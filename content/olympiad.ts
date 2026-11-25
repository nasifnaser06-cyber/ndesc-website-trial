
// NDESC's Olympiad teams. One source for the About page cards, /olympiad-teams/ and each team page.
// Facts come from the club: the About page text, and "The NDESC Olympiad Teams" document (23 Nov 2026)
// for Team Interstellar and Team Terrestrial (history, mentors, members and achievements by year).
// Where that document and a published result disagreed, the published result was used (see the
// notes beside those items). Sections with no content yet stay empty and the pages leave them out.

export type Achievement = {
  /** Left out when the club did not give the year. */
  year?: string;
  competition: string;
  /** e.g. "Silver medal", "Honourable mention". Participation alone is not an achievement. */
  award: string;
  /** Student or team credit, only with their permission. */
  credit?: string;
  /** Link to an official result or news report. */
  source?: { label: string; url: string };
};

/** One year's team: its mentors, advisors and members. */
export type Cohort = {
  year: string;
  mentors: { name: string; role: string }[];
  advisors?: string[];
  members: string[];
};

export type OlympiadTeam = {
  slug: "interstellar" | "terrestrial" | "helix";
  name: string;
  /** The international Olympiad the team prepares for. */
  olympiad: { name: string; short: string };
  /** Field shown on the team's card and page. */
  discipline: string;
  newlyFormed?: boolean;
  overview: string;
  /** Club activities that build the team (from the About page). */
  preparation: string[];
  selection?: string;
  /** Newest first. */
  cohorts: Cohort[];
  achievements: Achievement[];
  milestones: { year: string; text: string }[];
  photos: { src: string; alt: string }[];
  resources: { title: string; url: string }[];
};

const prepCommon: string[] = [
  "Weekly meetings and informative sessions.",
  "Team selection tests held by the club, often with universities and research teams.",
  "Guidance from experienced and award-winning mentors.",
];

// From "The NDESC Olympiad Teams" document: what the Interstellar and Terrestrial programmes include.
const prepDoc: string[] = [
  "Regular classes and assignments covering the whole syllabus.",
  "Frequent assessments, so every member keeps improving.",
  "Practical, hands-on training.",
];

const selectionFor = (syllabus: string): string =>
  `Every year about 7 to 10 members are selected for the team through team selection tests (TSTs). Before the tests, the club holds at least two sessions to introduce NDESC members to the ${syllabus} syllabus.`;

const terrestrialAdvisors = ["Ahsanur Razee", "Arindom Saha", "Mohtasim Hafiz", "Iftekhar Hossain Iftee"];

const founded = {
  year: "2023",
  text: "Team founded by Iftekhar Hossain Iftee with Dhrubo Hridraz, Ashraful Islam Mahi and Shah Ahmed Jubaer.",
};

