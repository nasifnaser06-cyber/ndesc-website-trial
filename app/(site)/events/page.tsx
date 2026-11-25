import { type Locale } from "@/lib/i18n";
import { meta, eventRow, eventLabels } from "@/lib/view";
import { sortedEvents, eventTypes } from "@/content/events";
import type { SearchDoc } from "@/lib/eventSearch";
import { nessx } from "@/content/ness2027";
import { PageHead } from "@/components/bits";
import { ui } from "@/content/ui";
import EventSearch from "@/components/EventSearch";

const title = "Events";
const lead = "Summits, festivals, camps and workshops, from the next one back to the early years.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/events", title, lead);
}

export default async function Events() {
  const lang: Locale = "en";
  const events = sortedEvents();
  const items = events.map((e) => eventRow(e, lang));
  // What the search looks through: name, category, dates, venue and summary of each real event.
  const docs: SearchDoc[] = events.map((e, i) => ({
    slug: e.slug,
    title: items[i].title,
    typeKey: e.type,
    typeLabel: eventTypes[e.type],
    date: items[i].date,
    where: items[i].where,
    summary: e.summary,
    start: e.start,
    end: e.end,
    aka: e.slug === "ness-x" ? nessx.name : undefined,
  }));
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }]} />
      <div className="wrap">
        <EventSearch items={items} docs={docs} labels={eventLabels(lang)} />
      </div>
    </>
  );
}
