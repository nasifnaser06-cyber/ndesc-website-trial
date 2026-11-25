import { type Locale } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { sortedFacts, factsCategories, type FactsCategory } from "@/content/factsFriday";
import { PageHead } from "@/components/bits";
import FactsFridayArchive from "@/components/FactsFridayArchive";
import FactsFridayMotion from "@/components/FactsFridayMotion";
import { toFactsCard } from "@/lib/factsCards";

const title = "FactsFriday";
const lead = "Explore fascinating scientific facts, discoveries, and explanations from NDESC's weekly science series.";

// Coming back to the archive with the browser's Back button after a full page load: hide the carousel
// for the moment it takes the script to put the reader's post back in the centre, so the latest post
// never flashes first. A failsafe shows it again after 3 seconds whatever happens.
const restoreBoot = `(function(){try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="back_forward"&&sessionStorage.getItem("ndesc-ff-archive")){var d=document.documentElement;d.classList.add("ff-restoring");setTimeout(function(){d.classList.remove("ff-restoring")},3000)}}catch(e){}})()`;

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/factsfriday", title, lead);
}

export default async function FactsFridayPage() {
  const lang: Locale = "en";
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const facts = sortedFacts();
  const items = facts.map((f) => toFactsCard(f, lang, bp));
  // Only categories and years that actually have posts.
  const used = new Set(facts.map((f) => f.category));
  const categories = (Object.keys(factsCategories) as FactsCategory[]).filter((k) => used.has(k)).map((k) => ({ key: k, label: factsCategories[k] }));
  const years = [...new Set(facts.map((f) => f.date.slice(0, 4)))].sort().reverse();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: restoreBoot }} />
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }]} />
      {items.length === 0 ? (
        <div className="wrap"><p className="empty">The first posts will appear here soon.</p></div>
      ) : (
        <FactsFridayArchive items={items} categories={categories} years={years} />
      )}
      <FactsFridayMotion page="archive" />
    </>
  );
}
