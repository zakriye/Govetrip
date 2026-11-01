# GoVeTrip

GoVeTrip is a responsive travel-search and discovery site. It includes flight-date price estimates, destination discovery, hotel and car search handoffs, regional language/currency preferences, and affiliate referrals.

The supplied GoVeTrip logo is used throughout the site. The interface keeps the GoVeTrip brand while using a dark plum backdrop, a clear white search panel, and pink accents to make the main travel search easy to find.

## Pages

- `index.html` and `govetrip.html` — home page and flight price calendar
- `flights.html` — flight search and estimated fare calendar
- `packages.html` — flight + hotel search and destination offers
- `explore.html` — destination discovery
- `hotels.html`, `stays.html`, `cars.html`, and `deals.html` — travel search pages and live flight deals by departure airport
- `about.html`, `contact.html`, `privacy.html`, `terms.html`, and `affiliate-disclosure.html` — information and legal pages

## Local preview

The included `dev-server.py` serves the site and proxies the price-calendar request. A basic static preview server cannot execute `prices.php`; use this server for a working local price search:

```powershell
python dev-server.py
```

Open `http://127.0.0.1:3000/`. Set `TRAVELPAYOUTS_API_TOKEN` in the server environment or create `api-config.local.php` from the example below. Without a token, the rest of the site still loads and the calendar displays a configuration message.

## Hostinger deployment

The live price calendar requires PHP 7.4 or newer with cURL enabled.

1. Generate a fresh Travelpayouts Data API token in the account and confirm that Data API access is enabled.
2. Configure `TRAVELPAYOUTS_API_TOKEN` in the hosting environment, or create `api-config.local.php` in the site directory with the following PHP content:

   ```php
   <?php
   return [
       'travelpayouts_token' => 'PASTE_THE_NEW_TOKEN_HERE',
   ];
   ```

3. Upload the site files, `.htaccess`, `robots.txt`, and `sitemap.xml` to the website root. The live price endpoint requires PHP 7.4 or newer with cURL enabled.
4. Keep `api-config.local.php` private and out of source control. The supplied `.htaccess` blocks direct requests to configuration files.
5. Test the deployed endpoint directly, for example `https://your-domain.example/prices.php?origin=HEL&destination=PAR&month=2026-11&currency=eur`. A JSON response with `"success":true` confirms the PHP endpoint and Travelpayouts API are connected; an empty `days` object means no cached fare data was returned for that route and month.
6. If the response has `"error":"upstream"`, check the hosting PHP error log for the Travelpayouts HTTP status and verify the API token, Data API access, and account rate limits. If `prices.php` returns HTML or source code instead of JSON, PHP is not executing on that host/path.
7. Confirm affiliate referrals in the Travelpayouts account after deployment. The Travelpayouts click-tracking script is disabled until a valid traffic-source ID is confirmed. Contact GoVeTrip at `info@govetrip.com`; review the privacy/legal text for the business and launch region.

The deployment ZIP may contain `api-config.example.php`, but must not contain `api-config.php`, `api-config.local.php`, `.env`, or any live API token.

## Price and booking behavior

Calendar prices and destination offers are estimates based on cached Travelpayouts fare data; they are not live booking quotes. The deals page loads the lowest estimated fares by departure airport when the API token is configured. If fare data is unavailable, it still offers direct partner searches for popular routes without displaying made-up prices. The airline or booking partner confirms the final price and availability. GoVeTrip does not process reservations or payments.

The site uses affiliate links for flight, tour and activity, and rental-car referrals. The GetYourGuide activities section builds partner-tagged searches for the visitor's detected city, with a browser-saved manual destination override; the site does not currently have user accounts or login profiles. The Travelpayouts click-tracking script is temporarily disabled because it adds an invalid traffic-source parameter to Aviasales links. Partner links continue to use the existing affiliate short link; verify referrals after Travelpayouts provides a valid traffic-source ID.

Activity cards use locally bundled category illustrations, so they load without third-party image searches. The chosen destination is still used for the GetYourGuide activity search links; the illustrations are category-themed rather than destination-specific.

The Bangkok destination card uses a locally bundled Wikimedia Commons photo, credited in the card to Vyacheslav Argenberg under CC BY 4.0.

## Consent

The Travelpayouts flight-price widget is not loaded until a visitor allows it in cookie settings. The click-tracking script is currently disabled while its traffic-source configuration is corrected. Visitors can accept the widget, choose necessary storage only, or adjust their choice later using the persistent Cookie settings button. This implementation is a technical control, not legal advice or a compliance certification; confirm the consent wording, partner behavior, and any additional regional requirements before launch.

## SEO landing pages

Run `python tools/build_seo_pages.py` to regenerate `destinations/`, `flights/` and the sitemap files (`sitemap.xml` is an index). Commit the generated output.
