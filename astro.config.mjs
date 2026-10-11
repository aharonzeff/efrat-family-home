import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { locales, defaultLocale } from "./src/i18n/config.ts";
import settings from "./src/content/site/settings.json" with { type: "json" };

const site = process.env.SITE_URL || settings.siteUrl;

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  i18n: {
    defaultLocale,
    locales: locales.map((locale) => locale.code),
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((locale) => [locale.code, locale.htmlLang])),
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
