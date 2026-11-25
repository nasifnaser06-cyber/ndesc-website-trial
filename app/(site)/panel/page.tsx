import type { Metadata } from "next";
import { type Locale, path } from "@/lib/i18n";

// The Panel page became Executives (18 Nov 2026). This keeps old links working.
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = { robots: { index: false } };

export default async function PanelMoved() {
  const lang: Locale = "en";
  const to = `${bp}${path(lang, "/executives")}`;
  return (
    <div className="wrap redirect-note">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <p><a href={to}>This page has moved to Executives.</a></p>
    </div>
  );
}
