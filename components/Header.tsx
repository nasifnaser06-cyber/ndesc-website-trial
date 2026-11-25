"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type Locale, path } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { Logo } from "./bits";
import IceButton from "./IceButton";

// Gallery and Resources left the header on 20 Nov 2026 (the pages still exist).
// News was taken off the site on 23 Nov 2026. Events moved into Explore on 23 Nov 2026 (the page stays).
const navItems = [
  { key: "nessX", to: "/ness" },
  { key: "photosphere", to: "/ness/photosphere" },
  { key: "explore", to: "/explore" },
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
  // A link tapped in the open menu closes the menu at once, so the header doesn't shrink under the reader.
  const onHeaderClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!open) return;
    const a = (e.target as HTMLElement).closest("a");
    if (!a || a.target === "_blank") return;
    setOpen(false);
  };
  // Every new page starts at its top (the logo and title), unless the link points at a #section or the
  // reader went Back/Forward (then the browser puts them where they were). Next.js's own scroll can land
  // part-way down pages with a fixed background picture (Photosphere opened at "About", 21 Nov 2026).
  const historyNav = useRef(false);
  useEffect(() => {
    const onPop = () => { historyNav.current = true; };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const firstRender = useRef(true);
  useEffect(() => {
    setOpen(false);
    if (firstRender.current) { firstRender.current = false; return; }
    if (historyNav.current) { historyNav.current = false; return; }
    // A page that restores its own scroll position (the FactsFriday archive on return) asks to be left alone.
    const w = window as unknown as { __ndescKeepScroll?: boolean };
    if (w.__ndescKeepScroll) { w.__ndescKeepScroll = false; return; }
    if (window.location.hash) return;
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    requestAnimationFrame(() => { toTop(); requestAnimationFrame(toTop); });
  }, [sub]);
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
  // At the very top the header is see-through and blends with the page; once the page scrolls under
  // it, it takes a soft glass tint of the same page colour so the menu stays readable.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      const h = header.current?.offsetHeight ?? 80;
      const dy = y - lastY;
      setScrolled(y > 4);
      if (y <= h) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      if (Math.abs(dy) > 6 || y <= h) lastY = y;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setHidden(false), [sub]);

  // The longest matching item wins, so /ness/photosphere marks Photosphere, not NESS X.
  const matches = (to: string) => sub === to || sub.startsWith(`${to}/`);
  // Explore stays lit on the sections it leads to (Events, FactsFriday, Olympiad Teams, Publications, Resources).
  const sections: [string, string][] = [
    ...navItems.map((i) => [i.to, i.to] as [string, string]),
    ["/contact", "/contact"],
    ...["/events", "/factsfriday", "/olympiad-teams", "/publications", "/resources"].map((p) => [p, "/explore"] as [string, string]),
  ];
  const best = sections.filter(([p]) => matches(p)).sort((a, b) => b[0].length - a[0].length)[0]?.[1];
  const isActive = (to: string) => to === best;

  return (
    <header className="site-header" ref={header} data-hidden={hidden && !open} data-solid={scrolled || open} onClickCapture={onHeaderClick}>
      <div className="wrap header-row">
        <Link href={path(lang)} className="brand">
          <Logo />
          <span className="brand-name">
            {(
              <>
                Notre Dame
                <br />
                Eco and Space Club
              </>
            )}
          </span>
        </Link>

        <nav aria-label={ui.mainNav} className="main-nav" id="main-nav" data-open={open}>
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={path(lang, item.to)} aria-current={isActive(item.to) ? "page" : undefined}>
                  {ui.nav[item.key]}
                </Link>
              </li>
            ))}
            <li className="only-menu">
              <Link href={path(lang, "/contact")} aria-current={isActive("/contact") ? "page" : undefined}>
                {ui.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-tools">
          {/* The "Register for NESS X" ice button (Mahmud, 20 Nov 2026). It opens the NESS X page
              (Mahmud, 24 Nov 2026), whose Register now button leads on to the registration form,
              so it is not shown on the NESS X page itself (Mahmud, 21 Nov 2026). */}
          {sub !== "/ness" && <IceButton href={path(lang, "/ness")} />}
          <button
            ref={menuButton}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? ui.menuClose : ui.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {/* Three bars that turn into an X when the menu is open (CSS, .menu-btn .bar). */}
              <path className="bar bar-1" d="M3 6h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path className="bar bar-2" d="M3 11h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path className="bar bar-3" d="M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {site.draft && (
        <p className="draft-ribbon">
          <span className="wrap">{ui.draft}</span>
        </p>
      )}
    </header>
  );
}
