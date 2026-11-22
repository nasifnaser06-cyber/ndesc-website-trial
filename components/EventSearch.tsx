"use client";

/**
 * Events page search (23 Nov 2026): a Google-style search bar that replaces the old filter chips.
 * - Filters the list below on every keystroke (no Enter needed) and ranks it by relevance.
 * - Suggests up to 6 real events in a dropdown; clicking or Enter on one opens that event.
 * - WAI-ARIA combobox: input with aria-expanded / aria-controls / aria-activedescendant,
 *   a listbox of options, arrow keys, Enter, Escape; Tab moves on as normal.
 * - All / Upcoming / Past buttons under the bar narrow the list and the suggestions (added 23 Nov 2026).
 * - Without JavaScript every event still shows, in date order.
 */

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { EventRows, type EventRowData } from "./EventList";
import { prepare, search, highlightRanges, type SearchDoc } from "@/lib/eventSearch";

type Labels = Parameters<typeof EventRows>[0]["labels"];
type When = "all" | "upcoming" | "past";

const MAX_SUGGESTIONS = 6;
const EMPTY_SUGGESTIONS = 4; // a few real events when the box is focused but empty

function Highlight({ text, query }: { text: string; query: string }) {
  const ranges = query ? highlightRanges(text, query) : [];
  if (!ranges.length) return <>{text}</>;
  const parts: ReactNode[] = [];
  let at = 0;
  ranges.forEach(([s, e], i) => {
    if (s > at) parts.push(text.slice(at, s));
    parts.push(<mark key={i}>{text.slice(s, e)}</mark>);
    at = e;
  });
  if (at < text.length) parts.push(text.slice(at));
  return <>{parts}</>;
}

export default function EventSearch({ items, docs, labels }: { items: EventRowData[]; docs: SearchDoc[]; labels: Labels }) {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [announce, setAnnounce] = useState("");
  const [touched, setTouched] = useState(false); // no fade on first load, only after a search
  const [when, setWhen] = useState<When>("all");

  const prepared = useMemo(() => prepare(docs), [docs]);
  const bySlug = useMemo(() => new Map(items.map((i) => [i.slug, i])), [items]);
  const akaOf = useMemo(() => new Map(docs.filter((d) => d.aka).map((d) => [d.slug, d.aka as string])), [docs]);
  const hits = useMemo(() => search(prepared, query), [prepared, query]);
  const inWhen = (e: EventRowData) => when === "all" || (when === "upcoming") === e.upcoming;
  const results = useMemo(
    () => hits.map((h) => bySlug.get(h.slug)).filter((x): x is EventRowData => !!x && (when === "all" || (when === "upcoming") === x.upcoming)),
    [hits, bySlug, when],
  );
  const hasQuery = query.trim().length > 0;
  const suggestions = hasQuery ? results.slice(0, MAX_SUGGESTIONS) : items.filter(inWhen).slice(0, EMPTY_SUGGESTIONS);
  const expanded = open && suggestions.length > 0;

  // Keep the search in the address (?q=) so Back from an event page brings the same results back.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
    const w = params.get("when");
    if (w === "upcoming" || w === "past") setWhen(w);
  }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    if (when !== "all") url.searchParams.set("when", when);
    else url.searchParams.delete("when");
    window.history.replaceState(window.history.state, "", url);
  }, [query, when]);

  // Announce the number of results once typing pauses, not on every key.
  useEffect(() => {
    if (!hasQuery && when === "all") { setAnnounce(""); return; }
    const t = setTimeout(() => {
      setAnnounce(results.length === 0 ? "No matching events found." : results.length === 1 ? "1 event found." : `${results.length} events found.`);
    }, 450);
    return () => clearTimeout(t);
  }, [results.length, hasQuery, query, when]);

  // Close the suggestions on a click or tap outside; the results stay.
  useEffect(() => {
    const onDown = (e: PointerEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const go = (e: EventRowData) => { setOpen(false); router.push(e.href); };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!expanded) { setOpen(true); setActive(e.altKey ? -1 : 0); return; }
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      if (!expanded) return;
      e.preventDefault();
      setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      if (expanded && active >= 0 && suggestions[active]) { e.preventDefault(); go(suggestions[active]); }
      else { e.preventDefault(); setOpen(false); } // keep the query and the filtered list
    } else if (e.key === "Escape") {
      if (expanded) { e.preventDefault(); setOpen(false); setActive(-1); }
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const clear = () => {
    setQuery("");
    setActive(-1);
    setOpen(false);
    inputRef.current?.focus();
  };
  const showAll = () => { setWhen("all"); clear(); };
  const pick = (w: When) => { setWhen(w); setActive(-1); setTouched(true); };

  // Phones: bring the box up so the suggestions are not hidden behind the keyboard.
  const onFocus = () => {
    setOpen(true);
    const el = inputRef.current;
    if (!el || window.innerWidth >= 600) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.3) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
    }
  };

  // Crossfade the list only when the set of results changes, not on every key.
  const resultKey = `${when}:${hasQuery ? results.map((r) => r.slug).join(",") : "all"}`;
  const whenOpts: { key: When; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "upcoming", label: labels.upcoming },
    { key: "past", label: labels.past },
  ];

  return (
    <>
      <div className="ev-search" ref={wrapRef} role="search">
        <label htmlFor={`${uid}-input`} className="visually-hidden">Search events</label>
        <div className="ev-search-box" data-open={expanded}>
          <svg className="ev-search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.6-3.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            id={`${uid}-input`}
            type="search"
            className="ev-search-input"
            placeholder="Search events"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-activedescendant={expanded && active >= 0 && suggestions[active] ? `${uid}-opt-${suggestions[active].slug}` : undefined}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); setTouched(true); }}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
          />
          {query && (
            <button type="button" className="ev-search-clear" aria-label="Clear search" onClick={clear}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <ul id={listId} role="listbox" aria-label="Event suggestions" className="ev-suggest" data-open={expanded} hidden={!expanded}>
          {suggestions.map((s, i) => (
            <li
              key={s.slug}
              id={`${uid}-opt-${s.slug}`}
              role="option"
              aria-selected={i === active}
              className="ev-suggest-item"
              onPointerDown={(e) => e.preventDefault()} // keep focus in the box
              onPointerEnter={() => setActive(i)}
              onClick={() => go(s)}
            >
              <span className="ev-suggest-title"><Highlight text={akaOf.has(s.slug) ? `${akaOf.get(s.slug)} — ${s.title}` : s.title} query={query} /></span>
              <span className="ev-suggest-meta">{s.typeLabel} · {s.date}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chips ev-when" role="group" aria-label={labels.when}>
        {whenOpts.map((o) => (
          <button key={o.key} type="button" className="chip" aria-pressed={when === o.key} onClick={() => pick(o.key)}>
            {o.label}
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">{announce}</p>

      {results.length === 0 ? (
        <div className="ev-empty">
          <p className="ev-empty-title">No matching events found.</p>
          <p className="muted">{hasQuery ? "Try another event name, category, or year." : when === "upcoming" ? "No upcoming events right now." : "No past events to show."}</p>
          <button type="button" className="btn btn-secondary" onClick={hasQuery ? clear : showAll}>{hasQuery ? "Clear search" : "Show all events"}</button>
        </div>
      ) : (
        <div className={touched ? "list-swap" : undefined} key={resultKey}>
          <EventRows items={results} labels={labels} />
        </div>
      )}
    </>
  );
}
