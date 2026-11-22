import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { photosphere, photosphereBanner } from "@/content/photosphere";
import { ContactLink, FormButton } from "@/components/bits";
import BgDrift from "@/components/BgDrift";

const title = { en: "Photosphere 7.0", bn: "Photosphere 7.0" };
const lead = {
  en: "The visual art competition and exhibition of NESS X. Astro and eco photography, poster design and AI art. Free to submit.",
  bn: "NESS X-এর দৃশ্যশিল্প প্রতিযোগিতা ও প্রদর্শনী। অ্যাস্ট্রো ও ইকো ফটোগ্রাফি, পোস্টার ডিজাইন ও এআই আর্ট। জমা দেওয়া বিনামূল্যে।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/ness/photosphere", title, lead, { src: photosphereBanner.social, alt: photosphereBanner.alt });
}

export default async function Photosphere() {
  const lang: Locale = "en";
  const p = photosphere;

  return (
    <>
      {/* Page background (trial, 20 Nov 2026): snowy peaks under the aurora and the Milky Way, behind a dark veil. */}
      <div
        className="ps-bg ps-four bg-drift"
        aria-hidden="true"
        style={{
          ["--bg-lg" as string]: `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ps-bg-2400.webp")`,
          ["--bg-sm" as string]: `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ps-bg-1600.webp")`,
        }}
      />
      <BgDrift />
      {/* Hero, laid out like the NESS X page: a short brief, key facts, then the two actions. */}
      <section className="sky sky-clear" aria-labelledby="ps-h1">
        <div className="wrap sky-inner" style={{ paddingBlock: "var(--s8) var(--s7)" }}>
          <div className="sky-copy">
            <h1 id="ps-h1" className="ps-logo-h1">
              {/* The Photosphere 7.0 logo stands in for the heading; its alt text is the heading's name. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ps7-logo-192.webp`}
                srcSet={[96, 192, 288].map((h) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ness/ps7-logo-${h}.webp ${h / 96}x`).join(", ")}
                alt={p.name}
                width={577}
                height={96}
                fetchPriority="high"
              />
            </h1>
            {/* Logo first, its line underneath (Mahmud, 23 Nov 2026). */}
            <p className="label logo-caption">Visual art competition and exhibition</p>
            <p>{p.brief}</p>
            <dl className="facts">
              <div><dt>Exhibition</dt><dd>28–30 January 2027</dd></div>
              <div><dt>Venue</dt><dd>Notre Dame College, Motijheel, Dhaka</dd></div>
              <div><dt>Initial Submission</dt><dd>Free</dd></div>
            </dl>
            <div className="actions">
              <a className="btn" href="#ps-submit">Submit Creation</a>
              <Link className="btn btn-secondary" href={path(lang, "/ness")}>Check out NESS X</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap ps-page">
        <section aria-labelledby="ps-about" className="ps-intro">
          <h2 id="ps-about">About Photosphere</h2>
          {p.intro.map((t) => <p key={t}>{t}</p>)}
        </section>

        <section aria-labelledby="ps-cats">
          <h2 id="ps-cats">Categories</h2>
          <div className="table-scroll">
            <table>
              <thead><tr><th scope="col">Code</th><th scope="col">Category</th><th scope="col">Who</th></tr></thead>
              <tbody>
                {p.categories.map((c) => (
                  <tr key={c.code}><td className="ps-code">{c.code}</td><td>{c.name}</td><td>{c.who}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="ps-submit" aria-labelledby="ps-seg">
          <h2 id="ps-seg">Segments and submission</h2>
          <p className="muted ps-note">Each segment has its own Google Form. Rename your files first (see below), or they won&apos;t be accepted.</p>
          <div className="ps-segments">
            {p.segments.map((s) => (
              <article className="surface ps-segment" key={s.name}>
                <div className="ps-seg-head">
                  <h3>{s.name}</h3>
                  <span className="segment-tags">{s.cats.map((c) => <span key={c} className="tag">{c}</span>)}</span>
                </div>
                <p className="muted">{s.desc}</p>
                <FormButton href={s.form} lang={lang}>Submit {s.name}</FormButton>
              </article>
            ))}
          </div>
        </section>

        <section id="ps-rename" aria-labelledby="ps-ren" className="surface ps-rename">
          <h2 id="ps-ren">Rename every file before you upload</h2>
          <p><strong>Files that aren&apos;t named in this format won&apos;t be accepted.</strong></p>
          <p className="ps-format"><code>{p.renaming.format}</code></p>
          <p className="muted small">Number your files in order: 01, 02, 03 and so on. For example:</p>
          <ul className="ps-examples">
            {p.renaming.examples.map((e) => <li key={e}><code>{e}</code></li>)}
          </ul>
        </section>

        <section id="ps-rules" aria-labelledby="ps-rul">
          <h2 id="ps-rul">Submission rules</h2>
          <div className="ps-rule-groups">
            {p.rules.map((g, i) => (
              <div key={g.title} className="ps-rule-group">
                <h3>{i + 1}. {g.title}</h3>
                <ul className="ps-list">
                  {g.items.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="ps-fee">
          <h2 id="ps-fee">Fee, exhibition and pass</h2>
          <ul className="ps-list">
            {p.fee.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>

        <section aria-labelledby="ps-contact">
          <h2 id="ps-contact">Questions? Contact us</h2>
          <div className="cards-3">
            {p.organizers.map((o) => (
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
