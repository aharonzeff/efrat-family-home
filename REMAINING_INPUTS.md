# Remaining inputs

These are gaps in the public listing as of October 2026. Each one is marked on the site, or deliberately left off it. Do not fill them with a guess. Edit the content file named here, then rebuild.

## Needed from Aharon

1. **Bedroom 7.** Airbnb’s totals say 7 bedrooms and 7 beds. The room-by-room list stops at six. The seventh card on the rooms page is a dashed placeholder. Add the real beds in `src/content/rooms/list.json` (`bedroom-7`, set `published` to `true`).
2. **Photo labels.** All 24 photographs were downloaded from the listing on 11 October 2026. Airbnb did not caption them. Captions in `src/content/photos/gallery.json` describe what is in the frame and are flagged unverified. Confirm which file is which bedroom, and whether any two bathroom frames are the same room.
3. **Host photograph and biography.** Neither was on the listing. The host page shows a dashed placeholder. When a portrait exists, add the file under `src/assets/photos/` and point a field at it (today the placeholder is the component on the host page, fed by `photoPlaceholder` and `bioPlaceholder` in `src/content/pages/host.json`).
4. **Heating and hot water.** Airbnb lists both under “Not included,” next to exterior security cameras. That may be an unchecked box. The FAQ says so. If the house does have them, update `src/content/amenities/list.json` only after the Airbnb listing matches.
5. **Hot tub.** It is an amenity. No photograph is captioned as the hot tub.
6. **Treadmill vs. exercise bike.** The amenity line says treadmill. One unlabeled bedroom photograph shows a stationary bike. The caption records both facts and does not merge them.
7. **Raised bed.** One photograph shows a raised bed frame. The published bed list has no bunk or loft. It is not counted as one.
8. **Parking.** Free on premises, free on the street, and paid on premises are all listed. The FAQ asks guests to confirm which applies.
9. **Kosher certification.** The listing says “kosher kitchen.” It does not name a hechsher. Do not add one in copy until you are willing to name it on Airbnb too.
10. **Eruv, synagogue names, walking minutes, and service times.** Not in the listing. The Shabbat page says they are not stated.
11. **The three-minute supermarket.** Asher’s review mentions it and does not name it. Do not name a chain until you know which door he meant.
12. **Crib, high chair, step-free access.** Not listed. The entry photos show stairs.
13. **Cancellation policy, prices, minimum stay, availability.** They depend on dates and are not copied here.
14. **Reviews.** The three texts are Airbnb’s English automatic translations of Hebrew originals. The site shows first name, month and year, “via Airbnb,” and the rating **5.0 from 3 reviews as of October 2026**. It does not refresh itself. Asher’s Hebrew spelling was not in the source we had (the translation says “Asher”), so the Hebrew page keeps the Latin name. Replace quotes only with text you are willing to stand behind; do not back-translate.
15. **Host profile vs. listing.** Profile: 7 reviews, 5.0, 9 years hosting. This listing: 3 reviews. No Superhost badge was shown. Guests write “Aaron.”
16. **Exact address.** Intentionally absent. The map is a marker-free view of Efrat. Airbnb’s map label “Ora” was not used.
17. **Higher-resolution originals.** The CDN served these files at 1440 pixels wide (`im_w=1440`). A wider size returned 404. Drop replacements into `src/assets/photos/` using the same filenames, then rebuild. See the README. Do not generate new pictures of the house.
18. **Analytics token and canonical domain.** `analytics.cloudflareToken` is empty. Set `PUBLIC_CF_ANALYTICS_TOKEN` in Cloudflare, and set `SITE_URL` to the real domain before launch. The current `siteUrl` is `https://beit-sela.pages.dev`, a placeholder.
19. **Open Graph image.** `public/og/home.jpg` is a crop of the balcony photograph. Replace it if the hero file changes (`npm run og` rebuilds it from `15-balcony.jpg`).

## Already saved

The 24 listing photos are in `src/assets/photos/`. Hotlinking is not used. A few files arrived with a `.png` URL but JPEG bytes; they are stored as `.jpg`.
