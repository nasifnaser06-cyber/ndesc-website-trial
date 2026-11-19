import { type Locale, tr, num } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { officers, executiveSessions } from "@/content/club";
import { ui } from "@/content/ui";
import { PageHead, PersonCard, Txt } from "@/components/bits";
import Tabs from "@/components/Tabs";

const title = { en: "Executives", bn: "কার্যনির্বাহী" };
const lead = {
  en: "The teachers who guide the club and the students who run it, session by session.",
  bn: "যে শিক্ষকেরা ক্লাবকে পথ দেখান আর যে শিক্ষার্থীরা প্রতি সেশনে ক্লাব পরিচালনা করেন।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/executives", title, lead);
}

const sessionLabel = (s: string, lang: Locale) => (lang === "bn" ? num(s, "bn") : s);

export default async function Executives() {
  const lang: Locale = "en";
  const en = lang === "en";
  const current = executiveSessions.find((s) => s.current) ?? executiveSessions[0];

  const officersPanel = (
    <div className="tab-section" role="region" aria-labelledby="h-officers">
      <h2 id="h-officers" className="tab-heading">{en ? "Officers" : "উপদেষ্টা ও মডারেটর"}</h2>
      <div className="people">
        {officers.map((p, i) => <PersonCard key={i} lang={lang} {...p} />)}
      </div>
    </div>
  );

  // Group the current panel by wing, keeping the order the members are listed in.
  const wings: { wing: string | null; members: typeof current.members }[] = [];
  for (const m of current.members) {
    const key = m.department ? tr(m.department, lang) : null;
    const group = wings.find((g) => g.wing === key);
    if (group) group.members.push(m);
    else wings.push({ wing: key, members: [m] });
  }

  const currentPanel = (
    <div className="tab-section" role="region" aria-labelledby="h-current">
      <h2 id="h-current" className="tab-heading">
        {en ? "Executive Committee" : "কার্যনির্বাহী পরিষদ"} <span className="session-tag"><Txt>{sessionLabel(current.session, lang)}</Txt></span>
      </h2>
      <div className="wings">
        {wings.map((g) => (
          <section key={g.wing ?? "lead"} className="wing" aria-label={g.wing ?? (en ? "Secretary General" : "মহাসচিব")}>
            {g.wing && <h3 className="wing-name">{g.wing}</h3>}
            <div className="people">
              {g.members.map((p, i) => <PersonCard key={i} lang={lang} {...p} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <PageHead lang={lang} kicker={{ en: "Meet the team", bn: "আমাদের দল" }} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s7)" }}>
        <Tabs
          syncHash
          label={en ? "Executives" : "কার্যনির্বাহী"}
          initial="current"
          tabs={[
            { id: "officers", label: en ? "Officers" : "উপদেষ্টা", content: officersPanel },
            { id: "current", label: en ? "Current" : "বর্তমান", content: currentPanel },
          ]}
        />
        <p className="small muted">{tr(ui.consentNote, lang)}</p>
      </div>
    </>
  );
}