export const olympiadTeams: OlympiadTeam[] = [
  {
    slug: "interstellar",
    name: "Team Interstellar",
    olympiad: { name: "International Olympiad on Astronomy and Astrophysics", short: "IOAA" },
    discipline: "Astronomy and astrophysics",
    overview: "Team Interstellar is NDESC's astronomy team. Guided by a mentor panel, its members prepare for the Bangladesh Olympiad on Astronomy and Astrophysics (BDOAA) and the International Olympiad on Astronomy and Astrophysics through regular sessions, assessments and practical training.",
    preparation: [
      ...prepDoc,
      prepCommon[1],
      "Stargazing and solar observation with the club's own telescope.",
    ],
    selection: selectionFor("Astronomy Olympiad"),
    cohorts: [
      {
        year: "2026",
        mentors: [
          { name: "Jaber Ibner Taher", role: "PhD in Physics, NC State University; IOAA 2018" },
          { name: "Sheikh Hasin Abrar Alvi", role: "IOAA 2024" },
          { name: "Tasdik Ahmed Tonmay", role: "IOAA 2025 silver medallist" },
        ],
        members: ["Sajid Aman", "M Fahim Rahman", "Mohammed Abrar", "Md Fahim Foysal", "Tahmid Jahan Iram", "Tawsif Muttaky", "Radi Amamul"],
      },
      {
        year: "2025",
        mentors: [
          { name: "Jaber Ibner Taher", role: "PhD in Physics, NC State University; IOAA 2018" },
          { name: "Sheikh Hasin Abrar Alvi", role: "IOAA 2024" },
        ],
        members: [
          "Tasdik Ahmed Tonmay", "Shaikh Taassuk Ahmed", "Junaed Labeeb Al Waasi", "Md. Shahriar Kabir", "Nirban Bin Shahjhan",
          "Sidratul Muntaha Masud", "Sadik Jafrullah Nabil", "Ishmum Mahdy Labeeb", "Mehrab Hasan", "Abhradeep Saha",
        ],
      },
      {
        year: "2024",
        mentors: [{ name: "Jaber Ibner Taher", role: "PhD in Physics, NC State University; IOAA 2018" }],
        members: ["Sheikh Hasin Abrar Alvi", "Labib Bin Azad", "Omor Bin Hayat", "Raiyan Kawsar", "Sheikh Fahim Mahmud", "Radh Chowdhury"],
      },
    ],
    achievements: [
      {
        // From the club's congratulation post, 24 Nov 2026.
        year: "2026",
        competition: "Team Selection Test (TST) for the International Olympiad on Astronomy and Astrophysics (IOAA) 2026",
        award: "Two members selected for Team Bangladesh",
        credit: "Sajid Aman and Junaed Labeeb Al Waasi, with Abrar Rahman also reaching the TST",
      },
      {
        year: "2026",
        competition: "Bangladesh Physics Olympiad (BDPhO) 2026",
        award: "Third place and national winner",
        credit: "Tasdik Ahmed Tonmay, Team Interstellar 2025",
      },
      {
        year: "2026",
        competition: "Bangladesh Physics Olympiad (BDPhO) 2026",
        award: "Regional winners",
        credit: "Several members of Team Interstellar 2025",
      },
      {
        year: "2025",
        competition: "International Olympiad on Astronomy and Astrophysics (IOAA) 2025",
        award: "Silver medal",
        // His IOAA 2024 bronze was won at Govt. Laboratory High School, Rajshahi, before he joined NDC
        // (The Daily Star, 31 Aug 2024), so it is mentioned in the credit rather than listed as the team's.
        credit: "Tasdik Ahmed Tonmay, Team Interstellar 2025 (he also won bronze at IOAA 2024, before joining NDESC)",
      },
      {
        year: "2025",
        competition: "BDOAA and BDAO 2025",
        award: "All 10 members national winners and campers, including first place in BDOAA",
        credit: "Team Interstellar 2025",
      },
      {
        year: "2025",
        competition: "Asian Physics Olympiad (APhO) 2025",
        award: "Honourable mention",
        credit: "Omor Bin Hayat, Team Interstellar 2024",
      },
      {
        year: "2024",
        competition: "International Olympiad on Astronomy and Astrophysics (IOAA) 2024",
        award: "Honourable mention",
        credit: "Labib Bin Azad, Team Interstellar 2024",
        source: { label: "The Daily Star", url: "https://www.thedailystar.net/node/3690826" },
      },
      {
        year: "2024",
        competition: "Bangladesh Olympiad on Astronomy and Astrophysics (BDOAA) 2024",
        award: "All 6 members national winners and campers",
        credit: "Team Interstellar 2024",
      },
    ],
    milestones: [
      {
        year: "2026",
        text: "Sajid Aman and Junaed Labeeb Al Waasi were selected to represent Bangladesh at IOAA 2026 in Hanoi, Vietnam, after the Regional, National and Team Selection Test rounds. IOAA has a theory exam, a data analysis exam, an observation exam and a team competition.",
      },
      {
        year: "2025",
        text: "Tasdik Ahmed Tonmay represented Bangladesh at IOAA 2025, and Omor Bin Hayat represented Bangladesh at the Asian Physics Olympiad for the second year running.",
      },
      {
        year: "2024",
        text: "Three members, Sheikh Hasin Abrar Alvi, Radh Chowdhury and Labib Bin Azad, represented Bangladesh at IOAA 2024. Omor Bin Hayat represented Bangladesh at the Asian Physics Olympiad 2024.",
      },
      founded,
    ],
    photos: [],
    resources: [],
  },
  {
    slug: "terrestrial",
    name: "Team Terrestrial",
    olympiad: { name: "International Earth Science Olympiad", short: "IESO" },
    discipline: "Earth science",
    overview: "Team Terrestrial is NDESC's Earth science team. Guided by a mentor panel, its members prepare for the National Earth Olympiad (NEO) and the International Earth Science Olympiad through regular sessions, assessments and practical training.",
    preparation: [...prepDoc, prepCommon[1]],
    selection: selectionFor("Earth Science Olympiad"),
    cohorts: [
      {
        year: "2026",
        mentors: [
          { name: "Ashraful Islam Mahi", role: "Founding mentor" },
          { name: "Sheikh Fahim Mahmud", role: "Chief mentor" },
          { name: "Abrar Nafis Sadeque", role: "Mentor" },
          { name: "Shaikh Taassuk Ahmed", role: "Mentor" },
        ],
        members: ["Shahad Shahriar", "Tawsif Muttaky", "Tawhidur Rahman", "M Rafat Chy", "Subrata Nabi", "Israk Tafhim", "Md. Omar Faruk"],
      },
      {
        year: "2025",
        mentors: [
          { name: "Ashraful Islam Mahi", role: "Founding mentor" },
          { name: "Sheikh Fahim Mahmud", role: "Chief mentor" },
          { name: "Abrar Nafis Sadeque", role: "Mentor" },
          { name: "Shaikh Taassuk Ahmed", role: "Mentor" },
        ],
        advisors: terrestrialAdvisors,
        members: ["Muhit Rahman", "Junaed Labeeb Al Waasi", "Md. Shahriar Kabir", "Tasdik Ahmed Tonmay", "Nirban Bin Shahjhan", "Sadik Jafrullah Nabil", "Zamiul Islam"],
      },
      {
        year: "2024",
        mentors: [{ name: "Ashraful Islam Mahi", role: "Founding mentor" }],
        advisors: terrestrialAdvisors,
        members: ["Sheikh Fahim Mahmud", "Sheikh Hasin Abrar Alvi", "Radh Chowdhury", "Raiyan Kawsar", "Omar Bin Arif", "Abrar Nafis Sadeque"],
      },
    ],
    achievements: [
      {
        // From the club's congratulation post, 24 Nov 2026.
        year: "2026",
        competition: "Team Selection Test (TST) for the International Earth Science Olympiad (IESO) 2026",
        award: "Three members selected for Team Bangladesh",
        credit: "Team Terrestrial",
      },
      {
        year: "2025",
        competition: "International Earth Science Olympiad (IESO) 2025",
        award: "Bronze medal in the individual test (ITT) and an honourable mention",
        credit: "Sheikh Fahim Mahmud, Team Terrestrial 2024 and NDESC General Secretary",
        source: { label: "The Prestige", url: "https://theprestige.global/bangladesh-team-excels-clinching-5-medals-at-18th-ieso-in-china/" },
      },
      {
        year: "2024",
        competition: "National Earth Olympiad (NEO) 2024",
        award: "National winners and campers",
        credit: "Junaed Labeeb Al Waasi and Tasdik Ahmed Tonmay, Team Terrestrial 2025",
      },
      {
        year: "2023",
        competition: "International Earth Science Olympiad (IESO) 2023",
        award: "Gold in the International Team Field Investigation (ITFI), bronze in the Earth System Project (ESP) and bronze in the individual test (ITT)",
        credit: "Ashraful Islam Mahi, founding mentor",
      },
      {
        year: "2023",
        competition: "International Earth Science Olympiad (IESO) 2023",
        award: "Gold in the International Team Field Investigation (ITFI) and an honourable mention",
        credit: "Shaikh Taassuk Ahmed, Team Terrestrial mentor",
      },
      {
        // Year from Sheikh Hasin Abrar Alvi's own site (ICSO 2023); the club's document gives none.
        year: "2023",
        competition: "International Climate Science Olympiad",
        award: "Bronze medals",
        credit: "Sheikh Hasin Abrar Alvi and Raiyan Kawsar, Team Terrestrial 2024",
      },
      {
        competition: "National Earth Olympiad (NEO)",
        award: "Four divisional toppers reached the national round",
        credit: "Team Terrestrial 2025",
      },
      {
        competition: "Bangladesh Biology Olympiad (BDBO)",
        award: "National winner and camper",
        credit: "Sheikh Fahim Mahmud, Team Terrestrial 2024 and NDESC General Secretary",
      },
      {
        competition: "Bangladesh Biology Olympiad (BDBO)",
        award: "Regional champion",
        credit: "Md. Shahriar Kabir, Team Terrestrial 2025",
      },
    ],
    milestones: [
      {
        year: "2026",
        text: "Three members were selected to represent Bangladesh at IESO 2026 in Turin, Italy, after the Preliminary, Divisional, National, pre-TST and TST rounds. IESO has a written test, a practical test, an international team investigation and an Earth science project.",
      },
      {
        // The club's document also names Abrar Nafis Sadeque, but the published four-member team was
        // Mohammad Tahmid Rahman, Sheikh Fahim Mahmud, Omar Bin Arif and Faaris Ahmed Aayan (The Prestige).
        year: "2025",
        text: "Sheikh Fahim Mahmud and Omar Bin Arif represented Bangladesh at IESO 2025.",
      },
      founded,
    ],
    photos: [],
    resources: [],
  },
  {
    slug: "helix",
    name: "Team Helix",
    olympiad: { name: "International Biology Olympiad", short: "IBO" },
    discipline: "Biology",
    newlyFormed: true,
    overview: "Team Helix is NDESC's newly formed biology team. Under the guidance of the club's mentors, its members prepare for the International Biology Olympiad.",
    preparation: prepCommon,
    cohorts: [],
    achievements: [],
    milestones: [],
    photos: [],
    resources: [],
  },
];

