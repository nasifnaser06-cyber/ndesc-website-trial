import Link from "next/link";
import { type Locale, tr, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { getEvent, ness2027Banner } from "@/content/events";
import { nessSchedule, showNessSchedule } from "@/content/club";
import { nessx, passes, passNote, registerWays, categories, categoryNote, winnersNote, soloSegments, teamSegments, specialSegments, programmes, organizers, type Segment } from "@/content/ness2027";
import { ContactLink, ExternalLink, Stars, T, RegisterButton } from "@/components/bits";

const title = { en: "NESS X", bn: "NESS X" };
const description = {
  en: "NESS X, the 10th National Earth and Space Summit: 28–30 January 2027 at Notre Dame College, Dhaka. Olympiads, quizzes, team contests, exhibitions and talks. Register now.",
  bn: "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট ২০২৭, ২৮–৩০ জানুয়ারি, নটর ডেম কলেজ, ঢাকা। অলিম্পিয়াড, কুইজ, দলীয় প্রতিযোগিতা, আলোচনা ও প্রদর্শনী।",
};

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
              {g.online && <span className="tag tag-up">{lang === "en" ? "Online" : "অনলাইন"}</span>}
            </span>
          </summary>
          {g.desc.map((d) => <p key={d}>{d}</p>)}
          {g.parts && (
            <ul className="segment-parts">
              {g.parts.map((p) => (
                <li key={p.name}><strong>{p.name}</strong> <span className="small">({p.cats.join(", ")})</span>: {p.desc}</li>
              ))}
            </ul>
          )}
          {g.page && (
            <p><Link href={path(lang, g.page)}>{lang === "en" ? `Rules, renaming and submission links: ${g.name} page` : `${g.name}: নিয়ম ও জমার লিংক`}</Link></p>
          )}
        </details>
      ))}
    </div>
  );
}

