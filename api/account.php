<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out(array $data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function config(string $key): string
{
    $env = getenv('GOVETRIP_' . strtoupper($key));
    if (is_string($env) && trim($env) !== '') {
        return trim($env);
    }
    foreach (['api-config.local.php', 'api-config.php'] as $file) {
        $path = dirname(__DIR__) . '/' . $file;
        if (!is_file($path)) {
            continue;
        }
        $cfg = require $path;
        if (is_array($cfg) && isset($cfg[$key]) && is_string($cfg[$key]) && trim($cfg[$key]) !== '') {
            return trim($cfg[$key]);
        }
    }
    return '';
}

function dataDir(): string
{
    $candidates = [];
    $override = getenv('GOVETRIP_DATA_DIR');
    if (is_string($override) && $override !== '') {
        $candidates[] = $override;
    }
    $root = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/\\');
    if ($root !== '') {
        $candidates[] = dirname($root) . '/govetrip-data';
    }
    $candidates[] = dirname(__DIR__) . '/_data';
    foreach ($candidates as $dir) {
        if (is_dir($dir) || @mkdir($dir, 0750, true)) {
            if (is_writable($dir)) {
                if (substr($dir, -6) === '/_data') {
                    @file_put_contents($dir . '/.htaccess', "Require all denied\n");
                }
                return $dir;
            }
        }
    }
    out(['error' => 'storage_unavailable'], 500);
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $pdo = new PDO('sqlite:' . dataDir() . '/accounts.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys=ON');
    $pdo->exec('CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL DEFAULT \'\',
        pass_hash TEXT,
        google_sub TEXT UNIQUE,
        home_airport TEXT NOT NULL DEFAULT \'\',
        lang TEXT NOT NULL DEFAULT \'\',
        marketing INTEGER NOT NULL DEFAULT 0,
        marketing_at TEXT,
        created_at TEXT NOT NULL,
        last_login TEXT
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        kind TEXT NOT NULL DEFAULT \'page\',
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, url)
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        kind TEXT NOT NULL DEFAULT \'flight\',
        label TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TEXT NOT NULL
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS resets (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        origin TEXT NOT NULL,
        dest TEXT NOT NULL,
        month TEXT NOT NULL,
        currency TEXT NOT NULL DEFAULT \'eur\',
        target REAL,
        last_price REAL,
        notified_price REAL,
        notified_at TEXT,
        checked_at TEXT,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, origin, dest, month)
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS attempts (
        ip TEXT NOT NULL,
        ts INTEGER NOT NULL
    )');
    return $pdo;
}

function startSession(): void
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_cache_limiter('');
    session_name('gvt_sid');
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 24 * 60,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    ini_set('session.gc_maxlifetime', (string)(60 * 60 * 24 * 60));
    $dir = dataDir() . '/sessions';
    if (is_dir($dir) || @mkdir($dir, 0750, true)) {
        session_save_path($dir);
    }
    session_start();
}

function now(): string
{
    return gmdate('Y-m-d H:i:s');
}

function clientIp(): string
{
    return substr((string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 64);
}

function tooManyAttempts(): bool
{
    $pdo = db();
    $pdo->prepare('DELETE FROM attempts WHERE ts < ?')->execute([time() - 900]);
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM attempts WHERE ip = ?');
    $stmt->execute([clientIp()]);
    return (int)$stmt->fetchColumn() >= 10;
}

function noteAttempt(): void
{
    db()->prepare('INSERT INTO attempts (ip, ts) VALUES (?, ?)')->execute([clientIp(), time()]);
}

function publicUser(array $u): array
{
    return [
        'id' => (int)$u['id'],
        'email' => $u['email'],
        'name' => $u['name'],
        'homeAirport' => $u['home_airport'],
        'lang' => $u['lang'],
        'marketing' => (int)$u['marketing'] === 1,
        'hasPassword' => !empty($u['pass_hash']),
        'google' => !empty($u['google_sub']),
        'createdAt' => $u['created_at'],
    ];
}

function userById(int $id): ?array
{
    $stmt = db()->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $u = $stmt->fetch();
    return $u ?: null;
}

function userByEmail(string $email): ?array
{
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $u = $stmt->fetch();
    return $u ?: null;
}

function currentUser(): ?array
{
    $id = (int)($_SESSION['uid'] ?? 0);
    return $id > 0 ? userById($id) : null;
}

function requireUser(): array
{
    $u = currentUser();
    if (!$u) {
        out(['error' => 'auth_required'], 401);
    }
    return $u;
}

function logIn(array $user): void
{
    session_regenerate_id(true);
    $_SESSION['uid'] = (int)$user['id'];
    db()->prepare('UPDATE users SET last_login = ? WHERE id = ?')->execute([now(), $user['id']]);
}

function cleanText($value, int $max): string
{
    $text = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string)$value) ?? '');
    return mb_substr($text, 0, $max);
}

