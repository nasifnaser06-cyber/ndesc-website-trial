import Link from "next/link";
import { type Locale, tr, path } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { CollegeCrest, ContactLink, Logo } from "./bits";

export default function Footer({ lang }: { lang: Locale }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <div className="footer-marks">
            <Logo size={64} alt={lang === "en" ? "Notre Dame Eco and Space Club logo" : "নটর ডেম ইকো অ্যান্ড স্পেস ক্লাবের লোগো"} />
            <CollegeCrest alt={lang === "en" ? "Notre Dame College, Dhaka crest" : "নটর ডেম কলেজ, ঢাকার প্রতীক"} />
          </div>
          <p className="footer-name">{tr(site.name, lang)}</p>
          <p className="small muted">{tr(ui.founded, lang)}</p>
          <p className="small muted">{tr(site.address, lang)}</p>
        </div>
        <div>
          <p className="label">{tr(ui.explore, lang)}</p>
          <ul>
            <li><Link href={path(lang, "/about")}>{tr(ui.nav.about, lang)}</Link></li>
            <li><Link href={path(lang, "/executives")}>{tr(ui.nav.executives, lang)}</Link></li>
            <li><Link href={path(lang, "/events")}>{tr(ui.nav.events, lang)}</Link></li>
            <li><Link href={path(lang, "/resources")}>{tr(ui.nav.resources, lang)}</Link></li>
          </ul>
        </div>
        <div>
          <p className="label">{tr(ui.takePart, lang)}</p>
          <ul>
            <li><Link href={path(lang, "/ness")}>{tr(ui.nav.ness, lang)}</Link></li>
            <li><Link href={path(lang, "/join")}>{tr(ui.nav.join, lang)}</Link></li>
            <li><Link href={path(lang, "/contact")}>{tr(ui.nav.contact, lang)}</Link></li>
          </ul>
        </div>
        <div>
          <p className="label">{tr(ui.follow, lang)}</p>
          <ul className="contact-links">
            <li><ContactLink kind="facebook" value={site.social.facebook} lang={lang} /></li>
            <li><ContactLink kind="instagram" value={site.social.instagram} lang={lang} /></li>
            {site.email && <li><ContactLink kind="email" value={site.email} lang={lang} /></li>}
          </ul>
        </div>
      </div>
      <div className="wrap footer-base">
        <p className="small muted">© {year} {tr(site.name, lang)}</p>
        <p className="small"><Link href={path(lang, "/privacy")}>{tr(ui.nav.privacy, lang)}</Link></p>
      </div>
    </footer>
  );
}
