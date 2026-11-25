"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FactsCard } from "@/lib/factsCards";

/*
 * FactsFriday carousel: one horizontal strip, newest first, centred card in front, looping in both
 * directions.
 *
 * Baseline: native horizontal scrolling with CSS scroll snapping, so swipes, trackpads and links work
 * even before (or without) this script. Depth: where the browser has scroll-driven animations, CSS
 * scales and stacks each card from its distance to the centre (globals.css, "FactsFriday carousel");
 * elsewhere this script does the same on scroll. Cards are only ever scaled, never rotated.
 *
 * Looping: the posts are drawn as several identical copies side by side ("virtual" slides). The strip
 * starts in the middle copy, so the last post already sits to the left of the first. Once a move
 * settles in another copy, the strip is moved without animation to the same post in the middle copy.
 * The copies look identical and the depth follows the scroll position, so nothing visibly changes.
 * Only the middle copy is exposed to screen readers; the counter, caption and announcements always
 * name the real post (slug), counted once.
 */

// Was the last navigation a browser Back/Forward? (Set before Next renders the new page.)
let lastHistoryNav = 0;
if (typeof window !== "undefined") window.addEventListener("popstate", () => { lastHistoryNav = Date.now(); });
export function cameByHistory(): boolean {
  return Date.now() - lastHistoryNav < 4000;
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cssDepth = () =>
  typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()") && document.documentElement.dataset.fcJs !== "1";

/** How many copies of the list to draw: an odd number, with about 20 or more cards on each side of the middle copy. */
const copiesFor = (n: number) => {
  if (n < 2) return 1;
  const c = Math.max(3, Math.ceil(40 / n));
  return c % 2 ? c : c + 1;
};

/** Resolves once a selector exists. setTimeout, not requestAnimationFrame: frames pause while a view transition waits. */
function waitFor(sel: string, ms = 3000): Promise<void> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = () => (document.querySelector(sel) || performance.now() - t0 > ms ? resolve() : setTimeout(tick, 16));
    tick();
  });
}

// Runs while the page HTML is still loading, straight after the strip: centres the starting card (in the
// middle copy) before the first paint, so both sides are already filled. Client-side visits do the same
// in a layout effect.
const startScript = `(function(){try{var t=document.currentScript.previousElementSibling;var s=t&&t.querySelector('[data-fc-start]');if(s){t.scrollLeft=s.offsetLeft+s.offsetWidth/2-t.clientWidth/2}}catch(e){}})()`;

type Props = {
  items: FactsCard[];
  /** The post to centre. When it changes from outside (filters, restoring), the strip jumps to it without animating. */
  activeSlug?: string;
  /** Called once a new post has settled in the centre. */
  onActiveChange?: (slug: string) => void;
  /** Called just before the centred post's article opens. */
  onOpen?: (slug: string) => void;
  label: string;
  compact?: boolean;
  /** Card-to-post flight (view transitions) when the centred picture is clicked. */
  flight?: boolean;
  headingLevel?: 2 | 3;
};

