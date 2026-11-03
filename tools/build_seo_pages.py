"""Generates static destination and flight-route landing pages plus sitemaps.

Run from the repository root:  python tools/build_seo_pages.py
"""
import json
import os
import shutil
from datetime import date
from html import escape

SITE = 'https://www.govetrip.com'
TODAY = date.today().isoformat()
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# code, name, slug, country, best time, highlights
DESTINATIONS = [
    ('PAR', 'Paris', 'France', 'April to June and September to October', 'the Louvre, Montmartre and the Seine riverbanks'),
    ('LON', 'London', 'United Kingdom', 'May to September', 'the British Museum, Borough Market and the West End'),
    ('BCN', 'Barcelona', 'Spain', 'May to June and September', 'Sagrada Familia, Park Guell and the beaches'),
    ('ROM', 'Rome', 'Italy', 'April to June and September to October', 'the Colosseum, the Vatican and Trastevere'),
    ('AMS', 'Amsterdam', 'Netherlands', 'April to May and September', 'the canals, Rijksmuseum and Vondelpark'),
    ('BER', 'Berlin', 'Germany', 'May to September', 'the Brandenburg Gate, Museum Island and street art'),
    ('MAD', 'Madrid', 'Spain', 'March to May and September to November', 'the Prado, Retiro Park and tapas bars'),
    ('LIS', 'Lisbon', 'Portugal', 'March to October', 'Alfama, tram 28 and Belem'),
    ('PRG', 'Prague', 'Czech Republic', 'May to September and December', 'Old Town Square, Prague Castle and Charles Bridge'),
    ('VIE', 'Vienna', 'Austria', 'April to October and December', 'Schonbrunn Palace, coffee houses and classical music'),
    ('CPH', 'Copenhagen', 'Denmark', 'May to September', 'Nyhavn, Tivoli Gardens and the food scene'),
    ('STO', 'Stockholm', 'Sweden', 'June to August', 'Gamla Stan, the archipelago and Vasa Museum'),
    ('TLL', 'Tallinn', 'Estonia', 'May to September and December', 'the medieval Old Town and Telliskivi district'),
    ('RIX', 'Riga', 'Latvia', 'May to September', 'Art Nouveau architecture and the Central Market'),
    ('WAW', 'Warsaw', 'Poland', 'May to September', 'the rebuilt Old Town and the Chopin Museum'),
    ('ATH', 'Athens', 'Greece', 'April to June and September to October', 'the Acropolis, Plaka and nearby islands'),
    ('IST', 'Istanbul', 'Turkey', 'April to May and September to October', 'Hagia Sophia, the Grand Bazaar and Bosphorus cruises'),
    ('DUB', 'Dublin', 'Ireland', 'May to September', 'Temple Bar, Trinity College and the Guinness Storehouse'),
    ('BUD', 'Budapest', 'Hungary', 'April to June and September', 'thermal baths, the Danube and ruin bars'),
    ('MIL', 'Milan', 'Italy', 'April to June and September to October', 'the Duomo, fashion districts and The Last Supper'),
    ('OSL', 'Oslo', 'Norway', 'June to August', 'the Opera House, Vigeland Park and fjord views'),
    ('BRU', 'Brussels', 'Belgium', 'April to October', 'Grand Place, chocolate and comic-strip art'),
    ('ZRH', 'Zurich', 'Switzerland', 'June to September', 'Lake Zurich, the old town and Alpine day trips'),
    ('MUC', 'Munich', 'Germany', 'May to October', 'Marienplatz, beer gardens and Bavarian Alps trips'),
    ('FRA', 'Frankfurt', 'Germany', 'May to September', 'the Romer, Main riverbank and museums'),
    ('HAM', 'Hamburg', 'Germany', 'May to September', 'the harbour, Elbphilharmonie and Speicherstadt'),
    ('KRK', 'Krakow', 'Poland', 'May to September and December', 'Wawel Castle, Kazimierz and the Main Square'),
    ('VNO', 'Vilnius', 'Lithuania', 'May to September', 'the Baroque Old Town and Uzupis district'),
    ('EDI', 'Edinburgh', 'United Kingdom', 'May to September and August festivals', 'Edinburgh Castle, the Royal Mile and Arthur\'s Seat'),
    ('MAN', 'Manchester', 'United Kingdom', 'May to September', 'football heritage, the Northern Quarter and live music'),
    ('NCE', 'Nice', 'France', 'May to June and September', 'the Promenade des Anglais and the French Riviera'),
    ('VCE', 'Venice', 'Italy', 'April to June and September to October', 'St Mark\'s Square, the canals and Murano'),
    ('FLR', 'Florence', 'Italy', 'April to June and September to October', 'the Uffizi, the Duomo and Tuscan day trips'),
    ('PMI', 'Palma', 'Spain', 'May to October', 'beaches, the cathedral and Mallorca\'s coves'),
    ('AGP', 'Malaga', 'Spain', 'March to June and September to November', 'the Alcazaba, Picasso Museum and Costa del Sol beaches'),
    ('TFS', 'Tenerife', 'Spain', 'year-round, warmest May to October', 'Mount Teide, black sand beaches and whale watching'),
    ('LPA', 'Gran Canaria', 'Spain', 'year-round, warmest May to October', 'Maspalomas dunes, Las Palmas and mountain villages'),
    ('DXB', 'Dubai', 'United Arab Emirates', 'November to March', 'the Burj Khalifa, Dubai Mall and desert safaris'),
    ('NYC', 'New York', 'United States', 'April to June and September to November', 'Central Park, Times Square and Brooklyn'),
    ('BKK', 'Bangkok', 'Thailand', 'November to February', 'the Grand Palace, street food and river temples'),
]

