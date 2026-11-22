/**
 * Client-side search for the Events page (23 Nov 2026).
 *
 * Small, dependency-free and fast enough to run on every keystroke for a few dozen events.
 * Every result comes from the real event list: nothing is invented.
 *
 * Ranking (lower tier = better), then the original date order:
 *   1 exact name    2 name starts with the query    3 partial name
 *   4 category or year    5 summary, venue or date    6 close spelling (typo tolerance)
 * Names include common aliases such as "NESS X", "NESS 8" or "8th NESS".
 * A multiword query must match every word somewhere; its tier is the weakest word's tier.
 */

export type SearchDoc = {
  slug: string;
  title: string;
  typeKey: string;
  typeLabel: string;
  date: string;
  where: string;
  summary: string;
  start: string; // YYYY-MM-DD
  end?: string;
  /** Short name the event is known by, shown before the title in suggestions ("NESS X"). */
  aka?: string;
};

type Prepared = {
  doc: SearchDoc;
  index: number;
  names: string[]; // normalised title and aliases
  category: string[]; // type, years, months
  meta: string[]; // summary, venue, date text
  words: string[]; // every word, for typo matching
};

export type SearchHit = { slug: string; tier: number; index: number };

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** Lowercase, strip accents, keep letters, digits and decimal points; collapse spaces. */
export function normalise(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/(\d)\.(\d)/g, "$1\u0000$2") // keep "2.0"
    .replace(/[^a-z0-9\u0000]+/g, " ")
    .replace(/\u0000/g, ".")
    .trim()
    .replace(/\s+/g, " ");
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const ROMAN: Record<number, string> = { 1: "i", 2: "ii", 3: "iii", 4: "iv", 5: "v", 6: "vi", 7: "vii", 8: "viii", 9: "ix", 10: "x" };

/** Other names people use for an event, built from its real data. */
export function aliasesFor(d: SearchDoc): string[] {
  const out: string[] = [];
  const t = normalise(d.title);
  const edition = t.match(/^(\d+)(st|nd|rd|th)\b/);
  if (d.typeKey === "ness") {
    out.push("ness", "national earth and space summit", "summit");
    if (edition) {
      const n = Number(edition[1]);
      out.push(`ness ${n}`, `${ordinal(n)} ness`, `ness${n}`);
      if (ROMAN[n]) out.push(`ness ${ROMAN[n]}`, `ness${ROMAN[n]}`);
    }
  }
  if (d.typeKey === "cosmoterrium") {
    out.push("cosmoterrium", "cosmo");
    const v = t.match(/cosmoterrium (\d+)(\.\d+)?/);
    if (v) out.push(`cosmoterrium ${v[1]}`, `cosmo ${v[1]}`, `cosmo ${v[1]}${v[2] ?? ""}`);
  }
  if (d.typeKey === "space-camp") {
    out.push("space camp", "camp");
    if (edition) out.push(`${ordinal(Number(edition[1]))} space camp`);
  }
  if (d.typeKey === "workshop") out.push("workshop");
  return out.map(normalise);
}

function yearsAndMonths(d: SearchDoc): string[] {
  const out = new Set<string>();
  for (const iso of [d.start, d.end].filter(Boolean) as string[]) {
    const [y, m] = iso.split("-");
    out.add(y);
    const month = MONTHS[Number(m) - 1];
    if (month) { out.add(month); out.add(month.slice(0, 3)); }
  }
  return [...out];
}

export function prepare(docs: SearchDoc[]): Prepared[] {
  return docs.map((doc, index) => {
    const names = [normalise(doc.title), ...(doc.aka ? [normalise(doc.aka)] : []), ...aliasesFor(doc)];
    const category = [normalise(doc.typeLabel), normalise(doc.typeKey.replace(/-/g, " ")), ...yearsAndMonths(doc)];
    const meta = [normalise(doc.summary), normalise(doc.where), normalise(doc.date)];
    const words = [...new Set([...names, ...category, ...meta].join(" ").split(" ").filter(Boolean))];
    return { doc, index, names, category, meta, words };
  });
}

/** True when `token` starts a word in `field` (field is already normalised). */
function startsWord(field: string, token: string): boolean {
  return field === token || field.startsWith(token) || field.includes(" " + token);
}

/** Levenshtein distance with an early exit above `max`. */
export function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function fuzzyAllowance(token: string): number {
  if (/\d/.test(token)) return 0; // years and numbers must match exactly (2025 is not 2026)
  if (token.length >= 7) return 2;
  if (token.length >= 4) return 1;
  return 0;
}

function tokenTier(p: Prepared, token: string): number {
  if (p.names.some((f) => startsWord(f, token))) return 3;
  if (p.category.some((f) => startsWord(f, token))) return 4;
  if (p.meta.some((f) => startsWord(f, token))) return 5;
  // Partial words inside a longer word (for example "terrium") count as a weak name or text match.
  if (token.length >= 3 && p.names.some((f) => f.includes(token))) return 5;
  const max = fuzzyAllowance(token);
  if (max > 0) {
    for (const w of p.words) {
      // compare with the whole word, and with its start (so a typo in a half-typed word still matches)
      if (distance(token, w, max) <= max) return 6;
      if (w.length > token.length && distance(token, w.slice(0, token.length), max) <= max && token.length >= 5) return 6;
    }
  }
  return 0; // no match
}

function tierFor(p: Prepared, q: string): number {
  if (p.names.some((f) => f === q)) return 1;
  if (p.names.some((f) => f.startsWith(q))) return 2;
  if (p.names.some((f) => f.includes(" " + q))) return 3;
  let worst = 0;
  for (const token of q.split(" ")) {
    const t = tokenTier(p, token);
    if (t === 0) return 0;
    worst = Math.max(worst, t);
  }
  return worst;
}

/** All matching events, best first. An empty query returns every event in its original order. */
export function search(prepared: Prepared[], query: string): SearchHit[] {
  const q = normalise(query);
  if (!q) return prepared.map((p) => ({ slug: p.doc.slug, tier: 0, index: p.index }));
  const hits: SearchHit[] = [];
  for (const p of prepared) {
    const tier = tierFor(p, q);
    if (tier > 0) hits.push({ slug: p.doc.slug, tier, index: p.index });
  }
  return hits.sort((a, b) => a.tier - b.tier || a.index - b.index);
}

/**
 * Parts of `text` to highlight for `query`: each query word where it starts a word in the text.
 * Returns [start, end) ranges in the original string, merged and sorted.
 */
export function highlightRanges(text: string, query: string): [number, number][] {
  const tokens = normalise(query).split(" ").filter((t) => t.length > 0);
  const lower = text.toLowerCase();
  const ranges: [number, number][] = [];
  for (const t of tokens) {
    let from = 0;
    while (from <= lower.length) {
      const i = lower.indexOf(t, from);
      if (i < 0) break;
      const before = i === 0 ? " " : lower[i - 1];
      if (!/[a-z0-9]/.test(before)) ranges.push([i, i + t.length]);
      from = i + 1;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  return merged;
}
