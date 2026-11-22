import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, tr, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { events, getEvent, eventTypes, isUpcoming } from "@/content/events";
import { ui } from "@/content/ui";
import { Banner, PageHead, PhotoSlot, T } from "@/components/bits";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const e = getEvent(slug);
  if (!e) return {};
  return meta(lang, `/events/${slug}`, e.title, e.summary, e.poster?.social ? { src: e.poster.social, alt: e.poster.alt } : undefined);
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const e = getEvent(slug);
  if (!e) notFound();
  const en = lang === "en";
  const upcoming = isUpcoming(e);

  return (
    <>
      <PageHead lang={lang} title={e.title} crumbs={[{ label: ui.nav.events, to: "/events" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <div className="split">
          {e.poster ? (
            <Banner lang={lang} {...e.poster} sizes="(min-width: 900px) 600px, 100vw" className="poster" />
          ) : (
            <PhotoSlot tall lang={lang} label={{ en: "event poster", bn: "ইভেন্টের পোস্টার" }} />
          )}
          <div className="stack" style={{ gap: "var(--s5)" }}>
            <p style={{ display: "flex", gap: "var(--s2)" }}>
              <span className={`tag ${upcoming ? "tag-up" : ""}`}>{tr(upcoming ? ui.upcoming : ui.past, lang)}</span>
              <span className="tag">{tr(eventTypes[e.type], lang)}</span>
            </p>
            <p className="lead" style={{ color: "var(--starlight)" }}>{tr(e.summary, lang)}</p>
            <dl className="facts" style={{ flexDirection: "column", gap: "var(--s3)" }}>
              <div><dt>{tr(ui.dates, lang)}</dt><dd>{formatDateRange(e.start, e.end, lang, "long")}</dd></div>
              <div><dt>{tr(ui.venue, lang)}</dt><dd>{tr(e.venue, lang)}</dd></div>
              {e.facts?.map((f) => (
                <div key={f.label.en}><dt>{tr(f.label, lang)}</dt><dd>{tr(f.value, lang)}</dd></div>
              ))}
              {e.partners && (
                <div><dt>{en ? "Partners" : "সহযোগী"}</dt><dd style={{ fontWeight: "var(--weight-body)" }}>{e.partners}</dd></div>
              )}
            </dl>
            {e.todo && <p className="small"><T lang={lang} text={{ en: `[${e.todo.en}]`, bn: `[${e.todo.bn}]` }} /></p>}
            {e.slug === "ness-x" && (
              <div className="actions"><Link className="btn" href={path(lang, "/ness")}>{en ? "Programme and registration" : "অনুষ্ঠানসূচি ও নিবন্ধন"}</Link></div>
            )}
          </div>
        </div>

        {e.highlights && (
          <section aria-labelledby="hl">
            <h2 id="hl" style={{ marginBottom: "var(--s4)" }}>{en ? "Highlights" : "উল্লেখযোগ্য"}</h2>
            <ul className="muted" style={{ display: "grid", gap: "var(--s3)", maxWidth: "70ch" }}>
              {e.highlights.map((h) => <li key={h.en}>{tr(h, lang)}</li>)}
            </ul>
          </section>
        )}

        {!upcoming && (
          <section aria-labelledby="res">
            <h2 id="res" style={{ marginBottom: "var(--s3)" }}>{en ? "Results" : "ফলাফল"}</h2>
            <p className="muted"><T lang={lang} text={{ en: "[Winners by event and category, with school names only if the club agrees]", bn: "[ইভেন্ট ও বিভাগভিত্তিক বিজয়ী, ক্লাব রাজি থাকলে প্রতিষ্ঠানের নামসহ]" }} /></p>
          </section>
        )}

        {e.sources && (
          <section aria-labelledby="src">
            <h2 id="src" style={{ marginBottom: "var(--s3)" }}>{en ? "In the press" : "সংবাদমাধ্যমে"}</h2>
            <ul style={{ display: "grid", gap: "var(--s2)" }}>
              {e.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener">{s.title}</a></li>)}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
