export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

/**
 * The site is English only. Bangla was taken off on 18 Nov 2026 and its text deleted on 23 Nov 2026
 * (Mahmud's call); it remains only in the git history before that date. The `lang` arguments that
 * remain are just the English locale, kept so page and helper signatures stay simple.
 */
export const publishedLocales: readonly Locale[] = ["en"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The default language has no prefix in addresses (ndesc.com/events/). Since 20 Nov 2026. */
export const defaultLocale: Locale = "en";

/** Path inside the site, e.g. path("en", "/events") -> "/events/". */
export function path(lang: Locale, to = "/"): string {
  const clean = to === "/" ? "" : to.replace(/\/+$/, "");
  const prefix = lang === defaultLocale ? "" : `/${lang}`;
  return `${prefix}${clean}/`;
}

const dateLocale = "en-GB";

/** "28 Jan 2027" or "28–30 Jan 2027" or "30 Sep – 2 Oct 2026". */
export function formatDateRange(start: string, end: string | undefined, lang: Locale, month: "short" | "long" = "short"): string {
  const loc = dateLocale;
  const s = new Date(`${start}T00:00:00Z`);
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(loc, { timeZone: "UTC", ...opts }).format(d);
  if (!end || end === start) return fmt(s, { day: "numeric", month, year: "numeric" });
  const e = new Date(`${end}T00:00:00Z`);
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const sameMonth = sameYear && s.getUTCMonth() === e.getUTCMonth();
  if (sameMonth) {
    return `${fmt(s, { day: "numeric" })}–${fmt(e, { day: "numeric", month, year: "numeric" })}`;
  }
  if (sameYear) {
    return `${fmt(s, { day: "numeric", month })} – ${fmt(e, { day: "numeric", month, year: "numeric" })}`;
  }
  return `${fmt(s, { day: "numeric", month, year: "numeric" })} – ${fmt(e, { day: "numeric", month, year: "numeric" })}`;
}

/** A number as text. (Was Bangla numerals on Bangla pages; the site is English only now.) */
export function num(value: number | string, _lang: Locale): string {
  return String(value);
}
