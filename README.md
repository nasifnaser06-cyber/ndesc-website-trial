# Notre Dame Eco and Space Club website

The website of the Notre Dame Eco and Space Club (NDESC), Notre Dame College, Dhaka. It is in English. (A Bangla version was built and then taken off on 18 Nov 2026; the Bangla text is still in `content/`.)

**Live site:** https://ndesc.com/ (the old nasifnaser06-cyber.github.io/ndesc-website/ address forwards here)

This is a **draft**. Anything shown in [square brackets] on the site is waiting for the club to confirm or supply it. Facts on the site come from press coverage, and each summit page links its sources.

## Editing the content

You do not need to touch the page code to update the site. All the words and data live in the `content/` folder:

| File | What it holds |
|---|---|
| `content/site.ts` | Club email, social links, form links, address, the draft ribbon switch |
| `content/events.ts` | Every event: dates, titles, summaries, highlights, partners, press links |
| `content/club.ts` | Timeline, NESS programme, categories, schedule, past summits, FAQs, officers and executives, resources, gallery albums |
| `content/ui.ts` | Menu labels, button words and other short interface text |

Every piece of text has an English (`en`) and a Bangla (`bn`) version. Only the English is published. Keep the `bn` lines in place (copy the English if you like): the site checks that both exist. To bring Bangla back, add `"bn"` to `publishedLocales` in `lib/i18n.ts` and put the language switch back in `components/Header.tsx`.

You can edit these files right on GitHub: open the file, click the pencil icon, make the change and click **Commit changes**. The site rebuilds and goes live by itself in about two minutes.

### Common jobs

- **Add the club email:** in `content/site.ts`, change `email: null` to `email: "club@example.com"`.
- **Turn on registration buttons:** put the Google Form links into `forms` in `content/site.ts`. Until a link is there, the button says "Form link coming soon".
- **Turn on the contact form:** set `contactEndpoint` to a form service address that accepts posts (for example Formspree). Until then the Contact page points people to Facebook.
- **Add an event:** copy an entry in `content/events.ts`, give it a new `slug` (a short name with hyphens, e.g. `ness-2028`) and change the details. It gets its own page automatically.
- **Update the executives:** in `content/club.ts`, edit `officers` (teachers) and `executiveSessions`. Each session has a `session` like `"2026–27"` and a list of members with `name`, `post` and an optional `department`. When a new panel takes over, add the new session at the top with `current: true` and remove `current` from the old one; the old one moves to the Former tab by itself. For a photo, put it in `public/executives/` and add `photo: "/executives/file-name.jpg"` to that person.
- **Add resources:** put the PDF in `public/resources/` and add a line to `resources` in `content/club.ts`, with `url: "/resources/your-file.pdf"`.
- **Fill a placeholder:** search the `content/` folder for the text in square brackets and replace it.
- **Remove the draft ribbon:** set `draft: false` in `content/site.ts` once the club is happy.

### Students' privacy

Students' names and photos appear on the site only with their consent. Never put a student's personal phone number or home address on the site; contact goes through the club email or Facebook page.

## Running it on your computer

You need Node.js 22.

```bash
npm install
npm run dev
```

Then open http://localhost:3000/.

To build the finished static site into the `out/` folder: `npm run build`.

## How publishing works

Every change pushed to the `main` branch runs the workflow in `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. It also rebuilds every Monday so "Upcoming" and "Past" labels on events stay right.

The site is built with Next.js as plain static pages (`output: "export"`), so search engines and Facebook link previews can read every page.

## Design

Night-sky look: night `#0F1E36`, starlight text `#E9EEF6`, haze `#A9B7CC`, one sprout-green accent `#8FD3A6`. Headings in Bitter, body text in Atkinson Hyperlegible. All fonts are self-hosted. Every text colour pair passes WCAG AA contrast.
