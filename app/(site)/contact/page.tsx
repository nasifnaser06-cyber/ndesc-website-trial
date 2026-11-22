import { type Locale, tr } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { ContactLink, PageHead, T, ExternalLink } from "@/components/bits";

const title = { en: "Contact", bn: "যোগাযোগ" };
const lead = { en: "Questions about the summit, exhibiting, membership or press.", bn: "সামিট, প্রদর্শনী, সদস্যপদ বা সংবাদমাধ্যম বিষয়ে প্রশ্ন।" };

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/contact", title, lead);
}

export default async function Contact() {
  const lang: Locale = "en";
  const en = lang === "en";
  const topics = en
    ? ["NESS X", "Exhibiting or sponsoring", "Joining the club", "Press", "Something else"]
    : ["NESS X", "প্রদর্শনী বা স্পনসরশিপ", "ক্লাবে যোগদান", "সংবাদমাধ্যম", "অন্য কিছু"];
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap split">
        <div className="contact-list">
          <div>
            <p className="label">{en ? "Email" : "ইমেইল"}</p>
            <p>{site.email ? <ContactLink kind="email" value={site.email} lang={lang} /> : <T lang={lang} text={{ en: "[Club email, monitored by the moderator]", bn: "[ক্লাবের ইমেইল, মডারেটর দেখবেন]" }} />}</p>
          </div>
          <div>
            <p className="label">{en ? "Social" : "সোশ্যাল মিডিয়া"}</p>
            <ul className="contact-links">
              <li><ContactLink kind="facebook" value={site.social.facebook} lang={lang} /></li>
              <li><ContactLink kind="instagram" value={site.social.instagram} lang={lang} /></li>
            </ul>
          </div>
          <div>
            <p className="label">{en ? "Address" : "ঠিকানা"}</p>
            <p>{tr(site.address, lang)}</p>
            <p><a href={site.mapUrl} rel="noopener">{en ? "Open in Google Maps" : "গুগল ম্যাপে দেখুন"}</a></p>
          </div>
        </div>

        {site.forms.contactEndpoint ? (
          <form className="form" action={site.forms.contactEndpoint} method="post">
            <div><label htmlFor="name">{en ? "Your name" : "আপনার নাম"}</label><input id="name" name="name" type="text" autoComplete="name" required /></div>
            <div><label htmlFor="email">{en ? "Email" : "ইমেইল"}</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
            <div><label htmlFor="topic">{en ? "Topic" : "বিষয়"}</label><select id="topic" name="topic">{topics.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label htmlFor="message">{en ? "Message" : "বার্তা"}</label><textarea id="message" name="message" rows={6} required /></div>
            <div><button className="btn" type="submit">{en ? "Send message" : "বার্তা পাঠান"}</button></div>
          </form>
        ) : (
          <div className="surface" style={{ padding: "var(--s6)", alignSelf: "start" }}>
            <h2 style={{ fontSize: "1.375rem", marginBottom: "var(--s3)" }}>{en ? "Message form" : "বার্তা ফর্ম"}</h2>
            <p className="muted">
              {en ? "The online form opens once the club sets up its inbox. Until then, message the club on Facebook. " : "ক্লাবের ইনবক্স চালু হলে অনলাইন ফর্ম খুলবে। ততদিন ফেসবুকে ক্লাবকে বার্তা পাঠান। "}
            </p>
            <p style={{ marginTop: "var(--s4)" }}><ExternalLink className="btn btn-secondary" href={site.social.facebook} lang={lang}>{en ? "Message us on Facebook" : "ফেসবুকে বার্তা পাঠান"}</ExternalLink></p>
          </div>
        )}
      </div>
    </>
  );
}
