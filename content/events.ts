
// The club's events. Facts come from press coverage (see `sources`) and the club's own write-ups
// ("Intra events of NDESC", 24 Nov 2026: Stargazing Night Camp 2024, Botalinnaeus 2025,
// Fruits Fiesta 2025 and Cosmoterrium 2026).
// To add an event, copy an entry, give it a new slug and fill in the fields.

export type EventType = "ness" | "cosmoterrium" | "space-camp" | "workshop" | "stargazing" | "botalinnaeus" | "fruits-fiesta";

/** One part of an event's programme. `when` is shown above the title (a date or day); `items` are its own sub-parts. */
export type EventSegment = { title: string; when?: string; text?: string; items?: { title: string; text: string }[] };

export type ClubEvent = {
  slug: string;
  type: EventType;
  start: string; // YYYY-MM-DD
  end?: string;
  title: string;
  venue: string;
  summary: string;
  /** Shown as [placeholder] when the club still has to confirm something about the event. */
  todo?: string;
  facts?: { label: string; value: string }[];
  highlights?: string[];
  /** A longer write-up of the event, one string per paragraph. */
  about?: string[];
  /** Named parts of the event, in order. */
  segments?: EventSegment[];
  /** Heading for `segments` (default "Segments"). */
  segmentsTitle?: string;
  /** A closing paragraph shown after the segments. */
  closing?: string;
  partners?: string;
  sources?: { title: string; url: string }[];
  /** Poster or banner. Files go in public/, e.g. public/ness/. `name` is the file name without the width and extension. */
  poster?: { name: string; widths: number[]; alt: string; social?: string };
};

/** The official NESS X banner, used on the home page, the NESS page and the event page. */
export const ness2027Banner = {
  name: "/ness/ness-2027",
  widths: [768, 1280, 1920],
  social: "/ness/ness-2027-og.jpg",
  alt: "NESS X, the 10th National Earth and Space Summit: two polar bears on melting ice reach towards each other under a pastel sky, with the Notre Dame College and club logos.",
};

const ndc: string = "Notre Dame College, Dhaka";

export const eventTypes: Record<EventType, string> = {
  ness: "NESS",
  cosmoterrium: "Cosmoterrium",
  "space-camp": "Space camp",
  workshop: "Workshop",
  stargazing: "Stargazing",
  botalinnaeus: "Botalinnaeus",
  "fruits-fiesta": "Fruits Fiesta",
};

