# GoVeTrip growth SEO audit (follow-up to PR #3)

Status: first-pass audit from repository contents plus limited public research. No Search Console, analytics, Lighthouse/PageSpeed or live-offer data was available, so nothing here is a measured result.

## What was analysed
- PR #3 (`zakriye-seo-technical-audit-fixes`): one commit (8da9930), open, base `zakriye-travel-platform`. This branch stacks on it.
- 40 destination pages and 355 generated flight-route pages (`tools/build_seo_pages.py`); `tools/audit_seo.py` baseline: 622 pages, 565 sitemap URLs, 1 broken link, short/long descriptions mostly on account/legal/index pages, 11 non-reciprocal hreflang (account pages), 14 pages without canonical (offline pages).
- Route pages are English-only and near-template (same structure; only city names, one generic highlight line and a best-season line differ). They carry no fares, schedules, availability or reviews. The conversion path is the search link `/index.html?from=..&to=..#search` (the price calendar reads `from`/`to`) plus a partner hotel link.
- Flight search/price data comes from Travelpayouts/Aviasales (see `app.js`, `price-calendar.js`); an affiliate disclosure page and footer exist.

## What changed
1. Removed `FAQPage` JSON-LD from all route and destination pages (Google's documentation updates page covers the FAQ rich result change). The visible FAQ text stays. Generic FAQ markup on templated pages added risk and no demonstrated benefit.
2. Route pages now state plainly that they list no fares or schedules, that offers/availability come from the booking partner, and link the affiliate disclosure.
3. `tests/test_seo_growth.py` (run: `python -m unittest discover tests`): no FAQPage on generated pages, no `SearchAction` anywhere, JSON-LD parses, one H1 + canonical, no invented prices on route pages, disclosure present.
- No SearchAction exists on the site (verified by grep); none added. CNY/RUB currency logic untouched. No new pages added.

## Sources
- Google Search Central, documentation updates (FAQ rich result): https://developers.google.com/search/updates
- Google spam policies (scaled content abuse, doorway pages): https://developers.google.com/search/docs/essentials/spam-policies
- Competitor pattern checks (Nov 2026): Skyscanner route page https://www.skyscanner.com/routes/hel/au/helsinki-vantaa-to-australia.html and Google Flights https://www.google.com/travel/flights/flights-from-helsinki.html. Both show live-derived fares/airline/schedule data on route pages, which GoVeTrip's static pages do not have. This is a small sample, not a full Nordic/EU/US/AU competitor study; that study is still to do.

## Recommendation on the 355 route pages
Do not add routes. Without GSC evidence, keep current pages indexable (canonical, in sitemap, not mass-AI text) but treat them as at-risk templates:
- Pages with impressions or clicks: improve only with reliable data (airlines operating the route, direct/non-stop, typical duration) from a licensed data source.
- Pages with zero impressions after ~90 days of indexing: consolidate into origin hubs (`/flights/`) or `noindex`, decided from the export below.
- Prefer hubs (e.g. Helsinki departures) over more city pairs.

## Needed from the owner
Search Console exports (16 months): Performance by Query x Page x Country x Device; Pages indexing report (Crawled/Discovered not indexed, Duplicate, Alternate page with canonical); Sitemaps; Core Web Vitals; Links. Plus analytics/affiliate data: landing-page sessions by country, search starts, partner click-outs and revenue per landing page. Also: whether Travelpayouts permits static display of route/airline data, and priority order of target markets (FI/Nordics, EU, US, AU). Run Lighthouse/PageSpeed on home, a route page and a destination page for a CWV baseline.

## 90-day plan (no traffic promise)
Days 0-14: get GSC/analytics exports; set up conversion events (search start, partner click-out); baseline CWV.
Days 15-45: from queries, pick top intents per market; localise titles/descriptions for pages with proven impressions; decide index/consolidate for route pages; add en-US/en-AU only if GSC shows demand and currency/airport behaviour is verified.
Days 46-90: enrich the best-performing pages with licensed, sourced data; build origin hubs; review CTR/indexing changes. Outcomes depend on competition and Google; 3,000-5,000 daily visits is a goal to measure against, not an expected result.

## Not done (limits)
No Lighthouse/CWV measurements; no per-country keyword/volume data; no live-offer verification; route pages remain English-only; small competitor sample; hreflang/title issues on non-generated pages left as listed by the audit tool.