# code, city, airport name
ORIGINS = [
    ('HEL', 'Helsinki', 'Helsinki-Vantaa'),
    ('TKU', 'Turku', 'Turku Airport'),
    ('TMP', 'Tampere', 'Tampere-Pirkkala'),
    ('OUL', 'Oulu', 'Oulu Airport'),
    ('STO', 'Stockholm', 'Stockholm Arlanda'),
    ('CPH', 'Copenhagen', 'Copenhagen Airport'),
    ('OSL', 'Oslo', 'Oslo Gardermoen'),
    ('TLL', 'Tallinn', 'Tallinn Airport'),
    ('RIX', 'Riga', 'Riga Airport'),
]


def slug(name):
    return name.lower().replace(' ', '-')


def head(title, desc, path, extra_ld, robots='index,follow'):
    url = SITE + path
    ld = ''.join('<script type="application/ld+json">%s</script>' % json.dumps(b, ensure_ascii=False, separators=(',', ':')) for b in extra_ld)
    return (
        '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
        '<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />\n'
        '<title>%(t)s</title>\n<meta name="description" content="%(d)s" />\n'
        '<meta name="robots" content="%(r)s, max-image-preview:large" />\n'
        '<link rel="canonical" href="%(u)s" />\n'
        '<link rel="alternate" hreflang="en" href="%(u)s" /><link rel="alternate" hreflang="x-default" href="%(u)s" />\n'
        '<meta property="og:type" content="website" /><meta property="og:site_name" content="GoVeTrip" />\n'
        '<meta property="og:title" content="%(t)s" /><meta property="og:description" content="%(d)s" />\n'
        '<meta property="og:url" content="%(u)s" /><meta property="og:image" content="%(s)s/assets/bangkok-skyline.jpg" />\n'
        '<meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="%(t)s" />\n'
        '<meta name="twitter:description" content="%(d)s" />\n'
        '<link rel="stylesheet" href="/styles.css?v=lang30-20261102" />\n%(ld)s\n</head>\n'
    ) % {'t': escape(title), 'd': escape(desc), 'r': robots, 'u': url, 's': SITE, 'ld': ld}


