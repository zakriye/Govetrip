(function () {
  var select = document.getElementById('dealOrigin');
  var input = document.getElementById('dealOriginSearch');
  var list = document.getElementById('dealOriginOptions');
  var status = document.getElementById('dealOriginStatus');
  if (!select || !input || !list || !status) return;

  var timer;
  var requestId = 0;
  var activeIndex = -1;

  function closeOptions() {
    list.hidden = true;
    list.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  }

  function setOrigin(code, label) {
    var option = Array.prototype.find.call(select.options, function (item) { return item.value === code; });
    if (!option && label) {
      option = document.createElement('option');
      option.value = code;
      option.textContent = label;
      select.appendChild(option);
    }
    if (!option) return;
    select.value = code;
    input.value = label || option.textContent;
    status.textContent = '';
    closeOptions();
    select.dispatchEvent(new Event('change', { bubbles: true }));
    window.__gvtFrom = code;
    window.dispatchEvent(new CustomEvent('gvt-from', { detail: code }));
  }

  function setActive(index) {
    var options = list.querySelectorAll('[role="option"]');
    if (!options.length) return;
    activeIndex = (index + options.length) % options.length;
    options.forEach(function (option, optionIndex) {
      option.setAttribute('aria-selected', optionIndex === activeIndex ? 'true' : 'false');
    });
    input.setAttribute('aria-activedescendant', options[activeIndex].id);
    options[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function showOptions(places) {
    list.replaceChildren();
    activeIndex = -1;
    places.slice(0, 12).forEach(function (place, index) {
      if (!place.code || !/^[A-Z0-9]{3,4}$/i.test(place.code)) return;
      var label = place.name + ' (' + place.code.toUpperCase() + ')' +
        (place.country_name ? ', ' + place.country_name : '');
      var option = document.createElement('li');
      option.id = 'deal-origin-option-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.textContent = label;
      option.addEventListener('mousedown', function (event) {
        event.preventDefault();
        setOrigin(place.code.toUpperCase(), label);
      });
      list.appendChild(option);
    });
    if (list.childElementCount) {
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      status.textContent = '';
    } else {
      closeOptions();
      status.textContent = 'No matching cities or airports found.';
    }
  }

  function searchPlaces(term) {
    var id = ++requestId;
    fetch('https://autocomplete.travelpayouts.com/places2?term=' + encodeURIComponent(term) + '&locale=en&types[]=city&types[]=airport')
      .then(function (response) {
        if (!response.ok) throw new Error('Airport search request failed: ' + response.status);
        return response.json();
      })
      .then(function (places) {
        if (id !== requestId) return;
        input.setAttribute('aria-busy', 'false');
        showOptions(Array.isArray(places) ? places : []);
      })
      .catch(function () {
        if (id !== requestId) return;
        input.setAttribute('aria-busy', 'false');
        closeOptions();
        status.textContent = 'Airport search is temporarily unavailable. Please try again.';
      });
  }

  input.addEventListener('input', function () {
    window.clearTimeout(timer);
    requestId += 1;
    select.value = '';
    input.setAttribute('aria-busy', 'false');
    closeOptions();
    var term = input.value.trim();
    if (term.length < 2) {
      status.textContent = '';
      return;
    }
    status.textContent = 'Searching for cities and airports…';
    input.setAttribute('aria-busy', 'true');
    timer = window.setTimeout(function () { searchPlaces(term); }, 250);
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown' && !list.hidden) {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === 'ArrowUp' && !list.hidden) {
      event.preventDefault();
      setActive(activeIndex < 0 ? list.childElementCount - 1 : activeIndex - 1);
    } else if (event.key === 'Enter' && !list.hidden) {
      event.preventDefault();
      if (activeIndex >= 0) list.children[activeIndex].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      else if (list.childElementCount === 1) list.children[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    } else if (event.key === 'Escape') {
      closeOptions();
    }
  });

  input.addEventListener('blur', function () {
    window.setTimeout(closeOptions, 120);
  });

  window.addEventListener('load', function () {
    var airport = typeof currentProfile !== 'undefined' && currentProfile.airport;
    var match = airport && airport.match(/\(([A-Z]{3})\)/);
    var code = match ? match[1] : select.value;
    var option = Array.prototype.find.call(select.options, function (item) { return item.value === code; });
    if (option) setOrigin(code, airport || option.textContent);
  });
})();
