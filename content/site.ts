// Club-wide settings. Fill in the nulls as the club confirms them;
// anything left null shows on the site as a [placeholder] or a disabled button.

export const site = {
  shortName: "NDESC",
  name: "Notre Dame Eco and Space Club",
  founded: "1992-10-28",
  college: "Notre Dame College, Dhaka",
  address: "Notre Dame College, Toyenbee Circular Road, Motijheel, Dhaka 1000",
  mapUrl: "https://maps.app.goo.gl/N4N3Rvg5j3EB2ua16",
  /** Google map of the college shown in the footer ("Visit us"): a pin on the campus (23.7304 N, 90.4207 E). No API key needed. */
  mapEmbed: "https://maps.google.com/maps?q=23.7304,90.4207&z=16&output=embed",

  /** Club email, monitored by the moderator. Never a student's personal address. */
  email: "ndesc.organizers.2027@gmail.com" as string | null,

  social: {
    facebook: "https://www.facebook.com/ndesc.official",
    instagram: "https://www.instagram.com/ndesc.official",
  },

  /**
   * Where every "Register" button goes (the NESS X page's "Register now" and the header's
   * "Register for NESS X"):
   *   "page" = the website's own Register page, /ness/register/ (20 to 24 Nov 2026)
   *   "form" = the NESS X Google Form below (since 24 Nov 2026, Mahmud: the Register page stays
   *            paused and the NESS X page's Register now goes to the Google Form)
   */
  registerWith: "form" as "page" | "form",

  /** Links to the club's forms (Google Forms or similar). */
  forms: {
    /** NESS X Google Form (link from Mahmud, 24 Nov 2026). Used by every Register button while registerWith is "form". */
    nessRegister: "https://docs.google.com/forms/d/e/1FAIpQLSdodZ963ojsNZQ1HIoSFq_qBtl-7dgccnFdbsj9OGxNVMWiMQ/viewform" as string | null,
    nessExhibit: null as string | null,
    join: null as string | null,
    /** A form endpoint that accepts POST (e.g. Formspree). Leave null to hide the form. */
    contactEndpoint: null as string | null,
  },

  /**
   * NESS X automatic registration (registration/README.md explains the setup).
   * endpoint: the Apps Script web app address. While it is null the Register page is a draft:
   * people can see it, but it sends them to the Google Form instead.
   * The payment numbers and prices shown on the page come live from the sheet's Settings tab once
   * connected; these are only the fallback.
   * trial: true while testing. The page stays hidden from search engines and shows a "Trial"
   * notice. Set false (live) on 20 Nov 2026, using the sheet in nasifnaser06@gmail.com.
   */
  registration: {
    /** true: the Register page shows "Registration is paused" and nothing on it can be typed in or sent
        (Mahmud, 23 Nov 2026). Set back to false to reopen. */
    paused: true,
    // Trial copy: disconnected so test sign-ups never reach the real registration sheet.
    endpoint: null as string | null,
    trial: false,
    bkash: "[club bKash number]",
    nagad: null as string | null,
    prices: { solo: 200, team: 300, online: 0 },
  },

  /** Shows the "draft" ribbon across the top until the club signs off the content. */
  draft: false,
};

export type Site = typeof site;
