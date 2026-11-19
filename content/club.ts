import type { L } from "@/lib/i18n";

// History, NESS programme, panel and other club content.
// Square-bracket text marks something the club still has to supply or confirm.

export const timeline: { year: string; text: L }[] = [
  { year: "1992", text: { en: "Founded on 28 October as the Notre Dame Environmental Promotion Club.", bn: "২৮ অক্টোবর নটর ডেম এনভায়রনমেন্টাল প্রমোশন ক্লাব নামে প্রতিষ্ঠা।" } },
  { year: "2017", text: { en: "First Earth and Space Carnival, and the first inter-college space camp in Bangladesh.", bn: "প্রথম আর্থ অ্যান্ড স্পেস কার্নিভাল, আর দেশের প্রথম আন্তঃকলেজ স্পেস ক্যাম্প।" } },
  { year: "2018", text: { en: "Renamed the Notre Dame Eco and Space Club [confirm date].", bn: "নাম বদলে নটর ডেম ইকো অ্যান্ড স্পেস ক্লাব [তারিখ নিশ্চিত করুন]।" } },
  { year: "2022", text: { en: "The 5th summit returns to campus after an online year.", bn: "অনলাইনে এক বছরের পর ৫ম সামিট আবার ক্যাম্পাসে।" } },
  { year: "2025", text: { en: "8th summit: nearly 2,000 participants from more than 60 institutions.", bn: "৮ম সামিট: ৬০টির বেশি প্রতিষ্ঠানের প্রায় ২,০০০ অংশগ্রহণকারী।" } },
  { year: "2026", text: { en: "9th summit, 4–10 April.", bn: "৯ম সামিট, ৪–১০ এপ্রিল।" } },
  { year: "2027", text: { en: "10th summit, 28–30 January.", bn: "১০ম সামিট, ২৮–৩০ জানুয়ারি।" } },
];

export const nessSchedule: { day: L; plan: L }[] = [
  { day: { en: "Day 1, 28 January", bn: "১ম দিন, ২৮ জানুয়ারি" }, plan: { en: "[Opening, olympiads, exhibitions open]", bn: "[উদ্বোধন, অলিম্পিয়াড, প্রদর্শনী শুরু]" } },
  { day: { en: "Day 2, 29 January", bn: "২য় দিন, ২৯ জানুয়ারি" }, plan: { en: "[Team contests and talks]", bn: "[দলীয় প্রতিযোগিতা ও আলোচনা]" } },
  { day: { en: "Day 3, 30 January", bn: "৩য় দিন, ৩০ জানুয়ারি" }, plan: { en: "[Finals and prize-giving]", bn: "[ফাইনাল ও পুরস্কার বিতরণ]" } },
];

export const nessPast: { edition: L; year: string; slug?: string; note: L }[] = [
  { edition: { en: "9th", bn: "৯ম" }, year: "2026", note: { en: "4–10 April 2026. [Highlights to add]", bn: "৪–১০ এপ্রিল ২০২৬। [উল্লেখযোগ্য দিক যোগ করতে হবে]" } },
  { edition: { en: "8th", bn: "৮ম" }, year: "2025", slug: "ness-2025", note: { en: "Nearly 2,000 participants from 60+ institutions. Formula IUT car unveiled.", bn: "৬০টির বেশি প্রতিষ্ঠানের প্রায় ২,০০০ অংশগ্রহণকারী। ফর্মুলা আইইউটি গাড়ি উন্মোচন।" } },
  { edition: { en: "7th", bn: "৭ম" }, year: "2024", slug: "ness-2024", note: { en: "About 2,500 participants and 6,000 visitors. Hybrid rocket engine test.", bn: "প্রায় ২,৫০০ অংশগ্রহণকারী ও ৬,০০০ দর্শনার্থী। হাইব্রিড রকেট ইঞ্জিন পরীক্ষা।" } },
  { edition: { en: "6th", bn: "৬ষ্ঠ" }, year: "[2023?]", note: { en: "[Details to add]", bn: "[তথ্য যোগ করতে হবে]" } },
  { edition: { en: "5th", bn: "৫ম" }, year: "2022", slug: "ness-2022", note: { en: "Back on campus after an online year.", bn: "অনলাইনে এক বছরের পর আবার ক্যাম্পাসে।" } },
  { edition: { en: "4th", bn: "৪র্থ" }, year: "2020", note: { en: "[Details to add]", bn: "[তথ্য যোগ করতে হবে]" } },
  { edition: { en: "3rd", bn: "৩য়" }, year: "2019", slug: "ness-2019", note: { en: "15 events across three age groups.", bn: "তিনটি বয়সভিত্তিক বিভাগে ১৫টি ইভেন্ট।" } },
  { edition: { en: "2nd", bn: "২য়" }, year: "2018", note: { en: "[Details to add]", bn: "[তথ্য যোগ করতে হবে]" } },
  { edition: { en: "1st", bn: "১ম" }, year: "2017", note: { en: "The first Earth and Space Carnival.", bn: "প্রথম আর্থ অ্যান্ড স্পেস কার্নিভাল।" } },
];

