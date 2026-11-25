// NESS X: the 10th National Earth and Space Summit, 28 to 30 January 2027.
// From the club's official announcement (sent by Mahmud, 18 Nov 2026).
// The site is English only for now, so these are plain English strings.

import { photosphere } from "./photosphere";

/** A Photosphere segment's submission form, kept once in photosphere.ts. */
const psForm = (name: string) => photosphere.segments.find((s) => s.name === name)?.form;

export const nessx = {
  name: "NESS X",
  fullName: "10th National Earth and Space Summit",
  intro:
    "NESS X opens a portal between the terrestrial and the cosmic. From the microscopic wonders of Earth's biology to the mysteries of distant nebulae, it brings dreamers, thinkers and innovators together to redefine the future.",
  registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdodZ963ojsNZQ1HIoSFq_qBtl-7dgccnFdbsj9OGxNVMWiMQ/viewform",
};

export const passes: { name: string; price: string; detail: string }[] = [
  { name: "Solo pass", price: "200 BDT", detail: "Entry to all solo segments in your category." },
  {
    name: "Team pass",
    price: "300 BDT per person",
    detail: "Entry to both solo and team segments in your category. Teams have up to 3 members, and each member registers separately.",
  },
  { name: "Online submission segments", price: "Free", detail: "Open to everyone, no pass needed." },
];

export const passNote = "Either pass also gets you into the exhibitions and programmes.";

/** `link` turns the given words of `how` into a link (e.g. to the Campus Ambassador section). */
export const registerWays: { who: string; how: string; link?: { text: string; href: string } }[] = [
  { who: "Notre Dame College students", how: "Register in person at the registration booths in front of the Archbishop Ganguly Building." },
  {
    who: "Students from other institutions",
    how: "Register through our club partners, campus ambassadors, or the NESS X booth at your institution (if there is one).",
    link: { text: "campus ambassadors", href: "#campus-ambassadors" },
  },
  { who: "Anyone, online", how: "Fill in the online registration form." },
];

/** Campus Ambassador recruitment, from the club's Facebook post on the NESS X event (Mahmud, 24 Nov 2026). */
export const campusAmbassadors = {
  label: "For students at other institutions",
  title: "Become a Campus Ambassador",
  intro:
    "Ready to represent your institution at NESS X? The club is recruiting Campus Ambassadors (CAs): the direct link between our organising team and your institution, bringing the summit experience to your campus.",
  gains: [
    "Put your leadership, coordination, adaptability and communication skills into real action.",
    "Gain hands-on experience and official recognition for your contribution to the event.",
  ],
  protocol: "Ambassadors are expected to keep a professional manner and help their peers through the registration process.",
  applyUrl: "https://forms.gle/FjfnMng2HM7xyiKP9",
};

export const categories: { code: string; name: string; who: string }[] = [
  { code: "P", name: "Primary", who: "Nursery to Class 5" },
  { code: "J", name: "Junior", who: "Class 6 to 8" },
  { code: "S", name: "Secondary", who: "Class 9 and 10 (SSC-27) and O Levels" },
  { code: "HS", name: "Higher Secondary", who: "Class 11 and 12 (HSC-27) and A Levels" },
  { code: "C", name: "Combined", who: "Everyone competes together, with only 3 winners in the whole segment" },
];

export const categoryNote =
  "Each segment is open to certain categories, and you can only enter segments for the category your class or level belongs to.";

export const winnersNote =
  "Each category has three winners: Champion, 1st Runner-Up and 2nd Runner-Up. A segment open to P, J, S and HS has three winners in each of those categories. A Combined segment picks three winners from everyone. In team segments, all three members of a winning team get their own certificate and crest.";

export type Segment = {
  page?: string; name: string; cats: string[]; online?: boolean; desc: string[];
  /** `form`: the part's own submission form, shown as a Submit link. */
  parts?: { name: string; cats: string[]; desc: string; form?: string }[] };

