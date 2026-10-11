export function bookingHref(
  settings: {
    booking: {
      url: string;
      utm: Record<string, string>;
    };
  },
  placement: string,
): string {
  const url = new URL(settings.booking.url);
  for (const [key, value] of Object.entries(settings.booking.utm)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("utm_content", placement);
  return url.toString();
}
