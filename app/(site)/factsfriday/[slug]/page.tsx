import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { factsFriday, getFact, sortedFacts, factsCategories } from "@/content/factsFriday";
import { ExternalLink, PageHead } from "@/components/bits";
import FactsFridayMotion from "@/components/FactsFridayMotion";
import FactsCarousel from "@/components/FactsCarousel";
import { toFactsCard } from "@/lib/factsCards";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return factsFriday.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const f = getFact(slug);
  if (!f) return {};
  const big = f.cover.sizes[f.cover.sizes.length - 1];
  return meta(lang, `/factsfriday/${slug}`, `${f.title} · FactsFriday`, f.summary, {
    src: `${f.cover.base}-${big}.webp`,
    alt: `FactsFriday: ${f.title}`,
    width: big,
    height: big,
  });
}

export default async function FactPage({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const f = getFact(slug);
  if (!f) notFound();
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const small = f.cover.sizes[0];
  const large = f.cover.sizes[f.cover.sizes.length - 1];
  // The next older post, for the "Next fact" button in the slide-down bar.
  const all = sortedFacts();
  const i = all.findIndex((x) => x.slug === f.slug);
  const older = i < all.length - 1 ? all[i + 1] : undefined;
  // "More FactsFriday": every other post, newest first. With this post left out, index i is the next older one.
  const more = all.filter((x) => x.slug !== f.slug).map((x) => toFactsCard(x, lang, bp));

  return (
    <>
      <PageHead
        lang={lang}
        kicker={`${factsCategories[f.category]} · ${formatDateRange(f.date, undefined, lang, "long")}`}
        title={f.title}
        crumbs={[{ label: ui.nav.explore, to: "/explore" }, { label: ui.nav.factsFriday, to: "/factsfriday" }]}
      />
      <div className="wrap">
        <article className="ff-article" data-older={older ? path(lang, `/factsfriday/${older.slug}`) : undefined}>
          <figure>
            <span className="ff-pic ff-pic-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${bp}${f.cover.base}-${small}.webp`}
              srcSet={large > small ? `${bp}${f.cover.base}-${small}.webp ${small}w, ${bp}${f.cover.base}-${large}.webp ${large}w` : undefined}
              sizes="(min-width: 960px) 352px, 100vw"
              alt={`The FactsFriday post on ${f.title}, as published.`}
              width={large}
              height={large}
              decoding="async"
            />
            </span>
          </figure>
          <div className="ff-body">
            <p className="ff-summary">{f.body[0]}</p>
            {f.body.slice(1).map((p, k) => <p key={k}>{p}</p>)}
            {f.fromImage && <p className="small muted">This post was published as a picture; the text above is copied from it.</p>}
            {f.writtenLater && <p className="small muted">This post was published as a picture without a caption. The text above was written later from the sources listed below.</p>}
            {f.credit && <p className="small muted">Written by {f.credit}</p>}
            {f.references && f.references.length > 0 && (
              <section className="ff-refs" aria-labelledby="refs">
                <h2 id="refs">Sources</h2>
                <ol>
                  {f.references.map((r, k) => (
                    <li key={k}>{r.url ? <ExternalLink href={r.url} lang={lang}>{r.label}</ExternalLink> : r.label}</li>
                  ))}
                </ol>
              </section>
            )}
            <div className="ff-foot">
              {f.facebook && (
                <ExternalLink className="btn btn-secondary btn-small" href={f.facebook} lang={lang}>See the original post</ExternalLink>
              )}
              <Link className="btn btn-secondary btn-small" href={path(lang, "/factsfriday")} data-all-posts="">All FactsFriday posts</Link>
            </div>
          </div>
        </article>
      </div>
      <section className="ff-more" aria-labelledby="ff-more-h">
        <div className="wrap"><h2 id="ff-more-h">More FactsFriday</h2></div>
        {/* Same carousel as the archive, without this post, starting on the next older post (or the
            nearest one when this is the oldest). */}
        <FactsCarousel items={more} activeSlug={more[Math.min(i, more.length - 1)]?.slug} label="More FactsFriday" compact headingLevel={3} />
      </section>
      <FactsFridayMotion page="post" />
    </>
  );
}
