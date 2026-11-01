(function () {
  var host = document.getElementById('gvOffers');
  if (!host) return;
  var dests = [['PAR', 'Paris'], ['LON', 'London'], ['BCN', 'Barcelona'], ['ROM', 'Rome'], ['AMS', 'Amsterdam'], ['BER', 'Berlin'], ['MAD', 'Madrid'], ['LIS', 'Lisbon'], ['PRG', 'Prague'], ['VIE', 'Vienna'], ['CPH', 'Copenhagen'], ['STO', 'Stockholm'], ['TLL', 'Tallinn'], ['RIX', 'Riga'], ['WAW', 'Warsaw'], ['ATH', 'Athens'], ['IST', 'Istanbul'], ['DUB', 'Dublin'], ['BUD', 'Budapest'], ['MIL', 'Milan'], ['TKU', 'Turku'], ['OUL', 'Oulu'], ['KUO', 'Kuopio'], ['AGP', 'Malaga'], ['AYT', 'Antalya'], ['HAN', 'Hanoi'], ['SPU', 'Split'], ['NCE', 'Nice'], ['MNL', 'Manila'], ['LPA', 'Gran Canaria'], ['TIA', 'Tirana']];
  var fi = { Paris: 'Pariisi', London: 'Lontoo', Rome: 'Rooma', Berlin: 'Berliini', Lisbon: 'Lissabon', Prague: 'Praha', Vienna: 'Wien', Copenhagen: 'Kööpenhamina', Stockholm: 'Tukholma', Riga: 'Riika', Warsaw: 'Varsova', Athens: 'Ateena', Istanbul: 'Istanbul', Budapest: 'Budapest', Milan: 'Milano', Tallinn: 'Tallinna', Turku: 'Turku', Oulu: 'Oulu', Kuopio: 'Kuopio', Malaga: 'Malaga', Antalya: 'Antalya', Hanoi: 'Hanoi', Split: 'Split', Nice: 'Nizza', Manila: 'Manila', 'Gran Canaria': 'Gran Canaria', Tirana: 'Tirana' };
  var track = host.querySelector('.go-track'), prev = host.querySelector('.go-prev'), next = host.querySelector('.go-next'), head = host.querySelector('h2'), status = host.querySelector('.go-status');
  var origin = '', run = 0, packageSearch = !!document.getElementById('pcForm');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function lang() { return document.documentElement.lang || 'en'; }
  function cur() { return (typeof currentProfile !== 'undefined' && currentProfile.currency) || 'EUR'; }
  function sym(c) { return { EUR: '€', USD: '$', GBP: '£', SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł', CHF: 'CHF' }[c] || c; }
  function fmt(d) { return d.toLocaleDateString(lang(), { weekday: 'short', day: 'numeric', month: 'numeric' }); }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function monthKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  function tripDates(hit) {
    var depart = hit ? new Date(hit.date + 'T00:00:00') : new Date();
    if (!hit) depart.setDate(depart.getDate() + 30);
    var ret = new Date(depart.getTime() + 7 * 864e5);
    return { depart: depart, ret: ret };
  }
  function best(o, d, mk, errors) {
    return fetch('/prices.php?origin=' + o + '&destination=' + d + '&month=' + mk + '&currency=' + cur().toLowerCase())
      .then(function (r) { return r.json(); }).then(function (j) {
        if (!j.success) {
          if (j.error === 'configuration_missing') errors.configuration = true;
          else errors.upstream = true;
          return null;
        }
        var today = new Date().toISOString().slice(0, 10), bk = null;
        Object.keys(j.days).forEach(function (k) { if (k > today && (bk === null || j.days[k] < j.days[bk])) bk = k; });
        return bk ? { date: bk, price: j.days[bk] } : null;
      }).catch(function () { errors.upstream = true; return null; });
  }
  function card(o, d, name, hit) {
    var dates = tripDates(hit), dep = dates.depart, ret = dates.ret;
    var dm = function (x) { return pad(x.getDate()) + pad(x.getMonth() + 1); };
    var target = 'https://www.aviasales.com/search/' + o + dm(dep) + d + dm(ret) + '1?currency=' + cur().toLowerCase();
    var a = document.createElement('a'); a.className = 'go-card'; a.target = '_blank'; a.rel = 'sponsored noopener';
    a.href = 'https://aviasales.tpm.lv/kG8FZBWw?u=' + encodeURIComponent(target);
    var label = lang() === 'fi' ? (fi[name] || name) : name;
    a.innerHTML = '<img loading="lazy" alt="" src="https://photo.hotellook.com/static/cities/480x320/' + d + '.auto"><div class="go-body"><h3></h3><p></p><strong></strong></div>';
    a.querySelector('h3').textContent = label;
    var dateRange = fmt(dep) + ' ▸ ' + fmt(ret);
    a.querySelector('p').textContent = hit || !packageSearch
      ? dateRange
      : (lang() === 'fi' ? 'Esimerkkipäivät: ' : 'Sample dates: ') + dateRange;
    a.querySelector('strong').textContent = hit
      ? (packageSearch
        ? (lang() === 'fi' ? 'Lento alk. ' : 'Flight from ')
        : (lang() === 'fi' ? 'alk. ' : 'from ')) + Math.round(hit.price) + ' ' + sym(cur())
      : (lang() === 'fi' ? 'Katso lennot →' : 'Search flights →');
    return a;
  }
  function packageCard(o, d, name, hit) {
    var dates = tripDates(hit), wrapper = document.createElement('div'), query = new URLSearchParams({
      ss: name,
      checkin: dateKey(dates.depart),
      checkout: dateKey(dates.ret),
      group_adults: 1,
      group_children: 0,
      no_rooms: 1,
      selected_currency: cur()
    });
    wrapper.className = 'package-offer';
    wrapper.appendChild(card(o, d, name, hit));
    var hotel = document.createElement('a');
    hotel.className = 'package-hotel-link';
    hotel.href = 'https://www.booking.com/searchresults.html?' + query.toString();
    hotel.target = '_blank';
    hotel.rel = 'sponsored noopener';
    hotel.textContent = lang() === 'fi' ? 'Hae hotellit samoille päiville →' : 'Find hotels for these dates →';
    wrapper.appendChild(hotel);
    return wrapper;
  }
  function load() {
    if (!origin) return;
    var my = ++run; track.innerHTML = ''; var errors = { configuration: false, upstream: false }; var now = new Date(), mks = [monthKey(now), monthKey(new Date(now.getFullYear(), now.getMonth() + 1, 1))];
    host.hidden = false;
    if (status) status.textContent = lang() === 'fi' ? 'Haetaan edullisia lentohintoja…' : 'Finding low flight fares…';
    var queue = dests.filter(function (x) { return x[0] !== origin; }), hits = [], cursor = 0;
    function worker() {
      if (my !== run) return Promise.resolve();
      var item = queue[cursor++];
      if (!item) return Promise.resolve();
      return best(origin, item[0], mks[0], errors)
        .then(function (h) { return h || best(origin, item[0], mks[1], errors); })
        .then(function (h) {
          if (my !== run) return;
          if (h) hits.push({ code: item[0], name: item[1], price: h.price, hit: h });
          return worker();
        });
    }
    Promise.all(Array.from({ length: Math.min(6, queue.length) }, worker)).then(function () {
      if (my !== run) return;
      hits.sort(function (a, b) { return a.price - b.price; });
      hits.slice(0, 8).forEach(function (item) {
        track.appendChild(packageSearch
          ? packageCard(origin, item.code, item.name, item.hit)
          : card(origin, item.code, item.name, item.hit));
      });
      if (!hits.length) {
        queue.filter(function (item) { return item[0] !== origin; }).slice(0, 8).forEach(function (item) {
          track.appendChild(packageSearch
            ? packageCard(origin, item[0], item[1], null)
            : card(origin, item[0], item[1], null));
        });
        if (status) {
          status.textContent = errors.configuration
            ? (packageSearch
              ? (lang() === 'fi' ? 'Lentohinnat eivät ole tällä hetkellä saatavilla. Hae lento ja hotelli erikseen kumppaneilta.' : 'Flight prices are unavailable right now. Search for flights and hotels separately.')
              : (lang() === 'fi' ? 'Live-hinnat eivät ole käytössä. Voit silti hakea lentoja suoraan.' : 'Live prices are unavailable. You can still search flights directly.'))
            : errors.upstream
              ? (packageSearch
                ? (lang() === 'fi' ? 'Lentohintojen haku ei onnistunut juuri nyt. Voit silti vertailla lentoja ja hotelleja kumppaneilla.' : 'Flight prices could not be loaded. You can still compare flights and hotels with our partners.')
                : (lang() === 'fi' ? 'Hintojen haku ei onnistunut juuri nyt. Voit silti hakea lentoja suoraan.' : 'Prices could not be loaded right now. You can still search flights directly.'))
              : (packageSearch
                ? (lang() === 'fi' ? 'Edullisia lentoja ei löytynyt näille reiteille. Hae lennot ja hotellit erikseen kumppaneilta.' : 'No low fares were found for these routes. Search for flights and hotels separately.')
                : (lang() === 'fi' ? 'Hintoja ei löytynyt tälle lähtökentälle. Voit silti selata kohteita ja hakea lentoja.' : 'No fares were found for this airport. You can still browse destinations and search flights.'));
        }
      } else if (status) {
        status.textContent = packageSearch
          ? (lang() === 'fi' ? 'Arvioidut lentohinnat, halvimmat ensin. Hotellin hinta näytetään erikseen kumppanin sivulla.' : 'Estimated flight fares, lowest first. Hotel prices are shown separately by the partner.')
          : (lang() === 'fi' ? 'Arvioidut meno-paluu hinnat, halvimmat ensin.' : 'Estimated return fares, lowest price first.');
      }
    });
  }
  function scroll(dir) { track.scrollBy({ left: dir * (track.querySelector('.go-card') ? track.querySelector('.go-card').offsetWidth + 16 : 300) * 2, behavior: 'smooth' }); }
  prev.addEventListener('click', function () { scroll(-1); });
  next.addEventListener('click', function () { scroll(1); });
  window.addEventListener('gvt-lang', function () { load(); });
  window.addEventListener('gvt-currency', function () { load(); });
  window.addEventListener('gvt-from', function (e) { if (e.detail && e.detail !== origin) { origin = e.detail; load(); } });
  if (window.__gvtFrom) { origin = window.__gvtFrom; load(); }
})();