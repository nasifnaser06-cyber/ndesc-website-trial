import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { categories, soloSegments, teamSegments } from "@/content/ness2027";
import { PageHead } from "@/components/bits";
import RegisterForm, { type SegOption } from "@/components/RegisterForm";

const title = { en: "Register for NESS X", bn: "NESS X-এ নিবন্ধন" };
const lead = {
  en: "Pick your pass, choose your segments, pay by bKash, and get your pass by email.",
  bn: "পাস বেছে নিন, সেগমেন্ট বাছুন, বিকাশে পেমেন্ট করুন, ইমেইলে পাস পান।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  const m = meta(lang, "/ness/register", title, lead);
  return site.registration.endpoint && !site.registration.trial ? m : { ...m, robots: { index: false } };
}

export default async function Register() {
  const lang: Locale = "en";
  const segments: SegOption[] = [
    ...soloSegments.map((s) => ({ name: s.name, cats: s.cats, online: !!s.online, team: false })),
    ...teamSegments.map((s) => ({ name: s.name, cats: s.cats, online: !!s.online, team: true })),
  ];
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: { en: "NESS 2027", bn: "NESS ২০২৭" }, to: "/ness" }]} />
      <div className="wrap">
        <RegisterForm
          endpoint={site.registration.endpoint}
          trial={site.registration.trial}
          fallback={{ bkash: site.registration.bkash, nagad: site.registration.nagad, prices: site.registration.prices }}
          googleForm={site.registerWith === "form" ? site.forms.nessRegister : null}
          categories={categories.filter((c) => c.code !== "C")}
          segments={segments}
          privacyHref={path(lang, "/privacy")}
          nessHref={path(lang, "/ness")}
        />
      </div>
    </>
  );
}
