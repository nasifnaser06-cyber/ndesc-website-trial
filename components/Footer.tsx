import { type Locale, tr } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { CollegeCrest, ContactLink, Logo } from "./bits";

export default function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <div className="footer-marks">
            <Logo size={40} alt={lang === "en" ? "Notre Dame Eco and Space Club logo" : "নটর ডেম ইকো অ্যান্ড স্পেস ক্লাবের লোগো"} />
            <CollegeCrest alt={lang === "en" ? "Notre Dame College, Dhaka crest" : "নটর ডেম কলেজ, ঢাকার প্রতীক"} />
          </div>
          <p className="footer-name">{tr(site.name, lang)}</p>
          <p className="small muted">{tr(ui.founded, lang)}</p>
        </div>
        <div className="footer-follow">
          <p className="label">{tr(ui.follow, lang)}</p>
          <ul className="contact-links">
            <li><ContactLink kind="facebook" value={site.social.facebook} lang={lang} /></li>
            <li><ContactLink kind="instagram" value={site.social.instagram} lang={lang} /></li>
            {site.email && <li><ContactLink kind="email" value={site.email} lang={lang} /></li>}
          </ul>
        </div>
        <div className="footer-visit">
          <p className="label">{lang === "en" ? "Visit us" : "আমাদের কাছে আসুন"}</p>
          <div className="footer-map">
            <iframe
              src={site.mapEmbed}
              title={lang === "en" ? "Map: Notre Dame College, Dhaka" : "মানচিত্র: নটর ডেম কলেজ, ঢাকা"}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Our own marker on top of Google's (shown on the Photosphere page, where the tinted map
                swallows Google's pin). It sits on the map centre, which is where the college is. */}
            <span className="footer-map-pin" aria-hidden="true">
              <svg viewBox="0 0 36 48" width="36" height="48">
                <path d="M18 2C9.2 2 2 9 2 17.6 2 29.4 18 46 18 46s16-16.6 16-28.4C34 9 26.8 2 18 2z" fill="#e2f2fc" stroke="#0b1c33" strokeWidth="2.5" />
                <circle cx="18" cy="17.5" r="6" fill="#0b1c33" />
              </svg>
            </span>
            {/* Photosphere only: the map starts still so our pin lines up. The first tap fades the pin
                and unlocks the map (zoom and drag); Google's own pin then marks the college. */}
            <input className="footer-map-unlock" id="footer-map-unlock" type="checkbox" />
            <label className="footer-map-cover" htmlFor="footer-map-unlock">
              <span className="footer-map-hint">{lang === "en" ? "Tap to zoom and move" : "জুম করতে ট্যাপ করুন"}</span>
            </label>
            <a className="footer-map-open" href={site.mapUrl} target="_blank" rel="noopener noreferrer">
              {lang === "en" ? "Open in Maps" : "ম্যাপে খুলুন"}
              <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6" /><path d="M10 14 20 4" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
              <span className="visually-hidden">{lang === "en" ? " (opens in a new tab)" : " (নতুন ট্যাবে খোলে)"}</span>
            </a>
          </div>
        </div>
      </div>
      <div className="wrap footer-base">
        <p className="small muted">© {tr(site.name, lang)}</p>
      </div>
    </footer>
  );
}