export const soloSegments: Segment[] = [
  // First in the list so younger children see their segment straight away (Mahmud, 20 Nov 2026).
  {
    name: "Children's Craftwork",
    cats: ["P"],
    desc: [
      "For our youngest scientists, from Nursery to Class 5, to show their interest in the world through hands-on crafting, in a supportive, fun and imaginative setting.",
    ],
  },
  {
    name: "Astronomy Olympiad",
    cats: ["J", "S", "HS"],
    desc: [
      "The crown jewel of NESS X. Solve theoretical and mathematical questions on astrophysics and astronomy, plus questions on stars and constellations. Set by national winners and participants of the BDOAA and the IOAA.",
    ],
  },
  {
    name: "Earth Science Olympiad",
    cats: ["J", "S", "HS"],
    desc: [
      "Moves away from dry classroom theory to decode real geological and atmospheric phenomena. Set by winners and participants of the NEO and the IESO, with theoretical and mathematical questions that need critical thinking and creativity.",
    ],
  },
  {
    name: "Biology Olympiad",
    cats: ["J", "S", "HS"],
    desc: [
      "Explore the \"symphony of life\", from the dance of DNA to the behaviour of the animal kingdom. Crafted by national and international winners of the BDBO and IBO to mirror a national-level olympiad.",
    ],
  },
  {
    name: "Aerospace Olympiad",
    cats: ["J", "S", "HS"],
    desc: [
      "For anyone who sees physics in motion every time a plane takes off. A specialised test on aviation and its history, avionics, flight instruments, aeronautical engineering and aerodynamics.",
    ],
  },
  {
    name: "Father Timm Memorial Bio Quest",
    cats: ["S", "HS"],
    desc: [
      "A tribute to Father Timm. A MAT-style test that pushes your medical and biological knowledge, and good practice for future medical admission tests. It needs speed, accuracy and a broad grasp of human biology and related sciences.",
    ],
  },
  {
    name: "Climate and Ocean Quiz",
    cats: ["J", "S", "HS"],
    desc: [
      "A knowledge-based quiz on Earth's climate system and the dynamic world of the oceans, testing both concepts and facts. Accuracy, awareness and connecting scientific ideas are the keys.",
    ],
  },
  {
    name: "Turn The Coat",
    cats: ["S", "HS"],
    desc: [
      "A speaking segment. Argue for a scientific topic, then switch in a blink and argue against it. A high-pressure test of scientific knowledge, logic and public speaking.",
    ],
  },
  {
    name: "Star Mapping",
    cats: ["S", "HS"],
    desc: [
      "For dedicated stargazers. On a blank chart, identify constellations and astronomical objects, using celestial coordinates and the relative and seasonal positions of the stars. Show us your inner Hipparchus.",
    ],
  },
  {
    name: "3 Minute Professor",
    cats: ["J", "S", "HS"],
    desc: [
      "A speaking segment. After a few minutes to prepare, explain a mind-bending scientific topic to the crowd in exactly three minutes. Make the jargon simple without losing accuracy.",
    ],
  },
  {
    name: "Creative Writing (Sci-Fi)",
    cats: ["J", "S", "HS"],
    online: true,
    desc: ["Imaginative storytelling using the setting, technology and science of today's world, or one of dreams and theories."],
  },
  {
    name: "Creative Writing (Academic)",
    cats: ["J", "S", "HS"],
    online: true,
    desc: ["Dive into a scientific topic you love. Using evidence, images and data, present it in a clear, cohesive and engaging way."],
  },
  {
    name: "Geotagging",
    cats: ["C"],
    desc: [
      "A fast geography challenge in two rounds. In \"Map It Right\" you mark locations on a blank map. The top performers go on to \"Battle of the Maps\", a 1v1 knockout where you point to locations on a projected map with a stick, faster and more accurately than your opponent.",
    ],
  },
  {
    name: "Guess to Gain",
    cats: ["C"],
    desc: [
      "A fun, fast segment of rapid recognition and scientific wit. Identify famous scientists, rare minerals or distant stars from cryptic clues and blurry images.",
    ],
  },
  {
    name: "Photosphere 7.0",
    cats: ["PS-J", "PS-S", "PS-C"],
    online: true,
    page: "/ness/photosphere",
    desc: [
      "The visual art competition and exhibition of NESS X. Free to submit, up to 5 works per segment, through each segment's Google Form. PS-J is Class 6 to 10, PS-S is Class 11, 12 and university, and PS-C is everyone competing together. Selected work is shown at the summit.",
    ],
    parts: [
      { name: "Astro Photography", cats: ["PS-J", "PS-S"], desc: "Star trails, constellations, galaxies, nebulae: whatever in the night sky has mesmerised you most.", form: psForm("Astro Photography") },
      { name: "Eco Photography", cats: ["PS-J", "PS-S"], desc: "The raw, intricate nature of our Earth from your own perspective.", form: psForm("Eco Photography") },
      { name: "Poster Designing", cats: ["PS-C"], desc: "Posters that turn complex scientific or environmental ideas into striking, easy-to-grasp visuals.", form: psForm("Poster Designing") },
      { name: "AI Art", cats: ["PS-C"], desc: "Human imagination paired with generative AI, blending science and creativity in a single frame.", form: psForm("AI Art") },
    ],
  },
];

