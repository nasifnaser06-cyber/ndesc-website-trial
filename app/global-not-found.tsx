import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";

const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = { title: "Page not found | Notre Dame Eco and Space Club" };

// Old links forward to the right page instead of showing this 404:
// - the site moved from nasifnaser06-cyber.github.io/ndesc-website/ to ndesc.com on 20 Nov 2026,
//   so ndesc.com/ndesc-website/... drops the old prefix;
// - pages lost their /en/ prefix on 20 Nov 2026 (known /en/ pages have their own forwarding page;
//   this catches any other /en/ address);
// - the Bangla pages were taken off on 18 Nov 2026, so /bn/ links go to the same page in English.
const forwardOld = `(function(){var b=${JSON.stringify(bp)};var p=location.pathname;var o="/ndesc-website";var n=p;if(!b&&(n===o||n.indexOf(o+"/")===0)){n=n.slice(o.length)||"/";}var r=n.slice(b.length);var m=r.match(/^\\/(en|bn)(\\/.*)?$/);if(n.indexOf(b)===0&&m){n=b+(m[2]||"/");}if(n!==p){location.replace(n+location.search+location.hash);}})();`;

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: forwardOld }} />
      </head>
      <body>
        <main className="wrap not-found">
          <p className="label">404</p>
          <h1>Lost in space</h1>
          <p className="lead">We could not find that page. It may have moved.</p>
          <p className="actions">
            <a className="btn" href={`${bp}/`}>Back to the home page</a>
          </p>
        </main>
      </body>
    </html>
  );
}
