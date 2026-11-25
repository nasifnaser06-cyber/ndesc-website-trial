"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import FactsCarousel, { cameByHistory } from "@/components/FactsCarousel";
import type { FactsCard } from "@/lib/factsCards";

export type { FactsCard };

type Filters = { q: string; cat: string; year: string };
type Saved = Filters & { slug: string; y: number };

/** The archive's state, kept for this browser tab so Back or "All FactsFriday posts" returns to it. */
export const FF_STATE_KEY = "ndesc-ff-archive";
/** Set by an article page when its "All FactsFriday posts" or breadcrumb link is used. */
export const FF_RETURN_KEY = "ndesc-ff-return";

function filterItems(items: FactsCard[], { q, cat, year }: Filters) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((f) => (!cat || f.category === cat) && (!year || f.year === year) && words.every((w) => f.haystack.includes(w)));
}

function readSaved(): Saved | null {
  try {
    const v = JSON.parse(sessionStorage.getItem(FF_STATE_KEY) || "null");
    return v && typeof v.slug === "string" ? v : null;
  } catch { return null; }
}

// The document's first page: a Back/Forward full load of the archive counts as a return too.
const loadPath = typeof window !== "undefined" ? window.location.pathname : "";
let archiveMounts = 0;

function isReturning(): boolean {
  let flag = false;
  try { flag = sessionStorage.getItem(FF_RETURN_KEY) === "1"; sessionStorage.removeItem(FF_RETURN_KEY); } catch { /* private mode */ }
  if (cameByHistory()) flag = true;
  if (archiveMounts === 0 && window.location.pathname === loadPath) {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "back_forward") flag = true;
  }
  return flag;
}

/** FactsFriday archive: search, category and year filters over one centre-focused carousel, newest first.
    The cards are plain links in the page HTML, so the archive still works if the script never runs. */
export default function FactsFridayArchive({ items, categories, years }: { items: FactsCard[]; categories: { key: string; label: string }[]; years: string[] }) {
  const [filters, setFilters] = useState<Filters>({ q: "", cat: "", year: "" });
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug ?? "");
  const shown = useMemo(() => filterItems(items, filters), [items, filters]);
  const centred = shown.some((s) => s.slug === activeSlug) ? activeSlug : shown[0]?.slug;
  const pending = useRef<Saved | null>(null);
  const live = useRef({ filters, activeSlug });
  live.current = { filters, activeSlug };

  const save = (y = window.scrollY) => {
    try {
      const { filters: f, activeSlug: a } = live.current;
      sessionStorage.setItem(FF_STATE_KEY, JSON.stringify({ ...f, slug: a, y: Math.round(y) }));
    } catch { /* private mode */ }
  };

  // Coming back: put the filters and the centred post back before the first paint.
  useLayoutEffect(() => {
    const saved = readSaved();
    const back = isReturning();
    archiveMounts++;
    if (saved && back) {
      pending.current = saved;
      (window as unknown as { __ndescKeepScroll?: boolean }).__ndescKeepScroll = true; // the header leaves the scroll alone
      setFilters({ q: saved.q || "", cat: saved.cat || "", year: saved.year || "" });
      setActiveSlug(saved.slug);
    } else {
      document.documentElement.classList.remove("ff-restoring");
    }
  }, []);

  // Once the restored state has rendered (the carousel has already jumped to the post), restore the page position.
  useLayoutEffect(() => {
    const p = pending.current;
    if (!p || p.slug !== activeSlug || p.q !== filters.q || p.cat !== filters.cat || p.year !== filters.year) return;
    pending.current = null;
    const to = () => window.scrollTo({ top: p.y || 0, left: 0, behavior: "instant" });
    to();
    requestAnimationFrame(() => { to(); requestAnimationFrame(to); });
    window.setTimeout(to, 120);
    document.documentElement.classList.remove("ff-restoring");
  }, [activeSlug, filters]);

  useEffect(() => { if (!pending.current) save(); }, [filters, activeSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let t = 0;
    const onScroll = () => { clearTimeout(t); t = window.setTimeout(() => { if (!pending.current) save(); }, 150); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(t); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function change(next: Partial<Filters>) {
    const nf = { ...filters, ...next };
    const list = filterItems(items, nf);
    if (!list.some((s) => s.slug === activeSlug) && list[0]) setActiveSlug(list[0].slug);
    setFilters(nf);
  }
  const reset = () => change({ q: "", cat: "", year: "" });
  const filtered = !!(filters.q || filters.cat || filters.year);

  return (
    <>
      <div className="wrap">
        <div className="ff-tools" role="search">
          <label className="visually-hidden" htmlFor="ff-q">Search FactsFriday</label>
          <input id="ff-q" type="search" placeholder="Search by topic, title or year" value={filters.q} onChange={(e) => change({ q: e.target.value })} autoComplete="off" />
          <label className="visually-hidden" htmlFor="ff-cat">Category</label>
          <select id="ff-cat" value={filters.cat} onChange={(e) => change({ cat: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <label className="visually-hidden" htmlFor="ff-year">Year</label>
          <select id="ff-year" value={filters.year} onChange={(e) => change({ year: e.target.value })}>
            <option value="">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <p className="ff-count" aria-live="polite">
          {filtered ? `${shown.length} of ${items.length} posts` : `${items.length} posts`}
        </p>
      </div>
      {shown.length === 0 ? (
        <div className="wrap ff-none">
          <p>No posts match that search. Try another word, or clear the filters.</p>
          <button type="button" className="btn btn-secondary btn-small" onClick={reset}>Clear filters</button>
        </div>
      ) : (
        <FactsCarousel
          items={shown}
          activeSlug={centred}
          onActiveChange={setActiveSlug}
          onOpen={() => save()}
          label="FactsFriday posts, newest first"
          flight
        />
      )}
    </>
  );
}
