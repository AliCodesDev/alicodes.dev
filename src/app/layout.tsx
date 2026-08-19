import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://alicodes.dev"),
  title: {
    default: "Ali Ezzeddine — Software / AI Engineer",
    template: "%s — Ali Ezzeddine",
  },
  description:
    "Software and AI engineer. I build LLM applications: agents that carry out multi-step work inside real systems, and the retrieval, integrations, and evaluation behind them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-14">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