export const teamSegments: Segment[] = [
  {
    name: "Treasure Hunt: Astral Hunt",
    cats: ["C"],
    desc: [
      "A campus-wide treasure hunt for detectives with astronomical knowledge. Round one is a written riddle round. The top teams go on to round two, solving riddles hidden around the grounds to find the treasure.",
    ],
  },
  {
    name: "Eco and Space Buzz",
    cats: ["C"],
    desc: [
      "Known as the loudest quiz in the city. Teams of three get through a preliminary quiz to reach the grand stage for a fast buzzer final on ecology and space.",
    ],
  },
  {
    name: "Astro Movie Quiz",
    cats: ["C"],
    desc: [
      "For astro-cinephiles to show their inner Christopher Nolan. Plot details, scientific accuracy and how space is shown in our hand-picked films.",
    ],
  },
  {
    name: "PowerPoint Presentation",
    cats: ["C"],
    online: true,
    desc: [
      "Combine graphic design with scientific data to tell a visual story. Selected teams present in the final, on stage at Notre Dame College.",
    ],
  },
  {
    name: "Astro and Eco Project Showcase",
    cats: ["J", "S", "HS"],
    desc: [
      "Bring your project to Notre Dame College to submit it. Pick one theme. Ecology-based: a physical project that solves a real environmental problem, judged on creativity and its potential impact on sustainability. Astro and space-based: a scale model of a historical or futuristic spacecraft, from a classic satellite to a Mars rover or a deep-space probe.",
    ],
  },
  {
    name: "Wall Magazine",
    cats: ["J", "S", "HS"],
    desc: [
      "Deep research and artistic expression on biology, Earth or space science, in a hand-crafted wall magazine. Bring it to Notre Dame College to submit it.",
    ],
  },
  {
    name: "Scrapbook",
    cats: ["J", "S", "HS"],
    desc: [
      "A \"book of wonders\" that documents science through colour, texture and facts, in a personal, artistic format. Bring it to Notre Dame College to submit it.",
    ],
  },
];

export const specialSegments: Segment[] = [
  {
    name: "Special Committee: UNOOSA (MUN style)",
    cats: [],
    desc: [
      "Step into space diplomacy. Resolve disputes and manage conflicts in a high-stakes setting, applying your ideas to the final frontier. This segment has its own registration form, shared in its dedicated post.",
    ],
  },
];

export const programmes: { name: string; desc: string }[] = [
  { name: "Astro Exhibition: Stellarscapes 6.0", desc: "The college turns into a celestial wonderland of 3D models and interactive displays. NDESC's main astronomy showcase." },
  { name: "Photo Exhibition: Photosphere 7.0", desc: "Science meets visual art: the Earth and the cosmos through your lens, with the best digital art and posters." },
  { name: "Solar Observation", desc: "Look at the Sun through the club's own telescope with a solar filter, mornings and afternoons on every day if the sky is clear." },
  { name: "Astro Tech Showcase", desc: "Instruments and devices used to study the stars, and how to use them." },
  { name: "Astro Talk", desc: "Experts on the latest discoveries in astronomy and the future of deep-space exploration." },
  { name: "Bio and Eco Talk", desc: "Biodiversity, conservation and how life adapts on Earth, from expert speakers." },
  { name: "Game Segments", desc: "Mini-games around the campus to enjoy between the main segments." },
];

export const organizers: { name: string; role: string; phone: string; facebook: string }[] = [
  { name: "Tahsil Ivan Rifat", role: "Organizer", phone: "+880 1341-823660", facebook: "https://www.facebook.com/unbothered.individual.1.0/" },
  { name: "Arik Alam", role: "Organizer", phone: "+880 1972-659467", facebook: "https://www.facebook.com/arik.alam.66" },
  { name: "Indranile Das", role: "Organizer", phone: "+880 1716-333722", facebook: "https://www.facebook.com/indranile.das.5" },
];
