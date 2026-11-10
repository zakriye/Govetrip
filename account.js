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
      alert_limit: 'You already have 10 alerts. Remove one first.',
      alSet: 'Set price alert', alSetDone: 'Alert set! We will email you when the price drops.', alSetLogin: 'Log in to set a price alert.',
      tabSearch: 'Search', tabExplore: 'Explore', tabTrips: 'Trips', tabProfile: 'Profile'
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
      alert_limit: 'Sinulla on jo 10 hälytystä. Poista ensin yksi.',
      alSet: 'Aseta hintahälytys', alSetDone: 'Hälytys asetettu! Lähetämme sähköpostia, kun hinta laskee.', alSetLogin: 'Kirjaudu sisään asettaaksesi hintahälytyksen.',
      tabSearch: 'Haku', tabExplore: 'Selaa', tabTrips: 'Matkat', tabProfile: 'Profiili'
    },
    sv: {
      signin: 'Logga in', profile: 'Profil', save: 'Spara i önskelistan', saved: 'Sparad i önskelistan',
      title: 'Få ut mer av GoVeTrip', b1: 'Spara resor och resmål i din önskelista', b2: 'Hitta dina senaste sökningar på ett ställe',
      b3: 'Få reseerbjudanden och tips (valfritt)', google: 'Fortsätt med Google', or: 'eller', email: 'Fortsätt med e-post',
      login: 'Logga in', register: 'Skapa konto', name: 'Namn', emailL: 'E-post', pass: 'Lösenord (minst 8 tecken)',
      marketing: 'Skicka reseerbjudanden och inspiration till min e-post. Du kan avsluta när som helst.',
      terms: 'Genom att fortsätta godkänner du våra <a href="terms.html">villkor</a> och vår <a href="privacy.html">integritetspolicy</a>.',
      forgot: 'Glömt lösenordet?', haveAcc: 'Har du redan ett konto? Logga in', noAcc: 'Ny här? Skapa konto',
      wishlist: 'Önskelista', searches: 'Senaste sökningar', account: 'Konto', logout: 'Logga ut',
      hello: 'Hej', empty: 'Inget här ännu.', clear: 'Rensa historik', remove: 'Ta bort', settings: 'Inställningar',
      homeAirport: 'Hemflygplats (t.ex. ARN)', saveBtn: 'Spara', del: 'Radera konto', delConfirm: 'Radera ditt konto och all sparad data permanent?',
      sent: 'Om e-postadressen finns har en återställningslänk skickats.', newPass: 'Nytt lösenord (minst 8 tecken)', setPass: 'Ange nytt lösenord',
      done: 'Sparat', err: 'Något gick fel. Försök igen.', invalid_credentials: 'Fel e-post eller lösenord.',
      email_taken: 'Den här e-postadressen är redan registrerad.', weak_password: 'Lösenordet måste ha minst 8 tecken.',
      invalid_email: 'Ange en giltig e-postadress.', rate_limited: 'För många försök. Försök igen senare.', close: 'Stäng',
      needLogin: 'Logga in för att se ditt konto.',
      alerts: 'Prisbevakning', alertsInfo: 'Vi mejlar dig när månadens billigaste flyg blir billigare. Lämna målpriset tomt för att få besked vid prissänkningar på 5 % eller mer.',
      alFrom: 'Från (t.ex. ARN)', alTo: 'Till (t.ex. BKK)', alMonth: 'Månad', alTarget: 'Målpris (valfritt)', alAdd: 'Skapa bevakning',
      alNow: 'Nu', alMax: 'Du kan ha upp till 10 bevakningar.', invalid_alert: 'Kontrollera flygplatskoderna (3 bokstäver) och välj en framtida månad.',
      alert_limit: 'Du har redan 10 bevakningar. Ta bort en först.',
      alSet: 'Bevaka priset', alSetDone: 'Bevakning skapad! Vi mejlar dig när priset sjunker.', alSetLogin: 'Logga in för att skapa en prisbevakning.',
      tabSearch: 'Sök', tabExplore: 'Utforska', tabTrips: 'Resor', tabProfile: 'Profil'
    },
    no: {
      signin: 'Logg inn', profile: 'Profil', save: 'Lagre i ønskelisten', saved: 'Lagret i ønskelisten',
      title: 'Få mer ut av GoVeTrip', b1: 'Lagre reiser og reisemål i ønskelisten', b2: 'Finn de siste søkene dine på ett sted',
      b3: 'Få reisetilbud og tips (valgfritt)', google: 'Fortsett med Google', or: 'eller', email: 'Fortsett med e-post',
      login: 'Logg inn', register: 'Opprett konto', name: 'Navn', emailL: 'E-post', pass: 'Passord (minst 8 tegn)',
      marketing: 'Send meg reisetilbud og inspirasjon på e-post. Du kan melde deg av når som helst.',
      terms: 'Ved å fortsette godtar du <a href="terms.html">vilkårene</a> og <a href="privacy.html">personvernerklæringen</a>.',
      forgot: 'Glemt passordet?', haveAcc: 'Har du allerede en konto? Logg inn', noAcc: 'Ny her? Opprett konto',
      wishlist: 'Ønskeliste', searches: 'Siste søk', account: 'Konto', logout: 'Logg ut',
      hello: 'Hei', empty: 'Ingenting her ennå.', clear: 'Tøm historikk', remove: 'Fjern', settings: 'Innstillinger',
      homeAirport: 'Hjemmeflyplass (f.eks. OSL)', saveBtn: 'Lagre', del: 'Slett konto', delConfirm: 'Slette kontoen din og alle lagrede data permanent?',
      sent: 'Hvis e-postadressen finnes, er en tilbakestillingslenke sendt.', newPass: 'Nytt passord (minst 8 tegn)', setPass: 'Angi nytt passord',
      done: 'Lagret', err: 'Noe gikk galt. Prøv igjen.', invalid_credentials: 'Feil e-post eller passord.',
      email_taken: 'Denne e-postadressen er allerede registrert.', weak_password: 'Passordet må ha minst 8 tegn.',
      invalid_email: 'Skriv inn en gyldig e-postadresse.', rate_limited: 'For mange forsøk. Prøv igjen senere.', close: 'Lukk',
      needLogin: 'Logg inn for å se kontoen din.',
      alerts: 'Prisvarsler', alertsInfo: 'Vi sender e-post når månedens billigste fly blir billigere. La målprisen stå tom for å få beskjed om prisfall på 5 % eller mer.',
      alFrom: 'Fra (f.eks. OSL)', alTo: 'Til (f.eks. BKK)', alMonth: 'Måned', alTarget: 'Målpris (valgfritt)', alAdd: 'Opprett varsel',
      alNow: 'Nå', alMax: 'Du kan ha opptil 10 varsler.', invalid_alert: 'Sjekk flyplasskodene (3 bokstaver) og velg en fremtidig måned.',
      alert_limit: 'Du har allerede 10 varsler. Fjern ett først.',
      alSet: 'Sett prisvarsel', alSetDone: 'Varsel opprettet! Vi sender e-post når prisen faller.', alSetLogin: 'Logg inn for å sette et prisvarsel.',
      tabSearch: 'Søk', tabExplore: 'Utforsk', tabTrips: 'Reiser', tabProfile: 'Profil'
    },
    da: {
      signin: 'Log ind', profile: 'Profil', save: 'Gem på ønskelisten', saved: 'Gemt på ønskelisten',
      title: 'Få mere ud af GoVeTrip', b1: 'Gem rejser og destinationer på din ønskeliste', b2: 'Find dine seneste søgninger ét sted',
      b3: 'Få rejsetilbud og tips (valgfrit)', google: 'Fortsæt med Google', or: 'eller', email: 'Fortsæt med e-mail',
      login: 'Log ind', register: 'Opret konto', name: 'Navn', emailL: 'E-mail', pass: 'Adgangskode (mindst 8 tegn)',
      marketing: 'Send mig rejsetilbud og inspiration på e-mail. Du kan afmelde dig når som helst.',
      terms: 'Ved at fortsætte accepterer du vores <a href="terms.html">vilkår</a> og <a href="privacy.html">privatlivspolitik</a>.',
      forgot: 'Glemt adgangskode?', haveAcc: 'Har du allerede en konto? Log ind', noAcc: 'Ny her? Opret konto',
      wishlist: 'Ønskeliste', searches: 'Seneste søgninger', account: 'Konto', logout: 'Log ud',
      hello: 'Hej', empty: 'Intet her endnu.', clear: 'Ryd historik', remove: 'Fjern', settings: 'Indstillinger',
      homeAirport: 'Hjemmelufthavn (f.eks. CPH)', saveBtn: 'Gem', del: 'Slet konto', delConfirm: 'Slet din konto og alle gemte data permanent?',
      sent: 'Hvis e-mailen findes, er der sendt et link til nulstilling.', newPass: 'Ny adgangskode (mindst 8 tegn)', setPass: 'Angiv ny adgangskode',
      done: 'Gemt', err: 'Noget gik galt. Prøv igen.', invalid_credentials: 'Forkert e-mail eller adgangskode.',
      email_taken: 'Denne e-mail er allerede registreret.', weak_password: 'Adgangskoden skal have mindst 8 tegn.',
      invalid_email: 'Angiv en gyldig e-mail.', rate_limited: 'For mange forsøg. Prøv igen senere.', close: 'Luk',
      needLogin: 'Log ind for at se din konto.',
      alerts: 'Prisalarmer', alertsInfo: 'Vi sender dig en e-mail, når månedens billigste fly bliver billigere. Lad målprisen stå tom for at få besked ved prisfald på 5 % eller mere.',
      alFrom: 'Fra (f.eks. CPH)', alTo: 'Til (f.eks. BKK)', alMonth: 'Måned', alTarget: 'Målpris (valgfrit)', alAdd: 'Opret alarm',
      alNow: 'Nu', alMax: 'Du kan have op til 10 alarmer.', invalid_alert: 'Tjek lufthavnskoderne (3 bogstaver) og vælg en fremtidig måned.',
      alert_limit: 'Du har allerede 10 alarmer. Fjern en først.',
      alSet: 'Opret prisalarm', alSetDone: 'Alarm oprettet! Vi sender en e-mail, når prisen falder.', alSetLogin: 'Log ind for at oprette en prisalarm.',
      tabSearch: 'Søg', tabExplore: 'Udforsk', tabTrips: 'Rejser', tabProfile: 'Profil'
    },
    de: {
      signin: 'Anmelden', profile: 'Profil', save: 'Zur Wunschliste hinzufügen', saved: 'In der Wunschliste gespeichert',
      title: 'Mehr aus GoVeTrip herausholen', b1: 'Reisen und Ziele in deiner Wunschliste speichern', b2: 'Deine letzten Suchen an einem Ort finden',
      b3: 'Reiseangebote und Tipps erhalten (optional)', google: 'Weiter mit Google', or: 'oder', email: 'Weiter mit E-Mail',
      login: 'Anmelden', register: 'Konto erstellen', name: 'Name', emailL: 'E-Mail', pass: 'Passwort (mind. 8 Zeichen)',
      marketing: 'Sende mir Reiseangebote und Inspiration per E-Mail. Abmeldung jederzeit möglich.',
      terms: 'Mit dem Fortfahren stimmst du unseren <a href="terms.html">Nutzungsbedingungen</a> und der <a href="privacy.html">Datenschutzerklärung</a> zu.',
      forgot: 'Passwort vergessen?', haveAcc: 'Schon ein Konto? Anmelden', noAcc: 'Neu hier? Konto erstellen',
      wishlist: 'Wunschliste', searches: 'Letzte Suchen', account: 'Konto', logout: 'Abmelden',
      hello: 'Hallo', empty: 'Hier ist noch nichts.', clear: 'Verlauf löschen', remove: 'Entfernen', settings: 'Einstellungen',
      homeAirport: 'Heimatflughafen (z. B. FRA)', saveBtn: 'Speichern', del: 'Konto löschen', delConfirm: 'Konto und alle gespeicherten Daten endgültig löschen?',
      sent: 'Falls die E-Mail existiert, wurde ein Link zum Zurücksetzen gesendet.', newPass: 'Neues Passwort (mind. 8 Zeichen)', setPass: 'Neues Passwort festlegen',
      done: 'Gespeichert', err: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.', invalid_credentials: 'Falsche E-Mail oder falsches Passwort.',
      email_taken: 'Diese E-Mail ist bereits registriert.', weak_password: 'Das Passwort muss mindestens 8 Zeichen haben.',
      invalid_email: 'Bitte gib eine gültige E-Mail ein.', rate_limited: 'Zu viele Versuche. Bitte später erneut versuchen.', close: 'Schließen',
      needLogin: 'Bitte melde dich an, um dein Konto zu sehen.',
      alerts: 'Preisalarme', alertsInfo: 'Wir senden dir eine E-Mail, wenn der günstigste Flug des Monats billiger wird. Lass den Zielpreis leer, um bei Preissenkungen ab 5 % benachrichtigt zu werden.',
      alFrom: 'Von (z. B. FRA)', alTo: 'Nach (z. B. BKK)', alMonth: 'Monat', alTarget: 'Zielpreis (optional)', alAdd: 'Alarm erstellen',
      alNow: 'Jetzt', alMax: 'Du kannst bis zu 10 Alarme haben.', invalid_alert: 'Prüfe die Flughafencodes (3 Buchstaben) und wähle einen zukünftigen Monat.',
      alert_limit: 'Du hast bereits 10 Alarme. Entferne zuerst einen.',
      alSet: 'Preisalarm setzen', alSetDone: 'Alarm gesetzt! Wir senden dir eine E-Mail, wenn der Preis sinkt.', alSetLogin: 'Melde dich an, um einen Preisalarm zu setzen.',
      tabSearch: 'Suche', tabExplore: 'Entdecken', tabTrips: 'Reisen', tabProfile: 'Profil'
    },
    fr: {
      signin: 'Connexion', profile: 'Profil', save: 'Ajouter à la liste d\'envies', saved: 'Enregistré dans la liste d\'envies',
      title: 'Profitez pleinement de GoVeTrip', b1: 'Enregistrez voyages et destinations dans votre liste d\'envies', b2: 'Retrouvez vos recherches récentes au même endroit',
      b3: 'Recevez des offres et conseils de voyage (facultatif)', google: 'Continuer avec Google', or: 'ou', email: 'Continuer avec l\'e-mail',
      login: 'Se connecter', register: 'Créer un compte', name: 'Nom', emailL: 'E-mail', pass: 'Mot de passe (8 caractères min.)',
      marketing: 'Envoyez-moi des offres et idées de voyage par e-mail. Désabonnement possible à tout moment.',
      terms: 'En continuant, vous acceptez nos <a href="terms.html">conditions</a> et notre <a href="privacy.html">politique de confidentialité</a>.',
      forgot: 'Mot de passe oublié ?', haveAcc: 'Déjà un compte ? Connectez-vous', noAcc: 'Nouveau ? Créer un compte',
      wishlist: 'Liste d\'envies', searches: 'Recherches récentes', account: 'Compte', logout: 'Se déconnecter',
      hello: 'Bonjour', empty: 'Rien ici pour le moment.', clear: 'Effacer l\'historique', remove: 'Supprimer', settings: 'Paramètres',
      homeAirport: 'Aéroport de départ (ex. CDG)', saveBtn: 'Enregistrer', del: 'Supprimer le compte', delConfirm: 'Supprimer définitivement votre compte et toutes les données enregistrées ?',
      sent: 'Si l\'e-mail existe, un lien de réinitialisation a été envoyé.', newPass: 'Nouveau mot de passe (8 caractères min.)', setPass: 'Définir un nouveau mot de passe',
      done: 'Enregistré', err: 'Une erreur est survenue. Veuillez réessayer.', invalid_credentials: 'E-mail ou mot de passe incorrect.',
      email_taken: 'Cet e-mail est déjà enregistré.', weak_password: 'Le mot de passe doit contenir au moins 8 caractères.',
      invalid_email: 'Veuillez saisir un e-mail valide.', rate_limited: 'Trop de tentatives. Réessayez plus tard.', close: 'Fermer',
      needLogin: 'Connectez-vous pour voir votre compte.',
      alerts: 'Alertes de prix', alertsInfo: 'Nous vous écrivons quand le vol le moins cher du mois baisse. Laissez le prix cible vide pour être prévenu d\'une baisse d\'au moins 5 %.',
      alFrom: 'De (ex. CDG)', alTo: 'Vers (ex. BKK)', alMonth: 'Mois', alTarget: 'Prix cible (facultatif)', alAdd: 'Créer l\'alerte',
      alNow: 'Actuel', alMax: 'Vous pouvez avoir jusqu\'à 10 alertes.', invalid_alert: 'Vérifiez les codes d\'aéroport (3 lettres) et choisissez un mois futur.',
      alert_limit: 'Vous avez déjà 10 alertes. Supprimez-en une d\'abord.',
      alSet: 'Créer une alerte de prix', alSetDone: 'Alerte créée ! Nous vous écrirons quand le prix baissera.', alSetLogin: 'Connectez-vous pour créer une alerte de prix.',
      tabSearch: 'Recherche', tabExplore: 'Explorer', tabTrips: 'Voyages', tabProfile: 'Profil'
    },
    es: {
      signin: 'Iniciar sesión', profile: 'Perfil', save: 'Guardar en favoritos', saved: 'Guardado en favoritos',
      title: 'Aprovecha más GoVeTrip', b1: 'Guarda viajes y destinos en tu lista de favoritos', b2: 'Encuentra tus búsquedas recientes en un solo lugar',
      b3: 'Recibe ofertas y consejos de viaje (opcional)', google: 'Continuar con Google', or: 'o', email: 'Continuar con correo',
      login: 'Iniciar sesión', register: 'Crear cuenta', name: 'Nombre', emailL: 'Correo electrónico', pass: 'Contraseña (mín. 8 caracteres)',
      marketing: 'Envíame ofertas e inspiración de viaje por correo. Puedes darte de baja cuando quieras.',
      terms: 'Al continuar aceptas nuestros <a href="terms.html">Términos</a> y la <a href="privacy.html">Política de privacidad</a>.',
      forgot: '¿Olvidaste la contraseña?', haveAcc: '¿Ya tienes cuenta? Inicia sesión', noAcc: '¿Nuevo aquí? Crea una cuenta',
      wishlist: 'Favoritos', searches: 'Búsquedas recientes', account: 'Cuenta', logout: 'Cerrar sesión',
      hello: 'Hola', empty: 'Aún no hay nada aquí.', clear: 'Borrar historial', remove: 'Quitar', settings: 'Ajustes',
      homeAirport: 'Aeropuerto de origen (p. ej. MAD)', saveBtn: 'Guardar', del: 'Eliminar cuenta', delConfirm: '¿Eliminar tu cuenta y todos los datos guardados de forma permanente?',
      sent: 'Si el correo existe, se ha enviado un enlace de restablecimiento.', newPass: 'Nueva contraseña (mín. 8 caracteres)', setPass: 'Establecer nueva contraseña',
      done: 'Guardado', err: 'Algo salió mal. Inténtalo de nuevo.', invalid_credentials: 'Correo o contraseña incorrectos.',
      email_taken: 'Este correo ya está registrado.', weak_password: 'La contraseña debe tener al menos 8 caracteres.',
      invalid_email: 'Introduce un correo válido.', rate_limited: 'Demasiados intentos. Inténtalo más tarde.', close: 'Cerrar',
      needLogin: 'Inicia sesión para ver tu cuenta.',
      alerts: 'Alertas de precio', alertsInfo: 'Te escribimos cuando baja el vuelo más barato del mes. Deja el precio objetivo vacío para recibir aviso de bajadas del 5 % o más.',
      alFrom: 'Desde (p. ej. MAD)', alTo: 'Hasta (p. ej. BKK)', alMonth: 'Mes', alTarget: 'Precio objetivo (opcional)', alAdd: 'Crear alerta',
      alNow: 'Ahora', alMax: 'Puedes tener hasta 10 alertas.', invalid_alert: 'Revisa los códigos de aeropuerto (3 letras) y elige un mes futuro.',
      alert_limit: 'Ya tienes 10 alertas. Elimina una primero.',
      alSet: 'Crear alerta de precio', alSetDone: '¡Alerta creada! Te escribiremos cuando baje el precio.', alSetLogin: 'Inicia sesión para crear una alerta de precio.',
      tabSearch: 'Buscar', tabExplore: 'Explorar', tabTrips: 'Viajes', tabProfile: 'Perfil'
    },
    it: {
      signin: 'Accedi', profile: 'Profilo', save: 'Salva nei preferiti', saved: 'Salvato nei preferiti',
      title: 'Sfrutta al meglio GoVeTrip', b1: 'Salva viaggi e destinazioni nei preferiti', b2: 'Trova le ricerche recenti in un unico posto',
      b3: 'Ricevi offerte e consigli di viaggio (facoltativo)', google: 'Continua con Google', or: 'oppure', email: 'Continua con l\'e-mail',
      login: 'Accedi', register: 'Crea account', name: 'Nome', emailL: 'E-mail', pass: 'Password (min. 8 caratteri)',
      marketing: 'Inviami offerte e ispirazioni di viaggio via e-mail. Puoi annullare l\'iscrizione in qualsiasi momento.',
      terms: 'Continuando accetti i nostri <a href="terms.html">Termini</a> e l\'<a href="privacy.html">Informativa sulla privacy</a>.',
      forgot: 'Password dimenticata?', haveAcc: 'Hai già un account? Accedi', noAcc: 'Nuovo qui? Crea un account',
      wishlist: 'Preferiti', searches: 'Ricerche recenti', account: 'Account', logout: 'Esci',
      hello: 'Ciao', empty: 'Ancora niente qui.', clear: 'Cancella cronologia', remove: 'Rimuovi', settings: 'Impostazioni',
      homeAirport: 'Aeroporto di partenza (es. FCO)', saveBtn: 'Salva', del: 'Elimina account', delConfirm: 'Eliminare definitivamente l\'account e tutti i dati salvati?',
      sent: 'Se l\'e-mail esiste, è stato inviato un link di reimpostazione.', newPass: 'Nuova password (min. 8 caratteri)', setPass: 'Imposta nuova password',
      done: 'Salvato', err: 'Qualcosa è andato storto. Riprova.', invalid_credentials: 'E-mail o password errata.',
      email_taken: 'Questa e-mail è già registrata.', weak_password: 'La password deve avere almeno 8 caratteri.',
      invalid_email: 'Inserisci un\'e-mail valida.', rate_limited: 'Troppi tentativi. Riprova più tardi.', close: 'Chiudi',
      needLogin: 'Accedi per vedere il tuo account.',
      alerts: 'Avvisi di prezzo', alertsInfo: 'Ti scriviamo quando il volo più economico del mese scende di prezzo. Lascia vuoto il prezzo obiettivo per essere avvisato di cali del 5 % o più.',
      alFrom: 'Da (es. FCO)', alTo: 'A (es. BKK)', alMonth: 'Mese', alTarget: 'Prezzo obiettivo (facoltativo)', alAdd: 'Crea avviso',
      alNow: 'Ora', alMax: 'Puoi avere fino a 10 avvisi.', invalid_alert: 'Controlla i codici aeroporto (3 lettere) e scegli un mese futuro.',
      alert_limit: 'Hai già 10 avvisi. Rimuovine uno prima.',
      alSet: 'Crea avviso di prezzo', alSetDone: 'Avviso creato! Ti scriveremo quando il prezzo scende.', alSetLogin: 'Accedi per creare un avviso di prezzo.',
      tabSearch: 'Cerca', tabExplore: 'Esplora', tabTrips: 'Viaggi', tabProfile: 'Profilo'
    },
    nl: {
      signin: 'Inloggen', profile: 'Profiel', save: 'Opslaan in verlanglijst', saved: 'Opgeslagen in verlanglijst',
      title: 'Haal meer uit GoVeTrip', b1: 'Bewaar reizen en bestemmingen in je verlanglijst', b2: 'Vind je recente zoekopdrachten op één plek',
      b3: 'Ontvang reisaanbiedingen en tips (optioneel)', google: 'Doorgaan met Google', or: 'of', email: 'Doorgaan met e-mail',
      login: 'Inloggen', register: 'Account maken', name: 'Naam', emailL: 'E-mail', pass: 'Wachtwoord (min. 8 tekens)',
      marketing: 'Stuur me reisaanbiedingen en inspiratie per e-mail. Je kunt je altijd afmelden.',
      terms: 'Door verder te gaan ga je akkoord met onze <a href="terms.html">voorwaarden</a> en ons <a href="privacy.html">privacybeleid</a>.',
      forgot: 'Wachtwoord vergeten?', haveAcc: 'Al een account? Log in', noAcc: 'Nieuw hier? Maak een account',
      wishlist: 'Verlanglijst', searches: 'Recente zoekopdrachten', account: 'Account', logout: 'Uitloggen',
      hello: 'Hallo', empty: 'Nog niets hier.', clear: 'Geschiedenis wissen', remove: 'Verwijderen', settings: 'Instellingen',
      homeAirport: 'Thuisluchthaven (bijv. AMS)', saveBtn: 'Opslaan', del: 'Account verwijderen', delConfirm: 'Je account en alle opgeslagen gegevens definitief verwijderen?',
      sent: 'Als het e-mailadres bestaat, is er een resetlink verstuurd.', newPass: 'Nieuw wachtwoord (min. 8 tekens)', setPass: 'Nieuw wachtwoord instellen',
      done: 'Opgeslagen', err: 'Er ging iets mis. Probeer het opnieuw.', invalid_credentials: 'Onjuist e-mailadres of wachtwoord.',
      email_taken: 'Dit e-mailadres is al geregistreerd.', weak_password: 'Het wachtwoord moet minstens 8 tekens hebben.',
      invalid_email: 'Voer een geldig e-mailadres in.', rate_limited: 'Te veel pogingen. Probeer het later opnieuw.', close: 'Sluiten',
      needLogin: 'Log in om je account te bekijken.',
      alerts: 'Prijsalerts', alertsInfo: 'We mailen je wanneer de goedkoopste vlucht van de maand daalt. Laat de streefprijs leeg om een melding te krijgen bij een daling van 5 % of meer.',
      alFrom: 'Van (bijv. AMS)', alTo: 'Naar (bijv. BKK)', alMonth: 'Maand', alTarget: 'Streefprijs (optioneel)', alAdd: 'Alert maken',
      alNow: 'Nu', alMax: 'Je kunt maximaal 10 alerts hebben.', invalid_alert: 'Controleer de luchthavencodes (3 letters) en kies een toekomstige maand.',
      alert_limit: 'Je hebt al 10 alerts. Verwijder er eerst één.',
      alSet: 'Prijsalert instellen', alSetDone: 'Alert ingesteld! We mailen je als de prijs daalt.', alSetLogin: 'Log in om een prijsalert in te stellen.',
      tabSearch: 'Zoeken', tabExplore: 'Ontdekken', tabTrips: 'Reizen', tabProfile: 'Profiel'
    },
    pl: {
      signin: 'Zaloguj się', profile: 'Profil', save: 'Zapisz na liście życzeń', saved: 'Zapisano na liście życzeń',
      title: 'Wykorzystaj GoVeTrip w pełni', b1: 'Zapisuj podróże i cele na liście życzeń', b2: 'Znajdź ostatnie wyszukiwania w jednym miejscu',
      b3: 'Otrzymuj oferty i porady podróżnicze (opcjonalnie)', google: 'Kontynuuj z Google', or: 'lub', email: 'Kontynuuj z e-mailem',
      login: 'Zaloguj się', register: 'Utwórz konto', name: 'Imię', emailL: 'E-mail', pass: 'Hasło (min. 8 znaków)',
      marketing: 'Chcę otrzymywać oferty i inspiracje podróżnicze e-mailem. Możesz zrezygnować w dowolnym momencie.',
      terms: 'Kontynuując, akceptujesz <a href="terms.html">Regulamin</a> i <a href="privacy.html">Politykę prywatności</a>.',
      forgot: 'Nie pamiętasz hasła?', haveAcc: 'Masz już konto? Zaloguj się', noAcc: 'Nowy tutaj? Utwórz konto',
      wishlist: 'Lista życzeń', searches: 'Ostatnie wyszukiwania', account: 'Konto', logout: 'Wyloguj się',
      hello: 'Cześć', empty: 'Nic tu jeszcze nie ma.', clear: 'Wyczyść historię', remove: 'Usuń', settings: 'Ustawienia',
      homeAirport: 'Lotnisko macierzyste (np. WAW)', saveBtn: 'Zapisz', del: 'Usuń konto', delConfirm: 'Trwale usunąć konto i wszystkie zapisane dane?',
      sent: 'Jeśli adres e-mail istnieje, wysłaliśmy link do zresetowania hasła.', newPass: 'Nowe hasło (min. 8 znaków)', setPass: 'Ustaw nowe hasło',
      done: 'Zapisano', err: 'Coś poszło nie tak. Spróbuj ponownie.', invalid_credentials: 'Nieprawidłowy e-mail lub hasło.',
      email_taken: 'Ten adres e-mail jest już zarejestrowany.', weak_password: 'Hasło musi mieć co najmniej 8 znaków.',
      invalid_email: 'Podaj prawidłowy adres e-mail.', rate_limited: 'Zbyt wiele prób. Spróbuj później.', close: 'Zamknij',
      needLogin: 'Zaloguj się, aby zobaczyć swoje konto.',
      alerts: 'Alerty cenowe', alertsInfo: 'Wyślemy e-mail, gdy najtańszy lot miesiąca stanieje. Zostaw cenę docelową pustą, aby dostać powiadomienie o spadku o co najmniej 5 %.',
      alFrom: 'Z (np. WAW)', alTo: 'Do (np. BKK)', alMonth: 'Miesiąc', alTarget: 'Cena docelowa (opcjonalnie)', alAdd: 'Utwórz alert',
      alNow: 'Teraz', alMax: 'Możesz mieć do 10 alertów.', invalid_alert: 'Sprawdź kody lotnisk (3 litery) i wybierz przyszły miesiąc.',
      alert_limit: 'Masz już 10 alertów. Najpierw usuń jeden.',
      alSet: 'Ustaw alert cenowy', alSetDone: 'Alert ustawiony! Wyślemy e-mail, gdy cena spadnie.', alSetLogin: 'Zaloguj się, aby ustawić alert cenowy.',
      tabSearch: 'Szukaj', tabExplore: 'Odkrywaj', tabTrips: 'Podróże', tabProfile: 'Profil'
    },
    pt: {
      signin: 'Iniciar sessão', profile: 'Perfil', save: 'Guardar nos favoritos', saved: 'Guardado nos favoritos',
      title: 'Tire mais partido do GoVeTrip', b1: 'Guarde viagens e destinos nos favoritos', b2: 'Encontre as suas pesquisas recentes num só lugar',
      b3: 'Receba ofertas e dicas de viagem (opcional)', google: 'Continuar com o Google', or: 'ou', email: 'Continuar com e-mail',
      login: 'Iniciar sessão', register: 'Criar conta', name: 'Nome', emailL: 'E-mail', pass: 'Palavra-passe (mín. 8 caracteres)',
      marketing: 'Enviem-me ofertas e inspiração de viagem por e-mail. Pode cancelar a qualquer momento.',
      terms: 'Ao continuar, aceita os nossos <a href="terms.html">Termos</a> e a <a href="privacy.html">Política de Privacidade</a>.',
      forgot: 'Esqueceu a palavra-passe?', haveAcc: 'Já tem conta? Inicie sessão', noAcc: 'Novo aqui? Crie uma conta',
      wishlist: 'Favoritos', searches: 'Pesquisas recentes', account: 'Conta', logout: 'Terminar sessão',
      hello: 'Olá', empty: 'Ainda não há nada aqui.', clear: 'Limpar histórico', remove: 'Remover', settings: 'Definições',
      homeAirport: 'Aeroporto de origem (ex. LIS)', saveBtn: 'Guardar', del: 'Eliminar conta', delConfirm: 'Eliminar permanentemente a conta e todos os dados guardados?',
      sent: 'Se o e-mail existir, foi enviada uma ligação de redefinição.', newPass: 'Nova palavra-passe (mín. 8 caracteres)', setPass: 'Definir nova palavra-passe',
      done: 'Guardado', err: 'Algo correu mal. Tente novamente.', invalid_credentials: 'E-mail ou palavra-passe incorretos.',
      email_taken: 'Este e-mail já está registado.', weak_password: 'A palavra-passe deve ter pelo menos 8 caracteres.',
      invalid_email: 'Introduza um e-mail válido.', rate_limited: 'Demasiadas tentativas. Tente mais tarde.', close: 'Fechar',
      needLogin: 'Inicie sessão para ver a sua conta.',
      alerts: 'Alertas de preço', alertsInfo: 'Enviamos-lhe um e-mail quando o voo mais barato do mês descer. Deixe o preço-alvo vazio para ser avisado de descidas de 5 % ou mais.',
      alFrom: 'De (ex. LIS)', alTo: 'Para (ex. BKK)', alMonth: 'Mês', alTarget: 'Preço-alvo (opcional)', alAdd: 'Criar alerta',
      alNow: 'Agora', alMax: 'Pode ter até 10 alertas.', invalid_alert: 'Verifique os códigos de aeroporto (3 letras) e escolha um mês futuro.',
      alert_limit: 'Já tem 10 alertas. Remova um primeiro.',
      alSet: 'Criar alerta de preço', alSetDone: 'Alerta criado! Enviamos-lhe um e-mail quando o preço descer.', alSetLogin: 'Inicie sessão para criar um alerta de preço.',
      tabSearch: 'Pesquisar', tabExplore: 'Explorar', tabTrips: 'Viagens', tabProfile: 'Perfil'
    },
    zh: {
      signin: '登录', profile: '个人资料', save: '加入心愿单', saved: '已加入心愿单',
      title: '畅享 GoVeTrip', b1: '将旅行和目的地加入心愿单', b2: '在一处查看最近的搜索',
      b3: '接收旅行优惠和建议（可选）', google: '使用 Google 继续', or: '或', email: '使用电子邮箱继续',
      login: '登录', register: '创建账户', name: '姓名', emailL: '电子邮箱', pass: '密码（至少 8 个字符）',
      marketing: '通过电子邮件向我发送旅行优惠和灵感。您可以随时取消订阅。',
      terms: '继续即表示您同意我们的<a href="terms.html">服务条款</a>和<a href="privacy.html">隐私政策</a>。',
      forgot: '忘记密码？', haveAcc: '已有账户？登录', noAcc: '新用户？创建账户',
      wishlist: '心愿单', searches: '最近的搜索', account: '账户', logout: '退出登录',
      hello: '您好', empty: '这里暂时没有内容。', clear: '清除历史记录', remove: '移除', settings: '设置',
      homeAirport: '常用机场（例如 HEL）', saveBtn: '保存', del: '删除账户', delConfirm: '永久删除您的账户和所有已保存的数据？',
      sent: '如果该邮箱已注册，重置链接已发送。', newPass: '新密码（至少 8 个字符）', setPass: '设置新密码',
      done: '已保存', err: '出现问题，请重试。', invalid_credentials: '邮箱或密码不正确。',
      email_taken: '该邮箱已注册。', weak_password: '密码必须至少包含 8 个字符。',
      invalid_email: '请输入有效的邮箱地址。', rate_limited: '尝试次数过多，请稍后再试。', close: '关闭',
      needLogin: '请登录以查看您的账户。',
      alerts: '价格提醒', alertsInfo: '当月最低机票价格下降时，我们会通过电子邮件通知您。目标价格留空时，降幅达到或超过 5% 即会收到通知。',
      alFrom: '出发地（例如 HEL）', alTo: '目的地（例如 BKK）', alMonth: '月份', alTarget: '目标价格（可选）', alAdd: '创建提醒',
      alNow: '当前价格', alMax: '最多可设置 10 个提醒。', invalid_alert: '请检查机场代码（3 个字母）并选择未来月份。',
      alert_limit: '您已有 10 个提醒，请先移除一个。',
      alSet: '设置价格提醒', alSetDone: '提醒已设置！价格下降时我们会发送电子邮件。', alSetLogin: '请登录以设置价格提醒。',
      tabSearch: '搜索', tabExplore: '探索', tabTrips: '旅行', tabProfile: '个人资料'
    },
    ru: {
      signin: 'Войти', profile: 'Профиль', save: 'Сохранить в избранное', saved: 'Сохранено в избранном',
      title: 'Больше возможностей с GoVeTrip', b1: 'Сохраняйте поездки и направления в избранном', b2: 'Просматривайте недавние поиски в одном месте',
      b3: 'Получайте предложения и советы для путешествий (необязательно)', google: 'Продолжить с Google', or: 'или', email: 'Продолжить с электронной почтой',
      login: 'Войти', register: 'Создать аккаунт', name: 'Имя', emailL: 'Электронная почта', pass: 'Пароль (не менее 8 символов)',
      marketing: 'Присылайте мне предложения и идеи для путешествий по электронной почте. Отписаться можно в любое время.',
      terms: 'Продолжая, вы принимаете <a href="terms.html">условия использования</a> и <a href="privacy.html">политику конфиденциальности</a>.',
      forgot: 'Забыли пароль?', haveAcc: 'Уже есть аккаунт? Войти', noAcc: 'Впервые здесь? Создать аккаунт',
      wishlist: 'Избранное', searches: 'Недавние поиски', account: 'Аккаунт', logout: 'Выйти',
      hello: 'Здравствуйте', empty: 'Здесь пока ничего нет.', clear: 'Очистить историю', remove: 'Удалить', settings: 'Настройки',
      homeAirport: 'Основной аэропорт (например, HEL)', saveBtn: 'Сохранить', del: 'Удалить аккаунт', delConfirm: 'Удалить аккаунт и все сохранённые данные без возможности восстановления?',
      sent: 'Если адрес зарегистрирован, ссылка для сброса пароля отправлена.', newPass: 'Новый пароль (не менее 8 символов)', setPass: 'Установить новый пароль',
      done: 'Сохранено', err: 'Что-то пошло не так. Попробуйте ещё раз.', invalid_credentials: 'Неверная почта или пароль.',
      email_taken: 'Этот адрес уже зарегистрирован.', weak_password: 'Пароль должен содержать не менее 8 символов.',
      invalid_email: 'Введите действительный адрес электронной почты.', rate_limited: 'Слишком много попыток. Попробуйте позже.', close: 'Закрыть',
      needLogin: 'Войдите, чтобы просмотреть свой аккаунт.',
      alerts: 'Уведомления о цене', alertsInfo: 'Мы отправим письмо, когда цена самого дешёвого рейса за месяц снизится. Оставьте целевую цену пустой, чтобы получать уведомления о снижении на 5% и более.',
      alFrom: 'Откуда (например, HEL)', alTo: 'Куда (например, BKK)', alMonth: 'Месяц', alTarget: 'Целевая цена (необязательно)', alAdd: 'Создать уведомление',
      alNow: 'Сейчас', alMax: 'Можно создать не более 10 уведомлений.', invalid_alert: 'Проверьте коды аэропортов (3 буквы) и выберите будущий месяц.',
      alert_limit: 'У вас уже 10 уведомлений. Сначала удалите одно из них.',
      alSet: 'Следить за ценой', alSetDone: 'Уведомление создано! Мы сообщим по почте о снижении цены.', alSetLogin: 'Войдите, чтобы следить за ценой.',
      tabSearch: 'Поиск', tabExplore: 'Обзор', tabTrips: 'Поездки', tabProfile: 'Профиль'
    }
  };
  var accountErrors = {
    en: ['Enter a valid three-letter airport code.', 'This reset link is invalid or has expired.', 'Google sign-in failed. Please try again.'],
    fi: ['Anna kelvollinen kolmikirjaiminen lentokenttäkoodi.', 'Palautuslinkki on virheellinen tai vanhentunut.', 'Google-kirjautuminen epäonnistui. Yritä uudelleen.'],
    sv: ['Ange en giltig flygplatskod med tre bokstäver.', 'Återställningslänken är ogiltig eller har gått ut.', 'Inloggning med Google misslyckades. Försök igen.'],
    no: ['Oppgi en gyldig flyplasskode med tre bokstaver.', 'Tilbakestillingslenken er ugyldig eller utløpt.', 'Innlogging med Google mislyktes. Prøv igjen.'],
    da: ['Indtast en gyldig lufthavnskode på tre bogstaver.', 'Nulstillingslinket er ugyldigt eller udløbet.', 'Login med Google mislykkedes. Prøv igen.'],
    de: ['Gib einen gültigen Flughafencode mit drei Buchstaben ein.', 'Der Link zum Zurücksetzen ist ungültig oder abgelaufen.', 'Die Anmeldung mit Google ist fehlgeschlagen. Bitte versuche es erneut.'],
    fr: ['Saisissez un code aéroport valide à trois lettres.', 'Ce lien de réinitialisation est invalide ou expiré.', 'La connexion avec Google a échoué. Veuillez réessayer.'],
    es: ['Introduce un código de aeropuerto válido de tres letras.', 'El enlace de restablecimiento no es válido o ha caducado.', 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.'],
    it: ['Inserisci un codice aeroportuale valido di tre lettere.', 'Il link di reimpostazione non è valido o è scaduto.', 'Accesso con Google non riuscito. Riprova.'],
    nl: ['Voer een geldige luchthavencode van drie letters in.', 'Deze herstelkoppeling is ongeldig of verlopen.', 'Inloggen met Google is mislukt. Probeer het opnieuw.'],
    pl: ['Podaj prawidłowy trzyliterowy kod lotniska.', 'Link do resetowania jest nieprawidłowy lub wygasł.', 'Logowanie przez Google nie powiodło się. Spróbuj ponownie.'],
    pt: ['Introduza um código de aeroporto válido com três letras.', 'A ligação de reposição é inválida ou expirou.', 'O início de sessão com o Google falhou. Tente novamente.'],
    zh: ['请输入有效的三字母机场代码。', '此重置链接无效或已过期。', '使用 Google 登录失败，请重试。'],
    ru: ['Введите действительный трёхбуквенный код аэропорта.', 'Ссылка для сброса пароля недействительна или истекла.', 'Не удалось войти через Google. Попробуйте ещё раз.']
  };
  Object.keys(T).forEach(function (code) {
    ['invalid_airport', 'invalid_token', 'google_failed'].forEach(function (key, i) { T[code][key] = accountErrors[code][i]; });
  });
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

  function pagePath() { return location.pathname.replace(/^\/(fi|sv|no|da|de|fr|es|it|nl|pl|pt|zh|ru)\//, '/'); }
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
        api({ action: 'forgot', email: em }).then(function (d) { out.textContent = d.error ? msg(d) : t('sent'); });
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
        callback: function (resp) { api({ action: 'google', credential: resp.credential, lang: lang }).then(function (d) {
          if (d.error) {
            var out = el.parentNode.querySelector('.acc-msg');
            if (!out) { out = document.createElement('p'); out.className = 'acc-msg'; out.setAttribute('role', 'alert'); el.parentNode.insertBefore(out, el.nextSibling); }
            out.textContent = msg(d);
          } else { apply(d); done(); }
        }); }
      });
      google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', width: 300, text: 'continue_with', locale: lang === 'zh' ? 'zh-CN' : lang });
    });
  }

  function recordSearch(label, url) {
    if (!state.user) return;
    api({ action: 'search_add', label: label, url: url }).then(apply);
  }
  function addAlert(origin, dest, month, currency) {
    if (!state.user) { openAuth('login'); return Promise.resolve({ error: 'login' }); }
    return api({ action: 'alert_add', origin: origin, dest: dest, month: month, target: '', currency: String(currency || 'eur').toLowerCase() }).then(function (d) { if (!d.error) apply(d); return d; });
  }
  window.gvtAccount = { recordSearch: recordSearch, addAlert: addAlert, t: t, msg: msg };

  // Mobile app-style bottom tabs
  function bottomTabs() {
    if (document.querySelector('.gvt-tabbar')) return;
    var m = location.pathname.match(/^\/(fi|sv|no|da|de|fr|es|it|nl|pl|pt|zh|ru)\//), base = m ? '/' + m[1] + '/' : '/';
    var path = location.pathname.replace(base, '/'), page = path.split('/').pop() || 'index.html';
    var items = [
      ['search', 'tabSearch', base + '#search', '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', page === 'index.html' || page === ''],
      ['explore', 'tabExplore', base + 'explore.html', '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>', page === 'explore.html' || page === 'deals.html'],
      ['trips', 'tabTrips', base + 'account.html#wishlist', '<path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9z"/>', page === 'account.html' && location.hash !== '#settings'],
      ['profile', 'tabProfile', base + 'account.html#settings', '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', page === 'account.html' && location.hash === '#settings']
    ];
    var nav = document.createElement('nav'); nav.className = 'gvt-tabbar'; nav.setAttribute('aria-label', 'App');
    nav.innerHTML = items.map(function (i) {
      return '<a href="' + i[2] + '" data-tab="' + i[0] + '"' + (i[4] ? ' class="on" aria-current="page"' : '') + '><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + i[3] + '</svg><span>' + esc(t(i[1])) + '</span></a>';
    }).join('');
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && !state.user && state.ready && (a.dataset.tab === 'trips' || a.dataset.tab === 'profile')) { e.preventDefault(); openAuth('login'); }
    });
    document.body.appendChild(nav);
    document.body.classList.add('has-tabbar');
  }

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
      var f = tab === 'settings' ? root.querySelector('form') : null; if (f) f.addEventListener('submit', function (e) {
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
    bottomTabs();
    var root = document.getElementById('accountRoot'); if (root) accountPage(root);
    api().then(apply).catch(function () { state.ready = true; render(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
