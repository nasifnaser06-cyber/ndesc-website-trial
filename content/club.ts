
// History, NESS programme, panel and other club content.
// Square-bracket text marks something the club still has to supply or confirm.

export const timeline: { year: string; text: string }[] = [
  { year: "1992", text: "Founded on 28 October as the Notre Dame Environmental Promotion Club." },
  { year: "2017", text: "First Earth and Space Carnival, and the first inter-college space camp in Bangladesh." },
  { year: "2018", text: "Renamed the Notre Dame Eco and Space Club on 23 May 2018." },
  { year: "2022", text: "The 5th summit returns to campus after an online year." },
  { year: "2025", text: "8th summit: nearly 2,000 participants from more than 60 institutions." },
  { year: "2026", text: "9th summit, 9–11 April." },
  { year: "2027", text: "10th summit, 28–30 January." },
];

/** The NESS X page shows the Schedule only when this is true. Hidden until the club sends the day-by-day plan (Mahmud, 20 Nov 2026). */
export const showNessSchedule = false;

export const nessSchedule: { day: string; plan: string }[] = [
  { day: "Day 1, 28 January", plan: "[Opening, olympiads, exhibitions open]" },
  { day: "Day 2, 29 January", plan: "[Team contests and talks]" },
  { day: "Day 3, 30 January", plan: "[Finals and prize-giving]" },
];

export const nessPast: { edition: string; year: string; slug?: string; note: string }[] = [
  { edition: "9th", year: "2026", note: "9–11 April 2026. [Highlights to add]" },
  { edition: "8th", year: "2025", slug: "ness-2025", note: "Nearly 2,000 participants from 60+ institutions. Formula IUT car unveiled." },
  { edition: "7th", year: "2024", slug: "ness-2024", note: "About 2,500 participants and 6,000 visitors. Hybrid rocket engine test." },
  { edition: "6th", year: "[2023?]", note: "[Details to add]" },
  { edition: "5th", year: "2022", slug: "ness-2022", note: "Back on campus after an online year." },
  { edition: "4th", year: "2020", note: "[Details to add]" },
  { edition: "3rd", year: "2019", slug: "ness-2019", note: "15 events across three age groups." },
  { edition: "2nd", year: "2018", note: "[Details to add]" },
  { edition: "1st", year: "2017", note: "The first Earth and Space Carnival." },
];

export const nessFaq: { q: string; a: string }[] = [
  { q: "Who can take part?", a: "Students from Nursery to Class 12, including O and A Levels, from Notre Dame College and other institutions. University students can also enter Photosphere 7.0." },
  { q: "Do visitors need a pass?", a: "Yes. The exhibitions and programmes are open with either a solo pass or a team pass." },
  { q: "How do teams work?", a: "A team has up to 3 members. Each member buys a team pass (300 BDT) and registers separately. [Whether members must be from the same institution]" },
  { q: "What do winners get?", a: "A certificate and a crest. In team segments, every member of a winning team gets their own. [Whether every participant gets a certificate]" },
  { q: "Where are the full rules for each segment?", a: "Each segment gets its own post with full details on the club's Facebook page." },
];

export const partnersPast =
  "Western Engineering, Bata, JR Recycling, Bangladesh Olympiad on Astronomy and Astrophysics, National Earth Olympiad, MICB Scientific Society, GPH Ispat, Shamsul Alamin Real Estate, The Daily Star";

// ---------------------------------------------------------------------------
// Executives page (like the Math Club's): three tabs, Officers, Current, Former.
// Add a name or photo only with that student's consent. Photos go in
// public/executives/ and are referenced as "/executives/file.jpg".
// ---------------------------------------------------------------------------

export type Person = {
  name: string;
  post: string;
  /** The wing or department, e.g. Fieldwork. Members of the current panel are grouped by it. */
  department?: string;
  /** A 4:5 portrait, as "/executives/folder/name" with -400.webp and -800.webp files beside it. */
  photo?: string;
  /** A square poster made by the club, as "/executives/2026-27/name" with -480.webp and -960.webp files beside it. */
  poster?: string;
};

const t = (s: string): string => (s);
const ec = (name: string, post: string, wing: string | null, slug: string): Person => ({
  name: t(name),
  post: t(post),
  ...(wing ? { department: t(wing) } : {}),
  poster: `/executives/2026-27/${slug}`,
});

