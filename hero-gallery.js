(function () {
  var gallery = document.querySelector('.hero-collage');
  if (!gallery) return;

  var tiles = gallery.querySelectorAll('.collage-circle');
  var weeklySets = [
    [
      ['photo-1500530855697-b586d89ba3ee', 'Desert road', 'Aavikkotie'],
      ['photo-1464822759023-fed622ff2c3b', 'Mountain peaks', 'Vuorenhuiput'],
      ['photo-1470770841072-f978cf4d019e', 'Alpine lake', 'Alppijärvi'],
      ['photo-1441974231531-c6227db76b6e', 'Forest trail', 'Metsäpolku']
    ],
    [
      ['photo-1501785888041-af3ef285b470', 'Mountain lake', 'Vuoristojärvi'],
      ['photo-1470252649378-9c29740c9fa8', 'Sunrise over the hills', 'Auringonnousu kukkuloilla'],
      ['photo-1519681393784-d120267933ba', 'Mountain under the stars', 'Vuori tähtitaivaan alla'],
      ['photo-1472396961693-142e6e269027', 'Wild landscape', 'Luonnonmaisema']
    ],
    [
      ['photo-1469474968028-56623f02e42e', 'Coastal landscape', 'Rannikkomaisema'],
      ['photo-1500534623283-312aade485b7', 'Open countryside', 'Avara maaseutumaisema'],
      ['photo-1470252649378-9c29740c9fa8', 'Golden-hour hills', 'Iltaruskon kukkulat'],
      ['photo-1441974231531-c6227db76b6e', 'Green forest', 'Vihreä metsä']
    ],
    [
      ['photo-1470770841072-f978cf4d019e', 'Quiet mountain lake', 'Rauhallinen vuoristojärvi'],
      ['photo-1500530855697-b586d89ba3ee', 'Desert landscape', 'Aavikkomaisema'],
      ['photo-1464822759023-fed622ff2c3b', 'Alpine peaks', 'Alppihuiput'],
      ['photo-1469474968028-56623f02e42e', 'Coast and mountains', 'Rannikkoa ja vuoria']
    ]
  ];
  var now = new Date();
  var utcDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  var monday = (new Date(utcDay).getUTCDay() + 6) % 7;
  var week = Math.floor((utcDay - monday * 86400000) / 604800000);
  var photos = weeklySets[((week % weeklySets.length) + weeklySets.length) % weeklySets.length];

  tiles.forEach(function (tile, index) {
    var photo = photos[index];
    if (!photo) return;
    tile.style.backgroundImage = 'url("https://images.unsplash.com/' + photo[0] + '?auto=format&fit=crop&w=640&q=72")';
    tile.setAttribute('role', 'img');
    function updateLabel() {
      tile.setAttribute('aria-label', (document.documentElement.lang || 'en').slice(0, 2) === 'fi' ? photo[2] : photo[1]);
    }
    updateLabel();
    window.addEventListener('gvt-lang', updateLabel);
  });
})();
