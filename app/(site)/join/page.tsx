import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { PageHead, FormButton, T } from "@/components/bits";

const title = { en: "Join the club", bn: "ক্লাবে যোগ দিন" };
const lead = {
  en: "Help run the National Earth and Space Summit, go stargazing and compete for the college.",
  bn: "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট আয়োজনে হাত লাগাও, তারা দেখো, কলেজের হয়ে প্রতিযোগিতায় নামো।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/join", title, lead);
}

export default async function Join() {
  const lang: Locale = "en";
  const en = lang === "en";
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <section className="two-worlds">
          <div>
            <h2>{en ? "Who can join" : "কারা যোগ দিতে পারবে"}</h2>
            <p className="muted"><T lang={lang} text={{ en: "Notre Dame College students. [Which years, and when]", bn: "নটর ডেম কলেজের শিক্ষার্থীরা। [কোন বর্ষ, কখন]" }} /></p>
          </div>
          <div>
            <h2>{en ? "What you get" : "যা পাবে"}</h2>
            <ul className="muted" style={{ display: "grid", gap: "var(--s2)" }}>
              <li>{en ? "Workshops and seminars on astronomy and the environment" : "জ্যোতির্বিজ্ঞান ও পরিবেশ বিষয়ে কর্মশালা ও সেমিনার"}</li>
              <li>{en ? "Stargazing camps and field tours" : "তারা দেখার ক্যাম্প ও ফিল্ড ট্যুর"}</li>
              <li>{en ? "A place in olympiad and contest teams" : "অলিম্পিয়াড ও প্রতিযোগিতার দলে জায়গা"}</li>
              <li>{en ? "A role in organising NESS and Cosmoterrium" : "NESS ও কসমোটেরিয়াম আয়োজনে ভূমিকা"}</li>
            </ul>
          </div>
        </section>
        <section aria-labelledby="how">
          <h2 id="how" style={{ marginBottom: "var(--s4)" }}>{en ? "How to join" : "যেভাবে যোগ দেবে"}</h2>
          <ol className="steps" style={{ gridTemplateColumns: "1fr", maxWidth: "60ch" }}>
            <li><T lang={lang} text={{ en: "[Step 1, e.g. fill in the entry form]", bn: "[ধাপ ১, যেমন ভর্তি ফর্ম পূরণ]" }} /></li>
            <li><T lang={lang} text={{ en: "[Step 2, fee and deadline]", bn: "[ধাপ ২, ফি ও শেষ তারিখ]" }} /></li>
            <li><T lang={lang} text={{ en: "[Step 3, ID card and group chat]", bn: "[ধাপ ৩, আইডি কার্ড ও গ্রুপ চ্যাট]" }} /></li>
          </ol>
          <div className="actions" style={{ marginTop: "var(--s5)" }}>
            <FormButton href={site.forms.join} lang={lang}>{en ? "Fill in the entry form" : "ভর্তি ফর্ম পূরণ করো"}</FormButton>
          </div>
        </section>
        <section className="surface panel-band">
          <div>
            <h3>{en ? "From another school or an organisation?" : "অন্য প্রতিষ্ঠান থেকে?"}</h3>
            <p className="muted small">{en ? "Compete or exhibit at the National Earth and Space Summit." : "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিটে প্রতিযোগিতা বা প্রদর্শনী করুন।"}</p>
          </div>
          <Link className="btn btn-secondary" href={path(lang, "/ness")}>{en ? "Go to NESS X" : "NESS X-এ যান"}</Link>
        </section>
      </div>
    </>
  );
}
