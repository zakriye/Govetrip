(function () {
  var section = document.querySelector('.activity-section');
  if (!section) return;

  var form = section.querySelector('[data-activity-form]');
  var input = section.querySelector('[data-activity-city]');
  var status = section.querySelector('[data-activity-location]');
  var grid = section.querySelector('[data-activity-grid]');
  var categories = [
    { key: 'Guided tours', query: 'guided tours', image: '/assets/activities/guided-tours.jpg' },
    { key: 'Museums', query: 'museum tickets', image: '/assets/activities/museums.jpg' },
    { key: 'Food experiences', query: 'food experiences', image: '/assets/activities/food-experiences.jpg' },
    { key: 'Day trips', query: 'day trips', image: '/assets/activities/day-trips.jpg' }
  ];
  var selectedCity = getSavedPreference('activitiesCity') || '';
  var detectedCity = '';

  function language() {
    return document.documentElement.lang === 'fi' ? 'fi' : 'en';
  }

  function label(key) {
    var fi = {
      'Guided tours': 'Opastetut retket',
      Museums: 'Museot',
      'Food experiences': 'Ruokaelämykset',
      'Day trips': 'Päiväretket'
    };
    var translated = typeof gvtT === 'function' ? gvtT(key) : key;
    return translated !== key ? translated : (language() === 'fi' && fi[key]) || key;
  }

  function text(key, finnish) {
    var translated = typeof gvtT === 'function' ? gvtT(key) : key;
    return translated !== key ? translated : (language() === 'fi' ? finnish : key);
  }
  function searchUrl(city, query) {
    var url = new URL('https://www.getyourguide.com/s/');
    url.searchParams.set('q', city + ' ' + query);
    url.searchParams.set('partner_id', 'DQZTOID');
    url.searchParams.set('travel_agent', '1');
    url.searchParams.set('cmp', 'share_to_earn');
    return url.toString();
  }

  function render(city) {
    var cleanCity = city.trim();
    if (!cleanCity) return;
    input.value = cleanCity;
    status.textContent = text('Experiences in', 'Elämyksiä kohteessa') + ' ' + cleanCity;
    grid.replaceChildren();
    categories.forEach(function (category) {
      var wrapper = document.createElement('div');
      var card = document.createElement('a');
      var media = document.createElement('div');
      var image = document.createElement('img');
      var content = document.createElement('div');
      var title = document.createElement('strong');
      var action = document.createElement('span');
      wrapper.className = 'activity-card-wrap';
      card.className = 'activity-card';
      media.className = 'activity-card-media';
      image.className = 'activity-card-image';
      image.src = category.image;
      image.alt = label(category.key);
      image.width = 480;
      image.height = 220;
      image.loading = 'lazy';
      image.decoding = 'async';
      content.className = 'activity-card-copy';
      card.href = searchUrl(cleanCity, category.query);
      card.rel = 'sponsored noopener';
      title.textContent = label(category.key);
      action.textContent = text('Explore options →', 'Katso vaihtoehdot →');
      content.appendChild(title);
      content.appendChild(action);
      media.appendChild(image);
      card.appendChild(media);
      card.appendChild(content);
      wrapper.appendChild(card);
      grid.appendChild(wrapper);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var city = input.value.trim();
    if (!city) return;
    selectedCity = city;
    savePreference('activitiesCity', city);
    render(city);
  });

  window.addEventListener('gvt-location', function (event) {
    detectedCity = event.detail && event.detail.city ? event.detail.city : '';
    if (!selectedCity && detectedCity) render(detectedCity);
  });
  window.addEventListener('gvt-lang', function () {
    render(selectedCity || detectedCity || input.value);
  });

  if (selectedCity) render(selectedCity);
  else if (typeof currentProfile !== 'undefined' && currentProfile.city) render(currentProfile.city);
})();
