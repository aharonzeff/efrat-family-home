# Creative direction — Beit Sela

## Name

**Beit Sela / בית סלע** — “house of stone.”

The entry photographs show a stone feature wall, and Efrat sits in the stone hills of Gush Etzion. The name is short, pronounceable in English (bate SEH-lah), and is an ordinary Hebrew phrase. It does not claim a vineyard, a hotel group, a kosher certificate, or a calendar of gatherings.

Names that were set aside:

- Anything with “Valley” in it. The notes on valleysuite.info are a pacing reference only, and that site already uses the word.
- “Ora House.” Airbnb’s map label says Ora. That is an approximate pin, not a neighborhood we are willing to print.
- “The Pool House.” The pool is seasonal and, in the photograph, above ground. It should not be the whole identity.
- “Shabbat Villa.” Shabbat is one true reason to stay, not the only one, and the listing calls this a family home.

## Palette

| Role | Hex | Use |
| --- | --- | --- |
| Paper | `#F7F4EE` | Page background, hero text panel |
| Cream | `#EFE6D6` | Alternate sections |
| Stone | `#E3D5C3` | Image mats, rules |
| Sand | `#CBBBA4` | The second course in the stone mark |
| Olive | `#4D5B42` | Eyebrows, secondary emphasis |
| Pine | `#243026` | Headings, primary buttons |
| Sage wash | `#E3EADC` | Review cards |
| Clay | `#8D4F3C` | Focus rings, small rules, the “needs confirmation” mark |
| Ink | `#241F1A` | Body text |
| Charcoal | `#3E382F` | Secondary text |

Cream text on pine, and ink on paper, both clear WCAG AA for body size. Clay is used for focus and for placeholder labels, not for long paragraphs.

The mark is four offset blocks, like courses of stone. It is not a leaf sprig and not a script wordmark.

## Type

- English display: Fraunces.
- English text: Source Sans 3.
- Hebrew display: Frank Ruhl Libre.
- Hebrew text: Heebo.

Hebrew is selected on `html[lang="he"]`, so a new language can point the same variables at another pair. Fonts are self-hosted through Fontsource. There is no right-aligned English, and Hebrew is not set in Fraunces.

## Sitemap

English is the default and is unprefixed. Hebrew lives under `/he/`.

| Page | English | Hebrew |
| --- | --- | --- |
| Home | `/` | `/he/` |
| Gallery | `/gallery/` | `/he/gallery/` |
| Rooms | `/rooms/` | `/he/rooms/` |
| Shabbat | `/shabbat/` | `/he/shabbat/` |
| The area | `/explore/` | `/he/explore/` |
| Host | `/host/` | `/he/host/` |
| FAQ | `/faq/` | `/he/faq/` |

Booking never stays on this site. Every reservation link goes to the Airbnb listing in `src/content/site/settings.json`, with the UTM parameters from that same file.

## What the pages refuse to do

They do not sell events. They do not quote a price. They do not draw the house on the map. They do not name a hechsher, an eruv, or a synagogue schedule. The pool is spoken of as May through August, and that range is the `pool` object in settings, not a sentence buried in a component.
