import { events } from "@/content/events";
import { factsFriday } from "@/content/factsFriday";
import { olympiadTeams } from "@/content/olympiad";

/** Every page address on the site, without the language prefix ("" is the home page). */
export function sitePages(): string[] {
  return [
    "", "about", "executives", "panel", "ness", "ness/photosphere", "ness/register",
    "events", "resources", "gallery", "join", "contact",
    "explore", "factsfriday", "olympiad-teams", "publications",
    ...events.map((e) => `events/${e.slug}`),
    ...factsFriday.map((f) => `factsfriday/${f.slug}`),
    ...olympiadTeams.map((t) => `olympiad-teams/${t.slug}`),
  ];
}
