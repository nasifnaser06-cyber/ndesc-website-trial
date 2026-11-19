"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type Locale, tr, path } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { Logo } from "./bits";
import IceButton from "./IceButton";

// Gallery and Resources left the header on 20 Nov 2026 (the pages still exist).
const navItems = [
  { key: "nessX", to: "/ness" },
  { key: "photosphere", to: "/ness/photosphere" },
  { key: "events", to: "/events" },
  { key: "news", to: "/news" },
  { key: "executives", to: "/executives" },
  { key: "about", to: "/about" },
] as const;

/** Strip the language from the current URL, e.g. /bn/events/ -> /events (English pages have no prefix). */
function useSubPath(lang: Locale) {
  const pathname = usePathname() || "/";
  const withoutLang = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), "");
  return withoutLang.replace(/\/+$/, "") || "/";
}

export default function Header({ lang }: { lang: Locale }) {
  const sub = useSubPath(lang);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Close the phone menu on navigation and with Escape.
  useEffect(() => setOpen(false), [sub]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Slide the header away while scrolling down, bring it back on any scroll up.
  const header = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      const h = header.current?.offsetHeight ?? 80;
      const dy = y - lastY;
      if (y <= h) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      if (Math.abs(dy) > 6 || y <= h) lastY = y;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setHidden(false), [sub]);

  // The longest matching item wins, so /ness/photosphere marks Photosphere, not NESS X.
  const matches = (to: string) => sub === to || sub.startsWith(`${to}/`);
  const best = [...navItems.map((i) => i.to as string), "/contact"].filter(matches).sort((a, b) => b.length - a.length)[0];
  const isActive = (to: string) => to === best;

  return (
    <header className="site-header" ref={header} data-hidden={hidden && !open}>
      <div className="wrap header-row">
        <Link href={path(lang)} className="brand">
          <Logo />
          <span className="brand-name">
            {lang === "en" ? (
              <>
                Notre Dame
                <br />
                Eco and Space Club
              </>
            ) : (
              <>
                নটর ডেম
                <br />
                ইকো অ্যান্ড স্পেস ক্লাব
              </>
            )}
          </span>
        </Link>

        <nav aria-label={tr(ui.mainNav, lang)} className="main-nav" id="main-nav" data-open={open}>
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={path(lang, item.to)} aria-current={isActive(item.to) ? "page" : undefined}>
                  {tr(ui.nav[item.key], lang)}
                </Link>
              </li>
            ))}
            <li className="only-menu">
              <Link href={path(lang, "/contact")} aria-current={isActive("/contact") ? "page" : undefined}>
                {tr(ui.nav.contact, lang)}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-tools">
          {/* No Register button on the Register page itself. */}
          {sub !== "/ness/register" &&
            (site.registerWith === "form" && site.forms.nessRegister ? (
              <IceButton href={site.forms.nessRegister} external note={tr(ui.newTab, lang)} />
            ) : (
              <IceButton href={path(lang, "/ness/register")} />
            ))}
          <button
            ref={menuButton}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={tr(open ? ui.menuClose : ui.menuOpen, lang)}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {open ? (
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {site.draft && (
        <p className="draft-ribbon">
          <span className="wrap">{tr(ui.draft, lang)}</span>
        </p>
      )}
    </header>
  );
}
