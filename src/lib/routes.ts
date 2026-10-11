import { localePath, locales, pages, type PageId } from "./i18n";

export function getStaticPathsForSite() {
  return locales.flatMap((locale) =>
    pages.map((page) => {
      const url = localePath(locale.code, page as PageId);
      const trimmed = url.replace(/^\/|\/$/g, "");
      return {
        params: { path: trimmed === "" ? undefined : trimmed },
        props: { locale: locale.code, page },
      };
    }),
  );
}
