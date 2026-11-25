import { type Locale } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { galleryAlbums } from "@/content/club";
import { PageHead, PhotoSlot } from "@/components/bits";

const title = "Gallery";
const lead = "Photos from summits, camps and nights under the sky.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/gallery", title, lead);
}

export default async function Gallery() {
  const lang: Locale = "en";
  const albums = [...galleryAlbums].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s6)" }}>
        <div className="grid-3">
          {albums.map((a) => (
            <div key={a.title} className="stack" style={{ gap: "var(--s2)" }}>
              <PhotoSlot lang={lang} label={"album cover"} />
              <h3>{a.title}</h3>
              <p className="small muted">{a.photos.length === 0 ? ("Photos coming soon") : `${a.photos.length}`}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
