import type { Metadata } from "next";
import "./plain.css";

/*
 * Root layout for /resume, separate from the archive-record one. #0010 keeps
 * this page plain and print-friendly: no header, no footer, no theme. It needs
 * its own <html>/<body> so the site design cannot reach it — see
 * (archive)/layout.tsx for the other root.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://alicodes.dev"),
  title: { default: "Résumé — Ali Ezzeddine", template: "%s — Ali Ezzeddine" },
};

export default function PlainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-3xl px-6 py-14">{children}</main>
      </body>
    </html>
  );
}
