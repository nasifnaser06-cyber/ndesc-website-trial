import Link from "next/link";
import { type Locale, path, formatDateRange, num } from "@/lib/i18n";
import { meta, eventRow, eventLabels } from "@/lib/view";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { sortedEvents, getEvent, ness2027Banner } from "@/content/events";
import { timeline } from "@/content/club";
import { nessx } from "@/content/ness2027";
import { Banner, PhotoSlot, Stars, T } from "@/components/bits";
import { EventRows } from "@/components/EventList";


const description = "The Notre Dame Eco and Space Club at Notre Dame College, Dhaka: astronomy, ecology and the National Earth and Space Summit, since 1992.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/", null, description);
}

// Tells Google the site's name and logo, for the name and icon beside ndesc.com in search results.
function siteJsonLd() {
  const origin = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://ndesc.com") + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  return JSON.stringify([
    { "@context": "https://schema.org", "@type": "WebSite", name: site.name, alternateName: [site.shortName, "Notre Dame Eco & Space Club"], url: `${origin}/` },
    {
      "@context": "https://schema.org", "@type": "Organization", name: site.name, alternateName: site.shortName, url: `${origin}/`,
      logo: `${origin}/brand/ndesc-logo-288.png`, foundingDate: site.founded, email: site.email ?? undefined,
      sameAs: [site.social.facebook, site.social.instagram],
    },
  ]).replace(/</g, "\\u003c");
}

export default async function Home() {
  const lang: Locale = "en";
  const ness = getEvent("ness-x")!;
  const latest = sortedEvents().slice(0, 3).map((e) => eventRow(e, lang));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteJsonLd() }} />
      <section className="sky" aria-labelledby="hero-title">
        <Stars />
        <div className="wrap sky-inner">
          <div className="sky-copy">
            <h1 id="hero-title">
              {"Somewhere something incredible is waiting to be discovered."}
            </h1>
            <p>
              {"The Notre Dame Eco and Space Club aims to spread knowledge of Astronomy, Earth Science and Biology and to provide a hub for like-minded students to venture beyond their academic syllabus and explore new realms of science."}
            </p>
            <div className="actions">
              <Link className="btn btn-secondary" href={path(lang, "/about")}>{"Learn more about us"}</Link>
            </div>
          </div>
          <div className="sky-media">
            <PhotoSlot tall lang={lang} label={"a real club stargazing night or the NESS crowd"} />
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="ness-title">
        <div className="surface panel-band has-banner">
          <Link href={path(lang, "/ness")} className="band-banner" tabIndex={-1} aria-hidden="true">
            <Banner lang={lang} {...ness2027Banner} alt={""} sizes="(min-width: 1280px) 1216px, 100vw" />
          </Link>
          <div>
            <p className="label">{"Registration open"}</p>
            <h2 id="ness-title">{nessx.name}</h2>
            <p className="muted">{ness.summary}</p>
            <dl className="facts">
              <div><dt>{ui.dates}</dt><dd>{formatDateRange(ness.start, ness.end, lang, "long")}</dd></div>
              <div><dt>{ui.venue}</dt><dd>{"Notre Dame College, Motijheel"}</dd></div>
              <div><dt>{ui.edition}</dt><dd><T lang={lang} text={"10th"} /></dd></div>
            </dl>
          </div>
          <div className="actions">
            <Link className="btn" href={path(lang, "/ness")}>{"See NESS X"}</Link>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="worlds-title">
        <div className="stack" style={{ marginBottom: "var(--s6)" }}>
          <h2 id="worlds-title">{"One club. Two worlds."}</h2>
          <p className="lead">{"The club started its journey in 1992 to study and protect life on Earth – its wildlife, ecosystems, and biodiversity. Today, it aims to study and research the cosmos beyond Earth as well."}</p>
        </div>
        <div className="two-worlds">
          <div>
            <PhotoSlot lang={lang} label={"a telescope session or a member's astrophotography"} />
            <h3>{"Beyond Earth"}</h3>
            <p className="muted">{"Astronomy Olympiads and the road to IOAA through NDESC Interstellar, stargazing and solar observation sessions, astrophotography and workshops on astronomical research."}</p>
          </div>
          <div>
            <PhotoSlot lang={lang} label={"a field tour or an eco project display"} />
            <h3>{"Within Earth"}</h3>
            <p className="muted">{"Olympiads in Earth Science, Biology and Climate with the road to IESO and IBO through NDESC Terrestrial and NDESC Helix, eco-research projects, field tours and workshops on biological and Earth sciences."}</p>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="events-title">
        <div className="section-head">
          <h2 id="events-title">{ui.nav.events}</h2>
          <Link href={path(lang, "/events")}>{ui.allEvents}</Link>
        </div>
        <EventRows items={latest} labels={eventLabels(lang)} />
      </section>

      <section className="wrap section" aria-labelledby="since-title">
        <div className="section-head">
          <h2 id="since-title">{"Since 1992"}</h2>
          <Link href={path(lang, "/about")}>{ui.ourStory}</Link>
        </div>
        <ol className="timeline">
          {timeline.map((t) => (
            <li key={t.year}>
              <span className="year">{num(t.year, lang)}</span>
              <span className="small muted"><T text={t.text} lang={lang} /></span>
            </li>
          ))}
        </ol>
      </section>

    </>
  );
}