export const events: ClubEvent[] = [
  {
    slug: "ness-x",
    type: "ness",
    start: "2027-01-28",
    end: "2027-01-30",
    // Named like the other summits in the events list (Mahmud, 21 Nov 2026); the home page box still says NESS X.
    title: "10th National Earth and Space Summit",
    venue: ndc,
    summary: "NESS X, the 10th summit: three days of olympiads, quizzes, team contests, exhibitions and talks for students from Nursery to Class 12.",
    todo: "day-by-day schedule",
    facts: [
      { label: "Passes", value: "Solo 200 BDT, team 300 BDT per person. Online submission segments are free." },
      { label: "Registration", value: "Open now, online or at registration booths" },
    ],
    poster: ness2027Banner,
  },
  {
    slug: "cosmoterrium-2",
    type: "cosmoterrium",
    start: "2026-10-09",
    title: "Cosmoterrium 2.0",
    venue: "Notre Dame College, for its students only",
    summary: "The second Cosmoterrium, the club's intra-college festival.",
    todo: "segments, passes and highlights",
  },
  {
    slug: "cosmoterrium-2026",
    type: "cosmoterrium",
    start: "2026-01-17",
    title: "Cosmoterrium 1.0",
    venue: "Notre Dame College, for its students only",
    summary: "The club's intra-college festival: astronomy and Earth science olympiads, a biology quiz, the Astral Hunt, starmapping, a movie quiz and an earthquake awareness session.",
    facts: [
      { label: "Passes", value: "Solo pass 70 BDT, team pass 100 BDT per person" },
    ],
    about: [
      "Cosmoterrium gave NDESC members a day to dive into astronomy, Earth science and biology through competitions, interactive activities and team challenges. The day-long event mixed learning with fun and kept everyone busy from start to finish.",
    ],
    segments: [
      { title: "Astronomy Olympiad", text: "Open to all participants. Contestants tackled questions on celestial bodies, radiation, celestial mechanics and observational astronomy, testing both their knowledge and their speed." },
      { title: "Earth Science Olympiad", text: "Questions on geology, natural disasters and planetary processes. Participants applied what they knew to real-world problems and tricky scenarios." },
      { title: "Biology Quiz", text: "Questions from the NCTB HSC biology syllabus. The quiz rewarded quick thinking and showed the links between Earth and life sciences." },
      { title: "Astral Hunt", text: "The highlight of the day: a team challenge in which members worked together to solve scientific puzzles and hunt for treasure. Strategy and teamwork were the keys to winning." },
      { title: "Starmapping and Movie Quiz", text: "In Starmapping, members identified constellations and celestial coordinates. The Movie Quiz tested science knowledge with questions inspired by popular films." },
      { title: "Earthquake Awareness Session", text: "A detailed session on seismic activity, its causes and its real-life effects, explaining complex geological processes simply with examples and demonstrations." },
      { title: "Fun games", text: "Games throughout the day kept energy high and gave participants a break between competitions." },
    ],
    closing: "Cosmoterrium balanced academic challenges with interactive activities, sparking curiosity and teamwork and deepening NDESC members' interest in astronomy and Earth science.",
    sources: [{ title: "HappeningNext event listing", url: "https://happeningnext.com/event/cosmoterrium-2026-eid3a0d7pqrpo" }],
  },
  {
    slug: "fruits-fiesta-2025",
    type: "fruits-fiesta",
    start: "2025-07-30",
    title: "Fruits Fiesta 2025 (Season 6)",
    venue: "Notre Dame College, for its students only",
    summary: "The sixth Fruits Fiesta: a fruit exhibition from around the world, the Pomology Quest, fruit crosswords, fresh juice and prizes.",
    facts: [
      { label: "Time", value: "12:00 PM, for about two hours" },
    ],
    about: [
      "Fruits Fiesta gives students a creative break from academic pressure. Season 6 turned the campus into a celebration of nature's sweetest gifts, with segments that were both educational and entertaining.",
    ],
    segments: [
      { title: "Exhibition of fruits", text: "The centrepiece: a wide variety of fruits from different corners of the world, each with a short description, so visitors could learn about exotic and familiar species while enjoying the colourful displays." },
      { title: "Pomology Quest and fruit crosswords", text: "The Pomology Quest tested participants' knowledge of fruit science, and fruit-themed crosswords offered a fun, interactive way to engage with the subject." },
      {
        title: "Treats",
        text: "The day was as much about tasting as learning.",
        items: [
          { title: "Fresh fruit juice", text: "A refreshing treat served during the celebration." },
          { title: "Fruit bites", text: "A free fruit mix for everyone who came." },
        ],
      },
      { title: "Recognition and rewards", text: "Every participant received a participation certificate. Top performers in each segment won prizes, a crest and a Certificate of Excellence." },
    ],
    closing: "Fruits Fiesta Season 6 was more than an exhibition: it was a cheerful afternoon of laughter and togetherness, and a welcome fruitful escape for the whole college.",
  },
  {
    slug: "botalinnaeus-2025",
    type: "botalinnaeus",
    start: "2025-04-30",
    end: "2025-06-25",
    title: "Botalinnaeus 2025",
    venue: "Notre Dame College, for its students only",
    summary: "A three-part botany programme: a plant identification seminar, a field trip around the NDC campus, and a final round with a quiz and a plant hunt.",
    about: [
      "Botalinnaeus is one of the club's signature intra events, built to bridge the gap between classroom theory and the natural world. The 2025 edition took students through botany in three phases, from lectures to hands-on exploration.",
    ],
    segmentsTitle: "Programme",
    segments: [
      {
        when: "Day 1 · 30 April 2025",
        title: "Seminar on botanical identification",
        text: "An introductory seminar in Room 434, led by Assistant Professor Mohammed Nazmul Hasan and Lecturer Mohammed Golam Kibriya of the Department of Biology. Students explored the rich diversity of plants and learned the technical basics of identifying them.",
      },
      {
        when: "Day 2 · 16 June 2025",
        title: "Field trip",
        text: "The learning moved outdoors. With biology teachers Mohammed Nazmul Hasan, Mohammed Golam Kibriya, Mohammed Johirul Islam and Abul Bashar, students explored the plants and animals of the NDC campus and put their identification skills to work.",
      },
      {
        when: "Day 3 · 25 June 2025",
        title: "Grand finale",
        text: "A final competition that combined knowledge and speed.",
        items: [
          { title: "Botalinnaeus Quiz", text: "Written tests in the classroom on the theory of plants." },
          { title: "Plant Hunt", text: "An outdoor race to find and identify specific plant species across the campus." },
        ],
      },
    ],
    closing: "Botalinnaeus 2025 was a celebration of botany, and left participants with a deeper appreciation of the plants growing right on their own campus.",
  },
  {
    slug: "stargazing-night-camp-2024",
    type: "stargazing",
    start: "2024-10-22",
    title: "Stargazing Night Camp 2024",
    venue: "Notre Dame College, for its students only",
    summary: "An overnight camp under the stars: Saturn's rings through three telescopes, a session with SPARRSO, a stargazing quiz and a barbecue.",
    facts: [
      { label: "Time", value: "Reporting at 4:00 PM, through the night" },
    ],
    partners: "SPARRSO (Bangladesh Space Research and Remote Sensing Organization), MICB Scientific Society (two telescopes)",
    about: [
      "The Stargazing Night Camp invited astronomy enthusiasts to explore the night sky through the lens of a telescope, blending scientific discovery with a lively social atmosphere.",
    ],
    segments: [
      { title: "Deep space observation", text: "The main focus of the night was Saturn and its rings. Students used three telescopes: one belonging to NDESC and two brought in through a collaboration with MICB Scientific Society." },
      { title: "Expert session with SPARRSO", text: "A session arranged with SPARRSO (Bangladesh Space Research and Remote Sensing Organization), where speakers shared professional insights into space science and satellite technology." },
      { title: "Stargazing quiz", text: "A quiz on what participants had learned during the observation and the expert session. It was a highlight of the night, and the top scorers won prizes." },
      { title: "Starlit socialising", text: "A barbecue kept spirits high, giving students the chance to bond and talk about what they had seen over a meal under the stars." },
    ],
    closing: "The Stargazing Night Camp 2024 gave the next generation of astronomers at Notre Dame College a night of magical moments, laughter and togetherness.",
  },
  {
    slug: "ness-2026",
    type: "ness",
    start: "2026-04-09",
    end: "2026-04-11",
    title: "9th National Earth and Space Summit",
    venue: ndc,
    summary: "The 9th summit: olympiads, quizzes, team contests, exhibitions and talks at Notre Dame College.",
    todo: "highlights, participants and partners",
  },
  {
    slug: "ness-2025",
    type: "ness",
    start: "2025-02-20",
    end: "2025-02-22",
    title: "8th National Earth and Space Summit",
    venue: ndc,
    summary: "Nearly 2,000 participants from more than 60 institutions, from primary to higher secondary level.",
    facts: [
      { label: "Reach", value: "Nearly 2,000 participants from more than 60 institutions" },
    ],
    partners: "Western Engineering (title sponsor), Bata (gold sponsor), Savoy Ice Cream, Dot Internet, MICB Scientific Society (telescope partner)",
    highlights: [
      "Astrophotography talk by Zubuyer Kaolin, with nearly 1,000 in the audience, and the Photosphere exhibition of his work.",
      "Students from the Islamic University of Technology unveiled the Formula IUT student race car.",
      "Visitors watched the Sun through a solar telescope.",
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
    title: "7th National Earth and Space Summit",
    venue: ndc,
    summary: "About 2,500 participants and 6,000 visitors from more than 50 institutes, across 27 competitions.",
    partners: "JR Recycling (title sponsor), Bata Children's Programme, BDOAA and National Earth Olympiad (academic partners), MICB Scientific Society (telescope partner)",
    highlights: [
      "Olympiad questions set by the Bangladesh Olympiad on Astronomy and Astrophysics and the National Earth Olympiad.",
      "Amateur Experimental Rocketry Dhaka tested a hybrid rocket engine.",
      "The Astral Hunt, a campus treasure hunt with astronomy clues, and the Astro and Eco Ideation contest.",
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
    title: "5th National Earth and Space Summit",
    venue: ndc,
    summary: "The summit came back to campus after an online year, with more than 15 activities on ecology and astronomy.",
    todo: "confirm reach: press reports differ",
    sources: [{ title: "Dhaka Tribune: Fifth National Earth and Space Summit held at Notre Dame College", url: "https://www.dhakatribune.com/bangladesh/288904/fifth-national-earth-and-space-summit-held-at" }],
  },
  {
    slug: "astronomy-workshop-2020",
    type: "workshop",
    start: "2020-03-11",
    title: "Astronomy Workshop with BARC",
    venue: ndc,
    summary: "A workshop run with the Bangladesh Astronomy Research Center for Notre Dame College students.",
    sources: [{ title: "Bangladesh Astronomy Research Center news", url: "https://barcbd.org/news/" }],
  },
  {
    slug: "ness-2019",
    type: "ness",
    start: "2019-09-20",
    end: "2019-09-21",
    title: "3rd National Earth and Space Summit",
    venue: ndc,
    summary: "15 events for junior, secondary and higher secondary students, from olympiads to sci-fi story writing.",
    partners: "GPH Ispat (presenting), Shamsul Alamin Real Estate (gold sponsor), The Daily Star (media)",
    sources: [{ title: "Youth Opportunities: 3rd National Earth and Space Summit 2019", url: "https://www.youthop.com/bd/competitions/3rd-national-earth-space-summit-2019-in-dhaka" }],
  },
  {
    slug: "space-camp-2018",
    type: "space-camp",
    start: "2018-10-11",
    end: "2018-10-12",
    title: "2nd National Space Camp",
    venue: ndc,
    summary: "Stargazing night camp, workshops, Space Olympiad, wall magazines, Space Buzz quiz and Space Talk.",
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
