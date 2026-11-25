import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { resources, resourceKinds, type ResourceKind } from "@/content/club";
import { PageHead, T } from "@/components/bits";
import { ui } from "@/content/ui";

const title = "Resources";
const lead = "Past questions, handouts and sky guides to practise and learn with.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/resources", title, lead);
}

export default async function Resources() {
  const lang: Locale = "en";
  const kinds = Object.keys(resourceKinds) as ResourceKind[];
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }, { label: ui.nav.publications, to: "/publications" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <nav aria-label={"Resource types"} className="chips">
          {kinds.map((k) => (
            <a key={k} className="chip" href={`#${k}`} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{resourceKinds[k]}</a>
          ))}
        </nav>
        {kinds.map((k) => {
          const items = resources.filter((r) => r.kind === k);
          return (
            <section key={k} id={k} aria-labelledby={`h-${k}`}>
              <h2 id={`h-${k}`} style={{ marginBottom: "var(--s4)" }}>{resourceKinds[k]}</h2>
              {items.length === 0 ? (
                <p className="empty">
                  <T lang={lang} text={"Nothing here yet. [Club to add files]"} />
                </p>
              ) : (
                <ul className="event-list">
                  {items.map((r) => (
                    <li className="event-row" key={r.url}>
                      <p className="event-date">{r.year}</p>
                      <div className="event-main"><h3 style={{ fontSize: "1.125rem" }}><a href={r.url.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${r.url}` : r.url}>{r.title}</a></h3></div>
                      <p className="small muted">{r.format}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
        <p className="small muted">
          {"Have notes or past papers to share? "}
          <Link href={path(lang, "/contact")}>{"Send them to the club"}</Link>.
        </p>
      </div>
    </>
  );
}
