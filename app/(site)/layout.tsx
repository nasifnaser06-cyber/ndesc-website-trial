import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/wght.css";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import { type Locale, tr } from "@/lib/i18n";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

// Runs before the first paint. `js` lets the phone menu hide; `motion` lets sections wait for
// their scroll intro. If the site's script has not started within 2.5s, show everything.
const motionBoot =
  "(function(){var d=document.documentElement;d.classList.add('js','motion');" +
  "setTimeout(function(){if(!window.__ndescMotion)d.classList.remove('motion')},2500)})()";

const siteUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";

// The site is English only, served without a language prefix (ndesc.com/ness/, not /en/ness/).
// The Bangla text is kept in content/; see lib/i18n.ts for how it could come back.
const lang: Locale = "en";

export async function generateMetadata(): Promise<Metadata> {
  const l = lang;
  return {
    metadataBase: new URL(siteUrl),
    // Trial copy: keep it out of search results so it never competes with ndesc.com.
    robots: { index: false, follow: false },
    title: { default: tr(site.name, l), template: `%s | ${tr(site.name, l)}` },
    icons: {
      icon: [
        { url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon-32.png`, sizes: "32x32", type: "image/png" },
        { url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon-192.png`, sizes: "192x192", type: "image/png" },
      ],
      apple: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/apple-touch-icon.png`,
    },
  };
}

export const viewport: Viewport = { themeColor: "#0F1E36", colorScheme: "dark" };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-lang={lang}>
      <head>
        {/* Lets the CSS hide the phone menu only when the menu button can work. */}
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {tr(ui.skip, lang)}
        </a>
        <Header lang={lang} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer lang={lang} />
        <Motion />
      </body>
    </html>
  );
}
