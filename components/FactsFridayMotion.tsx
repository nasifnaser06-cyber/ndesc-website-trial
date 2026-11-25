"use client";

import { useEffect } from "react";

/**
 * FactsFriday motion, Apple style (rion-motion-web Part 2; Mahmud picked the "Apple style" package, 23 Nov 2026).
 * Archive: a slim bar with a Search button slides down once the page title has left the screen.
 * Post:    the same slide-down bar with the post title and "Next fact"; links back to the archive
 *          are marked so it can restore the reader's place.
 * The carousel on both pages is components/FactsCarousel.tsx. Styles: "FactsFriday motion" and
 * "FactsFriday carousel" in globals.css.
 */
function subBar(page: "archive" | "post"): () => void {
  const head = document.querySelector(".page-head");
  if (!head || !("IntersectionObserver" in window)) return () => {};
  const bar = document.createElement("div");
  bar.className = "ff-subnav";
  const title = document.createElement("span");
  title.className = "ff-subnav-title";
  title.textContent = page === "post" ? (document.querySelector(".page-head h1")?.textContent || "FactsFriday") : "FactsFriday";
  bar.appendChild(title);
  if (page === "post") {
    const older = document.querySelector<HTMLElement>(".ff-article[data-older]")?.dataset.older;
    const a = document.createElement("a");
    a.className = "ff-subnav-btn";
    a.href = older || document.querySelector<HTMLAnchorElement>("a[data-all-posts]")?.href || "/factsfriday/";
    a.textContent = older ? "Next fact" : "All posts";
    a.tabIndex = -1;
    bar.appendChild(a);
  } else {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ff-subnav-btn";
    b.textContent = "Search";
    b.tabIndex = -1;
    b.onclick = () => {
      const q = document.getElementById("ff-q") as HTMLInputElement | null;
      q?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      setTimeout(() => q?.focus({ preventScroll: true }), 400);
    };
    bar.appendChild(b);
  }
  // A visual shortcut only: the same links are on the page, so screen readers skip it.
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  const io = new IntersectionObserver(([e]) => bar.classList.toggle("is-shown", !e.isIntersecting));
  io.observe(head);
  return () => { io.disconnect(); bar.remove(); };
}

/** Links from an article back to the archive (the "All FactsFriday posts" button and the breadcrumb)
    mark the visit as a return, so the archive puts back the post and filters the reader left with. */
function markReturns(): () => void {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest?.("a");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    try {
      if (new URL(a.href, location.href).pathname.replace(/\/+$/, "").endsWith("/factsfriday")) sessionStorage.setItem("ndesc-ff-return", "1");
    } catch { /* private mode */ }
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

export default function FactsFridayMotion({ page }: { page: "archive" | "post" }) {
  useEffect(() => {
    const offs = page === "archive" ? [subBar("archive")] : [subBar("post"), markReturns()];
    return () => offs.forEach((off) => off());
  }, [page]);
  return null;
}
