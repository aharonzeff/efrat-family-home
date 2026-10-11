import { getEntry } from "astro:content";

export async function loadContent() {
  const [site, ui, photos, amenities, rooms, reviews, faqs, attractions, home, gallery, roomsPage, shabbat, explore, host, faq] =
    await Promise.all([
      getEntry("site", "settings"),
      getEntry("ui", "strings"),
      getEntry("photos", "gallery"),
      getEntry("amenities", "list"),
      getEntry("rooms", "list"),
      getEntry("reviews", "list"),
      getEntry("faqs", "list"),
      getEntry("attractions", "list"),
      getEntry("pages", "home"),
      getEntry("pages", "gallery"),
      getEntry("pages", "rooms"),
      getEntry("pages", "shabbat"),
      getEntry("pages", "explore"),
      getEntry("pages", "host"),
      getEntry("pages", "faq"),
    ]);

  const required = {
    site,
    ui,
    photos,
    amenities,
    rooms,
    reviews,
    faqs,
    attractions,
    home,
    gallery,
    roomsPage,
    shabbat,
    explore,
    host,
    faq,
  };

  for (const [key, entry] of Object.entries(required)) {
    if (!entry) throw new Error(`Missing content entry: ${key}`);
  }

  return {
    settings: site!.data,
    ui: ui!.data as Record<string, unknown>,
    photos: photos!.data.items,
    amenities: amenities!.data.groups,
    rooms: rooms!.data.items,
    reviews: reviews!.data,
    faqs: [...faqs!.data.items].sort((a, b) => a.order - b.order),
    attractions: [...attractions!.data.items].sort((a, b) => a.order - b.order),
    pages: {
      home: home!.data,
      gallery: gallery!.data,
      rooms: roomsPage!.data,
      shabbat: shabbat!.data,
      explore: explore!.data,
      host: host!.data,
      faq: faq!.data,
    },
  };
}

export type SiteContent = Awaited<ReturnType<typeof loadContent>>;
