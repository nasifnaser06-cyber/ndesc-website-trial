import { type Locale } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { ContactLink, PageHead, T, ExternalLink } from "@/components/bits";

const title = "Contact";
const lead = "Questions about the summit, exhibiting, membership or press.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/contact", title, lead);
}

export default async function Contact() {
  const lang: Locale = "en";
  const topics = ["NESS X", "Exhibiting or sponsoring", "Joining the club", "Press", "Something else"];
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap split">
        <div className="contact-list">
          <div>
            <p className="label">{"Email"}</p>
            <p>{site.email ? <ContactLink kind="email" value={site.email} lang={lang} /> : <T lang={lang} text={"[Club email, monitored by the moderator]"} />}</p>
          </div>
          <div>
            <p className="label">{"Social"}</p>
            <ul className="contact-links">
              <li><ContactLink kind="facebook" value={site.social.facebook} lang={lang} /></li>
              <li><ContactLink kind="instagram" value={site.social.instagram} lang={lang} /></li>
            </ul>
          </div>
          <div>
            <p className="label">{"Address"}</p>
            <p>{site.address}</p>
            <p><a href={site.mapUrl} rel="noopener">{"Open in Google Maps"}</a></p>
          </div>
        </div>

        {site.forms.contactEndpoint ? (
          <form className="form" action={site.forms.contactEndpoint} method="post">
            <div><label htmlFor="name">{"Your name"}</label><input id="name" name="name" type="text" autoComplete="name" required /></div>
            <div><label htmlFor="email">{"Email"}</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
            <div><label htmlFor="topic">{"Topic"}</label><select id="topic" name="topic">{topics.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label htmlFor="message">{"Message"}</label><textarea id="message" name="message" rows={6} required /></div>
            <div><button className="btn" type="submit">{"Send message"}</button></div>
          </form>
        ) : (
          <div className="surface" style={{ padding: "var(--s6)", alignSelf: "start" }}>
            <h2 style={{ fontSize: "1.375rem", marginBottom: "var(--s3)" }}>{"Message form"}</h2>
            <p className="muted">
              {"The online form opens once the club sets up its inbox. Until then, message the club on Facebook. "}
            </p>
            <p style={{ marginTop: "var(--s4)" }}><ExternalLink className="btn btn-secondary" href={site.social.facebook} lang={lang}>{"Message us on Facebook"}</ExternalLink></p>
          </div>
        )}
      </div>
    </>
  );
}
