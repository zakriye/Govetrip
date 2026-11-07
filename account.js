(function () {
  'use strict';
  var API = '/api/account.php';
  var T = {
    en: {
      signin: 'Sign in', profile: 'Profile', save: 'Save to wishlist', saved: 'Saved to wishlist',
      title: 'Get more from GoVeTrip', b1: 'Save trips and destinations to your wishlist', b2: 'Find your recent searches in one place',
      b3: 'Get travel deals and tips (optional)', google: 'Continue with Google', or: 'or', email: 'Continue with email',
      login: 'Log in', register: 'Create account', name: 'Name', emailL: 'Email', pass: 'Password (min 8 characters)',
      marketing: 'Send me travel deals and inspiration by email. You can unsubscribe any time.',
      terms: 'By continuing you agree to our <a href="terms.html">Terms</a> and <a href="privacy.html">Privacy Policy</a>.',
      forgot: 'Forgot password?', haveAcc: 'Already have an account? Log in', noAcc: 'New here? Create account',
      wishlist: 'Wishlist', searches: 'Recent searches', account: 'Account', logout: 'Log out',
      hello: 'Hello', empty: 'Nothing here yet.', clear: 'Clear history', remove: 'Remove', settings: 'Settings',
      homeAirport: 'Home airport (e.g. HEL)', saveBtn: 'Save', del: 'Delete account', delConfirm: 'Delete your account and all saved data permanently?',
      sent: 'If the email exists, a reset link has been sent.', newPass: 'New password (min 8 characters)', setPass: 'Set new password',
      done: 'Saved', err: 'Something went wrong. Please try again.', invalid_credentials: 'Wrong email or password.',
      email_taken: 'This email is already registered.', weak_password: 'Password must be at least 8 characters.',
      invalid_email: 'Please enter a valid email.', rate_limited: 'Too many attempts. Try again later.', close: 'Close',
      needLogin: 'Please log in to view your account.',
      alerts: 'Price alerts', alertsInfo: 'We email you when the cheapest flight of the month drops. Leave the target empty to be told about drops of 5% or more.',
      alFrom: 'From (e.g. HEL)', alTo: 'To (e.g. BKK)', alMonth: 'Month', alTarget: 'Target price (optional)', alAdd: 'Create alert',
      alNow: 'Now', alMax: 'You can have up to 10 alerts.', invalid_alert: 'Check the airport codes (3 letters) and choose a future month.',
      alert_limit: 'You already have 10 alerts. Remove one first.'
    },
    fi: {
      signin: 'Kirjaudu', profile: 'Profiili', save: 'Tallenna toivelistalle', saved: 'Tallennettu toivelistalle',
      title: 'Hyödynnä GoVeTrip täysillä', b1: 'Tallenna matkat ja kohteet toivelistalle', b2: 'Löydä viimeisimmät hakusi yhdestä paikasta',
      b3: 'Saa matkatarjouksia ja vinkkejä (valinnainen)', google: 'Jatka Googlella', or: 'tai', email: 'Jatka sähköpostilla',
      login: 'Kirjaudu sisään', register: 'Luo tili', name: 'Nimi', emailL: 'Sähköposti', pass: 'Salasana (väh. 8 merkkiä)',
      marketing: 'Lähetä minulle matkatarjouksia ja inspiraatiota sähköpostilla. Voit perua milloin tahansa.',
      terms: 'Jatkamalla hyväksyt <a href="terms.html">käyttöehdot</a> ja <a href="privacy.html">tietosuojaselosteen</a>.',
      forgot: 'Unohtuiko salasana?', haveAcc: 'Onko sinulla jo tili? Kirjaudu', noAcc: 'Uusi täällä? Luo tili',
      wishlist: 'Toivelista', searches: 'Viimeisimmät haut', account: 'Tili', logout: 'Kirjaudu ulos',
      hello: 'Hei', empty: 'Täällä ei ole vielä mitään.', clear: 'Tyhjennä historia', remove: 'Poista', settings: 'Asetukset',
      homeAirport: 'Kotikenttä (esim. HEL)', saveBtn: 'Tallenna', del: 'Poista tili', delConfirm: 'Poistetaanko tili ja kaikki tallennetut tiedot pysyvästi?',
      sent: 'Jos sähköposti on rekisteröity, palautuslinkki on lähetetty.', newPass: 'Uusi salasana (väh. 8 merkkiä)', setPass: 'Aseta uusi salasana',
      done: 'Tallennettu', err: 'Jokin meni pieleen. Yritä uudelleen.', invalid_credentials: 'Väärä sähköposti tai salasana.',
      email_taken: 'Sähköposti on jo rekisteröity.', weak_password: 'Salasanan on oltava vähintään 8 merkkiä.',
      invalid_email: 'Anna kelvollinen sähköposti.', rate_limited: 'Liian monta yritystä. Yritä myöhemmin.', close: 'Sulje',
      needLogin: 'Kirjaudu sisään nähdäksesi tilisi.',
      alerts: 'Hintahälytykset', alertsInfo: 'Lähetämme sähköpostia, kun kuun halvin lento halpenee. Jätä tavoitehinta tyhjäksi, niin saat ilmoituksen vähintään 5 % laskusta.',
      alFrom: 'Mistä (esim. HEL)', alTo: 'Minne (esim. BKK)', alMonth: 'Kuukausi', alTarget: 'Tavoitehinta (valinnainen)', alAdd: 'Luo hälytys',
      alNow: 'Nyt', alMax: 'Voit luoda enintään 10 hälytystä.', invalid_alert: 'Tarkista lentokenttäkoodit (3 kirjainta) ja valitse tuleva kuukausi.',
      alert_limit: 'Sinulla on jo 10 hälytystä. Poista ensin yksi.'
    }
  };
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var L = T[lang] || T.en;
  function t(k) { return L[k] || T.en[k] || k; }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  var state = { user: null, wishlist: [], searches: [], alerts: [], googleClientId: '', ready: false };
  var listeners = [];

  function api(body) {
    var opt = body ? { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-GVT': '1' }, body: JSON.stringify(body) }
      : { credentials: 'same-origin' };
    return fetch(API + (body ? '' : '?action=me'), opt).then(function (r) { return r.json().catch(function () { return {}; }); });
  }
  function apply(d) {
    if (d && !d.error) {
      if ('user' in d) { state.user = d.user; state.wishlist = d.wishlist || []; state.searches = d.searches || []; state.alerts = d.alerts || []; }
      if (d.googleClientId != null) state.googleClientId = d.googleClientId;
    }
    state.ready = true; render();
    listeners.forEach(function (f) { f(); });
    return d;
  }
  function msg(d) { return d && d.error ? (L[d.error] || t('err')) : ''; }

  function pagePath() { return location.pathname.replace(/^\/(fi|sv|no|da|de|fr|es|it|nl|pl|pt)\//, '/'); }
  function isSaved() { var p = pagePath(); return state.wishlist.some(function (w) { return w.url === p || w.url === location.pathname; }); }

  var wishBtn, profBtn, menu;
  function build() {
    var host = document.querySelector('.nav-actions');
    if (!host || host.querySelector('.acc-btn')) return;
    wishBtn = document.createElement('button');
    wishBtn.type = 'button'; wishBtn.className = 'acc-btn acc-heart';
    wishBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
    wishBtn.addEventListener('click', toggleWish);
    profBtn = document.createElement('button');
    profBtn.type = 'button'; profBtn.className = 'acc-btn acc-profile';
    profBtn.addEventListener('click', function (e) { e.stopPropagation(); if (!state.user) openAuth(); else toggleMenu(); });
    host.insertBefore(profBtn, host.firstChild);
    host.insertBefore(wishBtn, host.firstChild);
    document.addEventListener('click', function () { if (menu) menu.hidden = true; });
  }
  function initial() { var u = state.user; return esc(((u.name || u.email || '?').trim()[0] || '?').toUpperCase()); }
  function render() {
    if (!wishBtn) return;
    var s = isSaved();
    wishBtn.classList.toggle('is-saved', s);
    wishBtn.setAttribute('aria-label', s ? t('saved') : t('save'));
    wishBtn.title = s ? t('saved') : t('save');
    if (state.user) {
      profBtn.innerHTML = '<span class="acc-avatar">' + initial() + '</span>';
      profBtn.setAttribute('aria-label', t('profile'));
    } else {
      profBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="acc-label">' + esc(t('signin')) + '</span>';
      profBtn.setAttribute('aria-label', t('signin'));
    }
  }
  function toggleMenu() {
    if (!menu) {
      menu = document.createElement('div'); menu.className = 'acc-menu'; menu.hidden = true;
      menu.addEventListener('click', function (e) { e.stopPropagation(); });
      profBtn.parentNode.appendChild(menu);
    }
    var u = state.user;
    menu.innerHTML = '<div class="acc-menu-head"><strong>' + esc(u.name || u.email) + '</strong><small>' + esc(u.email) + '</small></div>' +
      '<a href="account.html#wishlist">' + esc(t('wishlist')) + '</a><a href="account.html#searches">' + esc(t('searches')) + '</a><a href="account.html#alerts">' + esc(t('alerts')) + '</a>' +
      '<a href="account.html">' + esc(t('account')) + '</a><button type="button" data-out>' + esc(t('logout')) + '</button>';
    menu.querySelector('[data-out]').addEventListener('click', logout);
    menu.hidden = !menu.hidden;
  }
  function logout() { api({ action: 'logout' }).then(function () { state.user = null; state.wishlist = []; state.searches = []; if (menu) menu.hidden = true; apply({}); if (document.getElementById('accountRoot')) location.href = 'index.html'; }); }
  function toggleWish() {
    if (!state.user) { openAuth(); return; }
    var p = pagePath(), found = null;
    state.wishlist.forEach(function (w) { if (w.url === p || w.url === location.pathname) found = w; });
    var h1 = document.querySelector('h1');
    var title = (h1 ? h1.textContent : document.title).trim().slice(0, 120);
    api(found ? { action: 'wish_remove', id: found.id } : { action: 'wish_add', title: title, url: p, kind: 'page' }).then(apply);
  }

  function openAuth(mode) {
    var m = mode || 'register';
    var ov = document.createElement('div'); ov.className = 'acc-overlay';
    ov.innerHTML = '<div class="acc-modal" role="dialog" aria-modal="true"><button type="button" class="acc-close" aria-label="' + esc(t('close')) + '">×</button><div class="acc-body"></div></div>';
    document.body.appendChild(ov);
    function close() { ov.remove(); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.acc-close').addEventListener('click', close);
    var body = ov.querySelector('.acc-body');
    function home() {
      body.innerHTML = '<h2>' + esc(t('title')) + '</h2><ul class="acc-benefits"><li>' + esc(t('b1')) + '</li><li>' + esc(t('b2')) + '</li><li>' + esc(t('b3')) + '</li></ul>' +
        '<div id="accG"></div>' + (state.googleClientId ? '<div class="acc-or"><span>' + esc(t('or')) + '</span></div>' : '') +
        '<button type="button" class="acc-primary" data-email>' + esc(t('email')) + '</button><p class="acc-small">' + t('terms') + '</p>';
      body.querySelector('[data-email]').addEventListener('click', form);
      if (state.googleClientId) googleBtn(body.querySelector('#accG'), close);
    }
    function form() {
      var reg = m === 'register';
      body.innerHTML = '<h2>' + esc(reg ? t('register') : t('login')) + '</h2><form class="acc-form" novalidate>' +
        (reg ? '<label>' + esc(t('name')) + '<input name="name" autocomplete="name" maxlength="80" /></label>' : '') +
        '<label>' + esc(t('emailL')) + '<input name="email" type="email" autocomplete="email" required /></label>' +
        '<label>' + esc(t('pass')) + '<input name="password" type="password" autocomplete="' + (reg ? 'new-password' : 'current-password') + '" required minlength="8" /></label>' +
        (reg ? '<label class="acc-check"><input type="checkbox" name="marketing" /><span>' + esc(t('marketing')) + '</span></label>' : '') +
        '<div class="acc-msg" role="alert"></div><button class="acc-primary" type="submit">' + esc(reg ? t('register') : t('login')) + '</button></form>' +
        '<p class="acc-small"><button type="button" class="acc-link" data-forgot>' + esc(t('forgot')) + '</button></p>' +
        '<p class="acc-small"><button type="button" class="acc-link" data-toggle>' + esc(reg ? t('haveAcc') : t('noAcc')) + '</button></p>' +
        (reg ? '<p class="acc-small">' + t('terms') + '</p>' : '');
      var f = body.querySelector('form'), out = body.querySelector('.acc-msg');
      body.querySelector('[data-toggle]').addEventListener('click', function () { m = reg ? 'login' : 'register'; form(); });
      body.querySelector('[data-forgot]').addEventListener('click', function () {
        var em = f.email.value.trim(); if (!em) { out.textContent = t('invalid_email'); return; }
        api({ action: 'forgot', email: em }).then(function () { out.textContent = t('sent'); });
      });
      f.addEventListener('submit', function (e) {
        e.preventDefault(); out.textContent = '';
        var data = { action: reg ? 'register' : 'login', email: f.email.value.trim(), password: f.password.value, lang: lang };
        if (reg) { data.name = f.name.value.trim(); data.marketing = f.marketing.checked; }
        api(data).then(function (d) { if (d.error) { out.textContent = msg(d); return; } apply(d); close(); });
      });
    }
    m === 'login' ? form() : home();
  }

  function loadGoogle(cb) {
    if (window.google && google.accounts && google.accounts.id) { cb(); return; }
    var s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = cb;
    document.head.appendChild(s);
  }
  function googleBtn(el, done) {
    loadGoogle(function () {
      google.accounts.id.initialize({
        client_id: state.googleClientId,
        callback: function (resp) { api({ action: 'google', credential: resp.credential, lang: lang }).then(function (d) { if (!d.error) { apply(d); done(); } }); }
      });
      google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', width: 300, text: 'continue_with' });
    });
  }

  function recordSearch(label, url) {
    if (!state.user) return;
    api({ action: 'search_add', label: label, url: url }).then(apply);
  }
  window.gvtAccount = { recordSearch: recordSearch };

  // Account page
  function accountPage(root) {
    var qs = new URLSearchParams(location.search), token = qs.get('reset');
    function view() {
      if (token) {
        root.innerHTML = '<h1>' + esc(t('setPass')) + '</h1><form class="acc-form"><label>' + esc(t('newPass')) + '<input type="password" name="p" minlength="8" autocomplete="new-password" required /></label><div class="acc-msg"></div><button class="acc-primary">' + esc(t('setPass')) + '</button></form>';
        root.querySelector('form').addEventListener('submit', function (e) {
          e.preventDefault(); var f = e.target;
          api({ action: 'reset', token: token, password: f.p.value }).then(function (d) {
            if (d.error) { f.querySelector('.acc-msg').textContent = msg(d); return; }
            token = null; history.replaceState(null, '', 'account.html'); apply(d); view();
          });
        });
        return;
      }
      if (!state.ready) { root.innerHTML = ''; return; }
      if (!state.user) { root.innerHTML = '<h1>' + esc(t('account')) + '</h1><p>' + esc(t('needLogin')) + '</p><button class="acc-primary acc-inline" type="button" data-in>' + esc(t('signin')) + '</button>'; root.querySelector('[data-in]').addEventListener('click', function () { openAuth('login'); }); return; }
      var tab = (location.hash || '#wishlist').slice(1);
      if (['wishlist', 'searches', 'alerts', 'settings'].indexOf(tab) < 0) tab = 'wishlist';
      var u = state.user, h = '<h1>' + esc(t('hello')) + ', ' + esc(u.name || u.email) + '</h1><div class="acc-tabs">';
      ['wishlist', 'searches', 'alerts', 'settings'].forEach(function (k) { h += '<a href="#' + k + '" class="' + (k === tab ? 'on' : '') + '">' + esc(t(k)) + '</a>'; });
      h += '</div>';
      if (tab === 'alerts') {
        var nowM = new Date().toISOString().slice(0, 7);
        h += '<p>' + esc(t('alertsInfo')) + '</p>' +
          (state.alerts.length ? '<ul class="acc-list">' + state.alerts.map(function (a) {
            return '<li><span>' + esc(a.origin + ' → ' + a.dest + ' · ' + a.month + (a.target ? ' · ≤ ' + a.target + ' ' + a.currency.toUpperCase() : '') + (a.last_price ? ' · ' + t('alNow') + ' ' + Math.round(a.last_price) + ' ' + a.currency.toUpperCase() : '')) + '</span><button type="button" data-arm="' + a.id + '">' + esc(t('remove')) + '</button></li>';
          }).join('') + '</ul>' : '<p>' + esc(t('empty')) + '</p>') +
          '<form class="acc-form" data-alert><label>' + esc(t('alFrom')) + '<input name="o" maxlength="3" value="' + esc(u.homeAirport) + '" required /></label><label>' + esc(t('alTo')) + '<input name="d" maxlength="3" required /></label>' +
          '<label>' + esc(t('alMonth')) + '<input name="m" type="month" min="' + nowM + '" value="' + nowM + '" required /></label>' +
          '<label>' + esc(t('alTarget')) + '<input name="p" type="number" min="1" step="1" inputmode="numeric" /></label>' +
          '<label>€ <select name="c"><option value="eur">EUR</option><option value="usd">USD</option><option value="gbp">GBP</option><option value="sek">SEK</option><option value="nok">NOK</option><option value="dkk">DKK</option><option value="pln">PLN</option></select></label>' +
          '<div class="acc-msg"></div><button class="acc-primary">' + esc(t('alAdd')) + '</button><small>' + esc(t('alMax')) + '</small></form>';
      } else if (tab === 'wishlist') {
        h += state.wishlist.length ? '<ul class="acc-list">' + state.wishlist.map(function (w) { return '<li><a href="' + esc(w.url.replace(/^\//, '')) + '">' + esc(w.title) + '</a><button type="button" data-rm="' + w.id + '">' + esc(t('remove')) + '</button></li>'; }).join('') + '</ul>' : '<p>' + esc(t('empty')) + '</p>';
      } else if (tab === 'searches') {
        h += state.searches.length ? '<ul class="acc-list">' + state.searches.map(function (s) { return '<li><a href="' + esc(s.url.replace(/^\//, '')) + '">' + esc(s.label) + '</a><small>' + esc((s.created_at || '').slice(0, 10)) + '</small></li>'; }).join('') + '</ul><button type="button" class="acc-link" data-clr>' + esc(t('clear')) + '</button>' : '<p>' + esc(t('empty')) + '</p>';
      } else {
        h += '<form class="acc-form"><label>' + esc(t('name')) + '<input name="name" maxlength="80" value="' + esc(u.name) + '" /></label><label>' + esc(t('homeAirport')) + '<input name="ha" maxlength="3" value="' + esc(u.homeAirport) + '" /></label><label class="acc-check"><input type="checkbox" name="mk"' + (u.marketing ? ' checked' : '') + ' /><span>' + esc(t('marketing')) + '</span></label><div class="acc-msg"></div><button class="acc-primary">' + esc(t('saveBtn')) + '</button></form><p><button type="button" class="acc-link acc-danger" data-del>' + esc(t('del')) + '</button></p>';
      }
      root.innerHTML = h;
      root.querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { api({ action: 'wish_remove', id: +b.getAttribute('data-rm') }).then(apply); }); });
      var c = root.querySelector('[data-clr]'); if (c) c.addEventListener('click', function () { api({ action: 'search_clear' }).then(apply); });
      root.querySelectorAll('[data-arm]').forEach(function (b) { b.addEventListener('click', function () { api({ action: 'alert_remove', id: +b.getAttribute('data-arm') }).then(apply); }); });
      var af = root.querySelector('form[data-alert]'); if (af) af.addEventListener('submit', function (e) {
        e.preventDefault();
        api({ action: 'alert_add', origin: af.o.value.trim(), dest: af.d.value.trim(), month: af.m.value, target: af.p.value, currency: af.c.value }).then(function (d) {
          if (d.error) { af.querySelector('.acc-msg').textContent = msg(d); return; }
          apply(d);
        });
      });
      var dl = root.querySelector('[data-del]'); if (dl) dl.addEventListener('click', function () { if (confirm(t('delConfirm'))) api({ action: 'delete_account', confirm: true }).then(function () { location.href = 'index.html'; }); });
      var f = root.querySelector('form'); if (f) f.addEventListener('submit', function (e) {
        e.preventDefault();
        api({ action: 'profile', name: f.name.value.trim(), homeAirport: f.ha.value.trim(), marketing: f.mk.checked, lang: lang }).then(function (d) {
          if (d.error) { f.querySelector('.acc-msg').textContent = msg(d); return; }
          apply(d); var m2 = root.querySelector('.acc-msg'); if (m2) m2.textContent = t('done');
        });
      });
    }
    listeners.push(view); window.addEventListener('hashchange', view); view();
  }

  function init() {
    build();
    var root = document.getElementById('accountRoot'); if (root) accountPage(root);
    api().then(apply).catch(function () { state.ready = true; render(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
