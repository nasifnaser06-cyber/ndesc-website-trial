import type { L } from "@/lib/i18n";

// The club's events. Facts come from press coverage (see `sources`).
// To add an event, copy an entry, give it a new slug and fill in the fields.

export type EventType = "ness" | "cosmoterrium" | "space-camp" | "workshop" | "stargazing";

export type ClubEvent = {
  slug: string;
  type: EventType;
  start: string; // YYYY-MM-DD
  end?: string;
  title: L;
  venue: L;
  summary: L;
  /** Shown as [placeholder] when the club still has to confirm something about the event. */
  todo?: L;
  facts?: { label: L; value: L }[];
  highlights?: L[];
  partners?: string;
  sources?: { title: string; url: string }[];
  /** Poster or banner. Files go in public/, e.g. public/ness/. `name` is the file name without the width and extension. */
  poster?: { name: string; widths: number[]; alt: L; social?: string };
};

/** The official NESS 2027 banner, used on the home page, the NESS page and the event page. */
export const ness2027Banner = {
  name: "/ness/ness-2027",
  widths: [768, 1280, 1920],
  social: "/ness/ness-2027-og.jpg",
  alt: {
    en: "NESS, 10th National Earth and Space Summit 2027: two polar bears on melting ice reach towards each other under a pastel sky, with the Notre Dame College and club logos.",
    bn: "NESS, ১০ম ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট ২০২৭: গলতে থাকা বরফের ওপর দুটি মেরু ভালুক একে অপরের দিকে হাত বাড়িয়েছে, সঙ্গে নটর ডেম কলেজ ও ক্লাবের লোগো।",
  },
};

const ndc: L = { en: "Notre Dame College, Dhaka", bn: "নটর ডেম কলেজ, ঢাকা" };

export const eventTypes: Record<EventType, L> = {
  ness: { en: "NESS", bn: "NESS" },
  cosmoterrium: { en: "Cosmoterrium", bn: "কসমোটেরিয়াম" },
  "space-camp": { en: "Space camp", bn: "স্পেস ক্যাম্প" },
  workshop: { en: "Workshop", bn: "কর্মশালা" },
  stargazing: { en: "Stargazing", bn: "তারা দেখা" },
};

