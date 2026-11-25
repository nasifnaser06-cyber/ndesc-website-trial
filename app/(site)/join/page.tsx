import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { PageHead, FormButton, T } from "@/components/bits";

const title = "Join the club";
const lead = "Help run the National Earth and Space Summit, go stargazing and compete for the college.";

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/join", title, lead);
}

export default async function Join() {
  const lang: Locale = "en";
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <section className="two-worlds">
          <div>
            <h2>{"Who can join"}</h2>
            <p className="muted"><T lang={lang} text={"Notre Dame College students. [Which years, and when]"} /></p>
          </div>
          <div>
            <h2>{"What you get"}</h2>
            <ul className="muted" style={{ display: "grid", gap: "var(--s2)" }}>
              <li>{"Workshops and seminars on astronomy and the environment"}</li>
              <li>{"Stargazing camps and field tours"}</li>
              <li>{"A place in olympiad and contest teams"}</li>
              <li>{"A role in organising NESS and Cosmoterrium"}</li>
            </ul>
          </div>
        </section>
        <section aria-labelledby="how">
          <h2 id="how" style={{ marginBottom: "var(--s4)" }}>{"How to join"}</h2>
          <ol className="steps" style={{ gridTemplateColumns: "1fr", maxWidth: "60ch" }}>
            <li><T lang={lang} text={"[Step 1, e.g. fill in the entry form]"} /></li>
            <li><T lang={lang} text={"[Step 2, fee and deadline]"} /></li>
            <li><T lang={lang} text={"[Step 3, ID card and group chat]"} /></li>
          </ol>
          <div className="actions" style={{ marginTop: "var(--s5)" }}>
            <FormButton href={site.forms.join} lang={lang}>{"Fill in the entry form"}</FormButton>
          </div>
        </section>
        <section className="surface panel-band">
          <div>
            <h3>{"From another school or an organisation?"}</h3>
            <p className="muted small">{"Compete or exhibit at the National Earth and Space Summit."}</p>
          </div>
          <Link className="btn btn-secondary" href={path(lang, "/ness")}>{"Go to NESS X"}</Link>
        </section>
      </div>
    </>
  );
}
