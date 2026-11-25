import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { olympiadTeams, olympiadIntro, olympiadHistory, olympiadWhyJoin, olympiadHowToJoin } from "@/content/olympiad";
import { PageHead } from "@/components/bits";
import { TeamIcon } from "@/components/TeamIcon";
import { IconArrow } from "@/components/HubIcons";

const title = "Olympiad Teams";
const lead = "Meet NDESC's three Olympiad teams and the international Olympiads they prepare for.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/olympiad-teams", title, lead);
}

export default async function OlympiadTeams() {
  const lang: Locale = "en";
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s7)" }}>
        <p className="muted" style={{ maxWidth: "62ch", margin: 0 }}>{olympiadIntro}</p>
        <div className="hub-grid">
          {olympiadTeams.map((t) => (
            <Link key={t.slug} className={`hub-card accent-${t.slug}`} href={path(lang, `/olympiad-teams/${t.slug}`)}>
              <span className="hub-icon"><TeamIcon slug={t.slug} /></span>
              <h2>
                {t.name}
                {t.newlyFormed && <> <span className="tag tag-up" style={{ verticalAlign: "middle", marginLeft: "var(--s2)", fontSize: "0.8125rem" }}>{"Newly formed"}</span></>}
              </h2>
              <p>{t.discipline}</p>
              <div className="hub-preview">
                <div>
                  <span>{"Prepares for"}</span>
                  <strong>{t.olympiad.name} ({t.olympiad.short})</strong>
                </div>
              </div>
              <span className="hub-go">{"Team page"} <IconArrow /></span>
            </Link>
          ))}
        </div>

        <section aria-labelledby="began" style={{ maxWidth: "62ch" }}>
          <h2 id="began" style={{ marginBottom: "var(--s4)" }}>{"How the teams began"}</h2>
          {olympiadHistory.map((p, i) => <p key={i} className="muted" style={{ marginTop: i ? "var(--s4)" : 0 }}>{p}</p>)}
        </section>

        <section aria-labelledby="why" style={{ maxWidth: "62ch" }}>
          <h2 id="why" style={{ marginBottom: "var(--s4)" }}>{"Why join an Olympiad team?"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s4)" }}>{olympiadWhyJoin.intro}</p>
          <ul className="tick-list">
            {olympiadWhyJoin.items.map((it, i) => <li key={i}><span><strong>{it.title}.</strong> {it.text}</span></li>)}
          </ul>
        </section>

        <section aria-labelledby="howjoin" className="surface panel-band">
          <div>
            <h2 id="howjoin">{"How to join"}</h2>
            <p className="muted">{olympiadHowToJoin}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={path(lang, "/contact")}>{"Contact the club"}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
