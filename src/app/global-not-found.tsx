import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

/*
 * The 404.
 *
 * `global-not-found` rather than `not-found`, because this app has two root
 * layouts — `(archive)` and `(plain)` — so there is no single layout a global
 * 404 could compose from. That is the exact case the convention exists for, and
 * it means this file has to carry its own <html>, fonts and stylesheet.
 *
 * It reuses the NOTHING ON FILE state (#0023) rather than inventing an error
 * screen. A 404 *is* that state, one layer down: the archive was asked for a
 * record it does not hold, and it would rather say so than improvise one. Same
 * rule, same rust, same box.
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
  // This file bypasses both root layouts, so it inherits nothing from them.
  metadataBase: new URL("https://alicodes.dev"),
  title: "No such record — Ali Ezzeddine",
  description: "The archive holds no record at this address.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceMono.variable}`}>
      <body>
        <header>
          <div className="statusbar">
            <span className="statusbar-path">\\ALICODES.DEV\ARCHIVE\</span>
            <span className="shrink-0" style={{ color: "var(--rust)" }}>
              No such record
            </span>
          </div>
        </header>

        <main className="record-col nf-col">
          <div className="banner">&gt; Record not found &lt;</div>

          <div className="nof">
            <div className="nof-h">Nothing on file</div>
            <p className="nof-p">
              The archive holds no record at that address. Rather than guess at
              what you were looking for, it says so.
            </p>
          </div>

          <nav className="navbar nf-nav" aria-label="Archive sections">
            {/* Every one of these crosses out of this file into a root
             * layout, so the navigation is a full load either way. */}
            <Link className="navb" href="/">
              [ Index ]
            </Link>
            <Link className="navb" href="/projects">
              [ Projects ]
            </Link>
            <Link className="navb" href="/resume">
              [ Résumé ]
            </Link>
          </nav>

          <footer className="registry">
            <span>Every claim carries its source</span>
            <span>alicodes.dev / archive</span>
          </footer>
        </main>
      </body>
    </html>
  );
}
