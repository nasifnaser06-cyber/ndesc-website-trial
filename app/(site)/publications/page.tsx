import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { durbin, articles } from "@/content/publications";
import { resources, resourceKinds } from "@/content/club";
import { PageHead } from "@/components/bits";

const title = "Publications";
const lead = "NDESC's library: the DURBIN magazine, long-form science articles and educational resources.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/publications", title, lead);
}

export default async function Publications() {
  const lang: Locale = "en";
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const issues = [...durbin.issues].sort((a, b) => b.year.localeCompare(a.year));
  const fileUrl = (u: string) => (u.startsWith("/") ? `${bp}${u}` : u);

  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <nav aria-label={"Sections"} className="chips">
          <a className="chip" href="#durbin" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>DURBIN Magazine</a>
          <a className="chip" href="#articles" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{"Scientific articles"}</a>
          <a className="chip" href="#resources" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{"Educational resources"}</a>
        </nav>

        <section id="durbin" aria-labelledby="h-durbin">
          <h2 id="h-durbin" style={{ marginBottom: "var(--s3)" }}>DURBIN Magazine</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>{durbin.about}</p>
          {issues.length === 0 ? (
            <p className="empty">{"Issues of DURBIN will be added here to read and download."}</p>
          ) : (
            <ul className="ff-grid">
              {issues.map((d) => (
                <li key={d.title}>
                  <div className="ff-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {d.cover && <img src={fileUrl(d.cover)} alt={`Cover of ${d.title}`} width={400} height={400} loading="lazy" style={{ aspectRatio: "3 / 4" }} />}
                    <span className="ff-meta">{d.year}{d.editors ? ` · ${d.editors}` : ""}</span>
                    <h3>{d.title}</h3>
                    {d.description && <p>{d.description}</p>}
                    {d.pdf && <a className="btn btn-secondary btn-small" href={fileUrl(d.pdf)} download>{"Download PDF"}{d.fileInfo ? ` (${d.fileInfo})` : ""}</a>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="articles" aria-labelledby="h-articles">
          <h2 id="h-articles" style={{ marginBottom: "var(--s3)" }}>{"Scientific articles"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>
            {"Long-form science writing and research explanations by NDESC members. For short weekly science facts, see "}
            <Link href={path(lang, "/factsfriday")}>FactsFriday</Link>.
          </p>
          {articles.length === 0 ? (
            <p className="empty">{"Articles will be added here as they are published."}</p>
          ) : (
            <ul className="event-list">
              {articles.map((a) => (
                <li className="event-row" key={a.url}>
                  <p className="event-date">{a.date}</p>
                  <div className="event-main"><h3 style={{ fontSize: "1.125rem" }}><a href={fileUrl(a.url)}>{a.title}</a></h3><p className="small muted">{a.summary}{a.author ? ` · ${a.author}` : ""}</p></div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="resources" aria-labelledby="h-resources">
          <h2 id="h-resources" style={{ marginBottom: "var(--s3)" }}>{"Educational resources"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>
            {"Olympiad papers, workshop handouts and sky guides. The same list lives on the "}
            <Link href={path(lang, "/resources")}>{"Resources page"}</Link>.
          </p>
          {resources.length === 0 ? (
            <p className="empty">{"Resources will be added here to download."}</p>
          ) : (
            <ul className="event-list">
              {resources.map((r) => (
                <li className="event-row" key={r.url}>
                  <p className="event-date">{r.year}</p>
                  <div className="event-main"><h3 style={{ fontSize: "1.125rem" }}><a href={fileUrl(r.url)}>{r.title}</a></h3><p className="small muted">{resourceKinds[r.kind]}</p></div>
                  <p className="small muted">{r.format}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
