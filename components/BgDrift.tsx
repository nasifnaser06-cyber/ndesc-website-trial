"use client";

import { useEffect } from "react";

/**
 * Phones only, NESS X and Photosphere (23 Nov 2026). Spreads the background's small upward drift over the
 * whole page scroll instead of letting the address bar do it in the first few swipes.
 *
 * Writes one number, --drift (0 at the top of the page, 1 at the very bottom), on the `.bg-drift` layer.
 * The CSS turns it into a transform, so the browser only moves an existing layer: no React state, no
 * layout reads while scrolling (the scrollable range is measured on resize and when the page changes size).
 */
const PHONE = "(hover: none) and (pointer: coarse) and (max-width: 767px), (hover: none) and (pointer: coarse) and (max-height: 500px)";
const CALM = "(prefers-reduced-motion: reduce)";

export default function BgDrift() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".bg-drift");
    if (!el) return;
    const phone = window.matchMedia(PHONE);
    const calm = window.matchMedia(CALM);

    let range = 1;
    let frame = 0;
    let running = false;

    const measure = () => {
      range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const paint = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      el.style.setProperty("--drift", p.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measure();
      schedule();
    };
    // Content can change height without a window resize (an FAQ opening, fonts or images arriving).
    const ro = new ResizeObserver(onResize);

    const start = () => {
      if (running) return;
      running = true;
      measure();
      paint();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      ro.observe(document.body);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      el.style.removeProperty("--drift");
    };
    const update = () => (phone.matches && !calm.matches ? start() : stop());

    update();
    phone.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      phone.removeEventListener("change", update);
      calm.removeEventListener("change", update);
      stop();
    };
  }, []);

  return null;
}
