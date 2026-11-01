<?php
header('Content-Type: application/json; charset=utf-8');

function travelpayoutsToken(): string
{
    $environmentToken = getenv('TRAVELPAYOUTS_API_TOKEN');
    if (is_string($environmentToken) && trim($environmentToken) !== '') {
        return trim($environmentToken);
    }

    foreach (['api-config.local.php', 'api-config.php'] as $file) {
        $path = __DIR__ . '/' . $file;
        if (!is_file($path)) {
            continue;
        }

        $config = require $path;
        if (is_array($config) && isset($config['travelpayouts_token']) && is_string($config['travelpayouts_token'])) {
            $token = trim($config['travelpayouts_token']);
            if ($token !== '') {
                return $token;
            }
        }
    }

    return '';
}

$origin = strtoupper($_GET['origin'] ?? '');
$dest = strtoupper($_GET['destination'] ?? '');
$month = $_GET['month'] ?? '';
$currency = strtolower($_GET['currency'] ?? 'eur');
if (!preg_match('/^[A-Z]{3}$/', $origin) || !preg_match('/^[A-Z]{3}$/', $dest) || !preg_match('/^\d{4}-\d{2}$/', $month) || !preg_match('/^[a-z]{3}$/', $currency)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'bad_request']);
    exit;
}
$token = travelpayoutsToken();
if ($token === '') {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'configuration_missing']);
    exit;
}
$cache = sys_get_temp_dir() . "/govetrip_{$origin}_{$dest}_{$month}_{$currency}.json";
if (is_file($cache) && time() - filemtime($cache) < 1800) {
    $cached = file_get_contents($cache);
    $cachedData = is_string($cached) ? json_decode($cached, true) : null;
    if (is_array($cachedData) && !empty($cachedData['success']) && isset($cachedData['days']) && is_array($cachedData['days'])) {
        echo $cached;
        exit;
    }
}
$url = 'https://api.travelpayouts.com/v2/prices/month-matrix?' . http_build_query([
    'currency' => $currency, 'show_to_affiliates' => 'true', 'origin' => $origin,
    'destination' => $dest, 'month' => $month . '-01',
]);
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_ENCODING => '',
    CURLOPT_HTTPHEADER => ['X-Access-Token: ' . $token],
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);
if ($body === false) {
    error_log('Travelpayouts request failed: ' . $curlError);
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'upstream']);
    exit;
}
$data = json_decode($body, true);
if ($code !== 200 || !is_array($data) || empty($data['success']) || !isset($data['data']) || !is_array($data['data'])) {
    $apiError = is_array($data) && isset($data['error']) && is_scalar($data['error'])
        ? substr((string) $data['error'], 0, 200)
        : 'invalid response';
    error_log('Travelpayouts API returned HTTP ' . $code . ': ' . $apiError);
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'upstream']);
    exit;
}
$days = [];
foreach ($data['data'] as $row) {
    if (!is_array($row)) {
        continue;
    }
    $date = $row['depart_date'] ?? '';
    $price = $row['value'] ?? null;
    if ($date && is_numeric($price) && (!isset($days[$date]) || $price < $days[$date])) {
        $days[$date] = (float) $price;
    }
}
$out = json_encode(['success' => true, 'currency' => $currency, 'days' => (object)$days]);
if ($out === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'response_encoding']);
    exit;
}
file_put_contents($cache, $out, LOCK_EX);
echo $out;