import Link from "next/link";
import { type Locale, tr, path, formatDateRange, num } from "@/lib/i18n";
import { meta, eventRow, eventLabels } from "@/lib/view";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { sortedEvents, getEvent, ness2027Banner } from "@/content/events";
import { timeline } from "@/content/club";
import { posts, newsCategories } from "@/content/news";
import { Banner, FormButton, PhotoSlot, SectionHead, Stars, T, RegisterButton } from "@/components/bits";
import { EventRows } from "@/components/EventList";


const description = {
  en: "The Notre Dame Eco and Space Club at Notre Dame College, Dhaka: astronomy, ecology and the National Earth and Space Summit, since 1992.",
  bn: "নটর ডেম কলেজ, ঢাকার নটর ডেম ইকো অ্যান্ড স্পেস ক্লাব: জ্যোতির্বিজ্ঞান, পরিবেশ আর ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট, ১৯৯২ থেকে।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/", null, description);
}

export default async function Home() {
  const lang: Locale = "en";
  const ness = getEvent("ness-2027")!;
  const latest = sortedEvents().slice(0, 3).map((e) => eventRow(e, lang));
  const en = lang === "en";

  return (
    <>
      <section className="sky" aria-labelledby="hero-title">
        <Stars />
        <div className="wrap sky-inner">
          <div className="sky-copy">
            <p className="label">{en ? "At Notre Dame College, Dhaka, since 1992" : "নটর ডেম কলেজ, ঢাকা, ১৯৯২ থেকে"}</p>
            <h1 id="hero-title">
              {en ? "Look up. Then look after the ground under your feet." : "আকাশের দিকে তাকাও। তারপর পায়ের নিচের মাটির যত্ন নাও।"}
            </h1>
            <p>
              {en
                ? "The Eco and Space Club brings students together to study the night sky and protect the living world, through olympiads, workshops, stargazing camps and the National Earth and Space Summit."
                : "অলিম্পিয়াড, কর্মশালা, তারা দেখার ক্যাম্প আর ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিটের মাধ্যমে ইকো অ্যান্ড স্পেস ক্লাব শিক্ষার্থীদের রাতের আকাশ চেনা আর জীবজগৎ রক্ষার কাজে একসঙ্গে করে।"}
            </p>
            <div className="actions">
              <Link className="btn" href={path(lang, "/ness")}>{tr(ui.seeNess, lang)}</Link>
              <Link className="btn btn-secondary" href={path(lang, "/join")}>{tr(ui.nav.join, lang)}</Link>
            </div>
          </div>
          <div className="sky-media">
            <PhotoSlot tall lang={lang} label={{ en: "a real club stargazing night or the NESS crowd", bn: "ক্লাবের তারা দেখার রাত বা NESS-এর ভিড়ের আসল ছবি" }} />
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="ness-title">
        <div className="surface panel-band has-banner">
          <Link href={path(lang, "/ness")} className="band-banner" tabIndex={-1} aria-hidden="true">
            <Banner lang={lang} {...ness2027Banner} alt={{ en: "", bn: "" }} sizes="(min-width: 1280px) 1216px, 100vw" />
          </Link>
          <div>
            <p className="label">{en ? "Registration open" : "নিবন্ধন চলছে"}</p>
            <h2 id="ness-title">{tr(ness.title, lang)}</h2>
            <p className="muted">{tr(ness.summary, lang)}</p>
            <dl className="facts">
              <div><dt>{tr(ui.dates, lang)}</dt><dd>{formatDateRange(ness.start, ness.end, lang, "long")}</dd></div>
              <div><dt>{tr(ui.venue, lang)}</dt><dd>{en ? "Notre Dame College, Motijheel" : "নটর ডেম কলেজ, মতিঝিল"}</dd></div>
              <div><dt>{tr(ui.edition, lang)}</dt><dd><T lang={lang} text={{ en: "10th", bn: "১০ম" }} /></dd></div>
            </dl>
          </div>
          <div className="actions">
            <RegisterButton lang={lang}>{en ? "Register now" : "এখনই নিবন্ধন করুন"}</RegisterButton>
            <Link className="btn btn-secondary" href={path(lang, "/ness")}>{en ? "Segments and passes" : "সেগমেন্ট ও পাস"}</Link>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="worlds-title">
        <div className="stack" style={{ marginBottom: "var(--s6)" }}>
          <h2 id="worlds-title">{en ? "One club. Two worlds." : "এক ক্লাব। দুই জগৎ।"}</h2>
          <p className="lead">{en ? "The club began in 1992 to protect wildlife and biodiversity. Today it looks up as well." : "১৯৯২ সালে বন্যপ্রাণী ও জীববৈচিত্র্য রক্ষার লক্ষ্য নিয়ে ক্লাবের যাত্রা। এখন চোখ আকাশেও।"}</p>
        </div>
        <div className="two-worlds">
          <div>
            <PhotoSlot lang={lang} label={{ en: "a telescope session or a member's astrophotography", bn: "টেলিস্কোপ সেশন বা সদস্যের অ্যাস্ট্রোফটোগ্রাফি" }} />
            <h3>{en ? "The sky" : "আকাশ"}</h3>
            <p className="muted">{en ? "Astronomy olympiads, stargazing camps, astrophotography, the Astral Hunt and talks from olympiad medallists." : "জ্যোতির্বিজ্ঞান অলিম্পিয়াড, তারা দেখার ক্যাম্প, অ্যাস্ট্রোফটোগ্রাফি, অ্যাস্ট্রাল হান্ট আর অলিম্পিয়াড পদকজয়ীদের আলোচনা।"}</p>
          </div>
          <div>
            <PhotoSlot lang={lang} label={{ en: "a field tour or an eco project display", bn: "ফিল্ড ট্যুর বা ইকো প্রজেক্ট প্রদর্শনী" }} />
            <h3>{en ? "The ground" : "মাটি"}</h3>
            <p className="muted">{en ? "Earth science, biology and climate olympiads, eco project displays, field tours and work on biodiversity." : "ভূবিজ্ঞান, জীববিজ্ঞান ও জলবায়ু অলিম্পিয়াড, ইকো প্রজেক্ট প্রদর্শনী, ফিল্ড ট্যুর আর জীববৈচিত্র্য নিয়ে কাজ।"}</p>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="events-title">
        <div className="section-head">
          <h2 id="events-title">{tr(ui.nav.events, lang)}</h2>
          <Link href={path(lang, "/events")}>{tr(ui.allEvents, lang)}</Link>
        </div>
        <EventRows items={latest} labels={eventLabels(lang)} />
      </section>

      <section className="wrap section" aria-labelledby="since-title">
        <div className="section-head">
          <h2 id="since-title">{en ? "Since 1992" : "১৯৯২ থেকে"}</h2>
          <Link href={path(lang, "/about")}>{tr(ui.ourStory, lang)}</Link>
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

      <section className="wrap section" aria-labelledby="news-title">
        <SectionHead title={ui.nav.news} link={{ label: ui.allNews, to: "/news" }} lang={lang} />
        <div className="grid-3">
          {posts.slice(0, 3).map((p) => (
            <Link key={p.slug} className="card-link" href={path(lang, `/news/${p.slug}`)}>
              <p className="label">{tr(newsCategories[p.category], lang)}, {formatDateRange(p.date, undefined, lang)}</p>
              <h3>{tr(p.title, lang)}</h3>
              <p className="muted small">{tr(p.summary, lang)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
