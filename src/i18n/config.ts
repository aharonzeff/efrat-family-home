export const locales = [
  {
    code: "en",
    dir: "ltr",
    htmlLang: "en",
    ogLocale: "en_US",
    label: "English",
    shortLabel: "EN",
    default: true,
  },
  {
    code: "he",
    dir: "rtl",
    htmlLang: "he",
    ogLocale: "he_IL",
    label: "עברית",
    shortLabel: "HE",
    default: false,
  },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const defaultLocale: Locale = "en";

export const pages = ["home", "gallery", "rooms", "shabbat", "explore", "host", "faq"] as const;

export type PageId = (typeof pages)[number];
