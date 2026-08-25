import type { Metadata, Viewport } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "../globals.css";

/*
 * Root layout for the archive record. /resume has its own root layout under
 * (plain) and must stay outside all of this — #0010.
 *
 * Two families, per #0014: Space Mono is the system voice (labels, IDs, chips,
 * nav, footers) and Archivo is display *and* long-form body. Self-hosted by
 * next/font, exposed as the CSS variables globals.css reads.
 */
const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const DESCRIPTION =
  "Software and AI engineer. I build LLM applications: agents that carry out multi-step work inside real systems, and the retrieval, integrations, and evaluation behind them.";

/*
 * `opengraph-image.tsx` beside this file supplies the card; Next injects the
 * `og:image` tags from it, so they are not repeated here. It has to sit in
 * this route group rather than at the app root — at the root it builds as a
 * route and is linked from nothing (#0028). The site is read by
 * people who were sent a link, which makes the unfurl the first frame of the
 * design most readers see.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://alicodes.dev"),
  title: {
    default: "Ali Ezzeddine — Software / AI Engineer",
    template: "%s — Ali Ezzeddine",
  },
  description: DESCRIPTION,
  applicationName: "alicodes.dev",
  authors: [{ name: "Ali Ezzeddine", url: "https://alicodes.dev" }],
  creator: "Ali Ezzeddine",
  openGraph: {
    type: "profile",
    siteName: "alicodes.dev",
    locale: "en_GB",
    url: "/",
    title: "Ali Ezzeddine — Software / AI Engineer",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

/* Near-black, so a browser paints its chrome to match rather than flashing. */
export const viewport: Viewport = {
  themeColor: "#0a0b09",
  colorScheme: "dark",
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
