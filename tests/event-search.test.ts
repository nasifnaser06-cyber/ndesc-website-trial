// Tests for the Events page search, run against the real event data.
// Run: node --test tests/event-search.test.ts   (Node 22.18+ runs TypeScript directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { events, eventTypes } from "../content/events.ts";
import { prepare, search, normalise, highlightRanges, distance, type SearchDoc } from "../lib/eventSearch.ts";

const sorted = [...events].sort((a, b) => b.start.localeCompare(a.start));
const docs: SearchDoc[] = sorted.map((e) => ({
  slug: e.slug, title: e.title.en, typeKey: e.type, typeLabel: eventTypes[e.type].en,
  date: e.start, where: e.venue.en, summary: e.summary.en, start: e.start, end: e.end,
}));
const P = prepare(docs);
const titles = (q: string) => search(P, q).map((h) => docs.find((d) => d.slug === h.slug)!.title);
const slugs = (q: string) => search(P, q).map((h) => h.slug);

test("empty query keeps every event in the original date order", () => {
  assert.deepEqual(slugs(""), docs.map((d) => d.slug));
  assert.deepEqual(slugs("   "), docs.map((d) => d.slug));
});

test("ness: every NESS, newest first, NESS X on top", () => {
  const t = titles("ness");
  const nessCount = docs.filter((d) => d.typeKey === "ness").length;
  assert.equal(t.length, nessCount);
  assert.equal(t[0], "10th National Earth and Space Summit");
  assert.equal(t[1], "9th National Earth and Space Summit");
});

test("NESS X alias finds the 10th summit first", () => {
  assert.equal(slugs("ness x")[0], "ness-x");
  assert.equal(slugs("NESS   X")[0], "ness-x");
});

test("cos: both Cosmoterriums, 2.0 before 1.0, nothing else", () => {
  assert.deepEqual(titles("cos"), ["Cosmoterrium 2.0", "Cosmoterrium 1.0"]);
  assert.deepEqual(titles("cosmoterrium 1.0"), ["Cosmoterrium 1.0"]);
});

test("year: 2025 returns only events in 2025", () => {
  const hits = search(P, "2025");
  assert.ok(hits.length > 0);
  for (const h of hits) assert.ok(docs.find((d) => d.slug === h.slug)!.start.startsWith("2025") || docs.find((d) => d.slug === h.slug)!.end?.startsWith("2025"));
});

test("work: the workshop first, then events whose text mentions workshops", () => {
  const hits = search(P, "work");
  assert.equal(hits[0].slug, "astronomy-workshop-2020");
  for (const h of hits) {
    const d = docs.find((x) => x.slug === h.slug)!;
    assert.match(`${d.title} ${d.typeLabel} ${d.summary}`, /\bwork/i);
  }
});

test("exact name beats prefix beats partial", () => {
  const hits = search(P, "Cosmoterrium 2.0");
  assert.equal(hits[0].slug, "cosmoterrium-2");
  assert.equal(hits[0].tier, 1);
});

test("multiword query must match every word", () => {
  assert.deepEqual(slugs("cosmoterrium 2027"), []);
  assert.ok(slugs("summit 2024").includes("ness-2024"));
  assert.equal(slugs("summit 2024").length, 1);
});

test("typos still find the event", () => {
  assert.ok(slugs("cosmoterium").includes("cosmoterrium-2"));
  assert.ok(slugs("workshp").length >= 1);
  assert.ok(slugs("astronmy").includes("astronomy-workshop-2020"));
});

test("venue and summary words are searchable", () => {
  assert.ok(slugs("Notre Dame").length > 0);
  assert.ok(slugs("stargazing").includes("space-camp-2018"));
});

test("nonsense finds nothing (no padding with irrelevant results)", () => {
  assert.deepEqual(slugs("qwertyzz"), []);
  assert.deepEqual(slugs("football"), []);
});

test("ordinal aliases", () => {
  assert.equal(slugs("8th ness")[0], "ness-2025");
  assert.equal(slugs("ness 7")[0], "ness-2024");
});

test("helpers", () => {
  assert.equal(normalise("  Cosmoterrium   2.0! "), "cosmoterrium 2.0");
  assert.equal(distance("kitten", "sitting", 5), 3);
  assert.deepEqual(highlightRanges("10th National Earth and Space Summit", "nat sum"), [[5, 8], [30, 33]]);
  assert.deepEqual(highlightRanges("Cosmoterrium 2.0", "terr"), []); // only at word starts
});
