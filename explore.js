(function () {
  var dests = 'PAR:Paris,LON:London,BCN:Barcelona,ROM:Rome,AMS:Amsterdam,BER:Berlin,MAD:Madrid,LIS:Lisbon,PRG:Prague,VIE:Vienna,CPH:Copenhagen,STO:Stockholm,TLL:Tallinn,RIX:Riga,WAW:Warsaw,ATH:Athens,IST:Istanbul,DUB:Dublin,BUD:Budapest,MIL:Milan,OSL:Oslo,BRU:Brussels,ZRH:Zurich,MUC:Munich,FRA:Frankfurt,HAM:Hamburg,KRK:Krakow,VNO:Vilnius,EDI:Edinburgh,MAN:Manchester,NCE:Nice,VCE:Venice,FLR:Florence,PMI:Palma,AGP:Malaga,TFS:Tenerife,LPA:Gran Canaria,DXB:Dubai,NYC:New York,BKK:Bangkok'.split(',').map(function (s) { return s.split(':'); });
  var fi = { Paris: 'Pariisi', London: 'Lontoo', Rome: 'Rooma', Berlin: 'Berliini', Lisbon: 'Lissabon', Prague: 'Praha', Vienna: 'Wien', Copenhagen: 'Kööpenhamina', Stockholm: 'Tukholma', Riga: 'Riika', Warsaw: 'Varsova', Athens: 'Ateena', Budapest: 'Budapest', Milan: 'Milano', Brussels: 'Bryssel', Zurich: 'Zürich', Munich: 'München', Krakow: 'Krakova', Vilnius: 'Vilna', Edinburgh: 'Edinburgh', Venice: 'Venetsia', Florence: 'Firenze', Malaga: 'Malaga', 'New York': 'New York' };
  var fallbackDests = [['PAR', 'Paris'], ['STO', 'Stockholm'], ['RIX', 'Riga'], ['WAW', 'Warsaw'], ['VIE', 'Vienna'], ['TLL', 'Tallinn'], ['CPH', 'Copenhagen'], ['LIS', 'Lisbon']];
  var $ = function (s) { return document.querySelector(s); };
  var grid = $('#exGrid'), status = $('#exStatus'), max = $('#exMax'), len = $('#exLen'), from = $('#exFrom'), sug = $('#exSug');
  var origin = '', run = 0, results = [], loadError = '';
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function lang() { return document.documentElement.lang || 'en'; }
  function cur() { return (typeof currentProfile !== 'undefined' && currentProfile.currency) || 'EUR'; }
  function sym(c) { return { EUR: '€', USD: '$', GBP: '£', SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł', CHF: 'CHF' }[c] || c; }
  function fmt(d) { return d.toLocaleDateString(lang(), { weekday: 'short', day: 'numeric', month: 'numeric' }); }
  function mk(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  function best(o, d, m) {
    return fetch('/prices.php?origin=' + o + '&destination=' + d + '&month=' + m + '&currency=' + cur().toLowerCase())
      .then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok || !j.success) {
            if (j.error === 'configuration_missing') loadError = 'configuration';
            else loadError = 'upstream';
            return null;
          }
          var today = new Date().toISOString().slice(0, 10), b = null;
          Object.keys(j.days).forEach(function (k) { if (k > today && (b === null || j.days[k] < j.days[b])) b = k; });
          return b ? { date: b, price: j.days[b] } : null;
        });
      }).catch(function () { loadError = 'upstream'; return null; });
  }
  function renderFallback() {
    var current = fallbackDests.filter(function (d) { return d[0] !== origin; }).slice(0, 6);
    var departure = new Date();
    departure.setDate(departure.getDate() + 30);
    var returnDate = new Date(departure);
    returnDate.setDate(returnDate.getDate() + (+len.value));
    current.forEach(function (d) {
      var a = document.createElement('a');
      a.className = 'ex-card ex-card-fallback';
      var datePart = function (date) { return pad(date.getDate()) + pad(date.getMonth() + 1); };
      var searchUrl = 'https://www.aviasales.com/search/' + origin + datePart(departure) + d[0] + datePart(returnDate) + '1?currency=' + cur().toLowerCase();
      a.href = 'https://aviasales.tpm.lv/kG8FZBWw?u=' + encodeURIComponent(searchUrl);
      a.target = '_blank';
      a.rel = 'sponsored noopener';
      var image = document.createElement('img');
      image.src = 'https://photo.hotellook.com/static/cities/480x320/' + d[0] + '.auto';
      image.alt = '';
      image.loading = 'lazy';
      image.addEventListener('error', function () { image.remove(); }, { once: true });
      var body = document.createElement('div');
      var title = document.createElement('h3');
      var description = document.createElement('p');
      var link = document.createElement('strong');
      title.textContent = lang() === 'fi' ? (fi[d[1]] || d[1]) : d[1];
      description.textContent = lang() === 'fi' ? 'Katso päivät ja lennot' : 'Explore dates and flights';
      link.textContent = lang() === 'fi' ? 'Hae lentoja →' : 'Search flights →';
      body.appendChild(title);
      body.appendChild(description);
      body.appendChild(link);
      a.appendChild(image);
      a.appendChild(body);
      grid.appendChild(a);
    });
  }
  function render() {
    var lim = +max.value; $('#exMaxVal').textContent = lim >= 600 ? (lang() === 'fi' ? 'ei rajaa' : 'no limit') : '≤ ' + lim + ' ' + sym(cur());
    grid.innerHTML = '';
    var filtered = results.filter(function (r) { return lim >= 600 || r.price <= lim; }).sort(function (a, b) { return a.price - b.price; });
    filtered.forEach(function (r) {
      var dep = new Date(r.date + 'T00:00:00'), ret = new Date(dep.getTime() + (+len.value) * 864e5), dm = function (x) { return pad(x.getDate()) + pad(x.getMonth() + 1); };
      var target = 'https://www.aviasales.com/search/' + origin + dm(dep) + r.code + dm(ret) + '1?currency=' + cur().toLowerCase();
      var a = document.createElement('a'); a.className = 'ex-card'; a.target = '_blank'; a.rel = 'sponsored noopener';
      a.href = 'https://aviasales.tpm.lv/kG8FZBWw?u=' + encodeURIComponent(target);
      a.innerHTML = '<img loading="lazy" alt="" src="https://photo.hotellook.com/static/cities/480x320/' + r.code + '.auto"><div><h3></h3><p></p><strong></strong></div>';
      a.querySelector('h3').textContent = lang() === 'fi' ? (fi[r.name] || r.name) : r.name;
      a.querySelector('p').textContent = fmt(dep) + ' ▸ ' + fmt(ret);
      a.querySelector('strong').textContent = (lang() === 'fi' ? 'alk. ' : 'from ') + Math.round(r.price) + ' ' + sym(cur());
      grid.appendChild(a);
    });
    if (origin && !results.length) renderFallback();
    if (results.length && !filtered.length) {
      status.textContent = lang() === 'fi' ? 'Valitulla hintarajalla ei löytynyt lentoja. Nosta enimmäishintaa nähdäksesi lisää vaihtoehtoja.' : 'No flights were found within this budget. Increase the maximum price to see more options.';
    }
  }
  function load() {
    if (!origin) return; var my = ++run; results = []; loadError = ''; grid.innerHTML = ''; var n = new Date(), m = [mk(n), mk(new Date(n.getFullYear(), n.getMonth() + 1, 1))], queue = dests.filter(function (d) { return d[0] !== origin; }), left = queue.length, cursor = 0;
    status.textContent = lang() === 'fi' ? 'Haetaan hintoja…' : 'Loading prices…';
    function worker() {
      var d = queue[cursor++];
      if (!d) return Promise.resolve();
      return best(origin, d[0], m[0]).then(function (h) { return h || best(origin, d[0], m[1]); }).then(function (h) {
        if (my !== run) return;
        if (h) { results.push({ code: d[0], name: d[1], price: h.price, date: h.date }); render(); }
        if (--left === 0) {
          status.textContent = results.length
            ? (lang() === 'fi' ? 'Arvioidut halvimmat hinnat. Lopullinen hinta näkyy hakutuloksissa.' : 'Estimated lowest fares. The final price is shown in the search results.')
            : loadError === 'configuration'
              ? (lang() === 'fi' ? 'Reaaliaikaisia hintoja ei ole vielä määritetty. Voit silti selata kohteita ja tarkistaa hinnat hakukumppanilta.' : 'Live prices are not configured yet. You can still browse destinations and check fares with our booking partner.')
              : loadError === 'upstream'
                ? (lang() === 'fi' ? 'Hintapalvelu ei vastaa juuri nyt. Voit silti selata kohteita ja tarkistaa hinnat hakukumppanilta.' : 'The fare service is unavailable right now. You can still browse destinations and check fares with our booking partner.')
                : (lang() === 'fi' ? 'Hintoja ei löytynyt juuri nyt. Kokeile myöhemmin uudelleen.' : 'No prices were found right now. Please try again later.');
          render();
        }
        return worker();
      });
    }
    Promise.all(Array.from({ length: Math.min(6, queue.length) }, worker));
  }
  window.addEventListener('gvt-lang', function () { load(); });
  window.addEventListener('gvt-currency', function () { load(); });
  max.addEventListener('input', render); len.addEventListener('change', render);
  var t;
  from.addEventListener('input', function () {
    clearTimeout(t); if (from.value.trim().length < 2) { sug.hidden = true; return; }
    t = setTimeout(function () {
      fetch('https://autocomplete.travelpayouts.com/places2?term=' + encodeURIComponent(from.value.trim()) + '&locale=en&types[]=city&types[]=airport').then(function (r) { return r.json(); }).then(function (items) {
        sug.innerHTML = ''; items.slice(0, 8).forEach(function (it) {
          var li = document.createElement('li'); li.textContent = it.name + ' (' + it.code + '), ' + (it.country_name || '');
          li.addEventListener('mousedown', function (e) { e.preventDefault(); from.value = it.name + ' (' + it.code + ')'; origin = it.code; sug.hidden = true; load(); }); sug.appendChild(li);
        }); sug.hidden = !items.length;
      }).catch(function () {});
    }, 200);
  });
  from.addEventListener('blur', function () { setTimeout(function () { sug.hidden = true; }, 150); });
  fetch('https://ipapi.co/json/').then(function (r) { return r.json(); }).then(function (g) {
    if (origin || !g.city) return;
    return fetch('https://autocomplete.travelpayouts.com/places2?term=' + encodeURIComponent(g.city) + '&locale=en&types[]=city').then(function (r) { return r.json(); }).then(function (it) {
      if (origin || !it.length) return; origin = it[0].code; from.value = it[0].name + ' (' + origin + ')'; load();
    });
  }).catch(function () {}).then(function () { if (!origin) { origin = 'HEL'; from.value = 'Helsinki (HEL)'; load(); } });
  render();
})();