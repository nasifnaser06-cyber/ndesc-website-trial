import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { olympiadTeams, getTeam } from "@/content/olympiad";
import { ExternalLink, PageHead } from "@/components/bits";
import { TeamIcon } from "@/components/TeamIcon";

type Props = { params: Promise<{ team: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return olympiadTeams.map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { team } = await params;
  const lang: Locale = "en";
  const t = getTeam(team);
  if (!t) return {};
  return meta(lang, `/olympiad-teams/${t.slug}`, `${t.name} · Olympiad Teams`, t.overview);
}

// Sections show only when the club has given their content; nothing is filled in on its behalf.
export default async function TeamPage({ params }: Props) {
  const { team } = await params;
  const lang: Locale = "en";
  const t = getTeam(team);
  if (!t) notFound();
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // Newest first; items without a year go last, in the club's order.
  const achievements = [...t.achievements].sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));
  const others = olympiadTeams.filter((x) => x.slug !== t.slug);

  return (
    <>
      <PageHead
        lang={lang}
        kicker={t.newlyFormed ? `${t.discipline} · Newly formed` : t.discipline}
        title={t.name}
        lead={t.overview}
        crumbs={[{ label: ui.nav.explore, to: "/explore" }, { label: ui.nav.olympiadTeams, to: "/olympiad-teams" }]}
      />
      <div className={`wrap accent-${t.slug}`} style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <section aria-labelledby="focus">
          <div style={{ display: "flex", gap: "var(--s4)", alignItems: "center", marginBottom: "var(--s4)" }}>
            <span className="hub-icon"><TeamIcon slug={t.slug} /></span>
            <h2 id="focus" style={{ margin: 0 }}>{"Academic focus"}</h2>
          </div>
          <dl className="team-facts">
            <div><dt>{"Olympiad"}</dt><dd>{t.olympiad.name} ({t.olympiad.short})</dd></div>
            <div><dt>{"Field"}</dt><dd>{t.discipline}</dd></div>
          </dl>
        </section>

        <section aria-labelledby="prep">
          <h2 id="prep" style={{ marginBottom: "var(--s4)" }}>{"How the team prepares"}</h2>
          <ul className="tick-list">
            {t.preparation.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>

        {t.selection && (
          <section aria-labelledby="sel">
            <h2 id="sel" style={{ marginBottom: "var(--s4)" }}>{"Selection and eligibility"}</h2>
            <p className="muted">{t.selection}</p>
          </section>
        )}

        {t.cohorts.length > 0 && (
          <section aria-labelledby="people">
            <h2 id="people" style={{ marginBottom: "var(--s4)" }}>{"Mentors and members"}</h2>
            <div className="cohorts">
              {t.cohorts.map((c) => (
                <article className="cohort surface" key={c.year} aria-labelledby={`cohort-${c.year}`}>
                  <h3 id={`cohort-${c.year}`}>{t.name} {c.year}</h3>
                  <p className="cohort-label">{(c.mentors.length > 1 ? "Mentors" : "Mentor")}</p>
                  <ul className="cohort-list">
                    {c.mentors.map((m) => <li key={m.name}><strong>{m.name}</strong><span>{m.role}</span></li>)}
                  </ul>
                  {c.advisors && c.advisors.length > 0 && (
                    <>
                      <p className="cohort-label">{"Advisors"}</p>
                      <ul className="cohort-names">{c.advisors.map((n) => <li key={n}>{n}</li>)}</ul>
                    </>
                  )}
                  <p className="cohort-label">{`Members (${c.members.length})`}</p>
                  <ul className="cohort-names">{c.members.map((n) => <li key={n}>{n}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>
        )}

        {achievements.length > 0 && (
          <section aria-labelledby="ach">
            <h2 id="ach" style={{ marginBottom: "var(--s4)" }}>{"Achievements"}</h2>
            <ul className="event-list">
              {achievements.map((a, i) => (
                <li className="event-row" key={i}>
                  <p className="event-date">{a.year ?? ""}</p>
                  <div className="event-main">
                    <h3 style={{ fontSize: "1.125rem" }}>{a.award}</h3>
                    <p className="small muted">{a.competition}{a.credit ? ` · ${a.credit}` : ""}</p>
                  </div>
                  {a.source && <p className="small"><ExternalLink href={a.source.url} lang={lang}>{a.source.label}</ExternalLink></p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {t.milestones.length > 0 && (
          <section aria-labelledby="mile">
            <h2 id="mile" style={{ marginBottom: "var(--s4)" }}>{"Milestones"}</h2>
            <ul className="event-list">
              {t.milestones.map((m, i) => (
                <li className="event-row" key={i}><p className="event-date">{m.year}</p><div className="event-main"><p>{m.text}</p></div></li>
              ))}
            </ul>
          </section>
        )}

        {t.photos.length > 0 && (
          <section aria-labelledby="photos">
            <h2 id="photos" style={{ marginBottom: "var(--s4)" }}>{"Photos"}</h2>
            <div className="cards-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {t.photos.map((p) => <img key={p.src} src={`${bp}${p.src}`} alt={p.alt} loading="lazy" style={{ width: "100%", height: "auto", borderRadius: 14 }} />)}
            </div>
          </section>
        )}

        {t.resources.length > 0 && (
          <section aria-labelledby="learn">
            <h2 id="learn" style={{ marginBottom: "var(--s4)" }}>{"Learning resources"}</h2>
            <ul className="tick-list">{t.resources.map((r) => <li key={r.url}><ExternalLink href={r.url} lang={lang}>{r.title}</ExternalLink></li>)}</ul>
          </section>
        )}

        <section aria-labelledby="join" className="surface panel-band">
          <div>
            <h2 id="join">{`Interested in ${t.name}?`}</h2>
            <p className="muted">{"Ask the club about the next selection test and how to take part."}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={path(lang, "/contact")}>{"Contact the club"}</Link>
          </div>
        </section>

        <nav aria-label={"Other teams"} className="small" style={{ display: "flex", gap: "var(--s5)", flexWrap: "wrap" }}>
          {others.map((o) => <Link key={o.slug} href={path(lang, `/olympiad-teams/${o.slug}`)}>{o.name} →</Link>)}
        </nav>
      </div>
    </>
  );
}