/** The shared intro used on About and /olympiad-teams/ (the club's own wording). */
export const olympiadIntro: string = "NDESC also consists of its three renowned Olympiad teams. Under the guidance of experienced and award-winning mentors, team members prepare for these international Olympiads, achieving national and international recognition consistently every year.";

/** How Team Terrestrial and Team Interstellar began (from the club's document, lightly edited). */
export const olympiadHistory: string[] = [
  "The teams were started by Iftekhar Hossain Iftee, who turned his own struggle with unstructured Olympiad preparation into a mission for the club. Iftee became a national winner in the National Earth Olympiad (NEO) and qualified for the International Earth Science Olympiad (IESO), but could not represent Bangladesh because of his HSC exams.",
  "So that future students would have the academic mentoring he lacked, he set up two dedicated teams in 2023 with Dhrubo Hridraz, Ashraful Islam Mahi and Shah Ahmed Jubaer. Team Terrestrial was formed to mentor candidates for the NEO, and Team Interstellar for the Bangladesh Olympiad on Astronomy and Astrophysics (BDOAA). Among the first teams in Bangladesh built specifically for the IESO and the IOAA, they have since led NDESC members to success at national and international level.",
];

/** Why join (from the club's document). */
export const olympiadWhyJoin: { intro: string; items: { title: string; text: string }[] } = {
  intro: "Team Interstellar and Team Terrestrial brought dedicated Olympiad training to NDESC. Both are guided by experienced mentors in astronomy and Earth science, and the mentoring is demanding but well organised, so members are ready for international competition.",
  items: [
    { title: "Regular classes and assignments", text: "Structured learning that covers the whole syllabus." },
    { title: "Frequent assessments", text: "Regular checks on each member's progress, so everyone keeps growing." },
    { title: "Practical training", text: "Hands-on experience that has led to results at national and international level." },
  ],
};

/** How to join (from the club's document). */
export const olympiadHowToJoin: string = "Every year about 7 to 10 members are selected for each team through team selection tests (TSTs). Before the tests, the club holds at least two sessions to introduce NDESC members to the Olympiad syllabi.";

export function getTeam(slug: string): OlympiadTeam | undefined {
  return olympiadTeams.find((t) => t.slug === slug);
}
