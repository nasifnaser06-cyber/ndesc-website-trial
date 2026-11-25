import type { Metadata } from "next";
import { type Locale, path, formatDateRange, publishedLocales } from "@/lib/i18n";
import { type ClubEvent, eventTypes, isUpcoming } from "@/content/events";
import type { EventRowData } from "@/components/EventList";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
export function eventRow(e: ClubEvent, lang: Locale): EventRowData {
  return {
    slug: e.slug,
    href: path(lang, `/events/${e.slug}`),
    type: e.type,
    typeLabel: eventTypes[e.type],
    date: formatDateRange(e.start, e.end, lang),
    title: e.title,
    where: e.venue,
    upcoming: isUpcoming(e),
  };
}

export function eventLabels(lang: Locale) {
  return {
    upcoming: ui.upcoming,
    past: ui.past,
    all: ui.all,
    allTypes: "All types",
    details: ui.details,
    when: "When",
    kind: "Type",
    empty: "No events match these filters.",
  };
}

/** Page title, description, language alternates and share card for one page. */
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const full = (lang: Locale, to: string) => `${bp}${path(lang, to)}`;

export function meta(lang: Locale, to: string, title: string | null, description: string, image?: { src: string; alt: string; width?: number; height?: number }): Metadata {
  const languages = Object.fromEntries(publishedLocales.map((l) => ["en", full(l, to)]));
  const t = title ? title : undefined;
  return {
    title: t ? t : { absolute: site.name },
    description: description,
    alternates: { canonical: full(lang, to), languages },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t ?? site.name,
      description: description,
      locale: "en_GB",
      url: full(lang, to),
      ...(image ? { images: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${image.src}`, width: image.width ?? 1200, height: image.height ?? 675, alt: image.alt }] } : {}),
    },
    ...(image ? { twitter: { card: "summary_large_image" } } : {}),
  };
}