NAV = (
    '<header class="site-header"><div class="container nav-shell"><a class="brand" href="/index.html">'
    '<img src="/assets/govetrip-logo-640.png" alt="GoVeTrip" width="200" height="64" /></a>'
    '<nav class="main-nav" aria-label="Main navigation"><a href="/flights/">Flights</a><a href="/hotels.html">Hotels</a>'
    '<a href="/cars.html">Car Rentals</a><a href="/packages.html">Package trips</a><a href="/stays.html">Holiday homes</a>'
    '<a href="/destinations/">Destinations</a><a href="/deals.html">Deals</a><a href="/about.html">About</a></nav>'
    '<a class="btn btn-primary" href="/index.html#search">Start searching</a></div></header>\n'
)
FOOT = (
    '<footer class="container" style="padding:32px 0;text-align:center"><p>'
    '<a href="/about.html">About</a> Â· <a href="/privacy.html">Privacy</a> Â· <a href="/terms.html">Terms</a> Â· '
    '<a href="/affiliate-disclosure.html">Affiliate disclosure</a> Â· <a href="/contact.html">Contact</a></p>'
    '<p>GoVeTrip compares offers from third-party partners and may earn a commission on bookings. Prices shown on partner sites change often.</p></footer>\n</body>\n</html>\n'
)


def breadcrumbs(items):
    return {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': SITE + p} for i, (n, p) in enumerate(items)],
    }


def faq_ld(faqs):
    return {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faqs],
    }


def faq_html(faqs):
    return '<h2>Frequently asked questions</h2>' + ''.join('<h3>%s</h3><p>%s</p>' % (escape(q), escape(a)) for q, a in faqs)


def booking(city):
    return 'https://www.booking.com/searchresults.html?ss=' + city.replace(' ', '+')


def write(path, content):
    full = os.path.join(ROOT, path.lstrip('/').replace('/', os.sep))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)


def destination_page(d):
    code, name, country, best, highlights = d
    path = '/destinations/%s.html' % slug(name)
    title = 'Cheap Flights, Hotels & Car Rental in %s | GoVeTrip' % name
    desc = 'Plan a trip to %s, %s: compare flights, hotels and car rentals, see the best time to visit and what to do.' % (name, country)
    faqs = [
        ('When is the best time to visit %s?' % name, 'The best time to visit %s is %s.' % (name, best)),
        ('How do I find cheap flights to %s?' % name, 'Use the GoVeTrip price calendar to compare nearby dates, be flexible by a few days and book early. Prices change constantly, so check several departure airports.'),
        ('What is there to see in %s?' % name, 'Popular highlights in %s include %s.' % (name, highlights)),
    ]
    routes = ''.join(
        '<li><a href="/flights/%s-to-%s.html">Flights from %s to %s</a></li>' % (slug(o[1]), slug(name), o[1], name)
        for o in ORIGINS if o[1] != name)
    others = ''.join('<li><a href="/destinations/%s.html">%s</a></li>' % (slug(x[1]), x[1]) for x in DESTINATIONS if x[0] != code and x[2] == country) 
    body = (
        '<body>\n' + NAV +
        '<main class="legal-shell"><div class="container legal-card">'
        '<nav aria-label="Breadcrumb"><a href="/index.html">Home</a> â€º <a href="/destinations/">Destinations</a> â€º %(n)s</nav>'
        '<span class="eyebrow">%(c)s</span><h1>Travel to %(n)s: flights, hotels and car rental</h1>'
        '<p>%(n)s is one of the most popular city destinations in %(c)s, known for %(h)s. GoVeTrip helps you compare flights, hotels and car rentals from trusted partners in one place.</p>'
        '<p><a class="btn btn-primary" href="/index.html#search">Search flights to %(n)s</a> '
        '<a class="btn" href="%(b)s" target="_blank" rel="sponsored noopener">Find hotels in %(n)s</a></p>'
        '<h2>Best time to visit %(n)s</h2><p>%(best)s is generally the best period for a trip to %(n)s, with the most pleasant conditions for sightseeing.</p>'
        '<h2>Cheap flights to %(n)s</h2><p>Flight prices to %(n)s (%(code)s) vary by season and weekday. Compare departure airports and travel dates with the <a href="/index.html#search">price calendar</a> to find the lowest fares.</p>'
        '<ul>%(r)s</ul>'
        '<h2>Hotels and car rental in %(n)s</h2><p>Compare <a href="%(b)s" target="_blank" rel="sponsored noopener">hotels in %(n)s</a> by price and location, or browse <a href="/cars.html">car rental options</a> for day trips beyond the city.</p>'
        '%(faq)s%(o)s</div></main>\n'
    ) % {
        'n': escape(name), 'c': escape(country), 'h': escape(highlights), 'b': booking(name), 'best': escape(best[0].upper() + best[1:]),
        'code': code, 'r': routes, 'faq': faq_html(faqs),
        'o': ('<h2>More destinations in %s</h2><ul>%s</ul>' % (escape(country), others)) if others else '',
    }
    ld = [
        breadcrumbs([('Home', '/'), ('Destinations', '/destinations/'), (name, path)]),
        {'@context': 'https://schema.org', '@type': 'TouristDestination', 'name': name, 'description': desc, 'url': SITE + path,
         'containedInPlace': {'@type': 'Country', 'name': country}},
        faq_ld(faqs),
    ]
    write(path, head(title, desc, path, ld) + body + FOOT)
    return path