export default function FactsCarousel({ items, activeSlug, onActiveChange, onOpen, label, compact = false, flight = false, headingLevel = 2 }: Props) {
  const router = useRouter();
  const track = useRef<HTMLUListElement>(null);
  const slideEls = useRef<(HTMLLIElement | null)[]>([]);
  const titleEl = useRef<HTMLHeadingElement>(null);
  const n = items.length;
  const copies = copiesFor(n);
  const mid = (copies - 1) / 2;
  const total = n * copies;
  const home = (r: number) => mid * n + r; // the virtual slide for real post r in the middle copy
  const wanted = Math.max(0, items.findIndex((x) => x.slug === activeSlug));
  const [active, setActive] = useState(wanted); // real post index
  const [vActive, setVActive] = useState(home(wanted)); // virtual slide in the centre
  const [enhanced, setEnhanced] = useState(false);
  const [announce, setAnnounce] = useState("");
  const s = useRef({
    pos: [] as number[], width: 0, step: 1, active: wanted, v: home(wanted), target: -1, scrolling: false, raf: 0, timer: 0,
    jsDepth: false, reduce: false, down: false, dragging: false, suppress: false, startX: 0, startLeft: 0,
    samples: [] as { x: number; t: number }[], items: null as FactsCard[] | null, n, mid,
  });
  s.current.n = n;
  s.current.mid = mid;
  const list = useRef(items); // the current list, for handlers registered on mount
  list.current = items;
  const cb = useRef({ onActiveChange, onOpen });
  cb.current = { onActiveChange, onOpen };

  const measure = () => {
    const t = track.current;
    if (!t) return;
    s.current.pos = slideEls.current.slice(0, total).map((el) => (el ? el.offsetLeft + el.offsetWidth / 2 : 0));
    s.current.width = t.clientWidth;
    s.current.step = s.current.pos.length > 1 ? s.current.pos[1] - s.current.pos[0] : 1;
  };
  const leftFor = (v: number) => (s.current.pos[v] ?? 0) - s.current.width / 2;
  const nearest = (center: number) => {
    const p = s.current.pos;
    if (!p.length) return 0;
    const v = Math.round((center - p[0]) / s.current.step); // evenly spaced, so no search needed
    return Math.max(0, Math.min(p.length - 1, v));
  };

  /** JS depth for browsers without scroll-driven animations: same curve as the CSS keyframes. */
  const paint = () => {
    s.current.raf = 0;
    const t = track.current;
    if (!t || !s.current.jsDepth) return;
    const center = t.scrollLeft + s.current.width / 2;
    const near = nearest(center);
    const span = Math.ceil(s.current.width / s.current.step / 2) + 3;
    for (let v = Math.max(0, near - span); v <= Math.min(total - 1, near + span); v++) {
      const el = slideEls.current[v];
      if (!el) continue;
      const d = Math.abs((s.current.pos[v] ?? 0) - center) / s.current.step;
      const scale = d <= 1 ? 1 - 0.2 * d : d <= 2 ? 0.8 - 0.16 * (d - 1) : 0.64;
      const dim = d <= 1 ? 0.3 * d : d <= 2 ? 0.3 + 0.25 * (d - 1) : 0.55;
      const card = el.firstElementChild as HTMLElement | null;
      if (card) { card.style.transform = `scale(${scale.toFixed(4)})`; card.style.setProperty("--fc-dim", dim.toFixed(3)); }
      el.style.zIndex = String(100 - Math.round(Math.min(d, 3) * 33));
    }
  };

  /** Moves, without animation, to the same post in the middle copy. Identical copies, so nothing visibly changes. */
  const recentre = () => {
    const st = s.current, t = track.current;
    if (!t || st.n < 2) return;
    const r = ((st.v % st.n) + st.n) % st.n;
    const h = st.mid * st.n + r;
    if (h === st.v) return;
    t.scrollTo({ left: t.scrollLeft + (st.pos[h] - st.pos[st.v]), behavior: "instant" });
    st.v = h;
    setVActive(h);
    if (st.jsDepth) paint();
  };

  const settle = () => {
    const st = s.current, t = track.current;
    if (!t || st.dragging || st.down) return;
    measure(); // a resize can re-snap the strip and end a scroll before the resize observer has re-measured
    st.scrolling = false;
    st.target = -1;
    t.classList.remove("is-dragging");
    const v = nearest(t.scrollLeft + st.width / 2);
    const r = st.n ? v % st.n : 0;
    st.v = v;
    setVActive(v);
    if (r !== st.active) {
      st.active = r;
      setActive(r);
      const it = list.current[r];
      if (it) {
        setAnnounce(`${it.title}, post ${r + 1} of ${st.n}`);
        cb.current.onActiveChange?.(it.slug);
      }
    }
    recentre();
  };

  /** Smoothly centres virtual slide v (a neighbour across the wrap is just the next slide in the strip). */
  const go = (v: number, smooth = true) => {
    const t = track.current;
    if (!t || n < 2) return;
    const k = Math.max(0, Math.min(total - 1, v));
    s.current.target = k;
    const left = leftFor(k);
    if (Math.abs(t.scrollLeft - left) < 1) { settle(); return; }
    s.current.scrolling = true;
    t.scrollTo({ left, behavior: smooth && !s.current.reduce ? "smooth" : "instant" });
  };
  const base = () => (s.current.target >= 0 ? s.current.target : s.current.v);

  // Jump (no animation) to the wanted post, in the middle copy, whenever the list or the wanted post changes from outside.
  useLayoutEffect(() => {
    const t = track.current;
    if (!t) return;
    measure();
    const listChanged = s.current.items !== items;
    s.current.items = items;
    if (listChanged || wanted !== s.current.active) {
      const h = home(wanted);
      t.scrollTo({ left: leftFor(h), behavior: "instant" });
      s.current.active = wanted;
      s.current.v = h;
      s.current.target = -1;
      setActive(wanted);
      setVActive(h);
    }
    if (s.current.jsDepth) paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, wanted]);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const st = s.current;
    st.jsDepth = !cssDepth();
    st.reduce = reducedMotion();
    t.classList.toggle("fc-jsdepth", st.jsDepth && !st.reduce);
    setEnhanced(true);
    const hasScrollEnd = "onscrollend" in window;
    const onScroll = () => {
      st.scrolling = true;
      if (st.jsDepth && !st.reduce && !st.raf) st.raf = requestAnimationFrame(paint);
      if (!hasScrollEnd) { clearTimeout(st.timer); st.timer = window.setTimeout(settle, 140); }
    };
    const onEnd = () => settle();
    t.addEventListener("scroll", onScroll, { passive: true });
    t.addEventListener("scrollend", onEnd);
    // Keep the active post centred when the window or the strip changes size.
    const ro = new ResizeObserver(() => {
      measure();
      t.scrollTo({ left: leftFor(st.v), behavior: "instant" });
      if (st.jsDepth) paint();
    });
    ro.observe(t);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => { st.reduce = mq.matches; t.classList.toggle("fc-jsdepth", st.jsDepth && !st.reduce); measure(); t.scrollTo({ left: leftFor(st.v), behavior: "instant" }); };
    mq.addEventListener("change", onMq);
    if (st.jsDepth) paint();
    return () => {
      t.removeEventListener("scroll", onScroll);
      t.removeEventListener("scrollend", onEnd);
      ro.disconnect();
      mq.removeEventListener("change", onMq);
      clearTimeout(st.timer);
      cancelAnimationFrame(st.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mouse dragging (touch and trackpads scroll natively).
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    const st = s.current;
    st.down = true; st.dragging = false; st.startX = e.clientX; st.startLeft = track.current.scrollLeft;
    st.samples = [{ x: e.clientX, t: e.timeStamp }];
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const st = s.current, t = track.current;
    if (!st.down || !t) return;
    const dx = e.clientX - st.startX;
    if (!st.dragging && Math.abs(dx) > 5) {
      st.dragging = true;
      t.setPointerCapture(e.pointerId);
      t.classList.add("is-dragging"); // snapping off while the strip follows the mouse
    }
    if (st.dragging) {
      t.scrollLeft = st.startLeft - dx;
      st.samples.push({ x: e.clientX, t: e.timeStamp });
      if (st.samples.length > 6) st.samples.shift();
    }
  };
  const onPointerUp = () => {
    const st = s.current, t = track.current;
    if (!st.down || !t) return;
    st.down = false;
    if (!st.dragging) return;
    st.dragging = false;
    st.suppress = true; // the click that follows a drag must not open anything
    window.setTimeout(() => { st.suppress = false; }, 80);
    const a = st.samples[0], b = st.samples[st.samples.length - 1];
    const v = b && a && b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0; // px per ms, positive = dragged right
    const projected = t.scrollLeft + st.width / 2 - v * 180;
    go(nearest(projected));
  };

  const onCardClick = (e: React.MouseEvent<HTMLAnchorElement>, v: number) => {
    const st = s.current;
    if (st.suppress) { e.preventDefault(); return; }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // new tab or window: normal link
    const t = track.current;
    const moving = st.scrolling && !!t && Math.abs(t.scrollLeft - leftFor(v)) >= 2; // the flag can be stale when a scroll ends without scrollend
    if (v !== st.v || moving) { e.preventDefault(); go(v); return; }
    const it = items[v % n];
    cb.current.onOpen?.(it.slug);
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };
    if (flight && e.detail > 0 && doc.startViewTransition && !st.reduce) {
      e.preventDefault();
      const img = e.currentTarget.querySelector("img") as HTMLElement | null;
      if (img) img.style.viewTransitionName = "ff-cover";
      if (titleEl.current) titleEl.current.style.viewTransitionName = "ff-title";
      document.documentElement.classList.add("ff-flying");
      const tr = doc.startViewTransition(async () => {
        router.push(it.href);
        await waitFor(".ff-article .ff-pic img");
        window.scrollTo(0, 0);
      });
      tr.finished.finally(() => document.documentElement.classList.remove("ff-flying"));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(base() + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(base() - 1); }
  };

  const cur = items[Math.min(active, n - 1)];
  const H = headingLevel === 3 ? "h3" : "h2";
  if (!cur) return null;
  const startV = home(wanted);

  return (
    <div className={`fc${compact ? " fc-compact" : ""}${enhanced ? " is-enhanced" : ""}`} role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown}>
      <ul
        ref={track}
        className="fc-track"
        tabIndex={0}
        aria-label={`${label}. Use the left and right arrow keys to move between posts.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => { if (s.current.suppress) { e.preventDefault(); e.stopPropagation(); } }}
        onDragStart={(e) => e.preventDefault()}
      >
        {Array.from({ length: total }, (_, v) => {
          const r = v % n;
          const f = items[r];
          const copy = Math.floor(v / n);
          const clone = copy !== mid;
          return (
            <li
              key={`${copy}-${f.slug}`}
              ref={(el) => { slideEls.current[v] = el; }}
              className={`fc-slide${v === vActive ? " is-active" : ""}`}
              aria-hidden={clone || undefined}
              data-fc-start={v === startV ? "" : undefined}
            >
              <Link
                href={f.href}
                className="fc-card"
                prefetch={false}
                draggable={false}
                tabIndex={enhanced || clone ? -1 : undefined}
                aria-label={r === active || !enhanced ? f.title : `Show ${f.title}`}
                onClick={(e) => onCardClick(e, v)}
              >
                <span className="fc-frame">
                  {f.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.img}
                      srcSet={f.img2x ? `${f.img} 400w, ${f.img2x} 800w` : undefined}
                      sizes={compact ? "(max-width: 600px) 52vw, 240px" : "(max-width: 600px) 80vw, 560px"}
                      alt=""
                      width={400}
                      height={400}
                      draggable={false}
                      loading={Math.abs(v - startV) <= 3 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ) : (
                    <span className="fc-fallback">{f.title}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <script dangerouslySetInnerHTML={{ __html: startScript }} />
      {n > 1 && (
        // Without JavaScript there is no loop: show each post once.
        <noscript><style>{`.fc-slide[aria-hidden]{display:none}`}</style></noscript>
      )}

      {n > 1 && (
        <div className="fc-controls">
          <button type="button" className="fc-btn" aria-label="Previous post" onClick={() => go(base() - 1)}>
            <span aria-hidden="true">‹</span>
          </button>
          <span className="fc-pos" aria-hidden="true">{active + 1} / {n}</span>
          <button type="button" className="fc-btn" aria-label="Next post" onClick={() => go(base() + 1)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}

      <div className="fc-caption">
        <div key={cur.slug} className="fc-caption-inner">
          <p className="fc-meta"><span>{cur.categoryLabel}</span><span aria-hidden="true"> · </span><time dateTime={cur.date}>{cur.dateLabel}</time></p>
          <H className="fc-title" ref={titleEl}>{cur.title}</H>
          <p className="fc-teaser">{cur.summary}</p>
          <Link className="btn btn-secondary btn-small fc-read" href={cur.href} onClick={() => cb.current.onOpen?.(cur.slug)}>
            Read the post<span className="visually-hidden">: {cur.title}</span>
          </Link>
        </div>
      </div>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">{announce}</p>
    </div>
  );
}
