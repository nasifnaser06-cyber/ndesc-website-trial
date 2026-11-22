import { type Locale, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { categories, soloSegments, teamSegments } from "@/content/ness2027";
import { getEvent } from "@/content/events";
import RegisterForm, { type SegOption } from "@/components/RegisterForm";

const title = { en: "Registration for 10th National Earth and Space Summit", bn: "১০ম ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিটে নিবন্ধন" };
const lead = {
  en: "Pick your pass, pay by bKash, and get your pass by email.",
  bn: "পাস বেছে নিন, বিকাশে পেমেন্ট করুন, ইমেইলে পাস পান।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  const m = meta(lang, "/ness/register", title, lead);
  return site.registration.endpoint && !site.registration.trial ? m : { ...m, robots: { index: false } };
}

export default async function Register() {
  const lang: Locale = "en";
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const ness = getEvent("ness-x");
  const segments: SegOption[] = [
    ...soloSegments.map((s) => ({ name: s.name, cats: s.cats, online: !!s.online, team: false })),
    ...teamSegments.map((s) => ({ name: s.name, cats: s.cats, online: !!s.online, team: true })),
  ];
  return (
    <>
      {/* Same look as the NESS X page (Mahmud, 20 Nov 2026, trial): icy polar-bear background, clear hero, ice boxes. */}
      <div
        className="ness-bg ness-three"
        aria-hidden="true"
        style={{
          ["--bg-lg" as string]: `url("${bp}/ness/ness-bg-2400.webp")`,
          ["--bg-sm" as string]: `url("${bp}/ness/ness-bg-1600.webp")`,
        }}
      />
      <section className="sky sky-clear" aria-labelledby="reg-h1">
        <div className="wrap sky-inner" style={{ paddingBlock: "var(--s8) var(--s6)" }}>
          <div className="sky-copy">
            <h1 id="reg-h1">Registration for<br />10th National Earth and Space Summit</h1>
            {/* Date and venue in an ice box, each with an icon instead of a label (Mahmud, 20 Nov 2026, trial). */}
            <div className="surface reg-intro">
              <dl className="facts facts-icons">
                <div>
                  <dt>
                    <svg className="fact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span className="visually-hidden">Dates</span>
                  </dt>
                  <dd>{ness ? formatDateRange(ness.start, ness.end, lang, "long") : "28–30 January 2027"}</dd>
                </div>
                <div>
                  <dt>
                    <svg className="fact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="visually-hidden">Venue</span>
                  </dt>
                  <dd>Notre Dame College, Motijheel, Dhaka</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap reg-page">
        <RegisterForm
          endpoint={site.registration.endpoint}
          trial={site.registration.trial}
          fallback={{ bkash: site.registration.bkash, nagad: site.registration.nagad, prices: site.registration.prices }}
          googleForm={site.registerWith === "form" ? site.forms.nessRegister : null}
          categories={categories.filter((c) => c.code !== "C")}
          segments={segments}
          nessHref={path(lang, "/ness")}
        />
      </div>
    </>
  );
}