export const nessFaq: { q: L; a: L }[] = [
  { q: { en: "Who can take part?", bn: "Who can take part?" }, a: { en: "Students from Nursery to Class 12, including O and A Levels, from Notre Dame College and other institutions. University students can also enter Photosphere 7.0.", bn: "Students from Nursery to Class 12, including O and A Levels, from Notre Dame College and other institutions. University students can also enter Photosphere 7.0." } },
  { q: { en: "Do visitors need a pass?", bn: "Do visitors need a pass?" }, a: { en: "Yes. The exhibitions and programmes are open with either a solo pass or a team pass.", bn: "Yes. The exhibitions and programmes are open with either a solo pass or a team pass." } },
  { q: { en: "How do teams work?", bn: "How do teams work?" }, a: { en: "A team has up to 3 members. Each member buys a team pass (300 BDT) and registers separately. [Whether members must be from the same institution]", bn: "A team has up to 3 members. Each member buys a team pass (300 BDT) and registers separately. [Whether members must be from the same institution]" } },
  { q: { en: "What do winners get?", bn: "What do winners get?" }, a: { en: "A certificate and a crest. In team segments, every member of a winning team gets their own. [Whether every participant gets a certificate]", bn: "A certificate and a crest. In team segments, every member of a winning team gets their own. [Whether every participant gets a certificate]" } },
  { q: { en: "Where are the full rules for each segment?", bn: "Where are the full rules for each segment?" }, a: { en: "Each segment gets its own post with full details on the club's Facebook page.", bn: "Each segment gets its own post with full details on the club's Facebook page." } },
];

export const partnersPast =
  "Western Engineering, Bata, JR Recycling, Bangladesh Olympiad on Astronomy and Astrophysics, National Earth Olympiad, MICB Scientific Society, GPH Ispat, Shamsul Alamin Real Estate, The Daily Star";

// ---------------------------------------------------------------------------
// Executives page (like the Math Club's): three tabs, Officers, Current, Former.
// Add a name or photo only with that student's consent. Photos go in
// public/executives/ and are referenced as "/executives/file.jpg".
// ---------------------------------------------------------------------------

export type Person = {
  name: L;
  post: L;
  /** The wing or department, e.g. Fieldwork. Members of the current panel are grouped by it. */
  department?: L;
  /** A portrait photo, e.g. "/executives/name.jpg". */
  photo?: string;
  /** A square poster made by the club, as "/executives/2026-27/name" with -480.webp and -960.webp files beside it. */
  poster?: string;
};

const t = (s: string): L => ({ en: s, bn: s });
const ec = (name: string, post: string, wing: string | null, slug: string): Person => ({
  name: t(name),
  post: t(post),
  ...(wing ? { department: t(wing) } : {}),
  poster: `/executives/2026-27/${slug}`,
});

/** Teachers and college officers who guide the club. */
export const officers: Person[] = [
  { name: { en: "Dr Fr Hemanto Pius Rozario", bn: "ড. ফা. হেমন্ত পিউস রোজারিও" }, post: { en: "Principal, Notre Dame College", bn: "অধ্যক্ষ, নটর ডেম কলেজ" } },
  { name: { en: "Md Nazmul Hassan", bn: "মো. নাজমুল হাসান" }, post: { en: "Moderator [since year]", bn: "মডারেটর [কবে থেকে]" } },
  { name: { en: "[Name]", bn: "[নাম]" }, post: { en: "[Founding moderator, 1992]", bn: "[প্রতিষ্ঠাতা মডারেটর, ১৯৯২]" } },
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
      { name: { en: "[Name]", bn: "[নাম]" }, post: { en: "President", bn: "সভাপতি" } },
      { name: { en: "[Name]", bn: "[নাম]" }, post: { en: "General Secretary", bn: "সাধারণ সম্পাদক" } },
    ],
  },
];

export type ResourceKind = "papers" | "handouts" | "magazines" | "astrophotography" | "sky-guides";
export const resourceKinds: Record<ResourceKind, L> = {
  papers: { en: "Olympiad papers", bn: "অলিম্পিয়াডের প্রশ্ন" },
  handouts: { en: "Workshop handouts", bn: "কর্মশালার হ্যান্ডআউট" },
  magazines: { en: "Wall magazines", bn: "দেয়াল পত্রিকা" },
  astrophotography: { en: "Astrophotography", bn: "অ্যাস্ট্রোফটোগ্রাফি" },
  "sky-guides": { en: "Sky guides", bn: "আকাশ পরিচিতি" },
};
/** Add files to /public/resources and list them here. */
export const resources: { kind: ResourceKind; title: L; year: string; url: string; format: string }[] = [];

export const galleryAlbums: { title: L; date: string; photos: string[] }[] = [
  { title: { en: "8th NESS", bn: "৮ম NESS" }, date: "2025-02", photos: [] },
  { title: { en: "7th NESS", bn: "৭ম NESS" }, date: "2024-05", photos: [] },
  { title: { en: "Cosmoterrium 2026", bn: "কসমোটেরিয়াম ২০২৬" }, date: "2026-01", photos: [] },
  { title: { en: "5th NESS", bn: "৫ম NESS" }, date: "2022-05", photos: [] },
];
