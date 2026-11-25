import { type Locale, num } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { officers, executiveSessions } from "@/content/club";
import { PageHead, PersonCard, Txt } from "@/components/bits";
import Tabs from "@/components/Tabs";

const title = "Executives";
const lead = "Meet the team behind the club's vision and initiatives. Introducing our Executive Committee — the dedicated individuals working together to lead, coordinate, and shape the journey ahead.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/executives", title, lead);
}

const sessionLabel = (s: string, lang: Locale) => (s);

export default async function Executives() {
  const lang: Locale = "en";
  const current = executiveSessions.find((s) => s.current) ?? executiveSessions[0];

  const officersPanel = (
    <div className="tab-section" role="region" aria-labelledby="h-officers">
      <h2 id="h-officers" className="tab-heading">{"Officers"}</h2>
      <div className="people">
        {officers.map((p, i) => <PersonCard key={i} lang={lang} {...p} />)}
      </div>
    </div>
  );

  // Group the current panel by wing, keeping the order the members are listed in.
  const wings: { wing: string | null; members: typeof current.members }[] = [];
  for (const m of current.members) {
    const key = m.department ? m.department : null;
    const group = wings.find((g) => g.wing === key);
    if (group) group.members.push(m);
    else wings.push({ wing: key, members: [m] });
  }

  const currentPanel = (
    <div className="tab-section" role="region" aria-labelledby="h-current">
      <h2 id="h-current" className="tab-heading">
        {"Executive Committee"} <span className="session-tag"><Txt>{sessionLabel(current.session, lang)}</Txt></span>
      </h2>
      <div className="wings">
        {wings.map((g) => (
          <section key={g.wing ?? "lead"} className="wing">
            {/* The Secretary General has no wing; his heading is "Boss-Man" (Mahmud, 20 Nov 2026). */}
            <h3 className="wing-name">{g.wing ?? "Boss-Man"}</h3>
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
      <PageHead lang={lang} kicker={"Meet the team"} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s7)" }}>
        <Tabs
          syncHash
          label={"Executives"}
          initial="current"
          tabs={[
            { id: "officers", label: "Officers", content: officersPanel },
            { id: "current", label: "Current", content: currentPanel },
          ]}
        />
      </div>
    </>
  );
}
