(function () {
  var root = document.getElementById('priceCalendar');
  if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var state = { from: '', to: '', depart: '', ret: '', step: 'depart', view: new Date(), cache: {}, fromTouched: false, priceError: '' };
  state.view.setDate(1); state.view.setHours(0, 0, 0, 0);
  var fromInput = $('#pcFrom'), toInput = $('#pcTo'), pop = $('#pcPop'), btn = $('#pcDates');
  var fi = {
    'Select dates': 'Valitse päivät', 'Choose departure date': 'Valitse lähtöpäivä', 'Choose return date': 'Valitse paluupäivä',
    'Estimated fares. Green = cheapest, yellow = average, red = most expensive.': 'Arvioidut hinnat. Vihreä = halvin, keltainen = keskihintainen, punainen = kallein.',
    'Now choose your return date.': 'Valitse vielä paluupäivä kalenterista.',
    'Passengers': 'Matkustajat', 'Adult': 'Aikuinen', 'Child': 'Lapsi', 'Infant': 'Sylilapsi', '18+': '18+', '0–17': '0–17', 'under 2': 'alle 2 v', 'Cabin class': 'Matkustusluokka', 'Economy': 'Economy', 'Premium Economy': 'Premium Economy', 'Business': 'Bisnes', 'First class': '1. luokka',
    '1. Flights': '1. Lennot', '2. Hotel': '2. Hotelli',
    'No price data for this route. Try a nearby major airport.': 'Tälle reitille ei ole hintatietoja. Kokeile lähintä isoa lentokenttää.',
    'Choose places from the suggestions and pick your dates.': 'Valitse paikat ehdotuksista ja päivät.',
    'Search flights': 'Hae lentoja',
    'Price search is temporarily unavailable. Please try again later.': 'Hintahaku ei ole juuri nyt käytettävissä. Yritä myöhemmin uudelleen.',
    'Price search is not configured yet.': 'Hintahakua ei ole vielä määritetty.'
  };
  var order = ['Select dates', 'Choose departure date', 'Choose return date', 'Estimated fares. Green = cheapest, yellow = average, red = most expensive.', 'Now choose your return date.', 'Passengers', 'Adult', 'Child', 'Infant', 'under 2', 'Cabin class', 'Economy', 'Premium Economy', 'Business', 'First class', '1. Flights', '2. Hotel', 'No price data for this route. Try a nearby major airport.', 'Choose places from the suggestions and pick your dates.', 'Search flights', 'Price search is temporarily unavailable. Please try again later.', 'Price search is not configured yet.'];
  var others = {
    sv: ['Välj datum', 'Välj avresedatum', 'Välj returdatum', 'Beräknade priser. Grönt = billigast, gult = genomsnitt, rött = dyrast.', 'Välj nu ditt returdatum.', 'Passagerare', 'Vuxen', 'Barn', 'Spädbarn', 'under 2 år', 'Reseklass', 'Economy', 'Premium Economy', 'Business', 'First class', '1. Flyg', '2. Hotell', 'Inga prisuppgifter för den här rutten. Prova en större flygplats i närheten.', 'Välj platser bland förslagen och välj dina datum.', 'Sök flyg', 'Prissökningen är tillfälligt otillgänglig. Försök igen senare.', 'Prissökningen är inte konfigurerad ännu.'],
    no: ['Velg datoer', 'Velg avreisedato', 'Velg returdato', 'Estimerte priser. Grønn = billigst, gul = gjennomsnitt, rød = dyrest.', 'Velg nå returdato.', 'Passasjerer', 'Voksen', 'Barn', 'Spedbarn', 'under 2 år', 'Reiseklasse', 'Economy', 'Premium Economy', 'Business', 'First class', '1. Fly', '2. Hotell', 'Ingen prisdata for denne ruten. Prøv en større flyplass i nærheten.', 'Velg steder fra forslagene og velg datoer.', 'Søk fly', 'Prissøk er midlertidig utilgjengelig. Prøv igjen senere.', 'Prissøk er ikke konfigurert ennå.'],
    da: ['Vælg datoer', 'Vælg afrejsedato', 'Vælg returdato', 'Anslåede priser. Grøn = billigst, gul = gennemsnit, rød = dyrest.', 'Vælg nu din returdato.', 'Passagerer', 'Voksen', 'Barn', 'Spædbarn', 'under 2 år', 'Rejseklasse', 'Economy', 'Premium Economy', 'Business', 'First class', '1. Fly', '2. Hotel', 'Ingen prisdata for denne rute. Prøv en større lufthavn i nærheden.', 'Vælg steder fra forslagene og vælg dine datoer.', 'Søg fly', 'Prissøgning er midlertidigt utilgængelig. Prøv igen senere.', 'Prissøgning er endnu ikke konfigureret.'],
    de: ['Daten auswählen', 'Abflugdatum wählen', 'Rückflugdatum wählen', 'Geschätzte Preise. Grün = am günstigsten, gelb = durchschnittlich, rot = am teuersten.', 'Wähle jetzt dein Rückflugdatum.', 'Passagiere', 'Erwachsener', 'Kind', 'Kleinkind', 'unter 2 Jahren', 'Reiseklasse', 'Economy', 'Premium Economy', 'Business', 'First Class', '1. Flüge', '2. Hotel', 'Keine Preisdaten für diese Strecke. Versuche einen größeren Flughafen in der Nähe.', 'Wähle Orte aus den Vorschlägen und deine Reisedaten.', 'Flüge suchen', 'Die Preissuche ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.', 'Die Preissuche ist noch nicht eingerichtet.'],
    fr: ['Choisir les dates', 'Choisir la date de départ', 'Choisir la date de retour', 'Tarifs estimés. Vert = le moins cher, jaune = moyen, rouge = le plus cher.', 'Choisissez maintenant votre date de retour.', 'Passagers', 'Adulte', 'Enfant', 'Bébé', 'moins de 2 ans', 'Classe de voyage', 'Économique', 'Premium Economy', 'Affaires', 'Première classe', '1. Vols', '2. Hôtel', 'Aucune donnée de prix pour cet itinéraire. Essayez un grand aéroport proche.', 'Choisissez les lieux parmi les suggestions et vos dates.', 'Rechercher des vols', 'La recherche de prix est temporairement indisponible. Veuillez réessayer plus tard.', 'La recherche de prix n\'est pas encore configurée.'],
    es: ['Seleccionar fechas', 'Elige la fecha de salida', 'Elige la fecha de regreso', 'Tarifas estimadas. Verde = más barato, amarillo = medio, rojo = más caro.', 'Ahora elige tu fecha de regreso.', 'Pasajeros', 'Adulto', 'Niño', 'Bebé', 'menos de 2 años', 'Clase de cabina', 'Turista', 'Premium Economy', 'Business', 'Primera clase', '1. Vuelos', '2. Hotel', 'No hay datos de precios para esta ruta. Prueba con un aeropuerto grande cercano.', 'Elige los lugares de las sugerencias y tus fechas.', 'Buscar vuelos', 'La búsqueda de precios no está disponible temporalmente. Inténtalo de nuevo más tarde.', 'La búsqueda de precios aún no está configurada.'],
    it: ['Seleziona le date', 'Scegli la data di partenza', 'Scegli la data di ritorno', 'Tariffe stimate. Verde = più economico, giallo = medio, rosso = più caro.', 'Ora scegli la data di ritorno.', 'Passeggeri', 'Adulto', 'Bambino', 'Neonato', 'meno di 2 anni', 'Classe di viaggio', 'Economy', 'Premium Economy', 'Business', 'Prima classe', '1. Voli', '2. Hotel', 'Nessun dato sui prezzi per questa tratta. Prova un grande aeroporto vicino.', 'Scegli i luoghi dai suggerimenti e le date.', 'Cerca voli', 'La ricerca dei prezzi non è temporaneamente disponibile. Riprova più tardi.', 'La ricerca dei prezzi non è ancora configurata.'],
    nl: ['Selecteer data', 'Kies vertrekdatum', 'Kies retourdatum', 'Geschatte prijzen. Groen = goedkoopst, geel = gemiddeld, rood = duurst.', 'Kies nu je retourdatum.', 'Passagiers', 'Volwassene', 'Kind', 'Baby', 'jonger dan 2', 'Reisklasse', 'Economy', 'Premium Economy', 'Business', 'First class', '1. Vluchten', '2. Hotel', 'Geen prijsgegevens voor deze route. Probeer een grote luchthaven in de buurt.', 'Kies plaatsen uit de suggesties en kies je data.', 'Vluchten zoeken', 'Prijszoeken is tijdelijk niet beschikbaar. Probeer het later opnieuw.', 'Prijszoeken is nog niet ingesteld.'],
    pl: ['Wybierz daty', 'Wybierz datę wylotu', 'Wybierz datę powrotu', 'Szacowane ceny. Zielony = najtańszy, żółty = średni, czerwony = najdroższy.', 'Wybierz teraz datę powrotu.', 'Pasażerowie', 'Dorosły', 'Dziecko', 'Niemowlę', 'poniżej 2 lat', 'Klasa podróży', 'Ekonomiczna', 'Premium Economy', 'Biznes', 'Pierwsza klasa', '1. Loty', '2. Hotel', 'Brak danych o cenach dla tej trasy. Spróbuj pobliskiego dużego lotniska.', 'Wybierz miejsca z podpowiedzi i swoje daty.', 'Szukaj lotów', 'Wyszukiwanie cen jest tymczasowo niedostępne. Spróbuj ponownie później.', 'Wyszukiwanie cen nie zostało jeszcze skonfigurowane.'],
    pt: ['Selecionar datas', 'Escolha a data de partida', 'Escolha a data de regresso', 'Tarifas estimadas. Verde = mais barato, amarelo = médio, vermelho = mais caro.', 'Agora escolha a data de regresso.', 'Passageiros', 'Adulto', 'Criança', 'Bebé', 'menos de 2 anos', 'Classe de cabine', 'Económica', 'Premium Economy', 'Executiva', 'Primeira classe', '1. Voos', '2. Hotel', 'Sem dados de preços para esta rota. Tente um aeroporto grande nas proximidades.', 'Escolha os locais nas sugestões e as suas datas.', 'Pesquisar voos', 'A pesquisa de preços está temporariamente indisponível. Tente novamente mais tarde.', 'A pesquisa de preços ainda não está configurada.']
  };
  function t(s) {
    var lang = (document.documentElement.lang || 'en').slice(0, 2);
    if (lang === 'fi') return fi[s] || s;
    var list = others[lang], i = order.indexOf(s);
    return list && i > -1 ? list[i] : s;
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function currency() { return (typeof currentProfile !== 'undefined' && currentProfile.currency) || 'EUR'; }
  function symbol(c) { return { EUR: '€', USD: '$', GBP: '£', SEK: 'kr', NOK: 'kr', DKK: 'kr', CHF: 'CHF', PLN: 'zł' }[c] || c; }
  function oneway() { return $('#pcTrip').value === 'oneway'; }
  function hidePackageResults() { if ($('#pcPackage')) $('#pcPackage').hidden = true; }
  function addDays(key, amount) {
    var p = key.split('-'), date = new Date(+p[0], +p[1] - 1, +p[2]);
    date.setDate(date.getDate() + amount);
    return iso(date);
  }

  var pax = { adults: 1, children: 0, infants: 0, cabin: '' };
  var cabins = [['', 'Economy'], ['W', 'Premium Economy'], ['C', 'Business'], ['F', 'First class']];
  var paxBtn = $('#pcPaxBtn'), paxPop = $('#pcPaxPop');
  function paxTotal() { return pax.adults + pax.children + pax.infants; }
  function cabinName() { return t(cabins.filter(function (c) { return c[0] === pax.cabin; })[0][1]); }
  function renderPax() {
    paxBtn.textContent = paxTotal() + ' ' + cabinName() + ' ▾';
    paxPop.innerHTML = '';
    var h = document.createElement('h4'); h.textContent = t('Passengers'); paxPop.appendChild(h);
    [['adults', 'Adult', '18+', 1], ['children', 'Child', '0–17', 0], ['infants', 'Infant', 'under 2', 0]].forEach(function (r) {
      var row = document.createElement('div'); row.className = 'pc-prow';
      var lab = document.createElement('span'); lab.textContent = t(r[1]) + ' '; var sm = document.createElement('small'); sm.textContent = t(r[2]); lab.appendChild(sm);
      var st = document.createElement('div'); st.className = 'pc-step';
      var minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.disabled = pax[r[0]] <= r[3];
      var val = document.createElement('b'); val.textContent = pax[r[0]];
      var plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+';
      plus.disabled = paxTotal() >= 9 || (r[0] === 'infants' && pax.infants >= pax.adults);
      minus.addEventListener('click', function () { hidePackageResults(); pax[r[0]]--; if (pax.infants > pax.adults) pax.infants = pax.adults; renderPax(); });
      plus.addEventListener('click', function () { hidePackageResults(); pax[r[0]]++; renderPax(); });
      st.appendChild(minus); st.appendChild(val); st.appendChild(plus); row.appendChild(lab); row.appendChild(st); paxPop.appendChild(row);
    });
    var h2 = document.createElement('h4'); h2.textContent = t('Cabin class'); paxPop.appendChild(h2);
    var cw = document.createElement('div'); cw.className = 'pc-cabins';
    cabins.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = t(c[1]); if (pax.cabin === c[0]) b.className = 'on';
      b.addEventListener('click', function () { hidePackageResults(); pax.cabin = c[0]; renderPax(); }); cw.appendChild(b);
    });
    paxPop.appendChild(cw);
  }
  paxBtn.addEventListener('click', function (e) { e.stopPropagation(); paxPop.hidden = !paxPop.hidden; });
  document.addEventListener('click', function (e) { if (!paxPop.hidden && !paxPop.contains(e.target)) paxPop.hidden = true; });
  renderPax();
  function bindPlace(input, key) {
    var list = document.createElement('ul');
    list.className = 'pc-suggest'; list.hidden = true;
    input.parentNode.appendChild(list);
    var timer;
    input.addEventListener('input', function () {
      hidePackageResults();
      state[key] = ''; if (key === 'from') state.fromTouched = true;
      clearTimeout(timer);
      if (input.value.trim().length < 2) { list.hidden = true; return; }
      timer = setTimeout(function () {
        fetch('https://autocomplete.travelpayouts.com/places2?term=' + encodeURIComponent(input.value.trim()) + '&locale=en&types[]=city&types[]=airport')
          .then(function (r) { return r.json(); })
          .then(function (items) {
            list.innerHTML = '';
            items.slice(0, 8).forEach(function (it) {
              var li = document.createElement('li');
              li.textContent = it.name + ' (' + it.code + '), ' + (it.country_name || '');
              li.addEventListener('mousedown', function (e) {
                e.preventDefault(); hidePackageResults();
                input.value = it.name + ' (' + it.code + ')'; state[key] = it.code; list.hidden = true;
                if (key === 'from' || key === 'to') { prefetch(); if (key === 'to' && !state.depart) openPop(); }
              });
              list.appendChild(li);
            });
            list.hidden = !items.length;
          }).catch(function () { list.hidden = true; });
      }, 200);
    });
    input.addEventListener('blur', function () { setTimeout(function () { list.hidden = true; }, 150); });
  }
  bindPlace(fromInput, 'from');
  bindPlace(toInput, 'to');

  function setDefaultFrom() {
    if (state.fromTouched || state.from || geoDone) return;
    var c = (typeof currentProfile !== 'undefined' && currentProfile.airport || '').match(/\(([A-Z]{3})\)/);
    if (c) { state.from = c[1]; fromInput.value = currentProfile.airport; prefetch(); }
  }
  setDefaultFrom();
  var geoDone = false;
  function geoFrom() {
    fetch('https://ipapi.co/json/').then(function (r) { return r.json(); }).then(function (g) {
      if (state.fromTouched || !g.city) return;
      return fetch('https://autocomplete.travelpayouts.com/places2?term=' + encodeURIComponent(g.city) + '&locale=en&types[]=city').then(function (r) { return r.json(); }).then(function (items) {
        if (state.fromTouched || !items.length) return;
        geoDone = true; state.from = items[0].code; fromInput.value = items[0].name + ' (' + items[0].code + ')'; prefetch();
      });
    }).catch(function () {});
  }
  window.addEventListener('load', function () { setTimeout(geoFrom, 2000); setTimeout(setDefaultFrom, 1500); setTimeout(setDefaultFrom, 4000); });

  function monthKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }

  function fetchMonth(o, d, mk) {
    var key = o + d + mk + currency();
    if (state.cache[key] !== undefined) return;
    state.cache[key] = null;
    fetch('/prices.php?origin=' + o + '&destination=' + d + '&month=' + mk + '&currency=' + currency().toLowerCase())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.success) {
          state.cache[key] = {};
          state.priceError = data.error === 'configuration_missing' ? 'Price search is not configured yet.' : 'Price search is temporarily unavailable. Please try again later.';
        } else {
          state.cache[key] = data.days || {};
          state.priceError = '';
        }
        if (!pop.hidden) render();
      })
      .catch(function () {
        state.cache[key] = {};
        state.priceError = 'Price search is temporarily unavailable. Please try again later.';
        if (!pop.hidden) render();
      });
  }
  function days(o, d, mk) { return state.cache[o + d + mk + currency()] || null; }
  function prefetch() {
    if (state.from && window.__gvtFrom !== state.from) { window.__gvtFrom = state.from; window.dispatchEvent(new CustomEvent('gvt-from', { detail: state.from })); }
    if (!state.from || !state.to) return;
    [0, 1].forEach(function (i) {
      var mk = monthKey(addMonths(state.view, i));
      fetchMonth(state.from, state.to, mk);
      fetchMonth(state.to, state.from, mk);
    });
  }

  function direction() { return state.step === 'return' ? [state.to, state.from] : [state.from, state.to]; }

  function render() {
    var dir = direction(), hasRoute = state.from && state.to;
    $('#pcStep').textContent = t(state.step === 'return' ? 'Choose return date' : 'Choose departure date');
    var maps = [0, 1].map(function (i) {
      if (!hasRoute) return null;
      var mk = monthKey(addMonths(state.view, i)), m = days(dir[0], dir[1], mk);
      if (m && !Object.keys(m).length) { var alt = days(dir[1], dir[0], mk); if (alt && Object.keys(alt).length) return alt; }
      return m;
    });
    var all = [];
    maps.forEach(function (m) { if (m) Object.keys(m).forEach(function (k) { all.push(m[k]); }); });
    all.sort(function (a, b) { return a - b; });
    var low = all[Math.floor(all.length / 3)], high = all[Math.floor(all.length * 2 / 3)];
    var today = iso(new Date());
    var box = $('#pcMonths'); box.innerHTML = '';
    [0, 1].forEach(function (i) {
      var m = addMonths(state.view, i), y = m.getFullYear(), mo = m.getMonth();
      var wrap = document.createElement('div'); wrap.className = 'pc-m' + (i + 1);
      var title = document.createElement('div'); title.className = 'pc-mtitle';
      title.textContent = m.toLocaleString(document.documentElement.lang || 'en', { month: 'long', year: 'numeric' });
      var week = document.createElement('div'); week.className = 'pc-week';
      ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(function (w) { week.appendChild(document.createElement('span')).textContent = w; });
      var grid = document.createElement('div'); grid.className = 'pc-grid';
      var first = (new Date(y, mo, 1).getDay() + 6) % 7, count = new Date(y, mo + 1, 0).getDate();
      for (var k = 0; k < first; k++) grid.appendChild(document.createElement('span'));
      for (var day = 1; day <= count; day++) {
        var key = y + '-' + pad(mo + 1) + '-' + pad(day), cell = document.createElement('button');
        cell.type = 'button'; cell.className = 'pc-day';
        cell.innerHTML = '<span>' + day + '</span>';
        var price = maps[i] && maps[i][key];
        if (key < today || (state.step === 'return' && key <= state.depart)) { cell.disabled = true; }
        else if (price !== undefined && price !== null) {
          cell.classList.add(price <= low ? 'pc-low' : price >= high ? 'pc-high' : 'pc-mid');
          cell.innerHTML += '<small>' + Math.round(price) + symbol(currency()) + '</small>';
        }
        if (key === state.depart || key === state.ret) cell.classList.add('pc-end');
        else if (state.depart && state.ret && key > state.depart && key < state.ret) cell.classList.add('pc-in');
        cell.addEventListener('click', (function (kk) { return function () { pick(kk); }; })(key));
        grid.appendChild(cell);
      }
      wrap.appendChild(title); wrap.appendChild(week); wrap.appendChild(grid); box.appendChild(wrap);
    });
    var loaded = hasRoute && maps[0] && maps[1];
    $('#pcNote').textContent = state.priceError ? t(state.priceError) : loaded && !all.length ? t('No price data for this route. Try a nearby major airport.') : t('Estimated fares. Green = cheapest, yellow = average, red = most expensive.');
    renderAlertBtn(hasRoute);
  }

  function renderAlertBtn(hasRoute) {
    var acc = window.gvtAccount, btnEl = $('#pcAlert');
    if (!btnEl) {
      btnEl = document.createElement('button'); btnEl.type = 'button'; btnEl.id = 'pcAlert'; btnEl.className = 'pc-alert';
      var msgEl = document.createElement('p'); msgEl.id = 'pcAlertMsg'; msgEl.className = 'pc-alert-msg'; msgEl.hidden = true;
      $('#pcNote').insertAdjacentElement('afterend', msgEl); $('#pcNote').insertAdjacentElement('afterend', btnEl);
      btnEl.addEventListener('click', function () {
        if (!window.gvtAccount || !state.from || !state.to) return;
        var month = (state.depart || monthKey(state.view)).slice(0, 7), out = $('#pcAlertMsg');
        window.gvtAccount.addAlert(state.from, state.to, month, currency()).then(function (d) {
          if (d.error === 'login') { out.textContent = window.gvtAccount.t('alSetLogin'); }
          else { out.textContent = d.error ? window.gvtAccount.msg(d) : window.gvtAccount.t('alSetDone'); }
          out.hidden = false;
        });
      });
    }
    btnEl.hidden = !(hasRoute && acc);
    if (acc) btnEl.textContent = '🔔 ' + acc.t('alSet') + ' (' + state.from + ' → ' + state.to + ')';
    $('#pcAlertMsg').hidden = true;
  }

  function fmt(key) {
    var p = key.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(document.documentElement.lang || 'en', { day: 'numeric', month: 'short' });
  }
  function updateButton() {
    btn.textContent = state.depart ? fmt(state.depart) + (state.ret && !oneway() ? ' – ' + fmt(state.ret) : '') : t('Select dates');
  }
  function pick(key) {
    hidePackageResults();
    if (state.step === 'depart' || oneway()) {
      state.depart = key; state.ret = '';
      if (oneway()) { closePop(); } else { state.step = 'return'; prefetch(); render(); }
    } else {
      state.ret = key; closePop();
    }
    updateButton();
  }
  function openPop() { pop.hidden = false; btn.classList.add('on'); state.step = (state.depart && !state.ret && !oneway()) ? 'return' : 'depart'; prefetch(); render(); }
  function closePop() { pop.hidden = true; btn.classList.remove('on'); }
  btn.addEventListener('click', function () { pop.hidden ? openPop() : closePop(); });
  document.addEventListener('click', function (e) { if (!pop.hidden && !$('.pc-datewrap').contains(e.target)) closePop(); });
  $('#pcTrip').addEventListener('change', function () { hidePackageResults(); if (oneway()) state.ret = ''; state.step = 'depart'; updateButton(); if (!pop.hidden) render(); });
  $('#pcPrev').addEventListener('click', function () {
    var cur = new Date(); cur.setDate(1); cur.setHours(0, 0, 0, 0);
    var prev = addMonths(state.view, -1);
    if (prev >= cur) { state.view = prev; prefetch(); render(); }
  });
  $('#pcNext').addEventListener('click', function () { state.view = addMonths(state.view, 1); prefetch(); render(); });

  function resolvePlace(input, key) {
    if (state[key] || input.value.trim().length < 2) return Promise.resolve();
    return fetch('https://autocomplete.travelpayouts.com/places2?term=' + encodeURIComponent(input.value.trim().replace(/\s*\(.*$/, '')) + '&locale=en&types[]=city&types[]=airport')
      .then(function (r) { return r.json(); })
      .then(function (items) { if (items.length) { state[key] = items[0].code; input.value = items[0].name + ' (' + items[0].code + ')'; } })
      .catch(function () {});
  }
  function submitSearch(e) {
    if (e) e.preventDefault();
    hidePackageResults();
    Promise.all([resolvePlace(fromInput, 'from'), resolvePlace(toInput, 'to')]).then(doSearch);
  }
  var formEl = $('#pcForm');
  if (formEl.tagName === 'FORM') formEl.addEventListener('submit', submitSearch);
  else {
    $('.pc-go').addEventListener('click', submitSearch);
    [fromInput, toInput].forEach(function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitSearch(e); }); });
  }
  function doSearch() {
    var err = $('#pcError'); err.hidden = true;
    if (!state.from || !state.to || !state.depart || (!oneway() && !state.ret)) {
      err.textContent = t('Choose places from the suggestions and pick your dates.'); err.hidden = false;
      err.scrollIntoView({ block: 'nearest' });
      if (state.from && state.to && state.depart && !oneway() && !state.ret) err.textContent = t('Now choose your return date.');
      if (state.from && state.to) openPop();
      return;
    }
    function dm(k) { var p = k.split('-'); return p[2] + p[1]; }
    var target = 'https://www.aviasales.com/search/' + state.from + dm(state.depart) + state.to + (oneway() ? '' : dm(state.ret)) + pax.cabin + (pax.adults + '' + pax.children + pax.infants).replace(/0+$/, '') + '?currency=' + currency().toLowerCase();
    var url = 'https://aviasales.tpm.lv/kG8FZBWw?u=' + encodeURIComponent(target);
    if (formEl.dataset.package) {
      var city = toInput.value.replace(/\s*\(.*$/, '');
      var hq = new URLSearchParams({ ss: city, checkin: state.depart, checkout: oneway() ? addDays(state.depart, 7) : state.ret, group_adults: pax.adults, group_children: pax.children, no_rooms: 1, selected_currency: currency() });
      $('#pcPkgFlight').href = url;
      $('#pcPkgHotel').href = 'https://www.booking.com/searchresults.html?' + hq.toString();
      $('#pcPkgHotel').textContent = oneway() ? t('2. Hotel (7 nights)') : t('2. Hotel');
      $('#pcPackage').hidden = false;
      $('#pcPackage').scrollIntoView({ block: 'nearest' });
      return;
    }
    try { if (window.gvtAccount) window.gvtAccount.recordSearch(state.from + ' → ' + state.to + ' · ' + state.depart + (oneway() ? '' : ' – ' + state.ret), '/#priceCalendar'); } catch (x) {}
    var w = null;
    try { w = window.open(url, '_blank'); } catch (x) {}
    if (!w) window.location.href = url;
  }
  updateButton();
  window.addEventListener('gvt-lang', function () { updateButton(); renderPax(); if (!pop.hidden) render(); });
  window.addEventListener('gvt-currency', function () {
    hidePackageResults();
    state.cache = {};
    state.priceError = '';
    prefetch();
    if (!pop.hidden) render();
  });
})();