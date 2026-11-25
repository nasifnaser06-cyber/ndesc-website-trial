import { IconHelix, IconInterstellar, IconTerrestrial } from "./HubIcons";
import type { OlympiadTeam } from "@/content/olympiad";

/** The line icon for each Olympiad team: orbit for Interstellar, landform for Terrestrial, DNA for Helix. */
export function TeamIcon({ slug }: { slug: OlympiadTeam["slug"] }) {
  if (slug === "interstellar") return <IconInterstellar />;
  if (slug === "terrestrial") return <IconTerrestrial />;
  return <IconHelix />;
}