def route_page(o, d):
    ocode, ocity, oairport = o
    code, name, country, best, highlights = d
    path = '/flights/%s-to-%s.html' % (slug(ocity), slug(name))
    title = 'Cheap Flights from %s to %s (%sâ€“%s) | GoVeTrip' % (ocity, name, ocode, code)
    desc = 'Compare flights from %s to %s. Find the cheapest dates with a flexible price calendar and book with trusted partners.' % (ocity, name)
    faqs = [
        ('How can I find cheap flights from %s to %s?' % (ocity, name), 'Compare several dates with the GoVeTrip price calendar, travel midweek if you can, and book a few weeks ahead. Fares change often.'),
        ('When is the best time to fly to %s?' % name, 'Pleasant weather in %s is typically %s; flights are often cheaper just outside peak holiday weeks.' % (name, best)),
        ('Which airport do I fly from in %s?' % ocity, 'Flights on this route usually depart from %s (%s).' % (oairport, ocode)),
    ]
    sibling_dest = [x for x in DESTINATIONS if x[0] != code and x[1] != ocity][:8]
    sibling_orig = [x for x in ORIGINS if x[0] != ocode and x[1] != name][:6]
    more = ''.join('<li><a href="/flights/%s-to-%s.html">Flights from %s to %s</a></li>' % (slug(ocity), slug(x[1]), ocity, x[1]) for x in sibling_dest)
    more += ''.join('<li><a href="/flights/%s-to-%s.html">Flights from %s to %s</a></li>' % (slug(x[1]), slug(name), x[1], name) for x in sibling_orig)
    body = (
        '<body>\n' + NAV +
        '<main class="legal-shell"><div class="container legal-card">'
        '<nav aria-label="Breadcrumb"><a href="/index.html">Home</a> â€º <a href="/flights/">Flights</a> â€º %(oc)s to %(n)s</nav>'
        '<span class="eyebrow">%(oa)s â†’ %(code)s</span><h1>Cheap flights from %(oc)s to %(n)s</h1>'
        '<p>Looking for flights from %(oc)s (%(ocode)s) to %(n)s (%(code)s)? Use GoVeTrip to compare dates and prices, then continue to a trusted partner to book.</p>'
        '<p><a class="btn btn-primary" href="/index.html#search">Search %(ocode)s â†’ %(code)s flights</a></p>'
        '<h2>About the route</h2><p>%(n)s, %(c)s is known for %(h)s. The best time to go is %(best)s.</p>'
        '<h2>Plan the rest of your trip</h2><p><a href="/destinations/%(ns)s.html">%(n)s travel guide</a> Â· '
        '<a href="%(b)s" target="_blank" rel="sponsored noopener">Hotels in %(n)s</a> Â· <a href="/cars.html">Car rental</a></p>'
        '%(faq)s<h2>Related routes</h2><ul>%(more)s</ul></div></main>\n'
    ) % {
        'oc': escape(ocity), 'oa': escape(oairport), 'ocode': ocode, 'n': escape(name), 'code': code, 'c': escape(country),
        'h': escape(highlights), 'best': escape(best), 'b': booking(name), 'ns': slug(name), 'faq': faq_html(faqs), 'more': more,
    }
    ld = [
        breadcrumbs([('Home', '/'), ('Flights', '/flights/'), ('%s to %s' % (ocity, name), path)]),
        faq_ld(faqs),
    ]
    write(path, head(title, desc, path, ld) + body + FOOT)
    return path


