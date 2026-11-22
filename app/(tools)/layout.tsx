import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/wght.css";

// Layout for staff tools (the summit check-in scanner). No site header or footer, and kept
// out of search engines.
export const metadata: Metadata = {
  title: "NESS X check-in",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0F1E36", colorScheme: "dark", width: "device-width", initialScale: 1 };

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0F1E36", color: "#E9EEF6", fontFamily: "'Inter Variable', Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
