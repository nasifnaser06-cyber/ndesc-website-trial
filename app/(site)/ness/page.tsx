import Link from "next/link";
import { type Locale, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { getEvent, ness2027Banner } from "@/content/events";
import { nessSchedule, showNessSchedule } from "@/content/club";
import { nessx, passes, passNote, registerWays, campusAmbassadors, categories, categoryNote, winnersNote, soloSegments, teamSegments, specialSegments, programmes, organizers, type Segment } from "@/content/ness2027";
import { ContactLink, ExternalLink, FormButton, Stars, T, RegisterButton } from "@/components/bits";
import BgDrift from "@/components/BgDrift";

const title = "NESS X";
const description = "NESS X, the 10th National Earth and Space Summit: 28–30 January 2027 at Notre Dame College, Dhaka. Olympiads, quizzes, team contests, exhibitions and talks. Register now.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/ness", title, description, { src: ness2027Banner.social, alt: ness2027Banner.alt });
}

function SegmentList({ items, lang }: { items: Segment[]; lang: Locale }) {
  return (
    <div className="segments">
      {items.map((g) => (
        <details key={g.name} className="segment">
          <summary>
            <span className="segment-name">{g.name}</span>
            <span className="segment-tags">
              {g.cats.map((c) => <span key={c} className="tag">{c}</span>)}
              {g.online && <span className="tag tag-up">{"Online"}</span>}
            </span>
          </summary>
          {g.desc.map((d) => <p key={d}>{d}</p>)}
          {g.parts && (
            <ul className="segment-parts">
              {g.parts.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong> <span className="small">({p.cats.join(", ")})</span>: {p.desc}
                  {p.form && <> <ExternalLink href={p.form} lang={lang}>{`Submit ${p.name}`}</ExternalLink></>}
                </li>
              ))}
            </ul>
          )}
          {g.page && (
            <p><Link href={path(lang, g.page)}>{`Rules, renaming and submission links: ${g.name} page`}</Link></p>
          )}
        </details>
      ))}
    </div>
  );
}