function cleanUrl($value): string
{
    $url = trim((string)$value);
    $parts = parse_url($url);
    if ($parts === false) {
        return '';
    }
    if (isset($parts['host'])) {
        if (!in_array(strtolower($parts['host']), ['www.govetrip.com', 'govetrip.com'], true)) {
            return '';
        }
        $url = ($parts['path'] ?? '/') . (isset($parts['query']) ? '?' . $parts['query'] : '');
    }
    if ($url === '' || $url[0] !== '/' || strpos($url, '//') === 0) {
        return '';
    }
    return mb_substr($url, 0, 600);
}

function snapshot(array $u): array
{
    $pdo = db();
    $w = $pdo->prepare('SELECT id, kind, title, url, created_at FROM wishlist WHERE user_id = ? ORDER BY id DESC LIMIT 200');
    $w->execute([$u['id']]);
    $s = $pdo->prepare('SELECT id, kind, label, url, created_at FROM searches WHERE user_id = ? ORDER BY id DESC LIMIT 30');
    $s->execute([$u['id']]);
    $a = $pdo->prepare('SELECT id, origin, dest, month, currency, target, last_price, notified_at FROM alerts WHERE user_id = ? ORDER BY month, id');
    $a->execute([$u['id']]);
    return ['user' => publicUser($u), 'wishlist' => $w->fetchAll(), 'searches' => $s->fetchAll(), 'alerts' => $a->fetchAll()];
}

function fetchMonthMin(string $origin, string $dest, string $month, string $currency): ?array
{
    $token = config('travelpayouts_token');
    if ($token === '') {
        return null;
    }
    $url = 'https://api.travelpayouts.com/v2/prices/month-matrix?' . http_build_query([
        'currency' => $currency, 'show_to_affiliates' => 'true', 'origin' => $origin,
        'destination' => $dest, 'month' => $month . '-01',
    ]);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 15,
        CURLOPT_ENCODING => '', CURLOPT_HTTPHEADER => ['X-Access-Token: ' . $token],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = is_string($body) ? json_decode($body, true) : null;
    if ($code !== 200 || !is_array($data) || empty($data['success']) || !is_array($data['data'] ?? null)) {
        return null;
    }
    $best = null;
    foreach ($data['data'] as $row) {
        if (is_array($row) && isset($row['depart_date']) && is_numeric($row['value'] ?? null)
            && ($best === null || (float)$row['value'] < $best['price'])) {
            $best = ['price' => (float)$row['value'], 'date' => (string)$row['depart_date']];
        }
    }
    return $best;
}

