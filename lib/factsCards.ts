import { type Locale, path, formatDateRange } from "@/lib/i18n";
import { factsCategories, type FactsFridayPost } from "@/content/factsFriday";

/** What the FactsFriday carousel needs to know about one post (built on the server, passed to the client). */
export type FactsCard = {
  slug: string;
  href: string;
  title: string;
  date: string;
  dateLabel: string;
  year: string;
  category: string;
  categoryLabel: string;
  summary: string;
  /** Smaller cover, and the larger one for sharp screens and the centred card. Empty when there is no picture. */
  img: string;
  img2x?: string;
  /** Lower-case text the search looks through (title, topic, category, year, opening of the post). */
  haystack: string;
};

export function toFactsCard(f: FactsFridayPost, lang: Locale, bp: string): FactsCard {
  const sizes = f.cover?.sizes ?? [];
  const small = sizes[0];
  const large = sizes[sizes.length - 1];
  return {
    slug: f.slug,
    href: path(lang, `/factsfriday/${f.slug}`),
    title: f.title,
    date: f.date,
    dateLabel: formatDateRange(f.date, undefined, lang, "long"),
    year: f.date.slice(0, 4),
    category: f.category,
    categoryLabel: factsCategories[f.category],
    summary: f.summary,
    img: f.cover && small ? `${bp}${f.cover.base}-${small}.webp` : "",
    img2x: f.cover && large > small ? `${bp}${f.cover.base}-${large}.webp` : undefined,
    haystack: [f.title, f.summary, factsCategories[f.category], f.date.slice(0, 4), f.body.join(" ").slice(0, 600)].join(" ").toLowerCase(),
  };
}
