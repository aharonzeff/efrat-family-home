import { defaultLocale, locales, pages, type Locale, type PageId } from "../i18n/config";

export { defaultLocale, locales, pages };
export type { Locale, PageId };

export function getLocale(code: string) {
  const locale = locales.find((item) => item.code === code);
  if (!locale) throw new Error(`Unknown locale: ${code}`);
  return locale;
}

type Localized = { en: string; he: string; [key: string]: unknown };
type LocalizedList = { en: string[]; he: string[]; [key: string]: unknown };

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function t(locale: string, value: Localized | undefined): string {
  if (!value) return "";
  const picked = value[locale] ?? value[defaultLocale];
  return typeof picked === "string" ? picked : "";
}

export function tList(locale: string, value: LocalizedList | undefined): string[] {
  if (!value) return [];
  const picked = value[locale] ?? value[defaultLocale];
  return strings(picked);
}

export function localePath(locale: string, page: PageId | string): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  if (page === "home") return `${prefix}/`;
  return `${prefix}/${page}/`;
}

export function otherLocale(locale: string): string {
  const next = locales.find((item) => item.code !== locale);
  return next?.code ?? defaultLocale;
}
