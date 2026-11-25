import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, path, formatDateRange } from "@/lib/i18n";
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
  const upcoming = isUpcoming(e);

  return (
    <>
      <PageHead lang={lang} title={e.title} crumbs={[{ label: ui.nav.explore, to: "/explore" }, { label: ui.nav.events, to: "/events" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <div className="split">
          {e.poster ? (
            <Banner lang={lang} {...e.poster} sizes="(min-width: 900px) 600px, 100vw" className="poster" />
          ) : (
            <PhotoSlot tall lang={lang} label={"event poster"} />
          )}
          <div className="stack" style={{ gap: "var(--s5)" }}>
            <p style={{ display: "flex", gap: "var(--s2)" }}>
              <span className={`tag ${upcoming ? "tag-up" : ""}`}>{upcoming ? ui.upcoming : ui.past}</span>
              <span className="tag">{eventTypes[e.type]}</span>
            </p>
            <p className="lead" style={{ color: "var(--starlight)" }}>{e.summary}</p>
            <dl className="facts" style={{ flexDirection: "column", gap: "var(--s3)" }}>
              <div><dt>{ui.dates}</dt><dd>{formatDateRange(e.start, e.end, lang, "long")}</dd></div>
              <div><dt>{ui.venue}</dt><dd>{e.venue}</dd></div>
              {e.facts?.map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
              {e.partners && (
                <div><dt>{"Partners"}</dt><dd style={{ fontWeight: "var(--weight-body)" }}>{e.partners}</dd></div>
              )}
            </dl>
            {e.todo && <p className="small"><T lang={lang} text={`[${e.todo}]`} /></p>}
            {e.slug === "ness-x" && (
              <div className="actions"><Link className="btn" href={path(lang, "/ness")}>{"Programme and registration"}</Link></div>
            )}
          </div>
        </div>

        {e.about && (
          <section aria-labelledby="about-event" style={{ maxWidth: "70ch" }}>
            <h2 id="about-event" style={{ marginBottom: "var(--s4)" }}>{"About the event"}</h2>
            {e.about.map((p, i) => <p key={i} className="muted" style={{ marginTop: i ? "var(--s4)" : 0 }}>{p}</p>)}
          </section>
        )}

        {e.segments && (
          <section aria-labelledby="segments">
            <h2 id="segments" style={{ marginBottom: "var(--s4)" }}>{e.segmentsTitle ?? "Segments"}</h2>
            <ol className="seg-list">
              {e.segments.map((g) => (
                <li key={g.title} className="seg surface">
                  {g.when && <p className="seg-when">{g.when}</p>}
                  <h3>{g.title}</h3>
                  {g.text && <p className="muted">{g.text}</p>}
                  {g.items && (
                    <ul className="tick-list">
                      {g.items.map((it) => <li key={it.title}><span><strong>{it.title}.</strong> {it.text}</span></li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
            {e.closing && <p className="muted" style={{ maxWidth: "70ch", marginTop: "var(--s5)" }}>{e.closing}</p>}
          </section>
        )}

        {e.highlights && (
          <section aria-labelledby="hl">
            <h2 id="hl" style={{ marginBottom: "var(--s4)" }}>{"Highlights"}</h2>
            <ul className="muted" style={{ display: "grid", gap: "var(--s3)", maxWidth: "70ch" }}>
              {e.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </section>
        )}

        {!upcoming && (
          <section aria-labelledby="res">
            <h2 id="res" style={{ marginBottom: "var(--s3)" }}>{"Results"}</h2>
            <p className="muted"><T lang={lang} text={"[Winners by event and category, with school names only if the club agrees]"} /></p>
          </section>
        )}

        {e.sources && (
          <section aria-labelledby="src">
            <h2 id="src" style={{ marginBottom: "var(--s3)" }}>{"In the press"}</h2>
            <ul style={{ display: "grid", gap: "var(--s2)" }}>
              {e.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener">{s.title}</a></li>)}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
