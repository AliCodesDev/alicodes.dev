import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://alicodes.dev"),
  title: {
    default: "Ali Ezzeddine — Software / AI Engineer",
    template: "%s — Ali Ezzeddine",
  },
  description:
    "Software and AI engineer. I build LLM applications: agents that carry out multi-step work inside real systems, and the retrieval, integrations, and evaluation behind them.",
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
