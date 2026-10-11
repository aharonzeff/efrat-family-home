# Beit Sela / בית סלע

A static bilingual site for a 7-bedroom family home in Efrat, Gush Etzion. English is the default. Hebrew is full RTL. The only booking path is Airbnb.

The brand, palette, type, and sitemap are in [docs/CREATIVE_DIRECTION.md](docs/CREATIVE_DIRECTION.md). Facts the listing does not provide are listed in [REMAINING_INPUTS.md](REMAINING_INPUTS.md).

## Local install

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

The dev server prints a local URL. `npm run build` writes the static site to `dist/`. `npm run preview` serves that folder.

```bash
npm run build
npm run check:site
```

`check:site` checks the built HTML: internal links, Airbnb URLs and UTM parameters, unique titles, canonicals, `hreflang` (`en`, `he`, `x-default`), Hebrew `dir="rtl"`, JSON-LD, the 56 amenities, and that the no-parties rule is the only party language.

## Where content lives

Edit these files. You do not need to touch a component to change words, photos, amenities, or the booking link.

| What | File |
| --- | --- |
| Booking URL, UTM, pool season, guest counts, map, analytics token, canonical URL | `src/content/site/settings.json` |
| Navigation, buttons, house-rule labels | `src/content/ui/strings.json` |
| Photographs and captions | `src/content/photos/gallery.json` and `src/assets/photos/` |
| Amenities | `src/content/amenities/list.json` |
| Bedrooms | `src/content/rooms/list.json` |
| Reviews | `src/content/reviews/list.json` |
| FAQ | `src/content/faqs/list.json` |
| Area guide | `src/content/attractions/list.json` |
| Page headings and paragraphs | `src/content/pages/*.json` |

Every guest-facing string is an object with `en` and `he`. Add another language by:

1. Adding a locale in `src/i18n/config.ts`.
2. Adding the same key to each localized object (missing keys fall back to English).
3. Rebuilding. Routes, `hreflang`, and the language switcher read that config.

### Booking link

`settings.booking.url` is the only listing URL. `settings.booking.utm` is appended to every Airbnb link, plus `utm_content` for the button that was clicked (`nav`, `hero-availability`, `mobile-bar`, and the rest of `booking.placements`). Button text is “Check Availability on Airbnb” or “Reserve on Airbnb” (and the Hebrew equivalents). There is no payment and no calendar on this site.

### Pool season

`settings.pool.openMonths` is `[5, 6, 7, 8]`. The visible phrase is `pool.seasonLabel`. The outdoors section, the amenity line, and the FAQ read those fields.

### Photographs

Files live in `src/assets/photos/`. `gallery.json` names the file and stores the alt text and caption. Astro generates responsive images at build time.

The current files were downloaded from the Airbnb image CDN on 11 October 2026 at the 1440-pixel size that CDN would serve. To replace one, drop a `.jpg` in that folder with the **same filename** and edit the caption if the frame changed. Then run `npm run build`. Do not point the site at `a0.muscache.com`, and do not add generated pictures of the property.

`npm run og` rebuilds `public/og/home.jpg` from `15-balcony.jpg`.

### Analytics

Leave the token empty and no beacon is loaded. To turn on [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/), set one of:

- `PUBLIC_CF_ANALYTICS_TOKEN` in the Cloudflare project (preferred; it stays out of git)
- `analytics.cloudflareToken` in `settings.json`

Optional: `PUBLIC_ANALYTICS_ENDPOINT`. Clicks on Airbnb links, gallery opens, the language switch, and the “message Aharon” link call a small hook that pushes to `window.dataLayer` and, if that endpoint is set, `navigator.sendBeacon` with JSON `{ event, detail, path, href, ts }`. Event names: `airbnb_click`, `gallery_open`, `language_switch`, `contact_click`.

## Cloudflare Pages

Hosting is the static `dist/` folder. There is no server.

1. Push this repository to GitHub.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Choose the repository.
4. Build settings:
   - Framework preset: Astro, or None
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (the repository root)
   - Environment variable `NODE_VERSION`: `22`
5. Set `SITE_URL` to the production origin, including `https://`, with no trailing slash. Canonicals, the sitemap, Open Graph, and `hreflang` use it. Until you do, they use `siteUrl` in `settings.json`.
6. Set `PUBLIC_CF_ANALYTICS_TOKEN` if you want the beacon.
7. Save and deploy.

### Preview deployments

Cloudflare Pages builds a preview for every branch and pull request once the Git connection is in place. Open the preview from the Pages deployment list or from the commit status on the pull request. Production deploys from the production branch (usually `main`). Preview URLs are `https://<branch>.<project>.pages.dev`.

Set `SITE_URL` only for the **production** environment if you want preview canonicals to stay on the preview host. If `SITE_URL` is set for all environments, previews will advertise the production domain. That is safe for a private preview and wrong if a preview should be indexed. Leave previews unindexed by not pointing DNS at them.

### Custom domain and HTTPS

1. In the Pages project, open **Custom domains → Set up a domain**.
2. Add the domain (for example the name you buy for Beit Sela).
3. At the registrar, add the CNAME or the nameservers Cloudflare shows. If the domain is already on Cloudflare DNS, the record is added for you.
4. Wait until the certificate status is **Active**. Cloudflare issues the HTTPS certificate; you do not buy one separately.
5. Set `SITE_URL` to `https://your-domain` and redeploy so canonicals match the domain visitors use.
6. Optional: add a redirect from `www` to the apex (or the reverse) under **Custom domains**. One host should be canonical.

`public/_headers` sends a few security headers with the static files. Pages applies that file automatically.

## Languages and direction

`/` is English, left to right. `/he/` is Hebrew, `dir="rtl"` and `lang="he"`. Navigation, the hero panel, and the mobile booking bar follow the document direction. The lightbox moves to the next photo with the arrow that matches the reading direction, and with a swipe.

## Stack

Astro (static output), Tailwind CSS 4, content collections in `src/content`, Fontsource for Fraunces, Source Sans 3, Frank Ruhl Libre, and Heebo. JavaScript on the page is the menu (native `<details>`), the gallery lightbox, and the analytics hook.
