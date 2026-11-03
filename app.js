const assetVersion = ((document.currentScript && document.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || '1';
const regionProfiles = {
  FI: { region: 'Finland', language: 'fi', currency: 'EUR', airport: 'Helsinki (HEL)' },
  SE: { region: 'Sweden', language: 'sv', currency: 'SEK', airport: 'Stockholm (ARN)' },
  NO: { region: 'Norway', language: 'no', currency: 'NOK', airport: 'Oslo (OSL)' },
  DK: { region: 'Denmark', language: 'da', currency: 'DKK', airport: 'Copenhagen (CPH)' },
  GB: { region: 'United Kingdom', language: 'en', currency: 'GBP', airport: 'London (LON)' },
  US: { region: 'United States', language: 'en', currency: 'USD', airport: 'New York (NYC)' },
  DE: { region: 'Germany', language: 'de', currency: 'EUR', airport: 'Frankfurt (FRA)' },
  FR: { region: 'France', language: 'fr', currency: 'EUR', airport: 'Paris (PAR)' },
  ES: { region: 'Spain', language: 'es', currency: 'EUR', airport: 'Madrid (MAD)' },
  IT: { region: 'Italy', language: 'it', currency: 'EUR', airport: 'Rome (FCO)' },
  NL: { region: 'Netherlands', language: 'nl', currency: 'EUR', airport: 'Amsterdam (AMS)' },
  BE: { region: 'Belgium', language: 'fr', currency: 'EUR', airport: 'Brussels (BRU)' },
  AT: { region: 'Austria', language: 'de', currency: 'EUR', airport: 'Vienna (VIE)' },
  CH: { region: 'Switzerland', language: 'de', currency: 'CHF', airport: 'Zurich (ZRH)' },
  PL: { region: 'Poland', language: 'pl', currency: 'PLN', airport: 'Warsaw (WAW)' }
};

const prices = {
  Paris: { EUR: '€149', USD: '$179', GBP: '£130', SEK: '1 589 kr', NOK: '1 689 kr', DKK: '1 099 kr', CHF: 'CHF 145', PLN: '649 zł' },
  Lisbon: { EUR: '€179', USD: '$199', GBP: '£160', SEK: '1 899 kr', NOK: '2 049 kr', DKK: '1 349 kr', CHF: 'CHF 174', PLN: '779 zł' },
  Bangkok: { EUR: '€219', USD: '$239', GBP: '£198', SEK: '2 349 kr', NOK: '2 499 kr', DKK: '1 599 kr', CHF: 'CHF 212', PLN: '949 zł' },
  'New York': { EUR: '€289', USD: '$289', GBP: '£246', SEK: '3 199 kr', NOK: '3 399 kr', DKK: '2 149 kr', CHF: 'CHF 280', PLN: '1 259 zł' }
};

const translations = {
  en: { region: 'Detected region', currency: 'Currency', language: 'Language', location: 'Location detected from your browser', useLocation: 'Use my location', search: 'Search deals', searching: 'Opening the best available flight offers…', invalid: 'Add a departure, destination, and departure date to continue.', returnError: 'Return date must be after the departure date.', heroTitle: 'Where do you want to travel?', heroDescription: 'Search flights, hotels, and car rentals from trusted travel partners in one simple, localised experience.' },
  fi: { region: 'Tunnistettu alue', currency: 'Valuutta', language: 'Kieli', location: 'Sijainti tunnistettu selaimestasi', useLocation: 'Käytä sijaintiani', search: 'Hae tarjoukset', searching: 'Avataan parhaat lentotarjoukset…', invalid: 'Lisää lähtöpaikka, määränpää ja lähtöpäivä.', returnError: 'Paluupäivän tulee olla lähtöpäivän jälkeen.', heroTitle: 'Minne haluat matkustaa?', heroDescription: 'Hae lentoja, hotelleja ja autonvuokrausta luotettavilta kumppaneilta yhdestä helppokäyttöisestä palvelusta.' },
  sv: { region: 'Upptäckt region', currency: 'Valuta', language: 'Språk', location: 'Plats upptäckt från din webbläsare', useLocation: 'Använd min plats', search: 'Sök erbjudanden', searching: 'Öppnar de bästa flygerbjudandena…', invalid: 'Lägg till avreseort, destination och avresedatum.', returnError: 'Returdatum måste vara efter avresedatum.' },
  de: { region: 'Erkannte Region', currency: 'Währung', language: 'Sprache', location: 'Standort aus Ihrem Browser erkannt', useLocation: 'Meinen Standort verwenden', search: 'Angebote suchen', searching: 'Beste Flugangebote werden geöffnet…', invalid: 'Abflugort, Ziel und Abflugdatum hinzufügen.', returnError: 'Das Rückreisedatum muss nach dem Abflugdatum liegen.' },
  fr: { region: 'Région détectée', currency: 'Devise', language: 'Langue', location: 'Lieu détecté depuis votre navigateur', useLocation: 'Utiliser ma position', search: 'Rechercher', searching: 'Ouverture des meilleures offres de vols…', invalid: 'Ajoutez le départ, la destination et la date de départ.', returnError: 'La date de retour doit être après la date de départ.' },
  es: { region: 'Región detectada', currency: 'Moneda', language: 'Idioma', location: 'Ubicación detectada desde su navegador', useLocation: 'Usar mi ubicación', search: 'Buscar ofertas', searching: 'Abriendo las mejores ofertas de vuelos…', invalid: 'Añada salida, destino y fecha de salida.', returnError: 'La fecha de regreso debe ser posterior a la fecha de salida.' },
  no: { region: 'Oppdaget region', currency: 'Valuta', language: 'Språk', location: 'Sted oppdaget fra nettleseren din', useLocation: 'Bruk min posisjon', search: 'Søk etter tilbud', searching: 'Åpner de beste flytilbudene…', invalid: 'Legg til avreise, reisemål og avreisedato.', returnError: 'Returdatoen må være etter avreisedatoen.' },
  da: { region: 'Registreret område', currency: 'Valuta', language: 'Sprog', location: 'Placering fundet fra din browser', useLocation: 'Brug min placering', search: 'Søg tilbud', searching: 'Åbner de bedste flytilbud…', invalid: 'Tilføj afrejse, destination og afrejsedato.', returnError: 'Returdatoen skal være efter afrejsedatoen.' },
  it: { region: 'Regione rilevata', currency: 'Valuta', language: 'Lingua', location: 'Posizione rilevata dal browser', useLocation: 'Usa la mia posizione', search: 'Cerca offerte', searching: 'Apertura delle migliori offerte di volo…', invalid: 'Aggiungi partenza, destinazione e data di partenza.', returnError: 'La data di ritorno deve essere successiva alla partenza.' },
  nl: { region: 'Gedetecteerde regio', currency: 'Valuta', language: 'Taal', location: 'Locatie gedetecteerd via je browser', useLocation: 'Gebruik mijn locatie', search: 'Aanbiedingen zoeken', searching: 'Beste vluchtaanbiedingen openen…', invalid: 'Voeg vertrek, bestemming en vertrekdatum toe.', returnError: 'De terugdatum moet na de vertrekdatum liggen.' },
  pt: { region: 'Região detetada', currency: 'Moeda', language: 'Idioma', location: 'Localização detetada a partir do navegador', useLocation: 'Usar a minha localização', search: 'Pesquisar ofertas', searching: 'A abrir as melhores ofertas de voos…', invalid: 'Adicione partida, destino e data de partida.', returnError: 'A data de regresso deve ser posterior à data de partida.' },
  pl: { region: 'Wykryty region', currency: 'Waluta', language: 'Język', location: 'Lokalizacja wykryta przez przeglądarkę', useLocation: 'Użyj mojej lokalizacji', search: 'Szukaj ofert', searching: 'Otwieranie najlepszych ofert lotów…', invalid: 'Dodaj miejsce wylotu, cel i datę wylotu.', returnError: 'Data powrotu musi być późniejsza niż data wylotu.' }
};

const pageTranslations = {
  fi: {
    'Select dates': 'Valitse päivät',
    Search: 'Hae',
    '✓ Compare hundreds of travel sites': '✓ Vertaile satoja matkasivustoja',
    '✓ Local prices and destinations': '✓ Paikalliset hinnat ja kohteet',
    '✓ Search free with GoVeTrip': '✓ Hae ilmaiseksi GoVeTripillä',
    'Helsinki → Paris': 'Helsinki → Pariisi',
    'Lisbon apartments': 'Lissabonin asunnot',
    '€84/night': '€84/yö',
    'Barcelona airport': 'Barcelonan lentokenttä',
    '€36/day': '€36/päivä',
    Stockholm: 'Tukholma',
    Warsaw: 'Varsova',
    Vienna: 'Wien',
    Paris: 'Pariisi',
    Lisbon: 'Lissabon',
    Bangkok: 'Bangkok',
    'New York': 'New York',
    Riga: 'Riika',
    Rome: 'Rooma',
    London: 'Lontoo',
    Prague: 'Praha',
    Barcelona: 'Barcelona',
    'Lake Como': 'Comojärvi',
    '€164/night': '€164/yö',
    '€74/night': '€74/yö',
    'View stays →': 'Katso majoitukset →',
    'Popular destinations and routes': 'Suositut kohteet ja reitit',
    'All destinations': 'Kaikki kohteet',
    'Helsinki to Barcelona': 'Helsinki–Barcelona',
    'Helsinki to London': 'Helsinki–Lontoo',
    'Helsinki to Rome': 'Helsinki–Rooma',
    'Stockholm to Paris': 'Tukholma–Pariisi',
    'All flight routes': 'Kaikki lentoreitit',
    'GoVeTrip home': 'GoVeTripin etusivu',
    'Main navigation': 'Päävalikko',
    'Travel service': 'Matkapalvelu',
    'Previous month': 'Edellinen kuukausi',
    'Next month': 'Seuraava kuukausi',
    'Second departure city': 'Toinen lähtökaupunki',
    'Second destination city': 'Toinen määränpää',
    'City, airport or station': 'Kaupunki, lentokenttä tai asema',
    'Flight + hotel in one search.': 'Lento + hotelli yhdellä haulla.',
    '1. Flights': '1. Lennot',
    '2. Hotel': '2. Hotelli',
    Next: 'Seuraava',
    'Where can you fly cheaply?': 'Minne voit lentää edullisesti?',
    'Trip length': 'Matkan pituus',
    '3 days': '3 päivää',
    '7 days': '7 päivää',
    '14 days': '14 päivää',
    'Start searching': 'Aloita haku',
    'Language and currency': 'Kieli ja valuutta',
    'Search country or language': 'Etsi maata tai kieltä',
    'Search currency': 'Etsi valuuttaa',
    Close: 'Sulje',
    Currency: 'Valuutta',
    Language: 'Kieli',
    'About GoVeTrip': 'Tietoa GoVeTripistä',
    Flights: 'Lennot',
    Hotels: 'Majoitukset',
    'Car Rentals': 'Autonvuokraus',
    'Car rentals': 'Autonvuokraus',
    'Holiday homes': 'Loma-asunnot',
    'Package trips': 'Pakettimatkat',
    Deals: 'Tarjoukset',
    About: 'Tietoa meistä',
    Contact: 'Yhteystiedot',
    'Log in': 'Kirjaudu',
    'Book now': 'Varaa nyt',
    'GoVeTrip travel search': 'GoVeTripin matkahaku',
    'Round trip': 'Meno-paluu',
    'One way': 'Yksi suunta',
    'Multi-city': 'Useampi kohde',
    From: 'Lähtöpaikka',
    To: 'Määränpää',
    Departure: 'Lähtö',
    Return: 'Paluu',
    Travelers: 'Matkustajat',
    Currency: 'Valuutta',
    Language: 'Kieli',
    'Search flights': 'Hae lentoja',
    'Ready to plan your next trip?': 'Suunnitteletko jo seuraavaa matkaasi?',
    'Search deals': 'Hae tarjouksia',
    'Flexible dates': 'Joustavat päivät',
    'Direct flights only': 'Vain suorat lennot',
    'Explore deals first': 'Katso tarjoukset ensin',
    'Compare hundreds of travel sites': 'Vertaa satoja matkailusivustoja',
    'Local prices and destinations': 'Paikalliset hinnat ja kohteet',
    'Search free with GoVeTrip': 'Hae ilmaiseksi GoVeTripillä',
    'Limited-time savings': 'Parhaat tarjoukset juuri nyt',
    "See today's best travel discounts first.": 'Katso tämän päivän parhaat matkatarjoukset.',
    'Fresh flight, hotel, holiday-home and car rental offers, updated for your region.': 'Tuoreita lento-, hotelli-, loma-asunto- ja autonvuokraustarjouksia alueellesi.',
    'See all deals': 'Katso kaikki tarjoukset',
    'Tours & activities': 'Retket ja aktiviteetit',
    'Things to do near your destination': 'Tekemistä lähellä matkakohdettasi',
    'Finding experiences for your area…': 'Etsitään elämyksiä alueeltasi…',
    'City or destination': 'Kaupunki tai matkakohde',
    Update: 'Päivitä',
    'Guided tours': 'Opastetut retket',
    Museums: 'Museot',
    'Food experiences': 'Ruokaelämykset',
    'Day trips': 'Päiväretket',
    'Explore in': 'Tutustu kohteessa',
    'View deal →': 'Katso tarjous →',
    'View stay →': 'Katso majoitus →',
    'Travel deals from €128': 'Matkatarjouksia alkaen 128 €',
    'Explore all deals →': 'Tutustu kaikkiin tarjouksiin →',
    'Popular destinations this week.': 'Viikon suosituimmat kohteet.',
    'Trending deals': 'Suositut tarjoukset',
    'Explore more destinations': 'Tutustu kohteisiin',
    'Everything you need for local, flexible booking.': 'Kaikki mitä tarvitset joustavaan paikalliseen varaamiseen.',
    'Built for global travelers': 'Suunniteltu kansainvälisille matkailijoille',
    'Location-aware results': 'Sijaintiin perustuvat tulokset',
    'Detect country, city, language, and nearby airports to surface relevant offers instantly.': 'Tunnista maa, kaupunki, kieli ja lähimmät lentokentät sopivien tarjousten löytämiseksi.',
    'Local currency pricing': 'Hinnat paikallisessa valuutassa',
    'Display prices in EUR, USD, GBP, SEK, NOK, or DKK based on browsing context or user choice.': 'Näytä hinnat euroina, dollareina, puntina tai kruunuina sijainnin tai valinnan mukaan.',
    'Flight + hotel + car bundles': 'Lento-, hotelli- ja autopaketit',
    'Find the cheapest routes, nearby hotels, and local rental offers in one place.': 'Löydä edulliset reitit, lähihotellit ja autonvuokraustarjoukset samasta paikasta.',
    'Trusted partners': 'Läpinäkyvä kumppanipalvelu',
    'Travel services': 'Matkapalvelut',
    'Compare the best offers in every category.': 'Vertaa parhaat tarjoukset kaikissa kategorioissa.',
    'Aviasales search': 'Aviasales-haku',
    'Booking.com stays': 'Booking.com-majoitukset',
    'DiscoverCars / Rentalcars': 'DiscoverCars / Rentalcars',
    'Low-cost options': 'Edulliset vaihtoehdot',
    'Smart airport matching': 'Älykäs lentokentän valinta',
    'Regional fare discovery': 'Alueellisten hintojen vertailu',
    'Popular neighborhoods': 'Suositut kaupunginosat',
    'Flexible dates': 'Joustavat päivät',
    'Price comparison': 'Hintavertailu',
    'Pickup nearby': 'Nouto läheltä',
    'Airport deals': 'Lentokenttätarjoukset',
    'Transparent totals': 'Selkeä kokonaishinta',
    'Search flights': 'Hae lentoja',
    'Compare hotel deals for your next trip.': 'Vertaa hotellitarjouksia seuraavalle matkallesi.',
    'Choose a destination and dates to find available hotels and compare current prices with our booking partner.': 'Valitse kohde ja päivät, niin näet saatavilla olevat hotellit ja voit vertailla ajantasaisia hintoja kumppanimme sivustolla.',
    "Prices and availability are confirmed on the booking partner's site.": 'Vahvista hinnat ja saatavuus kumppanin sivustolla.',
    'Hotel offers': 'Hotellitarjoukset',
    'Find stays in popular destinations.': 'Löydä majoituksia suosituista kohteista.',
    'Choose a destination to see current hotel availability and prices.': 'Valitse kohde nähdäksesi hotellien ajantasaisen saatavuuden ja hinnat.',
    'View hotels →': 'Katso hotellit →',
    'Find a hotel': 'Etsi hotelli',
    'Rent a car': 'Vuokraa auto',
    'Flights + 3 nights · Spring escape': 'Lennot + 3 yötä · Kevätloma',
    'City breaks + coastal stay': 'Kaupunkiloma + rannikkokohde',
    'Warm-weather getaway': 'Lämmin lomakohde',
    'Urban weekend + flights': 'Kaupunkiviikonloppu + lennot',
    'View offer': 'Katso tarjous',
    'From': 'Alkaen',
    'direct flights': 'suorat lennot',
    'Riga stays': 'Riian majoitukset',
    'stays': 'majoitukset',
    'night': 'yö',
    'Flights': 'Lennot',
    'Car rentals': 'Autonvuokraus',
    'From €128 · direct flights': 'Alkaen 128 € · suorat lennot',
    'From €139 · direct flights': 'Alkaen 139 € · suorat lennot',
    'From €54/night · -20%': 'Alkaen 54 €/yö · -20 %',
    'From €168 · direct flights': 'Alkaen 168 € · suorat lennot',
    'Nearest airport suggestions, hidden fares, and cheapest routes tailored to your region.': 'Lähimmät lentokentät, edulliset hinnat ja alueellesi sopivat reitit.',
    'Nearby hotels, popular destinations, and local currency offers for faster decision-making.': 'Lähihotellit, suositut kohteet ja paikalliset hinnat nopeampaan päätöksentekoon.',
    'Location-based availability with competitive pricing and convenient pickup locations.': 'Sijaintiin perustuva saatavuus, kilpailukykyiset hinnat ja helpot noutopaikat.',
    'How it works': 'Näin se toimii',
    'Simple, transparent, and built for speed.': 'Helppoa, läpinäkyvää ja nopeaa.',
    'Detect location': 'Tunnista sijainti',
    'Personalize search': 'Personoi haku',
    'Redirect to affiliate booking': 'Siirry kumppanin varaukseen',
    'Travel with confidence': 'Matkusta luottavaisin mielin',
    'Talk to us': 'Ota yhteyttä',
    Explore: 'Tutustu',
    Legal: 'Lakiasiat',
    'Get in touch': 'Ota yhteyttä',
    'Trusted partners': 'Luotetut kumppanit',
    'Book through established travel partners with clear terms and privacy information.': 'Varaa vakiintuneiden matkakumppaneiden kautta selkeillä ehdoilla.',
    'Where do you want to travel?': 'Minne haluat matkustaa?',
    'Search flights, hotels, and car rentals from trusted travel partners in one simple, localised experience.': 'Hae lentoja, hotelleja ja autonvuokrausta luotettavilta kumppaneilta yhdestä helppokäyttöisestä palvelusta.',
    'Compare hundreds of travel sites': 'Vertaa satoja matkailusivustoja',
    'Local prices and destinations': 'Paikalliset hinnat ja kohteet',
    'Search free with GoVeTrip': 'Hae ilmaiseksi GoVeTripillä',
    'Limited-time savings': 'Parhaat tarjoukset juuri nyt',
    "See today's best travel discounts first.": 'Katso tämän päivän parhaat matkatarjoukset.',
    'Fresh flight, hotel, holiday-home and car rental offers, updated for your region.': 'Lento-, hotelli-, loma-asunto- ja autonvuokraustarjouksia alueellesi.',
    'See all deals': 'Katso kaikki tarjoukset',
    'Holiday homes': 'Loma-asunnot',
    'View deal →': 'Katso tarjous →',
    'View stay →': 'Katso majoitus →',
    'Travel deals from €128': 'Matkatarjouksia alkaen 128 €',
    'Explore all deals →': 'Tutustu kaikkiin tarjouksiin →',
    'Popular destinations this week.': 'Viikon suosituimmat kohteet.',
    'Trending deals': 'Suositut tarjoukset',
    'Explore more destinations': 'Tutustu muihin kohteisiin',
    'Everything you need for local, flexible booking.': 'Kaikki mitä tarvitset joustavaan matkasuunnitteluun.',
    'Built for global travelers': 'Suunniteltu matkailijoille',
    'Location-aware results': 'Sijaintiin perustuvat tulokset',
    'Detect country, city, language, and nearby airports to surface relevant offers instantly.': 'Löydä sijaintiisi, kieleesi ja lähialueesi lentokenttiin sopivia tarjouksia.',
    'Local currency pricing': 'Hinnat paikallisessa valuutassa',
    'Display prices in EUR, USD, GBP, SEK, NOK, or DKK based on browsing context or user choice.': 'Näytä hinnat valitussa valuutassa.',
    'Flight + hotel + car bundles': 'Lennot, hotellit ja vuokra-autot',
    'Find the cheapest routes, nearby hotels, and local rental offers in one place.': 'Vertaa lentoja, hotelleja ja vuokra-autoja samassa paikassa.',
    'Trusted partners': 'Kumppanipalvelut',
    'Travel services': 'Matkapalvelut',
    'Compare the best offers in every category.': 'Vertaa matkatarjouksia eri kategorioissa.',
    'Aviasales search': 'Lentohaku',
    'Booking.com stays': 'Hotellit ja majoitukset',
    'DiscoverCars / Rentalcars': 'Autonvuokraus',
    'Low-cost options': 'Edulliset vaihtoehdot',
    'Smart airport matching': 'Lähimmät lentokentät',
    'Regional fare discovery': 'Alueelliset lentohinnat',
    'Popular neighborhoods': 'Suositut kaupunginosat',
    'Price comparison': 'Hintavertailu',
    'Pickup nearby': 'Läheiset noutopaikat',
    'Airport deals': 'Lentokenttätarjoukset',
    'Transparent totals': 'Selkeät kokonaishinnat',
    'Find a hotel': 'Etsi hotelli',
    'Rent a car': 'Vuokraa auto',
    'Flights + 3 nights · Spring escape': 'Lennot + 3 yötä · Kevätloma',
    'City breaks + coastal stay': 'Kaupunkiloma + rannikkokohde',
    'Warm-weather getaway': 'Lämmin lomakohde',
    'Urban weekend + flights': 'Kaupunkiviikonloppu + lennot',
    'View offer': 'Katso tarjous',
    'From €128 · direct flights': 'Alkaen 128 € · suorat lennot',
    'From €139 · direct flights': 'Alkaen 139 € · suorat lennot',
    'From €54/night · -20%': 'Alkaen 54 €/yö · -20 %',
    'From €168 · direct flights': 'Alkaen 168 € · suorat lennot',
    'Global travel deals with local relevance, transparent affiliate booking, and a clean mobile-first experience.': 'Matkatarjouksia ympäri maailmaa, paikallisesti ja mobiiliystävällisesti.',
    'Privacy Policy': 'Tietosuojaseloste',
    'Terms & Conditions': 'Käyttöehdot',
    'Partnerships': 'Kumppanuudet',
    'Contact': 'Yhteystiedot',
    'Get in touch': 'Ota yhteyttä',
    'Back to home': 'Etusivulle',
    'Search now': 'Hae nyt',
    'Search deals': 'Hae tarjouksia',
    'Find a stay that feels like home.': 'Löydä itsellesi sopiva loma-asunto.',
    'Compare apartments, villas, cabins and holiday homes with local prices and visible discounts.': 'Vertaa huoneistoja, huviloita ja loma-asuntoja sekä löydä ajankohtaisia tarjouksia.',
    'Bright city apartment': 'Valoisa kaupunkihuoneisto',
    'Lake-view villa': 'Huvila järvinäköalalla',
    'Poolside apartment': 'Huoneisto uima-altaan äärellä',
    'Stay in the right place for your trip.': 'Löydä matkallesi sopiva majoitus.',
    'Discover hotels, apartments, and local stays with prices adapted to your region and currency.': 'Tutustu hotelleihin ja huoneistoihin alueesi valuutassa.',
    'Hotel discovery with local context': 'Löydä sopiva majoitus',
    'Compare neighborhoods, flexible dates, and nearby properties through our booking partners.': 'Vertaile alueita, matkapäiviä ja majoituksia kumppanipalveluissa.',
    'Popular neighborhoods and destinations.': 'Suositut alueet ja kohteet.',
    'Flexible dates and stay options.': 'Joustavat päivät ja majoitusvaihtoehdot.',
    'Transparent price comparison.': 'Selkeä hintavertailu.',
    'Search hotels on GoVeTrip': 'Hae hotelleja GoVeTripissä',
    'Find a rental car for your trip.': 'Löydä matkallesi sopiva vuokra-auto.',
    'Compare cars at airports and in cities, then check current prices and availability with our rental partner.': 'Vertaile lentoasemien ja kaupunkien vuokra-autoja ja tarkista ajantasaiset hinnat kumppaniltamme.',
    'Choose a location from the suggestions.': 'Valitse noutopaikka ehdotuksista.',
    'Prices and availability are confirmed by the rental partner after you search.': 'Vuokrauskumppani vahvistaa hinnat ja saatavuuden haun jälkeen.',
    'Popular pickup destinations': 'Suositut noutokohteet',
    'Find rental cars in popular destinations.': 'Etsi vuokra-autoja suosituista kohteista.',
    'Choose a city to start a rental search. Select the matching pickup location before viewing cars.': 'Aloita autonhaku valitsemalla kaupunki. Valitse ehdotuksista oikea noutopaikka ennen autojen katselua.',
    'Rental car types': 'Vuokra-auton luokat',
    'Choose the right type of car.': 'Valitse sopiva autoluokka.',
    'See clean example images for each class. Rental brands and models vary by search.': 'Katso selkeät esimerkkikuvat jokaisesta autoluokasta. Vuokra-autojen merkit ja mallit vaihtelevat haun mukaan.',
    'Rental car class': 'Autoluokka',
    'Select an image, then enter your pickup location and dates to see matching offers.': 'Valitse autoluokka kuvasta ja anna noutopaikka sekä päivämäärät nähdäksesi sopivat tarjoukset.',
    'Isolated example image of a small rental car, with no background': 'Eristetty esimerkkikuva pienestä vuokra-autosta ilman taustaa',
    'Isolated example image of a medium rental car, with no background': 'Eristetty esimerkkikuva keskikokoisesta vuokra-autosta ilman taustaa',
    'Isolated example image of an SUV, with no background': 'Eristetty esimerkkikuva katumaasturista ilman taustaa',
    'Isolated example image of a cargo van, with no background': 'Eristetty esimerkkikuva pakettiautosta ilman taustaa',
    Small: 'Pieni auto',
    Medium: 'Keskikokoinen',
    SUV: 'Maasturi (SUV)',
    Van: 'Pakettiauto',
    'Select small car class': 'Valitse pienen auton luokka',
    'Select medium car class': 'Valitse keskikokoisen auton luokka',
    'Select SUV car class': 'Valitse maasturin luokka',
    'Select van car class': 'Valitse pakettiauton luokka',
    'Small car class or similar': 'Pienen auton luokka tai vastaava',
    'Medium car class or similar': 'Keskikokoisen auton luokka tai vastaava',
    'SUV class or similar': 'Maasturiluokka tai vastaava',
    'Standard van class or similar': 'Tavallisen pakettiauton luokka tai vastaava',
    'Check the daily price after choosing your dates': 'Tarkista päivähinta valittuasi matkapäivät',
    'Photo:': 'Kuva:',
    '(cropped),': '(rajattu),',
    'Car rentals': 'Autonvuokraus',
    'Choose pickup location →': 'Valitse noutopaikka →',
    'Search cars on GoVeTrip': 'Hae vuokra-autoja GoVeTripissä',
    'Dates': 'Päivät', 'Search': 'Hae', '1. Flights': '1. Lennot', '2. Hotel': '2. Hotelli', '2. Hotel (7 nights)': '2. Hotelli (7 yötä)',
    'Package trips': 'Pakettimatkat', 'Flight + hotel in one search.': 'Lento + hotelli yhdellä haulla.',
    'Choose your route and dates to compare flight fares and hotel options for the same trip. The lowest flight fares appear first when live price data is available; hotel prices are shown separately.': 'Valitse reitti ja päivät, niin voit vertailla saman matkan lentoja ja hotelleja. Edullisimmat lentohinnat näytetään ensin, kun reaaliaikainen hintatieto on saatavilla; hotellin hinta tarkistetaan erikseen.',
    'Search flight + hotel': 'Hae lento + hotelli',
    'Travel deals from your airport': 'Matkatarjoukset lähimmältä lentokentältäsi', 'Explore ›': 'Tutustu ›',
    'Why book a package?': 'Miksi varata paketti?',
    'See the cheapest travel days before you choose.': 'Näet halvimmat matkapäivät ennen valintaa.',
    'One search for flight and hotel with the same dates and travelers.': 'Yksi haku lennolle ja hotellille samoilla päivillä ja matkustajilla.',
    'Prices in your own currency.': 'Hinnat omassa valuutassasi.',
    'Explore': 'Tutustu', 'Where can you fly cheaply?': 'Minne pääset edullisesti?',
    'See the cheapest destinations from your airport. Change the origin, set a budget and pick a trip length.': 'Katso halvimmat kohteet lentokentältäsi. Vaihda lähtöpaikkaa, aseta budjetti ja valitse matkan pituus.',
    'Max price': 'Enimmäishinta', 'Trip length': 'Matkan pituus', '3 days': '3 päivää', '7 days': '7 päivää', '14 days': '14 päivää',
    'Previous': 'Edellinen', 'Next': 'Seuraava', 'Previous month': 'Edellinen kuukausi', 'Next month': 'Seuraava kuukausi',    'Find better flights from your nearest airport.': 'Löydä lennot lähimmältä lentokentältäsi.',
    'Compare routes, regional fares, and flexible dates with our Travelpayouts-powered flight search.': 'Vertaile reittejä, lentohintoja ja joustavia matkapäiviä.',
    'Flight search made local': 'Lentohaku lähelläsi',
    'GoVeTrip uses your browser region, preferred language, currency, and nearby airport context to make flight discovery more relevant.': 'GoVeTrip mukauttaa lentohakua alueesi, kielesi, valuuttasi ja lähialueen lentokenttien mukaan.',
    'Compare low-cost and full-service airlines.': 'Vertaile edullisia ja täyden palvelun lentoyhtiöitä.',
    'Search from nearby airports.': 'Hae lentoja lähialueen lentokentiltä.',
    'View prices in your selected currency.': 'Näet hinnat valitsemassasi valuutassa.',
    'Start flight search': 'Aloita lentohaku',
    'Popular destinations and fresh travel deals.': 'Suositut matkakohteet ja tarjoukset.',
    'Explore current destination inspiration and open a search with your local currency and region preferences.': 'Tutustu matkakohteisiin ja etsi tarjouksia alueesi asetuksilla.',
    'Explore destination inspiration and search with your local currency and region preferences.': 'Tutustu matkakohteisiin ja hae tarjouksia alueesi asetuksilla.',
    'Featured escapes': 'Suosittuja matkakohteita',
    'Paris city breaks from €149.': 'Kaupunkilomia Pariisiin alkaen 149 €.',
    'Lisbon coastal stays from €179.': 'Rantalomia Lissaboniin alkaen 179 €.',
    'Bangkok warm-weather trips from €219.': 'Lämpimiä lomia Bangkokiin alkaen 219 €.',
    'Photo: Vyacheslav Argenberg / Wikimedia Commons (CC BY 4.0)': 'Kuva: Vyacheslav Argenberg / Wikimedia Commons (CC BY 4.0)',
    'New York urban weekends from €289.': 'Kaupunkilomia New Yorkiin alkaen 289 €.',
    'Explore all offers': 'Tutustu kaikkiin tarjouksiin',
    'Global travel discovery with local relevance.': 'Löydä maailman matkatarjoukset paikallisesti.',
    'GoVeTrip helps travelers compare flights, hotels, and car rentals using country, language, nearby airports, and preferred currency.': 'GoVeTrip auttaa vertailemaan lentoja, hotelleja ja vuokra-autoja alueen, kielen, lentokenttien ja valuutan perusteella.',
    'Our approach': 'Näin palvelu toimii',
    'We make travel search simpler by bringing relevant partner offers into one clean, mobile-friendly experience. We do not operate the travel inventory; bookings are completed with third-party partners.': 'Kokoamme matkatarjoukset selkeään, mobiiliystävälliseen palveluun. Varaukset tehdään matkakumppanien sivustoilla.',
    'Transparent booking': 'Selkeät varaukset',
    'Some links are affiliate links, which means we may earn a commission when you book through them. This does not increase your booking price.': 'Osa linkeistä on kumppanilinkkejä. Voimme saada niistä komission, eikä se lisää varauksen hintaa.',
    'Contact GoVeTrip': 'Ota yhteyttä GoVeTrippiin',
    'Your search is ready.': 'Hakusi on valmis.',
    'Review the search details below. You stay on GoVeTrip until you choose to continue to a booking partner.': 'Tarkista hakutiedot. Siirryt kumppanin sivustolle vasta, kun valitset jatkamisen.',
    'Compare flight options before you book.': 'Vertaile lentovaihtoehtoja ennen varausta.',
    'Compare stays before you book.': 'Vertaile majoituksia ennen varausta.',
    'Compare holiday homes before you book.': 'Vertaile loma-asuntoja ennen varausta.',
    'Compare travel options before you book.': 'Vertaile matkavaihtoehtoja ennen varausta.',
    'Compare rental cars before you book.': 'Vertaile vuokra-autoja ennen varausta.',
    "GoVeTrip does not charge a booking fee. The final booking is completed on the selected partner's secure website.": 'GoVeTrip ei veloita varausmaksua. Varaus tehdään valitun kumppanin verkkosivustolla.',
    'Continue to booking partner': 'Jatka kumppanin sivustolle',
    'Want to refine your search?': 'Haluatko muokata hakuasi?',
    'Return to GoVeTrip and adjust your route, dates, language, or currency before leaving this site.': 'Palaa GoVeTripiin ja muokkaa reittiä, päivämääriä, kieltä tai valuuttaa.',
    'Edit search': 'Muokkaa hakua',
    'Search results': 'Hakutulokset',
    'Contact Us': 'Ota yhteyttä',
    'We’d love to hear from partners, travelers, and press contacts.': 'Voit ottaa yhteyttä yhteistyöstä ja palveluun liittyvissä kysymyksissä.',
    'We respond to business inquiries, travel partner requests, and legal/privacy requests as quickly as possible.': 'Vastaamme yhteistyö- ja tietosuojakysymyksiin mahdollisimman pian.',
    'Information we collect': 'Keräämämme tiedot',
    'How we use information': 'Tietojen käyttö',
    'Location data': 'Sijaintitiedot',
    'Cookies and analytics': 'Evästeet ja analytiikka',
    'Your rights': 'Oikeutesi',
    'Service overview': 'Palvelun kuvaus',
    'Affiliate relationships': 'Kumppanuudet',
    'Accuracy of information': 'Tietojen paikkansapitävyys',
    'User responsibilities': 'Käyttäjän vastuut',
    'Limitation of liability': 'Vastuunrajoitus',
    'What this means': 'Mitä tämä tarkoittaa',
    'How to identify affiliate links': 'Kumppanilinkkien tunnistaminen',
    'GoVeTrip search': 'GoVeTrip-haku',
    'Compare available options': 'Vertaile vaihtoehtoja',
    'Continue with ': 'Jatka palveluun ',
    'Travel partner': 'Matkakumppani',
    'New search': 'Uusi haku',
    'Your search is ready.': 'Hakusi on valmis.',
    'Example prices only. Live prices and availability are confirmed by the booking partner.': 'Esimerkkihintoja, ei reaaliaikaisia tarjouksia. Tarkista ajantasaiset hinnat ja saatavuus kumppanin sivustolta.',
    'Prices shown are examples, not live quotes. Confirm current prices and availability with the booking partner.': 'Näytetyt hinnat ovat esimerkkejä, eivät reaaliaikaisia tarjouksia. Tarkista ajantasaiset hinnat ja saatavuus kumppanin sivustolta.',
    '2 guests': '2 vierasta',
    '1 guest': '1 vieras',
    '3 guests': '3 vierasta',
    '4 guests': '4 vierasta',
    '2 Travelers': '2 matkustajaa',
    '1 Traveler': '1 matkustaja',
    '3 Travelers': '3 matkustajaa',
    '4 Travelers': '4 matkustajaa',
    'Search trips': 'Hae matkoja',
    '© 2026 GoVeTrip. All rights reserved.': '© 2026 GoVeTrip. Kaikki oikeudet pidätetään.',
    round: 'Meno-paluu',
    'one-way': 'Yksi suunta',
    'multi-city': 'Useampi kohde',
    'GoVeTrip | Global Travel Deals': 'GoVeTrip | Matkatarjoukset',
    'GoVeTrip | Compare Cheap Flights, Hotels & Car Rentals': 'GoVeTrip | Vertaa halpoja lentoja, hotelleja ja autonvuokrausta',
    'Hotels | Compare Hotel Deals & Prices | GoVeTrip': 'Hotellit | Vertaa hotellitarjouksia | GoVeTrip',
    'Car Rentals | Compare Rental Car Prices | GoVeTrip': 'Autonvuokraus | Vertaa vuokra-autojen hintoja | GoVeTrip',
    'Package Trips | Flight + Hotel Holiday Deals | GoVeTrip': 'Pakettimatkat | Lento + hotelli | GoVeTrip',
    'Holiday Homes & Apartments | Vacation Rentals | GoVeTrip': 'Loma-asunnot ja huoneistot | GoVeTrip',
    'Travel Deals | Popular Destinations & Cheap Trips | GoVeTrip': 'Matkatarjoukset | Suositut kohteet | GoVeTrip',
    'Explore Cheap Flight Destinations | GoVeTrip': 'Tutustu edullisiin lentokohteisiin | GoVeTrip',
    'About GoVeTrip | Global Travel Discovery': 'Tietoa GoVeTripistä | GoVeTrip',
    'Contact GoVeTrip': 'Ota yhteyttä | GoVeTrip',
    'Flights | GoVeTrip': 'Lennot | GoVeTrip',
    'Hotels | GoVeTrip': 'Hotellit | GoVeTrip',
    'Car Rentals | GoVeTrip': 'Autonvuokraus | GoVeTrip',
    'Deals | GoVeTrip': 'Tarjoukset | GoVeTrip',
    'About | GoVeTrip': 'Tietoa | GoVeTrip',
    'Contact | GoVeTrip': 'Yhteystiedot | GoVeTrip',
    'Holiday Homes | GoVeTrip': 'Loma-asunnot | GoVeTrip',
    'Search results | GoVeTrip': 'Hakutulokset | GoVeTrip',
    'Live flight deals from your airport': 'Lentotarjoukset lähtökentältäsi',
    'Explore ›': 'Tutustu ›',
    'Leaving from': 'Lähtökenttä',
    'Search a city or airport': 'Hae kaupunkia tai lentoasemaa',
    'Searching for cities and airports…': 'Haetaan kaupunkeja ja lentoasemia…',
    'No matching cities or airports found.': 'Vastaavia kaupunkeja tai lentoasemia ei löytynyt.',
    'Airport search is temporarily unavailable. Please try again.': 'Lentoasemahaku ei ole juuri nyt käytettävissä. Yritä uudelleen.',
    'Helsinki (HEL)': 'Helsinki (HEL)',
    'Stockholm (ARN)': 'Tukholma (ARN)',
    'Oslo (OSL)': 'Oslo (OSL)',
    'Copenhagen (CPH)': 'Kööpenhamina (CPH)',
    'London (LON)': 'Lontoo (LON)',
    'Berlin (BER)': 'Berliini (BER)',
    'Frankfurt (FRA)': 'Frankfurt (FRA)',
    'Madrid (MAD)': 'Madrid (MAD)',
    'Barcelona (BCN)': 'Barcelona (BCN)',
    'Warsaw (WAW)': 'Varsova (WAW)',
    Tallinn: 'Tallinna',
    'Live fares are estimates from Travelpayouts data. Confirm current prices and availability with the booking partner.': 'Live-lentohinnat ovat Travelpayoutsin arvioita. Tarkista ajantasaiset hinnat ja saatavuus kumppanin sivustolta.',
    'These example prices are not live quotes.': 'Nämä esimerkkihinnat eivät ole reaaliaikaisia tarjouksia.',
    'Trip type': 'Matkan tyyppi',
    'Privacy Policy | GoVeTrip': 'Tietosuojaseloste | GoVeTrip',
    'Terms & Conditions | GoVeTrip': 'Käyttöehdot | GoVeTrip',
    'Affiliate Disclosure | GoVeTrip': 'Kumppanuustiedot | GoVeTrip',
    'English': 'Englanti',
    'Suomi': 'Suomi',
    'Svenska': 'Ruotsi',
    'Deutsch': 'Saksa',
    'Français': 'Ranska',
    'Español': 'Espanja',
    'Norsk': 'Norja',
    'Dansk': 'Tanska',
    'Italiano': 'Italia',
    'Nederlands': 'Hollanti',
    'Polski': 'Puola',
    Destination: 'Kohde',
    'Check-in': 'Sisäänkirjautuminen',
    'Check-out': 'Uloskirjautuminen',
    Guests: 'Vieraat',
    'Pick-up location': 'Noutopaikka',
    'Drop-off location': 'Palautuspaikka',
    'Pick-up date': 'Noutopäivä',
    'Drop-off date': 'Palautuspäivä',
    Time: 'Aika',
    "Return to a different location": 'Palautus eri paikkaan',
    "Driver's age 30–65": 'Kuljettajan ikä 30–65',
    'Second departure': 'Toinen lähtö',
    'Second destination': 'Toinen määränpää',
    'Second departure date': 'Toisen osuuden lähtöpäivä',
    'Search hotels': 'Hae hotelleja',
    'Search cars': 'Hae vuokra-autoja',
    'Search rental cars': 'Hae vuokra-autoja',
    'Search stays': 'Hae majoituksia',
    'Search holiday homes': 'Hae loma-asuntoja',
    'City or area': 'Kaupunki tai alue',
    'City or airport': 'Kaupunki tai lentokenttä',
    'Departure city': 'Lähtökaupunki',
    'Destination city': 'Kohdekaupunki',
    'Departure date': 'Lähtöpäivä',
    'Return date': 'Paluupäivä',
    'Number of travelers': 'Matkustajien määrä',
    'Currency selection': 'Valuutan valinta',
    'Language selection': 'Kielen valinta',
    from: 'Lähtö',
    to: 'Kohde',
    departure: 'Lähtöpäivä',
    return: 'Paluupäivä',
    checkIn: 'Sisäänkirjautuminen',
    checkOut: 'Uloskirjautuminen',
    pickup: 'Noutopaikka',
    pickupDate: 'Noutopäivä',
    dropoffDate: 'Palautuspäivä',
    guests: 'Vieraat',
    currency: 'Valuutta',
    country: 'Maa',
    'Continue with Aviasales': 'Jatka Aviasales-palveluun',
    'Continue with Booking.com': 'Jatka Booking.comiin',
    'Continue with Rentalcars': 'Jatka Rentalcars-palveluun',
    'For questions about an existing booking, contact the travel provider shown in your booking confirmation. GoVeTrip does not process or manage bookings.': 'Jos sinulla on kysyttävää varauksesta, ota yhteyttä varausvahvistuksessa mainittuun palveluntarjoajaan. GoVeTrip ei käsittele tai hallinnoi varauksia.',
    'For website, partnership, or privacy inquiries, email us at': 'Verkkosivuston, kumppanuuksien tai tietosuojan asioissa voit lähettää sähköpostia osoitteeseen',
    'The site uses your browser language and an IP-based country lookup to choose regional content, a supported departure airport, language, and currency. It does not request GPS location. Your language and currency selections may be stored in your browser so they remain selected as you move between pages.': 'Sivusto käyttää selaimesi kieltä ja IP-osoitteeseen perustuvaa maarajausta alueellisen sisällön, tuetun lähtölentokentän, kielen ja valuutan valintaan. Sivusto ei pyydä GPS-sijaintia. Kieli- ja valuuttavalintasi voidaan tallentaa selaimeesi sivujen välillä.',
    'GoVeTrip respects user privacy and processes personal data only to deliver a relevant travel experience and improve our services.': 'GoVeTrip kunnioittaa yksityisyyttä ja käsittelee henkilötietoja vain palvelun tarjoamiseen ja kehittämiseen.',
    'We may collect information such as device type, browser language, country or city detection, search preferences, affiliate clicks, and contact details submitted through forms.': 'Voimme kerätä esimerkiksi laitetyypin, selaimen kielen, maasijainnin, hakutoiveet, kumppanilinkkien klikkaukset ja lomakkeella annetut yhteystiedot.',
    'To personalize currency, language, and destination recommendations.': 'Valuutan, kielen ja kohdesuositusten mukauttamiseen.',
    'To improve site/app performance and user experience.': 'Sivuston suorituskyvyn ja käyttökokemuksen parantamiseen.',
    'To review affiliate referrals and service performance.': 'Kumppaniohjausten ja palvelun toimivuuden arviointiin.',
    'To respond to inquiries and maintain compliance records.': 'Yhteydenottoihin vastaamiseen ja velvoitteiden dokumentointiin.',
    'Geolocation information helps us estimate the user country, city, and local travel context. The website may use browser locale information and a third-party IP location service to select regional content, nearby airports, language, and currency. When GPS is used, the browser asks for permission before location-sharing begins.': 'Sijaintitietoja käytetään alueellisen matkasisällön, kielen ja valuutan valintaan. Sivusto voi käyttää selaimen kieli- ja alueasetuksia sekä kolmannen osapuolen IP-sijaintipalvelua. GPS-sijaintia ei käytetä ilman selaimen lupaa.',
    'GoVeTrip stores language and currency preferences in your browser. The Travelpayouts flight widget is optional and is loaded only if you allow it in the cookie settings. This setting does not enable GoVeTrip click tracking. If you follow a booking link, the travel partner may use its own cookies and tracking under its privacy policy. GoVeTrip does not currently use analytics cookies.': 'GoVeTrip tallentaa kieli- ja valuutta-asetukset selaimeesi. Travelpayoutsin lentohintawidget on valinnainen, ja se ladataan vain, jos sallit sen evästeasetuksissa. Tämä asetus ei ota käyttöön GoVeTripin klikkausseurantaa. Varauslinkkiä avatessasi matkakumppani voi käyttää omia evästeitään ja seurantaa oman tietosuojaselosteensa mukaisesti. GoVeTrip ei tällä hetkellä käytä analytiikkaevästeitä.',
    'Depending on your jurisdiction, you may request access, correction, or deletion of personal data, withdraw consent, or object to processing where applicable.': 'Sovellettavan lainsäädännön mukaan voit pyytää pääsyä henkilötietoihisi, niiden korjaamista tai poistamista sekä vastustaa käsittelyä.',
    'These terms govern the use of the GoVeTrip website and related services. By using the site, you agree to these conditions.': 'Nämä ehdot koskevat GoVeTrip-sivuston ja siihen liittyvien palvelujen käyttöä. Käyttämällä sivustoa hyväksyt ehdot.',
    'GoVeTrip provides travel discovery and comparison tools. It does not directly own or operate flight, hotel, or car rental inventory, and all booking transactions are completed through third-party partners.': 'GoVeTrip tarjoaa matkavaihtoehtojen haku- ja vertailutyökaluja. Se ei omista tai hallinnoi lento-, hotelli- tai autonvuokrauspalveluita. Varaukset tehdään kolmansien osapuolten palveluissa.',
    'We may earn a commission when users click through and book via linked offers. This affiliate relationship does not affect traveler pricing or service quality.': 'Voimme saada komission, jos käyttäjä varaa palvelun kumppanilinkin kautta. Kumppanuus ei vaikuta matkustajan maksamaan hintaan.',
    'Travel offers, prices, and availability are subject to change without notice and should be verified with the provider or partner before booking.': 'Matkatarjoukset, hinnat ja saatavuus voivat muuttua. Tarkista tiedot palveluntarjoajalta ennen varausta.',
    'Provide accurate trip information when searching.': 'Anna haussa oikeat matkatiedot.',
    'Review partner terms before final booking or payment.': 'Tutustu kumppanin ehtoihin ennen varausta tai maksua.',
    'Ensure any booking changes or cancellations comply with partner policies.': 'Varmista, että muutokset ja peruutukset noudattavat kumppanin ehtoja.',
    'GoVeTrip is not responsible for partner booking failures, third-party service issues, or indirect losses resulting from travel arrangements.': 'GoVeTrip ei vastaa kumppanien varausvirheistä, kolmansien osapuolten palveluista tai matkajärjestelyistä aiheutuvista välillisistä vahingoista.',
    'GoVeTrip participates in affiliate marketing programs, including Travelpayouts, Booking.com, and rental car partners. We may earn a commission when a user clicks a referral link and completes a qualifying booking.': 'GoVeTrip osallistuu kumppanuusmarkkinointiin, muun muassa Travelpayoutsin, Booking.comin ja autonvuokrauskumppaneiden kanssa. Voimme saada komission, kun käyttäjä tekee varauksen kumppanilinkin kautta.',
    'This does not increase the cost of travel for the user. Instead, the partner may compensate us for customer referrals. We use this revenue to sustain the platform, improve functionality, and continue providing comparisons and recommendations.': 'Kumppanuus ei lisää käyttäjän matkakustannuksia. Kumppani voi maksaa meille asiakasohjauksesta. Tuloilla ylläpidetään ja kehitetään palvelua.',
    'Affiliate links may use special identifiers or tracking URLs. These links help us attribute bookings to the appropriate partner source.': 'Kumppanilinkeissä voidaan käyttää tunnisteita tai seurantaosoitteita, joiden avulla varaukset kohdistetaan oikealle kumppanille.',
    'The disclosure statement displayed on the site is: We may earn a commission when you book through our links.': 'Sivustolla ilmoitamme, että voimme saada komission kumppanilinkkien kautta tehdyistä varauksista.'
  },
  no: {
    Flights: 'Flyreiser', Hotels: 'Hoteller', 'Car Rentals': 'Leiebiler', 'Holiday homes': 'Ferieboliger',
    'Package trips': 'Pakkereiser', Deals: 'Tilbud', About: 'Om oss', Contact: 'Kontakt',
    'Log in': 'Logg inn', 'Book now': 'Bestill nå', 'Round trip': 'Tur-retur', 'One way': 'Én vei',
    'Multi-city': 'Flere reisemål', From: 'Fra', To: 'Til', Departure: 'Avreise', Return: 'Retur',
    Travelers: 'Reisende', 'Search flights': 'Søk etter flyreiser', 'Search deals': 'Søk etter tilbud',
    'Flexible dates': 'Fleksible datoer', 'Direct flights only': 'Kun direktefly',
    'Explore deals first': 'Se tilbud først', 'See all deals': 'Se alle tilbud',
    'Travel services': 'Reisetjenester', 'How it works': 'Slik fungerer det',
    'Talk to us': 'Kontakt oss', Explore: 'Utforsk', Legal: 'Juridisk'
  },
  da: {
    Flights: 'Fly', Hotels: 'Hoteller', 'Car Rentals': 'Biludlejning', 'Holiday homes': 'Ferieboliger',
    'Package trips': 'Pakkerejser', Deals: 'Tilbud', About: 'Om os', Contact: 'Kontakt',
    'Log in': 'Log ind', 'Book now': 'Book nu', 'Round trip': 'Retur', 'One way': 'Enkeltbillet',
    'Multi-city': 'Flere destinationer', From: 'Fra', To: 'Til', Departure: 'Afrejse', Return: 'Retur',
    Travelers: 'Rejsende', 'Search flights': 'Søg fly', 'Search deals': 'Søg tilbud',
    'Flexible dates': 'Fleksible datoer', 'Direct flights only': 'Kun direkte fly',
    'Explore deals first': 'Se tilbud først', 'See all deals': 'Se alle tilbud',
    'Travel services': 'Rejsetjenester', 'How it works': 'Sådan fungerer det',
    'Talk to us': 'Kontakt os', Explore: 'Udforsk', Legal: 'Juridisk'
  },
  it: {
    Flights: 'Voli', Hotels: 'Hotel', 'Car Rentals': 'Autonoleggio', 'Holiday homes': 'Case vacanza',
    'Package trips': 'Pacchetti viaggio', Deals: 'Offerte', About: 'Chi siamo', Contact: 'Contatti',
    'Log in': 'Accedi', 'Book now': 'Prenota ora', 'Round trip': 'Andata e ritorno', 'One way': 'Solo andata',
    'Multi-city': 'Più destinazioni', From: 'Da', To: 'A', Departure: 'Partenza', Return: 'Ritorno',
    Travelers: 'Viaggiatori', 'Search flights': 'Cerca voli', 'Search deals': 'Cerca offerte',
    'Flexible dates': 'Date flessibili', 'Direct flights only': 'Solo voli diretti',
    'Explore deals first': 'Scopri prima le offerte', 'See all deals': 'Vedi tutte le offerte',
    'Travel services': 'Servizi di viaggio', 'How it works': 'Come funziona',
    'Talk to us': 'Contattaci', Explore: 'Esplora', Legal: 'Note legali'
  },
  nl: {
    Flights: 'Vluchten', Hotels: 'Hotels', 'Car Rentals': 'Autoverhuur', 'Holiday homes': 'Vakantiehuizen',
    'Package trips': 'Pakketreizen', Deals: 'Aanbiedingen', About: 'Over ons', Contact: 'Contact',
    'Log in': 'Inloggen', 'Book now': 'Boek nu', 'Round trip': 'Retour', 'One way': 'Enkele reis',
    'Multi-city': 'Meerdere bestemmingen', From: 'Van', To: 'Naar', Departure: 'Vertrek', Return: 'Terug',
    Travelers: 'Reizigers', 'Search flights': 'Vluchten zoeken', 'Search deals': 'Aanbiedingen zoeken',
    'Flexible dates': 'Flexibele datums', 'Direct flights only': 'Alleen directe vluchten',
    'Explore deals first': 'Bekijk eerst de aanbiedingen', 'See all deals': 'Bekijk alle aanbiedingen',
    'Travel services': 'Reisdiensten', 'How it works': 'Zo werkt het',
    'Talk to us': 'Neem contact op', Explore: 'Ontdek', Legal: 'Juridisch'
  }
};

let currentProfile = { ...regionProfiles.FI };
const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
const originalPageTitle = document.title;
const supportedCurrencies = ['EUR', 'USD', 'GBP', 'SEK', 'NOK', 'DKK', 'CHF', 'PLN'];
let cookieConsent = null;

function hasAffiliateConsent() {
  return cookieConsent?.affiliate === true;
}

function getSavedPreference(key) {
  try {
    return localStorage.getItem(`govetrip.${key}`);
  } catch (error) {
    console.warn(`Could not read saved ${key} preference.`, error);
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(`govetrip.${key}`, value);
    return true;
  } catch (error) {
    console.warn(`Could not save ${key} preference.`, error);
    return false;
  }
}

function profileFromBrowser() {
  const locale = navigator.language || 'en-US';
  const country = locale.split('-')[1]?.toUpperCase();
  const language = locale.split('-')[0];
  const profile = regionProfiles[country] || { region: 'Europe', language: translations[language] ? language : 'en', currency: 'EUR', airport: '' };
  return { ...profile, city: profile.airport?.split(' (')[0] || '', language: translations[profile.language] ? profile.language : 'en' };
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function translatePage(language) {
  const dictionary = pageTranslations[language] || {};
  document.querySelectorAll('body *').forEach((element) => {
    const original = originalAttributes.get(element) || {};
    ['placeholder', 'title', 'aria-label', 'alt'].forEach((attribute) => {
      if (!Object.prototype.hasOwnProperty.call(original, attribute)) {
        original[attribute] = element.getAttribute(attribute);
      }
      const value = original[attribute];
      if (value && dictionary[value]) element.setAttribute(attribute, dictionary[value]);
      else if (value) element.setAttribute(attribute, value);
    });
    originalAttributes.set(element, original);
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  nodes.forEach((textNode) => {
    const original = originalTextNodes.get(textNode) || textNode.textContent;
    originalTextNodes.set(textNode, original);
    const normalized = original.trim().replace(/\s+/g, ' ');
    if (!normalized || textNode.parentElement?.closest('.lang-list')) return;
    const translated = dictionary[normalized] || normalized;
    const leadingSpace = original.match(/^\s*/)[0];
    const trailingSpace = original.match(/\s*$/)[0];
    textNode.textContent = `${leadingSpace}${translated}${trailingSpace}`;
  });
  document.title = pageTranslations[language]?.[originalPageTitle] || originalPageTitle;
  convertStaticPrices();
}

const eurRates = { EUR: 1, USD: 1.1, GBP: 0.86, SEK: 11, NOK: 11.5, DKK: 7.45, CHF: 0.96, PLN: 4.3 };
function convertStaticPrices() {
  const currency = currentProfile.currency || 'EUR';
  if (currency === 'EUR' || !eurRates[currency]) return;
  const formatter = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency, maximumFractionDigits: 0 });
  document.querySelectorAll('.quick-deal p s, .quick-deal p strong').forEach((element) => {
    element.childNodes.forEach((node) => {
      if (node.nodeType !== 3) return;
      node.textContent = node.textContent.replace(/€\s?(\d+)/, (_, amount) => formatter.format(Math.round(amount * eurRates[currency] / 5) * 5));
    });
  });
}

const uiLanguages = ['en', 'fi', 'sv', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'no', 'da', 'pt'].map((code) => ({ code }));
const loadedLanguages = new Set(['en', 'fi']);

const languageChoices = [
  { country: 'Suomi', label: 'Suomi', lang: 'fi', cc: 'fi', currency: 'EUR' },
  { country: 'Sverige', label: 'Svenska', lang: 'sv', cc: 'se', currency: 'SEK' },
  { country: 'Norge', label: 'Norsk', lang: 'no', cc: 'no', currency: 'NOK' },
  { country: 'Danmark', label: 'Dansk', lang: 'da', cc: 'dk', currency: 'DKK' },
  { country: 'Deutschland', label: 'Deutsch', lang: 'de', cc: 'de', currency: 'EUR' },
  { country: 'France', label: 'Fran\u00e7ais', lang: 'fr', cc: 'fr', currency: 'EUR' },
  { country: 'Espa\u00f1a', label: 'Espa\u00f1ol', lang: 'es', cc: 'es', currency: 'EUR' },
  { country: 'Italia', label: 'Italiano', lang: 'it', cc: 'it', currency: 'EUR' },
  { country: 'Nederland', label: 'Nederlands', lang: 'nl', cc: 'nl', currency: 'EUR' },
  { country: 'Polska', label: 'Polski', lang: 'pl', cc: 'pl', currency: 'PLN' },
  { country: 'Portugal', label: 'Portugu\u00eas', lang: 'pt', cc: 'pt', currency: 'EUR' },
  { country: 'United Kingdom', label: 'English', lang: 'en', cc: 'gb', currency: 'GBP' },
  { country: 'United States', label: 'English', lang: 'en', cc: 'us', currency: 'USD' },
  { country: 'Ireland', label: 'English', lang: 'en', cc: 'ie', currency: 'EUR' },
  { country: 'Australia', label: 'English', lang: 'en', cc: 'au', currency: 'USD' }
];

const pageLanguage = document.documentElement.hasAttribute('data-localized') ? document.documentElement.lang : null;
function goToLanguage(language) {
  if (language === (pageLanguage || 'en')) return false;
  const page = window.location.pathname.split('/').pop() || 'index.html';
  window.location.href = (language === 'en' ? '/' : '/' + language + '/') + page + window.location.search + window.location.hash;
  return true;
}

function gvtT(text) {
  return (pageTranslations[document.documentElement.lang] || {})[text] || text;
}
window.gvtT = gvtT;

function copyFor(table) {
  const lang = currentProfile.language;
  if (table[lang]) return table[lang];
  return Object.fromEntries(Object.entries(table.en).map(([key, value]) => [key, gvtT(value)]));
}

function flagImg(cc) {
  return `<img class="lang-flag-img" src="https://flagcdn.com/24x18/${cc}.png" srcset="https://flagcdn.com/48x36/${cc}.png 2x" width="24" height="18" alt="" />`;
}

function setCurrency(code) {
  currentProfile.currency = code;
  savePreference('currency', code);
  const select = document.getElementById('currencySelect');
  if (select) select.value = code;
  updatePrices(code);
  translatePage(currentProfile.language);
  updateServiceLinks();
  setText('#currencyBadge', code);
  syncLanguageMenu(currentProfile.language);
  window.dispatchEvent(new CustomEvent('gvt-currency', { detail: code }));
  loadFlightWidget();
}

function initLanguageMenu() {
  const select = document.getElementById('languageSelect');
  if (select && ![...select.options].some((option) => option.value === 'pt')) select.add(new Option('Portugu\u00eas', 'pt'));
  const host = document.querySelector('.nav-shell');
  if (!host || document.getElementById('langMenu')) return;
  const wrap = document.createElement('div');
  wrap.className = 'lang-menu';
  wrap.id = 'langMenu';
  wrap.innerHTML = '<button type="button" class="lang-button" aria-haspopup="dialog" aria-label="Language and currency"><span class="lang-button-flag"></span><span class="lang-code"></span></button>'
    + '<div class="lang-modal" hidden><div class="lang-backdrop"></div><div class="lang-dialog" role="dialog" aria-modal="true" aria-label="Language and currency">'
    + '<button type="button" class="lang-close" aria-label="Close">×</button>'
    + '<div class="lang-tabs" role="tablist"><button type="button" role="tab" data-tab="lang" aria-selected="true">Language</button><button type="button" role="tab" data-tab="cur" aria-selected="false">Currency</button></div>'
    + '<input type="search" class="lang-search" placeholder="Search country or language" aria-label="Search country or language" />'
    + '<ul class="lang-list" role="listbox"></ul></div></div>';
  const button = wrap.querySelector('.lang-button');
  const modal = wrap.querySelector('.lang-modal');
  const list = wrap.querySelector('.lang-list');
  const search = wrap.querySelector('.lang-search');
  let tab = 'lang';
  const close = () => { modal.hidden = true; document.body.classList.remove('lang-open'); };
  const render = () => {
    const q = search.value.trim().toLowerCase();
    list.innerHTML = '';
    const items = tab === 'lang'
      ? languageChoices.map((c) => ({ key: c.country + '|' + c.lang, text: `${c.country} (${c.label})`, flag: flagImg(c.cc), selected: isChoiceSelected(c), pick: () => { selectedCountryCc = c.cc; savePreference('countryCc', c.cc); currentProfile.language = c.lang; currentProfile.currency = c.currency; savePreference('language', c.lang); savePreference('currency', c.currency); if (goToLanguage(c.lang)) return; applyLanguage(c.lang); updateServiceLinks(); setCurrency(c.currency); } }))
      : supportedCurrencies.map((code) => ({ key: code, text: code, flag: '', selected: code === currentProfile.currency, pick: () => setCurrency(code) }));
    items.filter((i) => i.text.toLowerCase().includes(q)).forEach((i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i.selected));
      li.tabIndex = 0;
      li.innerHTML = `${i.flag}<span>${i.text}</span>`;
      const choose = () => { i.pick(); close(); };
      li.addEventListener('click', choose);
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
      list.appendChild(li);
    });
  };
  button.addEventListener('click', () => { modal.hidden = false; document.body.classList.add('lang-open'); search.value = ''; render(); search.focus(); });
  wrap.querySelector('.lang-close').addEventListener('click', close);
  wrap.querySelector('.lang-backdrop').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
  search.addEventListener('input', render);
  wrap.querySelectorAll('.lang-tabs button').forEach((b) => b.addEventListener('click', () => {
    tab = b.dataset.tab;
    wrap.querySelectorAll('.lang-tabs button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    search.value = '';
    search.placeholder = tab === 'lang' ? 'Search country or language' : 'Search currency';
    render();
  }));
  const actions = host.querySelector('.nav-actions');
  if (actions) actions.prepend(wrap);
  else {
    const cta = [...host.children].find((child) => child.classList.contains('btn'));
    host.insertBefore(wrap, cta || null);
  }
  syncLanguageMenu(currentProfile.language);
}

let selectedCountryCc = (function () { try { return localStorage.getItem('govetrip.countryCc'); } catch (e) { return null; } })();
function isChoiceSelected(c) {
  if (c.lang !== currentProfile.language || c.currency !== currentProfile.currency) return false;
  const same = languageChoices.filter((x) => x.lang === c.lang && x.currency === c.currency);
  const pick = same.find((x) => x.cc === selectedCountryCc) || same[0];
  return pick === c;
}

function syncLanguageMenu(language) {
  const wrap = document.getElementById('langMenu');
  if (!wrap) return;
  const choice = languageChoices.find((c) => isChoiceSelected(c) && c.lang === language) || languageChoices.find((c) => c.lang === language && c.currency === currentProfile.currency) || languageChoices.find((c) => c.lang === language) || languageChoices[0];
  wrap.querySelector('.lang-button-flag').innerHTML = flagImg(choice.cc);
  wrap.querySelector('.lang-code').textContent = currentProfile.currency;
}

let languageRequest = 0;
function applyLanguage(language) {
  if (!uiLanguages.some((l) => l.code === language)) language = 'en';
  const request = ++languageRequest;
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) languageSelect.value = language;
  syncLanguageMenu(language);
  const finish = () => {
    if (request !== languageRequest) return;
    document.documentElement.lang = language;
    translatePage(language);
    window.dispatchEvent(new CustomEvent('gvt-lang', { detail: language }));
  };
  if (loadedLanguages.has(language)) {
    finish();
    return;
  }
  // Keep the current text on screen until the dictionary arrives, so the page never flashes back to English.
  fetch(`/i18n/${language}.json?v=${assetVersion}`)
    .then((response) => (response.ok ? response.json() : {}))
    .then((data) => {
      pageTranslations[language] = { ...(pageTranslations[language] || {}), ...data };
      loadedLanguages.add(language);
    })
    .catch(() => {})
    .then(finish);
}

function updatePrices(currency) {
  [['priceParis', 'Paris'], ['priceLisbon', 'Lisbon'], ['priceBangkok', 'Bangkok'], ['priceNY', 'New York']].forEach(([id, destination]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = prices[destination][currency] || prices[destination].EUR;
  });
}

function updateServiceLinks() {
  document.querySelectorAll('[data-service]').forEach((link) => {
    const service = link.dataset.service;
    link.href = service === 'hotels' ? 'hotels.html' : service === 'cars' ? 'cars.html' : 'flights.html';
  });
}

let flightWidgetKey = '';
function loadFlightWidget() {
  const mount = document.getElementById('tpFlightWidget');
  if (!mount || !hasAffiliateConsent()) return;
  const currency = (currentProfile.currency || 'EUR').toLowerCase();
  const locale = ['en', 'de', 'es', 'fr', 'it', 'pl'].includes(currentProfile.language) ? currentProfile.language : 'en';
  const key = `${currency}-${locale}`;
  if (key === flightWidgetKey) return;
  flightWidgetKey = key;
  mount.innerHTML = '';
  const script = document.createElement('script');
  script.async = true;
  script.charset = 'utf-8';
  script.src = `https://tpwdgt.com/content?currency=${currency}&trs=573176&shmarker=293373.293373&show_hotels=true&powered_by=true&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100`;
  mount.appendChild(script);
}

function loadAffiliateFeatures() {
  if (!hasAffiliateConsent()) return;
  loadFlightWidget();
}

function initCookieConsent() {
  const translations = {
    fi: {
      settings: 'Evästeasetukset', title: 'Yksityisyysvalintasi',
      description: 'Käytämme välttämätöntä selaintallennusta asetustesi muistamiseen. Luvallasi GoVeTripin lentohintawidget voidaan ladata.',
      necessary: 'Vain välttämättömät', accept: 'Hyväksy kaikki', customize: 'Muokkaa valintoja',
      affiliate: 'Lentohintawidget', affiliateDescription: 'Salli GoVeTripin lentohintawidgetin lataus.',
      save: 'Tallenna valinnat', privacy: 'Tietosuojaseloste', required: 'Aina käytössä',
      necessaryStorage: 'Välttämätön tallennus', storageError: 'Valintaa ei voitu tallentaa. Tarkista selaimen tallennusasetukset.'
    },
    en: {
      settings: 'Cookie settings', title: 'Your privacy choices',
      description: 'We use necessary browser storage to remember your settings. With your permission, the GoVeTrip flight widget may be loaded.',
      necessary: 'Necessary only', accept: 'Accept all', customize: 'Customize choices',
      affiliate: 'Flight price widget', affiliateDescription: 'Allow the GoVeTrip flight price widget to load.',
      save: 'Save choices', privacy: 'Privacy policy', required: 'Always on',
      necessaryStorage: 'Necessary storage', storageError: 'We could not save your choice. Check your browser storage settings.'
    }
  };
  const existing = getSavedPreference('cookieConsent.v1');
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (parsed && parsed.version === 1 && typeof parsed.affiliate === 'boolean') cookieConsent = parsed;
    } catch (error) {
      console.warn('Could not read saved cookie choices.', error);
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    .gvt-cookie-settings{position:fixed;z-index:1000;bottom:16px;left:16px;border:0;border-radius:999px;padding:10px 16px;background:#32105d;color:#fff;font-family:inherit;font-size:14px;font-weight:600;line-height:1.3;box-shadow:0 4px 18px #180b2640;cursor:pointer}
    .gvt-cookie-panel{position:fixed;z-index:1001;right:16px;bottom:16px;width:min(440px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;padding:22px;border:1px solid #e4def2;border-radius:18px;background:#fff;color:#21152f;box-shadow:0 18px 60px #180b2640;font:15px/1.5 Inter,system-ui,sans-serif}
    .gvt-cookie-panel[hidden],.gvt-cookie-custom[hidden]{display:none}
    .gvt-cookie-panel h2{margin:0 0 8px;font-size:1.25rem}
    .gvt-cookie-panel p{margin:0 0 14px}
    .gvt-cookie-panel a{color:#5b21b6}
    .gvt-cookie-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
    .gvt-cookie-actions button{flex:1 1 130px;min-height:42px;padding:9px 12px;border:1px solid #d6cfe6;border-radius:10px;background:#fff;color:#32105d;font-family:inherit;font-size:14px;font-weight:600;line-height:1.3;cursor:pointer}
    .gvt-cookie-actions .gvt-cookie-accept{border-color:#5b21b6;background:#5b21b6;color:#fff}
    .gvt-cookie-custom{margin-top:16px;padding-top:14px;border-top:1px solid #e4def2}
    .gvt-cookie-required,.gvt-cookie-option{display:flex;justify-content:space-between;gap:12px;align-items:center}
    .gvt-cookie-custom small{display:block;color:#625873}
    .gvt-cookie-option{align-items:flex-start;margin-top:12px}
    .gvt-cookie-option input{width:20px;height:20px;flex:0 0 auto;accent-color:#5b21b6}
    @media(max-width:520px){.gvt-cookie-panel{right:8px;bottom:8px;width:calc(100vw - 16px);padding:18px}.gvt-cookie-settings{bottom:8px;left:8px}}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.className = 'gvt-cookie-panel';
  panel.id = 'gvtCookiePanel';
  panel.setAttribute('aria-labelledby', 'gvtCookieTitle');
  panel.setAttribute('role', 'region');
  panel.hidden = Boolean(cookieConsent);
  const title = document.createElement('h2');
  title.id = 'gvtCookieTitle';
  const description = document.createElement('p');
  const privacyLink = document.createElement('a');
  privacyLink.href = 'privacy.html';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.hidden = true;
  const required = document.createElement('div');
  required.className = 'gvt-cookie-required';
  const requiredLabel = document.createElement('span');
  const requiredStatus = document.createElement('strong');
  required.append(requiredLabel, requiredStatus);
  const custom = document.createElement('div');
  custom.className = 'gvt-cookie-custom';
  custom.hidden = true;
  const affiliateLabel = document.createElement('label');
  affiliateLabel.className = 'gvt-cookie-option';
  const affiliateCopy = document.createElement('span');
  const affiliateTitle = document.createElement('strong');
  const affiliateDescription = document.createElement('small');
  const affiliateCheckbox = document.createElement('input');
  affiliateCheckbox.type = 'checkbox';
  affiliateCheckbox.id = 'gvtAffiliateConsent';
  affiliateLabel.htmlFor = affiliateCheckbox.id;
  affiliateCopy.append(affiliateTitle, affiliateDescription);
  affiliateLabel.append(affiliateCopy, affiliateCheckbox);
  custom.append(required, affiliateLabel);

  const actions = document.createElement('div');
  actions.className = 'gvt-cookie-actions';
  const necessaryButton = document.createElement('button');
  const acceptButton = document.createElement('button');
  acceptButton.className = 'gvt-cookie-accept';
  const customizeButton = document.createElement('button');
  const saveButton = document.createElement('button');
  saveButton.className = 'gvt-cookie-accept';
  [necessaryButton, acceptButton, customizeButton, saveButton].forEach((button) => { button.type = 'button'; });
  actions.append(necessaryButton, acceptButton, customizeButton);
  panel.append(title, description, privacyLink, custom, actions, status);
  document.body.append(panel);

  const settingsButton = document.createElement('button');
  settingsButton.className = 'gvt-cookie-settings';
  settingsButton.type = 'button';
  settingsButton.setAttribute('aria-controls', panel.id);
  settingsButton.setAttribute('aria-expanded', 'false');
  settingsButton.addEventListener('click', () => {
    affiliateCheckbox.checked = hasAffiliateConsent();
    actions.replaceChildren(necessaryButton, acceptButton, customizeButton);
    panel.hidden = !panel.hidden;
    settingsButton.setAttribute('aria-expanded', String(!panel.hidden));
  });
  document.body.append(settingsButton);

  const saveChoices = (affiliate) => {
    const wasAffiliateEnabled = hasAffiliateConsent();
    const nextConsent = { version: 1, necessary: true, affiliate, savedAt: new Date().toISOString() };
    if (!savePreference('cookieConsent.v1', JSON.stringify(nextConsent))) {
      status.textContent = copyFor(translations).storageError;
      status.hidden = false;
      return;
    }
    cookieConsent = nextConsent;
    status.hidden = true;
    panel.hidden = true;
    settingsButton.setAttribute('aria-expanded', 'false');
    custom.hidden = true;
    if (affiliate) loadAffiliateFeatures();
    else if (wasAffiliateEnabled) window.location.reload();
  };
  necessaryButton.addEventListener('click', () => saveChoices(false));
  acceptButton.addEventListener('click', () => saveChoices(true));
  customizeButton.addEventListener('click', () => {
    custom.hidden = false;
    affiliateCheckbox.focus();
    actions.replaceChildren(saveButton);
  });
  saveButton.addEventListener('click', () => saveChoices(affiliateCheckbox.checked));

  function render() {
    const copy = copyFor(translations);
    settingsButton.textContent = copy.settings;
    title.textContent = copy.title;
    description.textContent = copy.description;
    privacyLink.textContent = copy.privacy;
    requiredLabel.textContent = copy.necessaryStorage;
    requiredStatus.textContent = copy.required;
    affiliateTitle.textContent = copy.affiliate;
    affiliateDescription.textContent = copy.affiliateDescription;
    necessaryButton.textContent = copy.necessary;
    acceptButton.textContent = copy.accept;
    customizeButton.textContent = copy.customize;
    saveButton.textContent = copy.save;
  }
  window.addEventListener('gvt-lang', render);
  render();
  if (hasAffiliateConsent()) loadAffiliateFeatures();
}

function applyProfile(profile, locationLabel) {
  currentProfile = { ...currentProfile, ...profile };
  const savedLanguage = getSavedPreference('language');
  const savedCurrency = getSavedPreference('currency');
  if (savedLanguage && uiLanguages.some((l) => l.code === savedLanguage)) currentProfile.language = savedLanguage;
  if (savedCurrency && supportedCurrencies.includes(savedCurrency)) currentProfile.currency = savedCurrency;
  if (pageLanguage) {
    currentProfile.language = pageLanguage;
    savePreference('language', pageLanguage);
    if (!(savedCurrency && supportedCurrencies.includes(savedCurrency))) currentProfile.currency = languageChoices.find((c) => c.lang === pageLanguage)?.currency || 'EUR';
  } else {
    currentProfile.language = 'en';
  }
  if (!supportedCurrencies.includes(currentProfile.currency)) currentProfile.currency = 'EUR';
  setText('#regionName', currentProfile.region);
  setText('#currencyBadge', currentProfile.currency);
  setText('#languageBadge', currentProfile.language);
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) currencySelect.value = currentProfile.currency;
  const departureInput = document.querySelector('input[data-field="Departure city"]');
  if (departureInput && currentProfile.airport) departureInput.value = currentProfile.airport;
  updatePrices(currentProfile.currency);
  updateServiceLinks();
  applyLanguage(currentProfile.language);
  window.dispatchEvent(new CustomEvent('gvt-currency', { detail: currentProfile.currency }));
  window.dispatchEvent(new CustomEvent('gvt-location', { detail: { city: currentProfile.city || '', country: currentProfile.region || '' } }));
  loadFlightWidget();
}

async function detectNetworkLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
    if (!response.ok) throw new Error('Location lookup failed');
    const data = await response.json();
    const profile = regionProfiles[data.country_code] || {};
    applyProfile({ ...profile, region: data.country_name || profile.region, currency: data.currency || profile.currency, language: currentProfile.language, airport: profile.airport || '', city: data.city || profile.city || '' });
  } catch (error) {
    console.info('Automatic region lookup is unavailable; using the browser region.', error);
    applyProfile(currentProfile);
  }
}

function initCurrencyAndLanguage() {
  const browserProfile = profileFromBrowser();
  applyProfile(browserProfile);
  document.getElementById('currencySelect')?.addEventListener('change', (event) => {
    currentProfile.currency = event.target.value;
    savePreference('currency', currentProfile.currency);
    updatePrices(currentProfile.currency);
    translatePage(currentProfile.language);
    updateServiceLinks();
    setText('#currencyBadge', currentProfile.currency);
    window.dispatchEvent(new CustomEvent('gvt-currency', { detail: currentProfile.currency }));
    loadFlightWidget();
  });
  document.getElementById('languageSelect')?.addEventListener('change', (event) => {
    currentProfile.language = event.target.value;
    savePreference('language', currentProfile.language);
    if (goToLanguage(currentProfile.language)) return;
    applyLanguage(currentProfile.language);
    updateServiceLinks();
  });
  window.addEventListener('load', () => setTimeout(detectNetworkLocation, 1500));
  initLanguageMenu();
}

function initTripOptions() {
  const returnInput = document.querySelector('input[data-field="Return date"]');
  const returnLabel = returnInput?.closest('label');
  const multiCityFields = document.getElementById('multiCityFields');
  const secondFrom = document.querySelector('input[data-field="Second departure city"]');
  const secondTo = document.querySelector('input[data-field="Second destination city"]');
  const secondDate = document.querySelector('input[data-field="Second departure date"]');
  const firstTo = document.querySelector('input[data-field="Destination city"]');
  const firstDeparture = document.querySelector('input[data-field="Departure date"]');
  if (returnInput) returnInput.required = true;
  document.querySelectorAll('.type-option').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.type-option').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const oneWay = button.dataset.tripType === 'one-way';
      const multiCity = button.dataset.tripType === 'multi-city';
      if (returnInput) returnInput.disabled = oneWay || multiCity;
      if (returnInput) returnInput.required = !oneWay && !multiCity;
      if (returnLabel) returnLabel.hidden = oneWay || multiCity;
      if (multiCityFields) multiCityFields.hidden = !multiCity;
      [secondFrom, secondTo, secondDate].forEach((input) => {
        if (input) input.required = multiCity;
      });
      if (multiCity && secondFrom && firstTo && !secondFrom.value) {
        secondFrom.value = firstTo.value;
      }
      if (multiCity && secondDate && firstDeparture?.value) {
        const minimum = new Date(firstDeparture.value);
        minimum.setDate(minimum.getDate() + 1);
        secondDate.min = formatDateInput(minimum);
        if (!secondDate.value || secondDate.value < secondDate.min) {
          const suggested = new Date(minimum);
          suggested.setDate(suggested.getDate() + 6);
          secondDate.value = formatDateInput(suggested);
        }
      }
    });
  });
  firstDeparture?.addEventListener('change', () => {
    if (!secondDate || !secondDate.required || !firstDeparture.value) return;
    const minimum = new Date(firstDeparture.value);
    minimum.setDate(minimum.getDate() + 1);
    secondDate.min = formatDateInput(minimum);
    if (secondDate.value < secondDate.min) {
      const suggested = new Date(minimum);
      suggested.setDate(suggested.getDate() + 6);
      secondDate.value = formatDateInput(suggested);
    }
  });
}

function initServiceTabs() {
  const servicePages = {
    hotels: 'hotels.html',
    cars: 'cars.html',
    packages: 'packages.html',
    stays: 'stays.html'
  };
  const onHome = !/(hotels|cars|stays|deals|flights|packages|explore)\.html$/.test(window.location.pathname);
  document.querySelectorAll('.service-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.dataset.serviceTab;
      if (service === 'flights') {
        if (!onHome) window.location.href = 'index.html#search';
        return;
      }
      if (servicePages[service]) {
        window.location.href = servicePages[service];
        return;
      }
      document.querySelectorAll('.service-tab').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

function initSearch() {
  const departureInput = document.querySelector('input[data-field="Departure date"]');
  const returnInput = document.querySelector('input[data-field="Return date"]');
  if (departureInput && returnInput) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    departureInput.min = formatDateInput(today);
    returnInput.min = formatDateInput(tomorrow);
    if (!departureInput.value || departureInput.value < formatDateInput(today)) {
      departureInput.value = formatDateInput(nextWeek);
    }
    if (!returnInput.value || returnInput.value <= departureInput.value) {
      const returnDate = new Date(departureInput.value);
      returnDate.setDate(returnDate.getDate() + 7);
      returnInput.value = formatDateInput(returnDate);
    }
    departureInput.addEventListener('change', () => {
      const minReturn = new Date(departureInput.value);
      minReturn.setDate(minReturn.getDate() + 1);
      returnInput.min = formatDateInput(minReturn);
      if (returnInput.value <= departureInput.value) {
        const defaultReturn = new Date(minReturn);
        defaultReturn.setDate(defaultReturn.getDate() + 6);
        returnInput.value = formatDateInput(defaultReturn);
      }
    });
  }
  document.querySelector('#travelSearchForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('searchStatus');
    const copy = copyFor(translations);
    const from = form.querySelector('input[data-field="Departure city"]')?.value.trim();
    const to = form.querySelector('input[data-field="Destination city"]')?.value.trim();
    const departure = form.querySelector('input[data-field="Departure date"]')?.value;
    const returnDate = form.querySelector('input[data-field="Return date"]')?.value;
    const tripType = form.querySelector('.type-option.active')?.dataset.tripType || 'round';
    const secondFrom = form.querySelector('input[data-field="Second departure city"]')?.value.trim();
    const secondTo = form.querySelector('input[data-field="Second destination city"]')?.value.trim();
    const secondDeparture = form.querySelector('input[data-field="Second departure date"]')?.value;
    if (!from || !to || !departure) {
      if (status) status.textContent = copy.invalid;
      return;
    }
    if (returnDate && tripType === 'round' && returnDate < departure) {
      if (status) status.textContent = copy.returnError;
      return;
    }
    const flexible = form.querySelector('#flexibleDates')?.checked;
    const direct = form.querySelector('#directFlights')?.checked;
    const travelers = form.querySelector('[name="travelers"]')?.value || '2';
    const params = new URLSearchParams({
      from,
      to,
      departure,
      currency: currentProfile.currency,
      country: currentProfile.region,
      tripType,
      travelers,
      ...(returnDate && tripType === 'round' ? { return: returnDate } : {}),
      ...(tripType === 'multi-city' ? { secondFrom, secondTo, secondDeparture } : {}),
      ...(flexible ? { flexible: 'true' } : {}),
      ...(direct ? { direct: 'true' } : {})
    });
    if (status) status.textContent = copy.searching;
    const toCode = async (text) => {
      const m = text.match(/\(([A-Za-z]{3})\)/);
      if (m) return m[1].toUpperCase();
      try {
        const r = await fetch('https://autocomplete.travelpayouts.com/places2?term=' + encodeURIComponent(text) + '&locale=en&types[]=city&types[]=airport');
        const items = await r.json();
        return items.length ? items[0].code : '';
      } catch (e) { return ''; }
    };
    Promise.all([toCode(from), toCode(to)]).then(([o, d]) => {
      if (!o || !d) {
        if (status) status.textContent = copy.invalid;
        return;
      }
      const dm = (iso) => { const p = iso.split('-'); return p[2] + p[1]; };
      const back = returnDate && tripType === 'round' ? dm(returnDate) : '';
      const target = 'https://www.aviasales.com/search/' + o + dm(departure) + d + back + (parseInt(travelers, 10) || 1) + '?currency=' + currentProfile.currency.toLowerCase();
      window.location.href = 'https://aviasales.tpm.lv/kG8FZBWw?u=' + encodeURIComponent(target);
    });  });
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function initServiceSearch() {
  document.querySelectorAll('[data-service-search]').forEach((form) => {
    const dateInputs = [...form.querySelectorAll('input[type="date"]')];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateInputs.forEach((input, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() + (index === 0 ? 7 : 10));
      input.min = formatDateInput(today);
      if (!input.value) input.value = formatDateInput(date);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (dateInputs.length > 1 && dateInputs[1].value <= dateInputs[0].value) {
        dateInputs[1].setCustomValidity('The end date must be after the start date.');
        dateInputs[1].reportValidity();
        dateInputs[1].setCustomValidity('');
        return;
      }
      const params = new URLSearchParams();
      params.set('service', form.dataset.serviceSearch);
      params.set('currency', currentProfile.currency);
      params.set('country', currentProfile.region);
      new FormData(form).forEach((value, key) => params.set(key, String(value)));
      const data = Object.fromEntries(new FormData(form));
      const service = form.dataset.serviceSearch;
      if (service === 'hotels' || service === 'stays') {
        const query = new URLSearchParams({
          ss: data.destination,
          checkin: data.checkIn,
          checkout: data.checkOut,
          group_adults: data.guests || '2',
          no_rooms: '1',
          selected_currency: currentProfile.currency
        });
        window.location.href = `https://www.booking.com/searchresults.html?${query.toString()}`;
        return;
      }
      if (service === 'cars') {
        window.location.href = 'cars.html';
        return;
      }
      window.location.href = `results.html?${params.toString()}`;
    });
  });
}

function initHotelOfferLinks() {
  const form = document.getElementById('search-hotels');
  if (!form) return;

  const checkIn = form.querySelector('[name="checkIn"]');
  const checkOut = form.querySelector('[name="checkOut"]');
  const guests = form.querySelector('[name="guests"]');
  const links = [...document.querySelectorAll('[data-hotel-offer]')];

  const updateLinks = () => {
    if (!checkIn.value || !checkOut.value) return;
    links.forEach((link) => {
      const query = new URLSearchParams({
        ss: link.dataset.hotelOffer,
        checkin: checkIn.value,
        checkout: checkOut.value,
        group_adults: guests.value || '2',
        no_rooms: '1',
        selected_currency: currentProfile.currency
      });
      link.href = `https://www.booking.com/searchresults.html?${query.toString()}`;
    });
  };

  form.addEventListener('input', updateLinks);
  form.addEventListener('change', updateLinks);
  updateLinks();
}

function initStayOfferLinks() {
  const form = document.getElementById('search-stays');
  if (!form) return;

  const checkIn = form.querySelector('[name="checkIn"]');
  const checkOut = form.querySelector('[name="checkOut"]');
  const guests = form.querySelector('[name="guests"]');
  const links = [...document.querySelectorAll('[data-stay-offer]')];

  const updateLinks = () => {
    const firstNight = checkIn.value || formatDateInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    let lastNight = checkOut.value;
    if (!lastNight || lastNight <= firstNight) {
      const defaultCheckOut = new Date(`${firstNight}T00:00:00`);
      defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);
      lastNight = formatDateInput(defaultCheckOut);
    }

    links.forEach((link) => {
      const query = new URLSearchParams({
        ss: link.dataset.stayOffer,
        checkin: firstNight,
        checkout: lastNight,
        group_adults: guests.value || '2',
        no_rooms: '1',
        selected_currency: currentProfile.currency
      });
      link.href = `https://www.booking.com/searchresults.html?${query.toString()}`;
    });
  };

  form.addEventListener('input', updateLinks);
  form.addEventListener('change', updateLinks);
  window.addEventListener('gvt-currency', updateLinks);
  updateLinks();
}

function initFlightDealLinks() {
  const formatPartnerDate = (date) => String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0');
  const selectedOrigin = document.getElementById('dealOrigin');
  document.querySelectorAll('[data-flight-deal]').forEach((link) => {
    const origin = selectedOrigin ? selectedOrigin.value : link.dataset.flightOrigin;
    const destination = link.dataset.flightDestination;
    if (!origin || !destination) return;

    const departure = new Date();
    departure.setDate(departure.getDate() + 30);
    const returning = new Date(departure);
    returning.setDate(returning.getDate() + 7);
    const currency = (typeof currentProfile !== 'undefined' && currentProfile.currency) || 'EUR';
    const searchUrl = `https://www.aviasales.com/search/${origin}${formatPartnerDate(departure)}${destination}${formatPartnerDate(returning)}1?currency=${currency.toLowerCase()}`;
    link.href = `https://aviasales.tpm.lv/kG8FZBWw?u=${encodeURIComponent(searchUrl)}`;
    link.target = '_blank';
    link.rel = 'sponsored noopener';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[aria-label]').forEach((input) => { input.dataset.field = input.getAttribute('aria-label'); });
  initCurrencyAndLanguage();
  initCookieConsent();
  initServiceTabs();
  initTripOptions();
  initSearch();
  initServiceSearch();
  initHotelOfferLinks();
  initStayOfferLinks();
  initFlightDealLinks();
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const activePage = currentPage === 'index.html' || currentPage === 'govetrip.html' ? 'flights.html' : currentPage;
  const navigationIcons = {
    'flights.html': 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16Z',
    'hotels.html': 'M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M3 19v-6h18v6M6 16h.01M18 16h.01M5 19v2M19 19v2',
    'cars.html': 'm5 16 1.5-6h11L19 16M4 16h16v3H4zM7 19v2M17 19v2M7 13h.01M17 13h.01',
    'packages.html': 'M4 18h16M6 18l1-7h10l1 7M8 11l2-4h4l2 4M12 7V3M9 4h6',
    'stays.html': 'M4 20V6l8-3 8 3v14M8 20v-5h8v5M8 9h.01M12 9h.01M16 9h.01'
  };
  document.querySelectorAll('.main-nav a[href]').forEach((link) => {
    const page = link.getAttribute('href');
    if (page === activePage) link.setAttribute('aria-current', 'page');
    if (navigationIcons[page] && !link.querySelector('.nav-icon')) {
      const icon = document.createElement('span');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      icon.className = 'nav-icon';
      icon.setAttribute('aria-hidden', 'true');
      svg.setAttribute('viewBox', '0 0 24 24');
      path.setAttribute('d', navigationIcons[page]);
      svg.appendChild(path);
      icon.appendChild(svg);
      link.insertBefore(icon, link.firstChild);
    }
  });
  const dealOrigin = document.getElementById('dealOrigin');
  if (dealOrigin) dealOrigin.addEventListener('change', initFlightDealLinks);
});

window.addEventListener('gvt-flight-deals-ready', initFlightDealLinks);

(function initHeaderMenuAndStickySearch() {
  const start = () => {
    const header = document.querySelector('.site-header');
    const shell = header && header.querySelector('.nav-shell');
    const nav = shell && shell.querySelector('.main-nav');
    if (!shell || !nav || shell.querySelector('.nav-burger')) return;

    const burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    shell.insertBefore(burger, shell.firstChild);
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    header.appendChild(backdrop);
    const setOpen = (open) => {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
    backdrop.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });

    const card = document.getElementById('search');
    const from = document.getElementById('pcFrom');
    const to = document.getElementById('pcTo');
    const dates = document.getElementById('pcDates');
    const go = document.querySelector('.pc-go');
    if (!card || !from || !to || !dates || !go || !('IntersectionObserver' in window)) return;

    const bar = document.createElement('div');
    bar.className = 'sticky-search';
    bar.innerHTML = '<button type="button" data-s="from"></button><button type="button" data-s="to"></button><button type="button" data-s="dates"></button><button type="button" class="sticky-go" data-s="go"></button>';
    const actions = shell.querySelector('.nav-actions');
    shell.insertBefore(bar, actions && actions.parentNode === shell ? actions : null);
    const parts = {};
    bar.querySelectorAll('button').forEach((b) => { parts[b.dataset.s] = b; });
    const refresh = () => {
      parts.from.textContent = from.value || from.placeholder;
      parts.to.textContent = to.value || to.placeholder;
      parts.dates.textContent = dates.textContent.trim();
      parts.go.textContent = go.textContent.trim();
      parts.from.classList.toggle('empty', !from.value);
      parts.to.classList.toggle('empty', !to.value);
      parts.dates.classList.toggle('empty', !dates.classList.contains('on'));
    };
    const toSearch = (focus) => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { if (focus) focus.click(); if (focus && focus.focus) focus.focus(); }, 450);
    };
    bar.addEventListener('click', (event) => {
      const key = event.target.closest('button')?.dataset.s;
      if (!key) return;
      if (key === 'go') {
        if (to.value && dates.classList.contains('on')) go.click(); else toSearch(to);
      } else {
        toSearch({ from, to, dates }[key]);
      }
    });
    const observer = new IntersectionObserver(([entry]) => {
      const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      if (show) refresh();
      header.classList.toggle('show-search', show);
    }, { rootMargin: '-80px 0px 0px 0px' });
    observer.observe(card);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
(function initAppInstall() {
  const head = document.head;
  const add = (tag, attrs) => { const el = document.createElement(tag); Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k])); head.appendChild(el); };
  if (!document.querySelector('link[rel="manifest"]')) add('link', { rel: 'manifest', href: '/manifest.webmanifest' });
  if (!document.querySelector('link[rel="apple-touch-icon"]')) add('link', { rel: 'apple-touch-icon', href: '/assets/apple-touch-icon.png' });
  if (!document.querySelector('meta[name="theme-color"]')) add('meta', { name: 'theme-color', content: '#3b1a7a' });
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  const T = {
    en: ['Get the GoVeTrip app', 'Install on Android', 'Add to iPhone', 'Tap the menu (⋮) and choose "Install app" or "Add to Home screen".', 'Tap the Share button, then choose "Add to Home Screen".', 'Already installed'],
    fi: ['Lataa GoVeTrip-sovellus', 'Asenna Androidille', 'Lisää iPhoneen', 'Avaa selaimen valikko (⋮) ja valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".', 'Paina Jaa-painiketta ja valitse "Lisää Koti-valikkoon".', 'Asennettu'],
    sv: ['Skaffa GoVeTrip-appen', 'Installera på Android', 'Lägg till på iPhone', 'Öppna webbläsarmenyn (⋮) och välj "Installera app" eller "Lägg till på startskärmen".', 'Tryck på Dela och välj "Lägg till på hemskärmen".', 'Redan installerad'],
    no: ['Last ned GoVeTrip-appen', 'Installer på Android', 'Legg til på iPhone', 'Åpne nettlesermenyen (⋮) og velg "Installer app" eller "Legg til på startskjermen".', 'Trykk på Del og velg "Legg til på Hjem-skjerm".', 'Allerede installert'],
    da: ['Hent GoVeTrip-appen', 'Installer på Android', 'Tilføj til iPhone', 'Åbn browsermenuen (⋮) og vælg "Installer app" eller "Føj til startskærm".', 'Tryk på Del og vælg "Føj til hjemmeskærm".', 'Allerede installeret'],
    de: ['GoVeTrip-App holen', 'Auf Android installieren', 'Zum iPhone hinzufügen', 'Öffne das Browsermenü (⋮) und wähle "App installieren" oder "Zum Startbildschirm hinzufügen".', 'Tippe auf Teilen und wähle "Zum Home-Bildschirm".', 'Bereits installiert'],
    fr: ["Obtenir l'appli GoVeTrip", 'Installer sur Android', "Ajouter à l'iPhone", 'Ouvrez le menu du navigateur (⋮) et choisissez "Installer l\'application" ou "Ajouter à l\'écran d\'accueil".', 'Touchez Partager puis "Sur l\'écran d\'accueil".', 'Déjà installée'],
    es: ['Descarga la app de GoVeTrip', 'Instalar en Android', 'Añadir al iPhone', 'Abre el menú del navegador (⋮) y elige "Instalar app" o "Añadir a la pantalla de inicio".', 'Toca Compartir y elige "Añadir a pantalla de inicio".', 'Ya instalada'],
    it: ["Scarica l'app GoVeTrip", 'Installa su Android', 'Aggiungi a iPhone', 'Apri il menu del browser (⋮) e scegli "Installa app" o "Aggiungi a schermata Home".', 'Tocca Condividi e scegli "Aggiungi a schermata Home".', 'Già installata'],
    nl: ['Download de GoVeTrip-app', 'Installeren op Android', 'Toevoegen aan iPhone', 'Open het browsermenu (⋮) en kies "App installeren" of "Toevoegen aan startscherm".', 'Tik op Delen en kies "Zet op beginscherm".', 'Al geïnstalleerd'],
    pl: ['Pobierz aplikację GoVeTrip', 'Zainstaluj na Androidzie', 'Dodaj na iPhone', 'Otwórz menu przeglądarki (⋮) i wybierz "Zainstaluj aplikację" lub "Dodaj do ekranu głównego".', 'Dotknij Udostępnij i wybierz "Do ekranu początkowego".', 'Już zainstalowana'],
    pt: ['Obtenha a app GoVeTrip', 'Instalar no Android', 'Adicionar ao iPhone', 'Abra o menu do navegador (⋮) e escolha "Instalar app" ou "Adicionar ao ecrã inicial".', 'Toque em Partilhar e escolha "Adicionar ao ecrã principal".', 'Já instalada']
  };
  const lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  const t = T[lang] || T.en;
  const footer = document.querySelector('.site-footer');
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const inApp = standalone || /android-app:/.test(document.referrer) || /[?&]source=twa/.test(location.search) || sessionStorage.getItem('gvt-app') === '1';
  if (inApp) {
    sessionStorage.setItem('gvt-app', '1');
    document.documentElement.classList.add('is-app');
    const vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    const stop = (e) => e.preventDefault();
    document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
    ['gesturestart', 'gesturechange', 'gestureend'].forEach((n) => document.addEventListener(n, stop));
    const showSplash = () => {
      if (document.querySelector('.gvt-splash')) return;
      const splash = document.createElement('div');
      splash.className = 'gvt-splash';
      splash.setAttribute('aria-hidden', 'true');
      splash.innerHTML = '<div class="gvt-splash-inner"><img class="gvt-splash-emblem" src="/assets/splash-emblem.png" alt="">'
        + '<img class="gvt-splash-word" src="/assets/splash-word.png" alt=""></div>'
        + '<div class="gvt-splash-plane"><span class="gvt-splash-trail"></span>'
        + '<svg viewBox="0 0 24 24" width="46" height="46"><path fill="#6d28d9" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>';
      document.documentElement.appendChild(splash);
      document.documentElement.classList.add('gvt-splashing');
      const done = () => {
        if (!splash.parentNode) return;
        splash.classList.add('gvt-splash-out');
        document.documentElement.classList.remove('gvt-splashing');
        setTimeout(() => splash.remove(), 450);
      };
      setTimeout(done, 3600);
      splash.addEventListener('click', done);
    };
    const stamp = () => { try { localStorage.setItem('gvt-splash-ts', String(Date.now())); } catch (e) { /* ignore */ } };
    let last = 0;
    try { last = Number(localStorage.getItem('gvt-splash-ts') || 0); } catch (e) { last = 0; }
    if (Date.now() - last > 20000 || /android-app:/.test(document.referrer)) showSplash();
    stamp();
    window.addEventListener('pagehide', stamp);
    let hiddenAt = 0;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); stamp(); }
      else if (hiddenAt && Date.now() - hiddenAt > 15000) { showSplash(); hiddenAt = 0; }
    });    return;
  }
  if (!footer || footer.querySelector('.app-download')) return;
  const box = document.createElement('div');
  box.className = 'container app-download';
  const title = document.createElement('h3');
  title.textContent = t[0];
  const row = document.createElement('div');
  row.className = 'app-badges';
  const hint = document.createElement('p');
  hint.className = 'app-hint';
  hint.hidden = true;

  const android = document.createElement('button');
  android.type = 'button';
  android.className = 'app-badge';
  android.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M3.6 2.3c-.2.2-.3.6-.3 1v17.4c0 .4.1.8.3 1l9.7-9.7L3.6 2.3zm10.4 8.7 2.6-2.6L5.9 2.2l8.1 8.8zm0 2 -8.1 8.8 10.7-6.2L14 13zm3.6-1.6 3.1 1.8c.9.5.9 1.3 0 1.8l-3.1 1.8-2.9-2.7 2.9-2.7z"/></svg><span><small></small><b></b></span>';
  android.querySelector('b').textContent = t[1];
  const ios = document.createElement('button');
  ios.type = 'button';
  ios.className = 'app-badge';
  ios.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.800 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.200-2.600-.1 0-2.600-1-2.600-3.900zM14.100 5.800c.600-.8 1.100-1.900.9-3-.9 0-2.100.6-2.700 1.400-.6.700-1.100 1.800-1 2.900 1.100.1 2.200-.5 2.800-1.300z"/></svg><span><small></small><b></b></span>';
  ios.querySelector('b').textContent = t[2];
  row.append(android, ios);
  box.append(title, row, hint);

  let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', () => { deferred = null; hint.hidden = false; hint.textContent = t[5]; });

  const show = (msg) => { hint.textContent = msg; hint.hidden = false; };
  android.addEventListener('click', async () => {
    if (standalone) return show(t[5]);
    if (deferred) { deferred.prompt(); try { await deferred.userChoice; } catch (e) {} deferred = null; return; }
    show(t[3]);
  });
  ios.addEventListener('click', () => show(standalone ? t[5] : t[4]));

  const bottom = footer.querySelector('.footer-bottom');
  footer.insertBefore(box, bottom);
})();