// Photosphere 7.0, the visual art competition and exhibition of NESS X (10th National Earth and Space Summit).
// Source: the club's Photosphere 7.0 announcement, 19 Nov 2026.

export const photosphereBanner = {
  name: "/ness/photosphere-7",
  widths: [768, 1280, 1920],
  height: 1005,
  social: "/ness/photosphere-7-og.jpg",
  alt: {
    en: "Photosphere 7.0, presented by NDESC, 28–30 January 2027: snowy mountains reflected in still water under green auroras and the Milky Way, with the Notre Dame College and club logos.",
    bn: "Photosphere 7.0, NDESC, ২৮–৩০ জানুয়ারি ২০২৭: সবুজ মেরুজ্যোতি ও আকাশগঙ্গার নিচে স্থির জলে প্রতিফলিত তুষারঢাকা পাহাড়, সঙ্গে নটর ডেম কলেজ ও ক্লাবের লোগো।",
  },
};

export const photosphere = {
  name: "Photosphere 7.0",
  brief:
    "Photography, poster design and AI art about the Earth and the cosmos. Submit your best work online for free. Selected pieces are framed and shown to everyone at NESS X.",
  intro: [
    "Photosphere 7.0 is the visual art competition and exhibition of NESS X, the 10th National Earth and Space Summit. The artworks and photographs you submit go on display for everyone at the summit. Photography, design or AI art: choose how you express yourself, and show us how you capture our universe.",
    "As the visual heart of NESS X, Photosphere brings the wonders of nature and outer space to a wider audience through the lens and imagination of talented photographers and artists.",
  ],
  categories: [
    { code: "PS-J", name: "Photosphere Junior", who: "Class 6 to 10" },
    { code: "PS-S", name: "Photosphere Senior", who: "Class 11, 12 and university" },
    { code: "PS-C", name: "Photosphere Combined", who: "Everyone competes together, from every category" },
  ],
  segments: [
    {
      name: "Astro Photography",
      cats: ["PS-J", "PS-S"],
      desc: "The cosmos is endlessly captivating, from star trails and constellations to distant galaxies and nebulae. What in the night sky has mesmerised you the most? Frame it and let us see.",
      form: "https://forms.gle/rpSN5ixT8JKEJ5zY6",
    },
    {
      name: "Eco Photography",
      cats: ["PS-J", "PS-S"],
      desc: "Billions of worlds in a single planet. Capture the raw, intricate nature of our Earth from your own perspective.",
      form: "https://forms.gle/uPCJGcLwu1K9NvCq7",
    },
    {
      name: "Poster Designing",
      cats: ["PS-C"],
      desc: "Where information meets aesthetics. Make posters that turn complex scientific or environmental ideas into visuals that are striking and easy to grasp.",
      form: "https://forms.gle/tAi1CUcxhv4aE21E7",
    },
    {
      name: "AI Art",
      cats: ["PS-C"],
      desc: "Pair human imagination with generative AI to create a standout visual. Use your prompts to blend science and creativity into a single frame.",
      form: "https://forms.gle/DkUg2SRedi1fnJMf9",
    },
  ],
  renaming: {
    format: "Photo number_Your name_Phone number_Segment name",
    examples: ["01_Israk Tafhim_01715***_Eco Photography", "02_Israk Tafhim_01715***_Eco Photography"],
  },
  rules: [
    "You must be the sole owner of the photos, art or designs you submit.",
    "Up to 5 photographs, artworks or designs per person in each segment.",
    "JPG files only, each no larger than 20 MB.",
    "Photographs can be black and white or colour.",
    "No watermarks, borders, signatures, logos, or dates and times on the image.",
    "Manipulation is strictly prohibited.",
    "Digital submissions only.",
    "Mobile and DSLR photos are both accepted. They are judged together, with no separate prizes.",
    "No nudity or sexually explicit, defamatory or provocative content.",
    "The organisers can remove a submission after accepting it if it breaks any rule.",
  ],
  fee: [
    "Submitting is free. There is no registration fee for the first round.",
    "After the selection round, selected participants pay a registration fee to show their selected work in the Photosphere exhibition.",
    "Registered participants also get a team pass for NESS X.",
    "The frames are returned to the photographers after the exhibition.",
    "How to pay will be announced after selection. Selected participants are told by email, at the address they gave in the form.",
  ],
  organizers: [
    { name: "Avoy Sen Paean", role: "Organizer", phone: "+880 1572-928028", facebook: "https://www.facebook.com/AvoySenPaean" },
    { name: "Farhan Labib Oykko", role: "Organizer", phone: "+880 1625-318144", facebook: "https://www.facebook.com/FarhanOykko" },
  ],
  nessxFacebook: "https://www.facebook.com/share/1CEGvd4m2G/",
};