export default async function Ness() {
  const lang: Locale = "en";
  const ness = getEvent("ness-x")!;

  return (
    <>
      {/* Page background (trial, 20 Nov 2026): polar bears under the aurora, behind a white veil; the page uses dark text. */}
      <div
        className="ness-bg ness-three ness-dark bg-drift"
        aria-hidden="true"
        style={{
          ["--bg-lg" as string]: `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ness-bg-2400.webp")`,
          ["--bg-sm" as string]: `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ness-bg-1600.webp")`,
        }}
      />
      <BgDrift />
      <section className="sky sky-clear" aria-labelledby="ness-h1">
        <Stars />
        <div className="wrap sky-inner" style={{ paddingBlock: "var(--s8) var(--s7)" }}>
          <div className="sky-copy">
            <h1 id="ness-h1" className="ness-logo-h1">
              {/* The NESS snowflake logo (Mahmud, 25 Nov 2026) stands in for the "NESS X" heading;
                  its alt text is the heading's name. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/nessx-snowflake-360.webp`}
                srcSet={[180, 360, 540].map((h) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/nessx-snowflake-${h}.webp ${h / 180}x`).join(", ")}
                alt={nessx.name}
                width={180}
                height={180}
                fetchPriority="high"
              />
            </h1>
            {/* Logo first, its line underneath (Mahmud, 23 Nov 2026). */}
            <p className="label logo-caption">{nessx.fullName}</p>
            <p>{nessx.intro}</p>
            <dl className="facts">
              <div><dt>{ui.dates}</dt><dd>{formatDateRange(ness.start, ness.end, lang, "long")}</dd></div>
              <div><dt>{ui.venue}</dt><dd>{"Notre Dame College, Motijheel, Dhaka"}</dd></div>
            </dl>
            <div className="actions">
              <RegisterButton lang={lang}>{"Register now"}</RegisterButton>
              <a className="btn btn-secondary" href="#segments">{"See all segments"}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s9)", paddingTop: "var(--s8)" }}>
        <section aria-labelledby="passes-h">
          <h2 id="passes-h" style={{ marginBottom: "var(--s5)" }}>{"Passes"}</h2>
          <div className="cards-3">
            {passes.map((p) => (
              <div className="surface pass" key={p.name}>
                <h3>{p.name}</h3>
                <p className="pass-price">{p.price}</p>
                <p className="muted small">{p.detail}</p>
              </div>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: "var(--s3)" }}>{passNote}</p>
        </section>

        <section id="register" aria-labelledby="reg">
          <h2 id="reg" style={{ marginBottom: "var(--s5)" }}>{"How to register"}</h2>
          <ol className="steps">
            {registerWays.map((w) => (
              <li key={w.who}>
                <p><strong>{w.who}</strong></p>
                <p className="muted small">
                  {w.link && w.how.includes(w.link.text) ? (
                    <>{w.how.split(w.link.text)[0]}<a href={w.link.href}>{w.link.text}</a>{w.how.split(w.link.text).slice(1).join(w.link.text)}</>
                  ) : w.how}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cats">
          <h2 id="cats" style={{ marginBottom: "var(--s4)" }}>{"Categories"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s4)", maxWidth: "70ch" }}>{categoryNote}</p>
          <div className="table-scroll">
            <table>
              <thead><tr><th scope="col">{"Code"}</th><th scope="col">{"Category"}</th><th scope="col">{"Class"}</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.code}><td style={{ fontFamily: "var(--font-head)", fontWeight: "var(--weight-head)" }}>{c.code}</td><td>{c.name}</td><td>{c.who}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: "var(--s4)", maxWidth: "70ch" }}><strong>{"Winner details: "}</strong>{winnersNote}</p>
        </section>

        <section id="segments" aria-labelledby="seg-h">
          <h2 id="seg-h" style={{ marginBottom: "var(--s3)" }}>{"Segments"}</h2>
          <p className="muted" style={{ maxWidth: "70ch" }}>
            {"Open a segment to read what it involves. The letters show which categories can enter. Full rules for each segment come in its own post on "}
            {"the club's "}<ExternalLink href={site.social.facebook} lang={lang}>{"facebook page"}</ExternalLink>.
          </p>
          <div className="segment-groups">
            <div>
              <h3>{"Solo"}</h3>
              <SegmentList items={soloSegments} lang={lang} />
            </div>
            <div>
              <h3>{"Team (up to 3 members)"}</h3>
              <SegmentList items={teamSegments} lang={lang} />
              <h3 style={{ marginTop: "var(--s6)" }}>{"Special"}</h3>
              <SegmentList items={specialSegments} lang={lang} />
            </div>
          </div>
        </section>

        <section aria-labelledby="prog-h">
          <h2 id="prog-h" style={{ marginBottom: "var(--s3)" }}>{"Exhibitions and programmes"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>{"Open to everyone with a solo or team pass."}</p>
          <div className="groups">
            {programmes.map((g) => (
              <div key={g.name}>
                <h3>{g.name}</h3>
                <p className="muted small">{g.desc}</p>
                {g.name.includes("Photosphere") && (
                  <Link className="btn btn-secondary btn-mini" href={path(lang, "/ness/photosphere")} style={{ marginTop: "var(--s2)", alignSelf: "flex-start" }}>
                    {"Check out Photosphere 7.0"}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {showNessSchedule && (
        <section aria-labelledby="schedule">
          <h2 id="schedule" style={{ marginBottom: "var(--s5)" }}>{"Schedule"}</h2>
          <div className="cards-3">
            {nessSchedule.map((d) => (
              <div className="surface" key={d.day}>
                <h3>{d.day}</h3>
                <p className="muted small"><T text={d.plan} lang={lang} /></p>
              </div>
            ))}
          </div>
        </section>
        )}

        <section id="exhibit" className="surface panel-band" aria-labelledby="exh">
          <div>
            <p className="label">{"For External Organizations"}</p>
            <h2 id="exh">{"Showcase Your Project or Organization at NESS"}</h2>
            <p className="muted">
              {"Academic institutions, research teams, external student clubs and companies can book an exhibition stall on our event premises and partner with NESS to showcase their projects, products, programs and innovations or host dedicated seminars and workshops for thousands of attending students and families."}
            </p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={path(lang, "/contact")}>{"Contact for Exhibition"}</Link>
          </div>
        </section>

        <section id="campus-ambassadors" className="surface panel-band" aria-labelledby="ca-h">
          <div>
            <p className="label">{campusAmbassadors.label}</p>
            <h2 id="ca-h">{campusAmbassadors.title}</h2>
            <p className="muted">{campusAmbassadors.intro}</p>
            <ul className="tick-list">
              {campusAmbassadors.gains.map((g) => <li key={g}>{g}</li>)}
            </ul>
            <p className="small muted"><strong>{"Campus Ambassador protocol: "}</strong>{campusAmbassadors.protocol}</p>
          </div>
          <div className="actions">
            <FormButton href={campusAmbassadors.applyUrl} lang={lang} secondary>{"Apply as a Campus Ambassador"}</FormButton>
          </div>
        </section>

        <section id="contacts" aria-labelledby="contacts-h">
          <h2 id="contacts-h" style={{ marginBottom: "var(--s5)" }}>{"Questions? Contact us"}</h2>
          <div className="cards-3">
            {organizers.map((o) => (
              <div className="surface organizer" key={o.name}>
                <h3>{o.name}</h3>
                <p className="muted small">{o.role}</p>
                <ul className="contact-links">
                  <li><ContactLink kind="phone" value={o.phone} lang={lang} /></li>
                  <li><ContactLink kind="facebook" value={o.facebook} lang={lang} /></li>
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