export const events: ClubEvent[] = [
  {
    slug: "ness-2027",
    type: "ness",
    start: "2027-01-28",
    end: "2027-01-30",
    title: { en: "National Earth and Space Summit 2027", bn: "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট ২০২৭" },
    venue: ndc,
    summary: {
      en: "NESS X, the 10th summit: three days of olympiads, quizzes, team contests, exhibitions and talks for students from Nursery to Class 12.",
      bn: "১০ম আসর: সারা দেশের শিক্ষার্থীদের জন্য তিন দিনের অলিম্পিয়াড, কুইজ, দলীয় প্রতিযোগিতা, আলোচনা আর প্রদর্শনী।",
    },
    todo: { en: "day-by-day schedule", bn: "দিনভিত্তিক সময়সূচি" },
    facts: [
      { label: { en: "Passes", bn: "Passes" }, value: { en: "Solo 200 BDT, team 300 BDT per person. Online submission segments are free.", bn: "Solo 200 BDT, team 300 BDT per person. Online submission segments are free." } },
      { label: { en: "Registration", bn: "Registration" }, value: { en: "Open now, online or at registration booths", bn: "Open now, online or at registration booths" } },
    ],
    poster: ness2027Banner,
  },
  {
    slug: "cosmoterrium-2026",
    type: "cosmoterrium",
    start: "2026-01-17",
    title: { en: "Cosmoterrium 2026", bn: "কসমোটেরিয়াম ২০২৬" },
    venue: { en: "Notre Dame College, for its students only", bn: "নটর ডেম কলেজ, শুধু এই কলেজের শিক্ষার্থীদের জন্য" },
    summary: {
      en: "The club's intra-college festival: olympiads, quizzes, games, sessions and the Stellarscapes astro exhibits.",
      bn: "ক্লাবের আন্তঃকলেজ উৎসব: অলিম্পিয়াড, কুইজ, খেলা, সেশন আর স্টেলারস্কেপস জ্যোতির্বিজ্ঞান প্রদর্শনী।",
    },
    facts: [
      { label: { en: "Passes", bn: "পাস" }, value: { en: "Solo pass 70 BDT, team pass 100 BDT per person", bn: "একক পাস ৭০ টাকা, দলীয় পাস জনপ্রতি ১০০ টাকা" } },
    ],
    sources: [{ title: "HappeningNext event listing", url: "https://happeningnext.com/event/cosmoterrium-2026-eid3a0d7pqrpo" }],
  },
  {
    slug: "ness-2025",
    type: "ness",
    start: "2025-02-20",
    end: "2025-02-22",
    title: { en: "8th National Earth and Space Summit", bn: "৮ম ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট" },
    venue: ndc,
    summary: {
      en: "Nearly 2,000 participants from more than 60 institutions, from primary to higher secondary level.",
      bn: "প্রাথমিক থেকে উচ্চমাধ্যমিক পর্যন্ত ৬০টির বেশি প্রতিষ্ঠানের প্রায় ২,০০০ অংশগ্রহণকারী।",
    },
    facts: [
      { label: { en: "Reach", bn: "অংশগ্রহণ" }, value: { en: "Nearly 2,000 participants from more than 60 institutions", bn: "৬০টির বেশি প্রতিষ্ঠানের প্রায় ২,০০০ অংশগ্রহণকারী" } },
    ],
    partners: "Western Engineering (title sponsor), Bata (gold sponsor), Savoy Ice Cream, Dot Internet, MICB Scientific Society (telescope partner)",
    highlights: [
      { en: "Astrophotography talk by Zubuyer Kaolin, with nearly 1,000 in the audience, and the Photosphere exhibition of his work.", bn: "জুবায়ের কাওলিনের অ্যাস্ট্রোফটোগ্রাফি আলোচনা, প্রায় ১,০০০ দর্শক, সঙ্গে তাঁর কাজের ফটোস্ফিয়ার প্রদর্শনী।" },
      { en: "Students from the Islamic University of Technology unveiled the Formula IUT student race car.", bn: "ইসলামিক ইউনিভার্সিটি অব টেকনোলজির শিক্ষার্থীরা ফর্মুলা আইইউটি রেস কার উন্মোচন করেন।" },
      { en: "Visitors watched the Sun through a solar telescope.", bn: "দর্শনার্থীরা সোলার টেলিস্কোপে সূর্য পর্যবেক্ষণ করেন।" },
    ],
    sources: [
      { title: "The Daily Star: Notre Dame College hosts 8th National Earth and Space Summit", url: "https://www.thedailystar.net/campus/noticeboard/news/notre-dame-college-hosts-8th-national-earth-and-space-summit-3840246" },
      { title: "The Financial Express: Notre Dame College hosts landmark 8th NESS", url: "https://thefinancialexpress.com.bd/youth-and-entrepreneurship/notre-dame-college-hosts-landmark-8th-national-earth-and-space-summit" },
    ],
  },
  {
    slug: "ness-2024",
    type: "ness",
    start: "2024-05-16",
    end: "2024-05-18",
    title: { en: "7th National Earth and Space Summit", bn: "৭ম ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট" },
    venue: ndc,
    summary: {
      en: "About 2,500 participants and 6,000 visitors from more than 50 institutes, across 27 competitions.",
      bn: "৫০টির বেশি প্রতিষ্ঠানের প্রায় ২,৫০০ অংশগ্রহণকারী ও ৬,০০০ দর্শনার্থী, ২৭টি প্রতিযোগিতা।",
    },
    partners: "JR Recycling (title sponsor), Bata Children's Programme, BDOAA and National Earth Olympiad (academic partners), MICB Scientific Society (telescope partner)",
    highlights: [
      { en: "Olympiad questions set by the Bangladesh Olympiad on Astronomy and Astrophysics and the National Earth Olympiad.", bn: "অলিম্পিয়াডের প্রশ্ন তৈরি করে বাংলাদেশ অলিম্পিয়াড অন অ্যাস্ট্রোনমি অ্যান্ড অ্যাস্ট্রোফিজিক্স ও ন্যাশনাল আর্থ অলিম্পিয়াড।" },
      { en: "Amateur Experimental Rocketry Dhaka tested a hybrid rocket engine.", bn: "অ্যামেচার এক্সপেরিমেন্টাল রকেট্রি ঢাকা একটি হাইব্রিড রকেট ইঞ্জিন পরীক্ষা করে।" },
      { en: "The Astral Hunt, a campus treasure hunt with astronomy clues, and the Astro and Eco Ideation contest.", bn: "অ্যাস্ট্রাল হান্ট, জ্যোতির্বিজ্ঞানের সূত্র ধরে ক্যাম্পাসজুড়ে গুপ্তধন খোঁজা, আর অ্যাস্ট্রো অ্যান্ড ইকো আইডিয়েশন।" },
    ],
    sources: [
      { title: "The Financial Express: 7th Nature and Earth Summit held", url: "https://today.thefinancialexpress.com.bd/print/7th-nature-and-earth-summit-held-1716050238" },
      { title: "Bangladesh Post: 7th National Earth and Space Summit begins", url: "https://bangladeshpost.net/posts/7th-nat-l-earth-space-summit-begins-at-ndc-on-may-16-137309" },
    ],
  },
  {
    slug: "ness-2022",
    type: "ness",
    start: "2022-05-19",
    end: "2022-05-21",
    title: { en: "5th National Earth and Space Summit", bn: "৫ম ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট" },
    venue: ndc,
    summary: {
      en: "The summit came back to campus after an online year, with more than 15 activities on ecology and astronomy.",
      bn: "অনলাইনে এক বছর আয়োজনের পর সামিট আবার ক্যাম্পাসে ফেরে, পরিবেশ ও জ্যোতির্বিজ্ঞান নিয়ে ১৫টির বেশি আয়োজন।",
    },
    todo: { en: "confirm reach: press reports differ", bn: "অংশগ্রহণের সংখ্যা নিশ্চিত করুন: পত্রিকার তথ্যে মিল নেই" },
    sources: [{ title: "Dhaka Tribune: Fifth National Earth and Space Summit held at Notre Dame College", url: "https://www.dhakatribune.com/bangladesh/288904/fifth-national-earth-and-space-summit-held-at" }],
  },
  {
    slug: "astronomy-workshop-2020",
    type: "workshop",
    start: "2020-03-11",
    title: { en: "Astronomy Workshop with BARC", bn: "BARC-এর সঙ্গে জ্যোতির্বিজ্ঞান কর্মশালা" },
    venue: ndc,
    summary: {
      en: "A workshop run with the Bangladesh Astronomy Research Center for Notre Dame College students.",
      bn: "বাংলাদেশ অ্যাস্ট্রোনমি রিসার্চ সেন্টারের সঙ্গে নটর ডেম কলেজের শিক্ষার্থীদের জন্য কর্মশালা।",
    },
    sources: [{ title: "Bangladesh Astronomy Research Center news", url: "https://barcbd.org/news/" }],
  },
  {
    slug: "ness-2019",
    type: "ness",
    start: "2019-09-20",
    end: "2019-09-21",
    title: { en: "3rd National Earth and Space Summit", bn: "৩য় ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট" },
    venue: ndc,
    summary: {
      en: "15 events for junior, secondary and higher secondary students, from olympiads to sci-fi story writing.",
      bn: "জুনিয়র, মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষার্থীদের জন্য ১৫টি ইভেন্ট, অলিম্পিয়াড থেকে সায়েন্স ফিকশন গল্প লেখা পর্যন্ত।",
    },
    partners: "GPH Ispat (presenting), Shamsul Alamin Real Estate (gold sponsor), The Daily Star (media)",
    sources: [{ title: "Youth Opportunities: 3rd National Earth and Space Summit 2019", url: "https://www.youthop.com/bd/competitions/3rd-national-earth-space-summit-2019-in-dhaka" }],
  },
  {
    slug: "space-camp-2018",
    type: "space-camp",
    start: "2018-10-11",
    end: "2018-10-12",
    title: { en: "2nd National Space Camp", bn: "২য় ন্যাশনাল স্পেস ক্যাম্প" },
    venue: ndc,
    summary: {
      en: "Stargazing night camp, workshops, Space Olympiad, wall magazines, Space Buzz quiz and Space Talk.",
      bn: "রাতভর তারা দেখার ক্যাম্প, কর্মশালা, স্পেস অলিম্পিয়াড, দেয়াল পত্রিকা, স্পেস বাজ কুইজ আর স্পেস টক।",
    },
    sources: [{ title: "Youth Opportunities: 2nd National Space Camp 2018", url: "https://www.youthop.com/bd/competitions/2nd-national-space-camp-2018-in-dhaka" }],
  },
];

/** Upcoming means the event has not finished on the day the site was built. */
export function isUpcoming(e: ClubEvent, today = new Date()): boolean {
  const end = new Date(`${e.end ?? e.start}T23:59:59+06:00`);
  return end >= today;
}

export function sortedEvents(): ClubEvent[] {
  return [...events].sort((a, b) => b.start.localeCompare(a.start));
}

export function getEvent(slug: string): ClubEvent | undefined {
  return events.find((e) => e.slug === slug);
}