function alertMail(array $user, array $al, array $best): void
{
    $tpl = [
        'en' => ['Price alert: {route} now {price}', "Hello,\n\nthe price for {route} has dropped: the cheapest flight in {month} is now {price} ({date}).\n\nView the deal: {link}\n\nPrices change fast. Manage your alerts: {manage}\n\nGoVeTrip"],
        'fi' => ['Hintahälytys: {route} nyt {price}', "Hei,\n\nreitin {route} hinta on laskenut: halvin lento kuussa {month} on nyt {price} ({date}).\n\nKatso tarjous: {link}\n\nHinnat muuttuvat nopeasti. Voit hallita hälytyksiäsi: {manage}\n\nGoVeTrip"],
        'sv' => ['Prisbevakning: {route} nu {price}', "Hej,\n\npriset för {route} har sjunkit: det billigaste flyget i {month} kostar nu {price} ({date}).\n\nSe erbjudandet: {link}\n\nPriserna ändras snabbt. Hantera dina bevakningar: {manage}\n\nGoVeTrip"],
        'no' => ['Prisvarsel: {route} nå {price}', "Hei,\n\nprisen for {route} har falt: billigste fly i {month} koster nå {price} ({date}).\n\nSe tilbudet: {link}\n\nPrisene endres raskt. Administrer varslene dine: {manage}\n\nGoVeTrip"],
        'da' => ['Prisalarm: {route} nu {price}', "Hej,\n\nprisen for {route} er faldet: det billigste fly i {month} koster nu {price} ({date}).\n\nSe tilbuddet: {link}\n\nPriserne ændrer sig hurtigt. Administrer dine alarmer: {manage}\n\nGoVeTrip"],
        'de' => ['Preisalarm: {route} jetzt {price}', "Hallo,\n\nder Preis für {route} ist gesunken: Der günstigste Flug im {month} kostet jetzt {price} ({date}).\n\nAngebot ansehen: {link}\n\nPreise ändern sich schnell. Alarme verwalten: {manage}\n\nGoVeTrip"],
        'fr' => ['Alerte de prix : {route} maintenant {price}', "Bonjour,\n\nle prix de {route} a baissé : le vol le moins cher en {month} est maintenant à {price} ({date}).\n\nVoir l'offre : {link}\n\nLes prix changent vite. Gérez vos alertes : {manage}\n\nGoVeTrip"],
        'es' => ['Alerta de precio: {route} ahora {price}', "Hola,\n\nel precio de {route} ha bajado: el vuelo más barato de {month} cuesta ahora {price} ({date}).\n\nVer la oferta: {link}\n\nLos precios cambian rápido. Gestiona tus alertas: {manage}\n\nGoVeTrip"],
        'it' => ['Avviso di prezzo: {route} ora {price}', "Ciao,\n\nil prezzo per {route} è sceso: il volo più economico di {month} costa ora {price} ({date}).\n\nVedi l'offerta: {link}\n\nI prezzi cambiano in fretta. Gestisci i tuoi avvisi: {manage}\n\nGoVeTrip"],
        'nl' => ['Prijsalert: {route} nu {price}', "Hallo,\n\nde prijs voor {route} is gedaald: de goedkoopste vlucht in {month} kost nu {price} ({date}).\n\nBekijk het aanbod: {link}\n\nPrijzen veranderen snel. Beheer je alerts: {manage}\n\nGoVeTrip"],
        'pl' => ['Alert cenowy: {route} teraz {price}', "Cześć,\n\ncena trasy {route} spadła: najtańszy lot w {month} kosztuje teraz {price} ({date}).\n\nZobacz ofertę: {link}\n\nCeny szybko się zmieniają. Zarządzaj alertami: {manage}\n\nGoVeTrip"],
        'pt' => ['Alerta de preço: {route} agora {price}', "Olá,\n\no preço de {route} desceu: o voo mais barato em {month} custa agora {price} ({date}).\n\nVer a oferta: {link}\n\nOs preços mudam depressa. Gerir os seus alertas: {manage}\n\nGoVeTrip"],
        'zh' => ['价格提醒：{route} 现价 {price}', "您好，\n\n{route} 的价格下降了：{month} 最便宜的航班现价为 {price}（{date}）。\n\n查看优惠：{link}\n\n价格变化较快。管理您的提醒：{manage}\n\nGoVeTrip"],
        'ru' => ['Уведомление о цене: {route} теперь {price}', "Здравствуйте!\n\nЦена на рейс {route} снизилась: самый дешёвый рейс за {month} теперь стоит {price} ({date}).\n\nПосмотреть предложение: {link}\n\nЦены быстро меняются. Управление уведомлениями: {manage}\n\nGoVeTrip"],
    ];
    $code = substr((string)($user['lang'] ?? ''), 0, 2);
    if (!isset($tpl[$code])) {
        $code = 'en';
    }
    $prefix = $code === 'en' ? '' : '/' . $code;
    $d = substr($best['date'], 8, 2) . substr($best['date'], 5, 2);
    $search = 'https://www.aviasales.com/search/' . $al['origin'] . $d . $al['dest'] . '1?currency=' . $al['currency'];
    $vars = [
        '{route}' => $al['origin'] . ' → ' . $al['dest'],
        '{price}' => number_format($best['price'], 0, '.', ' ') . ' ' . strtoupper($al['currency']),
        '{month}' => $al['month'], '{date}' => $best['date'],
        '{link}' => 'https://aviasales.tpm.lv/kG8FZBWw?u=' . rawurlencode($search),
        '{manage}' => 'https://www.govetrip.com' . $prefix . '/account.html#alerts',
    ];
    $subject = strtr($tpl[$code][0], $vars);
    $text = strtr($tpl[$code][1], $vars);    @mail($user['email'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, "From: GoVeTrip <noreply@govetrip.com>\r\nContent-Type: text/plain; charset=UTF-8");
}

function verifyGoogleToken(string $credential): ?array
{
    $clientId = config('google_client_id');
    if ($clientId === '' || $credential === '' || strlen($credential) > 4096) {
        return null;
    }
    $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($credential);
    $body = false;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
        $body = curl_exec($ch);
        curl_close($ch);
    } else {
        $body = @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 8]]));
    }
    if (!is_string($body)) {
        return null;
    }
    $info = json_decode($body, true);
    if (!is_array($info) || ($info['aud'] ?? '') !== $clientId) {
        return null;
    }
    if (!in_array($info['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true)) {
        return null;
    }
    if (($info['email_verified'] ?? '') !== 'true' && ($info['email_verified'] ?? false) !== true) {
        return null;
    }
    if ((int)($info['exp'] ?? 0) < time() || empty($info['sub']) || empty($info['email'])) {
        return null;
    }
    return $info;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string)($_GET['action'] ?? '');
$input = [];

if ($method === 'POST') {
    if (($_SERVER['HTTP_X_GVT'] ?? '') !== '1') {
        out(['error' => 'bad_request'], 400);
    }
    $raw = file_get_contents('php://input');
    $decoded = is_string($raw) ? json_decode($raw, true) : null;
    $input = is_array($decoded) ? $decoded : [];
    $action = (string)($input['action'] ?? $action);
} elseif ($method !== 'GET') {
    out(['error' => 'method_not_allowed'], 405);
}

try {
    if ($action === 'ping') {
        out(['ok' => true, 'storage' => is_dir(dataDir()), 'google' => config('google_client_id') !== '']);
    }

    if ($action === 'admin_export') {
        $key = config('admin_key');
        if ($key === '' || !hash_equals($key, (string)($_GET['key'] ?? ''))) {
            out(['error' => 'forbidden'], 403);
        }
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="govetrip-marketing-' . gmdate('Ymd') . '.csv"');
        $fh = fopen('php://output', 'w');
        fputcsv($fh, ['email', 'name', 'language', 'consent_given_at']);
        foreach (db()->query('SELECT email, name, lang, marketing_at FROM users WHERE marketing = 1 ORDER BY id') as $row) {
            fputcsv($fh, [$row['email'], $row['name'], $row['lang'], $row['marketing_at']]);
        }
        fclose($fh);
        exit;
    }

    if ($action === 'cron_alerts') {
        $key = config('admin_key');
        if ($key === '' || !hash_equals($key, (string)($_GET['key'] ?? ''))) {
            out(['error' => 'forbidden'], 403);
        }
        $pdo = db();
        $pdo->prepare('DELETE FROM alerts WHERE month < ?')->execute([gmdate('Y-m', strtotime('-1 month'))]);
        $rows = $pdo->query('SELECT a.*, u.email, u.lang FROM alerts a JOIN users u ON u.id = a.user_id ORDER BY a.id')->fetchAll();
        $cache = [];
        $checked = 0;
        $sent = 0;
        foreach ($rows as $al) {
            $ck = $al['origin'] . $al['dest'] . $al['month'] . $al['currency'];
            if (!array_key_exists($ck, $cache)) {
                if (count($cache) >= 200) {
                    continue;
                }
                $cache[$ck] = fetchMonthMin($al['origin'], $al['dest'], $al['month'], $al['currency']);
            }
            $best = $cache[$ck];
            if ($best === null) {
                continue;
            }
            $checked++;
            $price = $best['price'];
            $notify = false;
            if ($al['target'] !== null) {
                $notify = $price <= (float)$al['target'] && ($al['notified_price'] === null || $price < (float)$al['notified_price']);
            } elseif ($al['last_price'] !== null) {
                $notify = $price <= (float)$al['last_price'] * 0.95;
            }
            if ($notify) {
                alertMail($al, $al, $best);
                $sent++;
                $pdo->prepare('UPDATE alerts SET notified_price = ?, notified_at = ? WHERE id = ?')->execute([$price, now(), $al['id']]);
            }
            $pdo->prepare('UPDATE alerts SET last_price = ?, checked_at = ? WHERE id = ?')->execute([$price, now(), $al['id']]);
        }
        out(['ok' => true, 'alerts' => count($rows), 'checked' => $checked, 'sent' => $sent]);
    }

    startSession();

    switch ($action) {
        case 'me':
            $u = currentUser();
            $base = ['googleClientId' => config('google_client_id')];
            out($u ? array_merge($base, snapshot($u)) : array_merge($base, ['user' => null]));

        case 'register':
            if (tooManyAttempts()) {
                out(['error' => 'rate_limited'], 429);
            }
            $email = strtolower(cleanText($input['email'] ?? '', 190));
            $password = (string)($input['password'] ?? '');
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                out(['error' => 'invalid_email'], 422);
            }
            if (strlen($password) < 8 || strlen($password) > 200) {
                out(['error' => 'weak_password'], 422);
            }
            $name = cleanText($input['name'] ?? '', 80);
            if ($name === '') {
                $name = ucfirst(explode('@', $email)[0]);
            }
            $marketing = !empty($input['marketing']) ? 1 : 0;
            if (userByEmail($email)) {
                noteAttempt();
                out(['error' => 'email_taken'], 409);
            }
            db()->prepare('INSERT INTO users (email, name, pass_hash, lang, marketing, marketing_at, created_at) VALUES (?,?,?,?,?,?,?)')
                ->execute([$email, $name, password_hash($password, PASSWORD_DEFAULT), cleanText($input['lang'] ?? '', 5), $marketing, $marketing ? now() : null, now()]);
            $user = userByEmail($email);
            logIn($user);
            out(snapshot($user), 201);

        case 'login':
            if (tooManyAttempts()) {
                out(['error' => 'rate_limited'], 429);
            }
            $email = strtolower(cleanText($input['email'] ?? '', 190));
            $user = userByEmail($email);
            if (!$user || empty($user['pass_hash']) || !password_verify((string)($input['password'] ?? ''), $user['pass_hash'])) {
                noteAttempt();
                out(['error' => 'invalid_credentials'], 401);
            }
            logIn($user);
            out(snapshot($user));

        case 'google':
            if (tooManyAttempts()) {
                out(['error' => 'rate_limited'], 429);
            }
            $info = verifyGoogleToken((string)($input['credential'] ?? ''));
            if (!$info) {
                noteAttempt();
                out(['error' => 'google_failed'], 401);
            }
            $email = strtolower((string)$info['email']);
            $stmt = db()->prepare('SELECT * FROM users WHERE google_sub = ? OR email = ? ORDER BY google_sub IS NULL LIMIT 1');
            $stmt->execute([(string)$info['sub'], $email]);
            $user = $stmt->fetch();
            if ($user) {
                if (empty($user['google_sub'])) {
                    db()->prepare('UPDATE users SET google_sub = ? WHERE id = ?')->execute([(string)$info['sub'], $user['id']]);
                }
            } else {
                $name = cleanText($info['name'] ?? '', 80) ?: ucfirst(explode('@', $email)[0]);
                $marketing = !empty($input['marketing']) ? 1 : 0;
                db()->prepare('INSERT INTO users (email, name, google_sub, lang, marketing, marketing_at, created_at) VALUES (?,?,?,?,?,?,?)')
                    ->execute([$email, $name, (string)$info['sub'], cleanText($input['lang'] ?? '', 5), $marketing, $marketing ? now() : null, now()]);
            }
            $user = userByEmail($email);
            logIn($user);
            out(snapshot($user));

        case 'logout':
            $_SESSION = [];
            session_destroy();
            out(['ok' => true]);

        case 'forgot':
            if (tooManyAttempts()) {
                out(['error' => 'rate_limited'], 429);
            }
            noteAttempt();
            $user = userByEmail(strtolower(cleanText($input['email'] ?? '', 190)));
            if ($user) {
                $token = bin2hex(random_bytes(32));
                db()->prepare('INSERT INTO resets (token_hash, user_id, expires_at) VALUES (?,?,?)')
                    ->execute([hash('sha256', $token), $user['id'], time() + 3600]);
                $link = 'https://www.govetrip.com/account.html?reset=' . $token;
                $msg = 'Hi ' . $user['name'] . ",\n\nReset your GoVeTrip password here (valid for 1 hour):\n" . $link . "\n\nIf you did not request this, you can ignore this email.\n\nGoVeTrip";
                @mail($user['email'], 'Reset your GoVeTrip password', $msg, "From: GoVeTrip <noreply@govetrip.com>\r\nContent-Type: text/plain; charset=UTF-8");
            }
            out(['ok' => true]);

        case 'reset':
            if (tooManyAttempts()) {
                out(['error' => 'rate_limited'], 429);
            }
            $password = (string)($input['password'] ?? '');
            if (strlen($password) < 8 || strlen($password) > 200) {
                out(['error' => 'weak_password'], 422);
            }
            $stmt = db()->prepare('SELECT * FROM resets WHERE token_hash = ? AND expires_at > ?');
            $stmt->execute([hash('sha256', (string)($input['token'] ?? '')), time()]);
            $row = $stmt->fetch();
            if (!$row) {
                noteAttempt();
                out(['error' => 'invalid_token'], 400);
            }
            db()->prepare('UPDATE users SET pass_hash = ? WHERE id = ?')->execute([password_hash($password, PASSWORD_DEFAULT), $row['user_id']]);
            db()->prepare('DELETE FROM resets WHERE user_id = ?')->execute([$row['user_id']]);
            $user = userById((int)$row['user_id']);
            logIn($user);
            out(snapshot($user));

        case 'profile':
            $user = requireUser();
            $name = cleanText($input['name'] ?? $user['name'], 80) ?: $user['name'];
            $airport = strtoupper(cleanText($input['homeAirport'] ?? $user['home_airport'], 3));
            if ($airport !== '' && !preg_match('/^[A-Z]{3}$/', $airport)) {
                out(['error' => 'invalid_airport'], 422);
            }
            $marketing = array_key_exists('marketing', $input) ? (!empty($input['marketing']) ? 1 : 0) : (int)$user['marketing'];
            $marketingAt = $marketing === 1 ? ((int)$user['marketing'] === 1 ? $user['marketing_at'] : now()) : null;
            db()->prepare('UPDATE users SET name = ?, home_airport = ?, marketing = ?, marketing_at = ?, lang = ? WHERE id = ?')
                ->execute([$name, $airport, $marketing, $marketingAt, cleanText($input['lang'] ?? $user['lang'], 5), $user['id']]);
            out(snapshot(userById((int)$user['id'])));

        case 'wish_add':
            $user = requireUser();
            $url = cleanUrl($input['url'] ?? '');
            $title = cleanText($input['title'] ?? '', 160);
            if ($url === '' || $title === '') {
                out(['error' => 'invalid_item'], 422);
            }
            db()->prepare('INSERT OR IGNORE INTO wishlist (user_id, kind, title, url, created_at) VALUES (?,?,?,?,?)')
                ->execute([$user['id'], cleanText($input['kind'] ?? 'page', 20) ?: 'page', $title, $url, now()]);
            out(snapshot($user));

        case 'wish_remove':
            $user = requireUser();
            if (!empty($input['id'])) {
                db()->prepare('DELETE FROM wishlist WHERE user_id = ? AND id = ?')->execute([$user['id'], (int)$input['id']]);
            } else {
                db()->prepare('DELETE FROM wishlist WHERE user_id = ? AND url = ?')->execute([$user['id'], cleanUrl($input['url'] ?? '')]);
            }
            out(snapshot($user));

        case 'search_add':
            $user = requireUser();
            $url = cleanUrl($input['url'] ?? '');
            $label = cleanText($input['label'] ?? '', 160);
            if ($url === '' || $label === '') {
                out(['error' => 'invalid_item'], 422);
            }
            $pdo = db();
            $pdo->prepare('DELETE FROM searches WHERE user_id = ? AND url = ?')->execute([$user['id'], $url]);
            $pdo->prepare('INSERT INTO searches (user_id, kind, label, url, created_at) VALUES (?,?,?,?,?)')
                ->execute([$user['id'], cleanText($input['kind'] ?? 'flight', 20) ?: 'flight', $label, $url, now()]);
            $pdo->prepare('DELETE FROM searches WHERE user_id = ? AND id NOT IN (SELECT id FROM searches WHERE user_id = ? ORDER BY id DESC LIMIT 30)')
                ->execute([$user['id'], $user['id']]);
            out(snapshot($user));

        case 'search_clear':
            $user = requireUser();
            db()->prepare('DELETE FROM searches WHERE user_id = ?')->execute([$user['id']]);
            out(snapshot($user));

        case 'alert_add':
            $user = requireUser();
            $origin = strtoupper(cleanText($input['origin'] ?? '', 3));
            $dest = strtoupper(cleanText($input['dest'] ?? '', 3));
            $month = cleanText($input['month'] ?? '', 7);
            $currency = strtolower(cleanText($input['currency'] ?? 'eur', 3));
            $target = isset($input['target']) && is_numeric($input['target']) && (float)$input['target'] > 0 ? round((float)$input['target'], 2) : null;
            if (!preg_match('/^[A-Z]{3}$/', $origin) || !preg_match('/^[A-Z]{3}$/', $dest) || $origin === $dest
                || !preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $month) || $month < gmdate('Y-m') || !preg_match('/^[a-z]{3}$/', $currency)) {
                out(['error' => 'invalid_alert'], 422);
            }
            $n = db()->prepare('SELECT COUNT(*) FROM alerts WHERE user_id = ?');
            $n->execute([$user['id']]);
            if ((int)$n->fetchColumn() >= 10) {
                out(['error' => 'alert_limit'], 422);
            }
            $first = fetchMonthMin($origin, $dest, $month, $currency);
            db()->prepare('INSERT OR REPLACE INTO alerts (user_id, origin, dest, month, currency, target, last_price, created_at) VALUES (?,?,?,?,?,?,?,?)')
                ->execute([$user['id'], $origin, $dest, $month, $currency, $target, $first['price'] ?? null, now()]);
            out(snapshot($user));

        case 'alert_remove':
            $user = requireUser();
            db()->prepare('DELETE FROM alerts WHERE user_id = ? AND id = ?')->execute([$user['id'], (int)($input['id'] ?? 0)]);
            out(snapshot($user));

        case 'delete_account':
            $user = requireUser();
            if (empty($input['confirm'])) {
                out(['error' => 'confirm_required'], 422);
            }
            db()->prepare('DELETE FROM users WHERE id = ?')->execute([$user['id']]);
            $_SESSION = [];
            session_destroy();
            out(['ok' => true]);

        default:
            out(['error' => 'unknown_action'], 400);
    }
} catch (Throwable $e) {
    error_log('GoVeTrip account error: ' . $e->getMessage());
    out(['error' => 'server_error'], 500);
}