export default async function Ness() {
  const lang: Locale = "en";
  const en = lang === "en";
  const ness = getEvent("ness-x")!;

  return (
    <>
      {/* Page background (trial, 20 Nov 2026): polar bears under the aurora, behind a white veil; the page uses dark text. */}
      <div
        className="ness-bg ness-three"
        aria-hidden="true"
        style={{
          ["--bg-lg" as string]: `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ness-bg-2400.webp")`,
          ["--bg-sm" as string]: `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ness-bg-1600.webp")`,
        }}
      />
      <section className="sky sky-clear" aria-labelledby="ness-h1">
        <Stars />
        <div className="wrap sky-inner" style={{ paddingBlock: "var(--s8) var(--s7)" }}>
          <div className="sky-copy">
            <h1 id="ness-h1" className="ness-logo-h1">
              {/* The NESS logo stands in for the "NESS X" heading; its alt text is the heading's name. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/nessx-logo-dark-360.webp`}
                srcSet={[180, 360, 540].map((h) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/nessx-logo-dark-${h}.webp ${h}x`.replace(`${h}x`, `${h / 180}x`)).join(", ")}
                alt={nessx.name}
                width={166}
                height={180}
                fetchPriority="high"
              />
            </h1>
            {/* Logo first, its line underneath (Mahmud, 23 Nov 2026). */}
            <p className="label logo-caption">{nessx.fullName}</p>
            <p>{nessx.intro}</p>
            <dl className="facts">
              <div><dt>{tr(ui.dates, lang)}</dt><dd>{formatDateRange(ness.start, ness.end, lang, "long")}</dd></div>
              <div><dt>{tr(ui.venue, lang)}</dt><dd>{en ? "Notre Dame College, Motijheel, Dhaka" : "নটর ডেম কলেজ, মতিঝিল, ঢাকা"}</dd></div>
            </dl>
            <div className="actions">
              <RegisterButton lang={lang}>{en ? "Register now" : "এখনই নিবন্ধন করুন"}</RegisterButton>
              <a className="btn btn-secondary" href="#segments">{en ? "See all segments" : "সব সেগমেন্ট দেখুন"}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s9)", paddingTop: "var(--s8)" }}>
        <section aria-labelledby="passes-h">
          <h2 id="passes-h" style={{ marginBottom: "var(--s5)" }}>{en ? "Passes" : "পাস"}</h2>
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
          <h2 id="reg" style={{ marginBottom: "var(--s5)" }}>{en ? "How to register" : "যেভাবে নিবন্ধন করবেন"}</h2>
          <ol className="steps">
            {registerWays.map((w) => (
              <li key={w.who}><p><strong>{w.who}</strong></p><p className="muted small">{w.how}</p></li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cats">
          <h2 id="cats" style={{ marginBottom: "var(--s4)" }}>{en ? "Categories" : "বিভাগ"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s4)", maxWidth: "70ch" }}>{categoryNote}</p>
          <div className="table-scroll">
            <table>
              <thead><tr><th scope="col">{en ? "Code" : "কোড"}</th><th scope="col">{en ? "Category" : "বিভাগ"}</th><th scope="col">{en ? "Class" : "শ্রেণি"}</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.code}><td style={{ fontFamily: "var(--font-head)", fontWeight: "var(--weight-head)" }}>{c.code}</td><td>{c.name}</td><td>{c.who}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: "var(--s4)", maxWidth: "70ch" }}><strong>{en ? "Winners. " : "বিজয়ী। "}</strong>{winnersNote}</p>
        </section>

        <section id="segments" aria-labelledby="seg-h">
          <h2 id="seg-h" style={{ marginBottom: "var(--s3)" }}>{en ? "Segments" : "সেগমেন্ট"}</h2>
          <p className="muted" style={{ maxWidth: "70ch" }}>
            {en ? "Open a segment to read what it involves. The letters show which categories can enter. Full rules for each segment come in its own post on " : "প্রতিটি সেগমেন্টের বিস্তারিত দেখতে খুলুন। "}
            <ExternalLink href={site.social.facebook} lang={lang}>{en ? "the club's Facebook page" : "ফেসবুক পেজ"}</ExternalLink>.
          </p>
          <div className="segment-groups">
            <div>
              <h3>{en ? "Solo" : "একক"}</h3>
              <SegmentList items={soloSegments} lang={lang} />
            </div>
            <div>
              <h3>{en ? "Team (up to 3 members)" : "দলীয় (সর্বোচ্চ ৩ জন)"}</h3>
              <SegmentList items={teamSegments} lang={lang} />
              <h3 style={{ marginTop: "var(--s6)" }}>{en ? "Special" : "বিশেষ"}</h3>
              <SegmentList items={specialSegments} lang={lang} />
            </div>
          </div>
        </section>

        <section aria-labelledby="prog-h">
          <h2 id="prog-h" style={{ marginBottom: "var(--s3)" }}>{en ? "Exhibitions and programmes" : "প্রদর্শনী ও অনুষ্ঠান"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>{en ? "Open to everyone with a solo or team pass." : "একক বা দলীয় পাস থাকলেই সবার জন্য খোলা।"}</p>
          <div className="groups">
            {programmes.map((g) => (
              <div key={g.name}>
                <h3>{g.name.includes("Photosphere") ? <Link href={path(lang, "/ness/photosphere")}>{g.name}</Link> : g.name}</h3>
                <p className="muted small">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {showNessSchedule && (
        <section aria-labelledby="schedule">
          <h2 id="schedule" style={{ marginBottom: "var(--s5)" }}>{en ? "Schedule" : "সময়সূচি"}</h2>
          <div className="cards-3">
            {nessSchedule.map((d) => (
              <div className="surface" key={d.day.en}>
                <h3>{tr(d.day, lang)}</h3>
                <p className="muted small"><T text={d.plan} lang={lang} /></p>
              </div>
            ))}
          </div>
        </section>
        )}

        <section id="exhibit" className="surface panel-band" aria-labelledby="exh">
          <div>
            <p className="label">{en ? "For External Organizations" : "বাইরের প্রতিষ্ঠানের জন্য"}</p>
            <h2 id="exh">{en ? "Showcase Your Project or Organization at NESS" : "NESS-এ আপনার প্রকল্প বা প্রতিষ্ঠান তুলে ধরুন"}</h2>
            <p className="muted">
              {en
                ? "Academic institutions, research teams, external student clubs and companies can book an exhibition stall on our event premises and partner with NESS to showcase their projects, products, programs and innovations or host dedicated seminars and workshops for thousands of attending students and families."
                : "শিক্ষাপ্রতিষ্ঠান, গবেষণা দল, বাইরের শিক্ষার্থী ক্লাব ও প্রতিষ্ঠান আমাদের আয়োজনস্থলে প্রদর্শনী স্টল নিয়ে NESS-এর সঙ্গে অংশীদার হয়ে তাদের প্রকল্প, পণ্য, কার্যক্রম ও উদ্ভাবন তুলে ধরতে পারে, অথবা হাজারো শিক্ষার্থী ও পরিবারের জন্য সেমিনার ও কর্মশালা আয়োজন করতে পারে।"}
            </p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={path(lang, "/contact")}>{en ? "Contact for Exhibition" : "প্রদর্শনীর জন্য যোগাযোগ"}</Link>
          </div>
        </section>

        <section id="contacts" aria-labelledby="contacts-h">
          <h2 id="contacts-h" style={{ marginBottom: "var(--s5)" }}>{en ? "Questions? Contact us" : "প্রশ্ন? আমাদের সঙ্গে যোগাযোগ করুন"}</h2>
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