/** Teachers and college officers who guide the club. */
export const officers: Person[] = [
  { name: "Dr Fr Hemanto Pius Rozario", post: "Principal, Notre Dame College", photo: "/executives/moderators/hemanto-pius-rozario" },
  { name: "Md Nazmul Hassan", post: "Moderator", photo: "/executives/moderators/md-nazmul-hassan" },
];

/** Moderators shown on the About page. */
export const moderators = officers.slice(1);

/** One entry per session, newest first. The first one marked current shows on the Current tab. */
export const executiveSessions: { session: string; current?: boolean; members: Person[] }[] = [
  {
    // Executive Committee 2026–27, from the club's EC 26-27 posters (shared by Mahmud, 18 Nov 2026).
    session: "2026–27",
    current: true,
    members: [
      ec("Hameem Muktadir", "Secretary General", null, "hameem-muktadir"),
      ec("Junaed Labeeb Al Waasi", "President", "Administration", "junaed-labeeb-al-waasi"),
      ec("Mushfiq Al Rafi", "Vice President", "Administration", "mushfiq-al-rafi"),
      ec("Sidratul Muntaha Masud", "Vice President", "Administration", "sidratul-muntaha-masud"),
      ec("Nabhan Uddin", "Secretary", "Administration", "nabhan-uddin"),
      ec("Mahir Abid Akkho", "President", "Festival", "mahir-abid-akkho"),
      ec("Tasirul Omar", "Vice President", "Festival", "tasirul-omar"),
      ec("Arad Farzin Hasnat", "Secretary", "Festival", "arad-farzin-hasnat"),
      ec("Prithish Ranjon Das", "President", "Fieldwork", "prithish-ranjon-das"),
      ec("Farhan Ferdous", "Vice President", "Fieldwork", "farhan-ferdous"),
      ec("Rubayet Bin Zaman", "Secretary", "Fieldwork", "rubayet-bin-zaman"),
      ec("Abdullah Islam Sabiq", "President", "IT and Aesthetics", "abdullah-islam-sabiq"),
      ec("Kauser Mahmud", "Vice President", "IT and Aesthetics", "kauser-mahmud"),
      ec("Towkir Mahmud Tripto", "Secretary", "IT and Aesthetics", "towkir-mahmud-tripto"),
      ec("Tashrif Arefin", "President", "Outreach", "tashrif-arefin"),
      ec("Zubair Zarif", "Vice President", "Outreach", "zubair-zarif"),
      ec("Mahir Shahriar Rahman", "Secretary", "Outreach", "mahir-shahriar-rahman"),
      ec("Nirban Bin Shahjhan", "President", "Record and Publication", "nirban-bin-shahjhan"),
      ec("Fahad Haque", "Vice President", "Record and Publication", "fahad-haque"),
      ec("F.M. Tamim Hasan", "Secretary", "Record and Publication", "fm-tamim-hasan"),
      ec("Shahriar Kabir", "President", "Research and Academics", "shahriar-kabir"),
      ec("Shaikh Taassuk Ahmed", "Vice President", "Research and Academics", "shaikh-taassuk-ahmed"),
      ec("Tasdik Ahmed Tonmay", "Vice President", "Research and Academics", "tasdik-ahmed-tonmay"),
      ec("Muhit Rahman", "Secretary", "Research and Academics", "muhit-rahman"),
      ec("Rafid Raiyan", "Director", "Visual Creatives", "rafid-raiyan"),
    ],
  },
  {
    session: "[2025–26]",
    members: [
      { name: "[Name]", post: "President" },
      { name: "[Name]", post: "General Secretary" },
    ],
  },
];

export type ResourceKind = "papers" | "handouts" | "magazines" | "astrophotography" | "sky-guides";
export const resourceKinds: Record<ResourceKind, string> = {
  papers: "Olympiad papers",
  handouts: "Workshop handouts",
  magazines: "Wall magazines",
  astrophotography: "Astrophotography",
  "sky-guides": "Sky guides",
};
/** Add files to /public/resources and list them here. */
export const resources: { kind: ResourceKind; title: string; year: string; url: string; format: string }[] = [];

export const galleryAlbums: { title: string; date: string; photos: string[] }[] = [
  { title: "8th NESS", date: "2025-02", photos: [] },
  { title: "7th NESS", date: "2024-05", photos: [] },
  { title: "Cosmoterrium 2.0", date: "2026-10", photos: [] },
  { title: "Cosmoterrium 1.0", date: "2026-01", photos: [] },
  { title: "5th NESS", date: "2022-05", photos: [] },
];