def hub(path, title, desc, h1, intro, links, crumb):
    items = ''.join('<li><a href="%s">%s</a></li>' % (p, escape(t)) for p, t in links)
    body = (
        '<body>\n' + NAV + '<main class="legal-shell"><div class="container legal-card">'
        '<nav aria-label="Breadcrumb"><a href="/index.html">Home</a> â€º %s</nav><h1>%s</h1><p>%s</p><ul>%s</ul></div></main>\n' % (crumb, escape(h1), escape(intro), items))
    ld = [breadcrumbs([('Home', '/'), (crumb, path)])]
    write(path, head(title, desc, path, ld) + body + FOOT)


def sitemap(name, urls):
    rows = ''.join('  <url><loc>%s%s</loc><lastmod>%s</lastmod></url>\n' % (SITE, u, TODAY) for u in urls)
    write('/' + name, '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + rows + '</urlset>\n')


def main():
    for sub in ('destinations', 'flights'):
        shutil.rmtree(os.path.join(ROOT, sub), ignore_errors=True)
    dest_paths = [destination_page(d) for d in DESTINATIONS]
    route_paths = [route_page(o, d) for o in ORIGINS for d in DESTINATIONS if d[1] != o[1]]
    hub('/destinations/index.html', 'Travel Destinations: Guides, Flights & Hotels | GoVeTrip',
        'Browse popular city break destinations in Europe and beyond with travel tips, flights and hotel links.',
        'Travel destinations', 'Explore popular city destinations and compare flights, hotels and car rentals.',
        [(p, 'Travel to ' + d[1]) for p, d in zip(dest_paths, DESTINATIONS)], 'Destinations')
    hub('/flights/index.html', 'Cheap Flights by Route | GoVeTrip',
        'Compare cheap flights from Helsinki, Stockholm, Copenhagen, Oslo and more to popular European destinations.',
        'Flights by route', 'Pick your departure city to see popular routes.',
        [(p, 'Flights ' + p.split('/')[-1][:-5].replace('-to-', ' to ').title()) for p in route_paths], 'Flights')
    static = ['/', '/hotels.html', '/cars.html', '/packages.html', '/stays.html', '/deals.html', '/explore.html', '/about.html',
              '/contact.html', '/privacy.html', '/terms.html', '/affiliate-disclosure.html']
    sitemap('sitemap-pages.xml', static + ['/destinations/', '/flights/'])
    sitemap('sitemap-destinations.xml', dest_paths)
    sitemap('sitemap-flights.xml', route_paths)
    idx = ''.join('  <sitemap><loc>%s/%s</loc><lastmod>%s</lastmod></sitemap>\n' % (SITE, n, TODAY)
                  for n in ('sitemap-pages.xml', 'sitemap-destinations.xml', 'sitemap-flights.xml', 'sitemap-languages.xml'))
    write('/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + idx + '</sitemapindex>\n')
    print('destinations: %d, routes: %d' % (len(dest_paths), len(route_paths)))


if __name__ == '__main__':
    main()
