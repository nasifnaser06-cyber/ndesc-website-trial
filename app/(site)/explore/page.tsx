import Link from "next/link";
import { type Locale, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { sortedEvents, isUpcoming } from "@/content/events";
import { sortedFacts, factsCategories } from "@/content/factsFriday";
import { olympiadTeams } from "@/content/olympiad";
import { durbin } from "@/content/publications";
import { PageHead } from "@/components/bits";
import { IconArrow, IconEvents, IconFacts, IconPublications, IconTeams } from "@/components/HubIcons";

const title = "Explore NDESC";
const lead = "Discover our events, scientific discoveries, Olympiad teams, and publications.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/explore", title, lead);
}

export default async function Explore() {
  const lang: Locale = "en";
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // Previews come only from real content: the next upcoming event, the newest FactsFriday post,
  // the three teams, and the newest DURBIN issue once one is added.
  const next = sortedEvents().filter((e) => isUpcoming(e)).sort((a, b) => a.start.localeCompare(b.start))[0];
  const latestFact = sortedFacts()[0];
  const latestIssue = [...durbin.issues].sort((a, b) => b.year.localeCompare(a.year))[0];

  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap">
        <div className="hub-grid hub-2x2">
          <Link className="hub-card accent-events" href={path(lang, "/events")}>
            <span className="hub-icon"><IconEvents /></span>
            <h2>Events</h2>
            <p>Explore our summits, competitions, camps, workshops, and scientific gatherings.</p>
            {next && (
              <div className="hub-preview">
                <div>
                  <span>Next up</span>
                  <strong>{next.title}</strong>
                  <span>{formatDateRange(next.start, next.end, lang, "long")}</span>
                </div>
              </div>
            )}
            <span className="hub-go">See all events <IconArrow /></span>
          </Link>

          <Link className="hub-card accent-facts" href={path(lang, "/factsfriday")}>
            <span className="hub-icon"><IconFacts /></span>
            <h2>FactsFriday</h2>
            <p>Discover fascinating scientific facts, explanations, and discoveries from our weekly series.</p>
            {latestFact && (
              <div className="hub-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${bp}${latestFact.cover.base}-${latestFact.cover.sizes[0]}.webp`} alt="" width={56} height={56} loading="lazy" decoding="async" />
                <div>
                  <span>Latest · {factsCategories[latestFact.category]}</span>
                  <strong>{latestFact.title}</strong>
                  <span>{formatDateRange(latestFact.date, undefined, lang, "long")}</span>
                </div>
              </div>
            )}
            <span className="hub-go">Read FactsFriday <IconArrow /></span>
          </Link>

          <Link className="hub-card accent-teams" href={path(lang, "/olympiad-teams")}>
            <span className="hub-icon"><IconTeams /></span>
            <h2>Olympiad Teams</h2>
            <p>Meet our Olympiad teams, explore their achievements, and discover their academic journeys.</p>
            <div className="hub-preview">
              <div>
                <span>{olympiadTeams.length} teams</span>
                <strong>{olympiadTeams.map((t) => t.name.replace("Team ", "")).join(", ")}</strong>
                <span>{olympiadTeams.map((t) => t.olympiad.short).join(" · ")}</span>
              </div>
            </div>
            <span className="hub-go">Meet the teams <IconArrow /></span>
          </Link>

          <Link className="hub-card accent-pubs" href={path(lang, "/publications")}>
            <span className="hub-icon"><IconPublications /></span>
            <h2>Publications</h2>
            <p>Explore DURBIN magazine, scientific articles, and educational resources.</p>
            {latestIssue && (
              <div className="hub-preview">
                <div>
                  <span>Latest issue</span>
                  <strong>{latestIssue.title}</strong>
                  <span>{latestIssue.year}</span>
                </div>
              </div>
            )}
            <span className="hub-go">Open the library <IconArrow /></span>
          </Link>
        </div>
      </div>
    </>
  );
}
