import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * Archive chrome: the status bar across the top, the bracket nav under it, and
 * the registry footer that closes a record. #0014.
 *
 * The status-bar path and the record meta are per-page — the artboards show
 * \ARCHIVE\PERSONNEL\ + SYSTEM ONLINE on the index and \ARCHIVE\PROJECTS\SAFIYR\ +
 * RECORD 01 OF 04 on a project file — so pages pass them rather than the chrome
 * inferring them from the route. Keeps every page a server component.
 */

type NavKey = "index" | "projects" | "resume";

/*
 * `/about` is gone — its content is field rows in the record now (#0019) — and
 * `/blog` stays out until it has something in it. The homepage passes no
 * `active` at all: its navigation is the folder tabs above the record.
 */
const NAV: { key: NavKey; href: string; label: string }[] = [
  { key: "index", href: "/", label: "Index" },
  { key: "projects", href: "/projects", label: "Projects" },
  { key: "resume", href: "/resume", label: "Résumé" },
];

/** Live indicator. Green here means the system is up — see #0014 on green. */
export function SystemOnline() {
  return (
    <span>
      System online
      <span className="dot-live">&#9679;</span>
    </span>
  );
}

export function SiteHeader({
  segments,
  meta,
  active,
}: {
  /** Path shown in the status bar, e.g. ["projects", "safiyr"]. */
  segments: string[];
  meta: ReactNode;
  /** Omit to render the status bar alone, with no bracket nav under it. */
  active?: NavKey;
}) {
  const path = `\\\\ALICODES.DEV\\ARCHIVE\\${segments
    .map((s) => `${s.toUpperCase()}\\`)
    .join("")}`;

  return (
    <header>
      <div className="statusbar">
        {/* The full path is the accessible name; the screen shows what fits. */}
        <span className="statusbar-path" title={path}>
          {path}
        </span>
        <span className="shrink-0">{meta}</span>
      </div>

      {active === undefined ? null : (
        <nav className="navbar" aria-label="Archive sections">
          {NAV.map((item) =>
            item.key === active ? (
              <span key={item.key} className="navb navb-on" aria-current="page">
                [ x {item.label} ]
              </span>
            ) : (
              <Link key={item.key} href={item.href} className="navb">
                [ {item.label} ]
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  );
}

/** Closes a record. Left is the registry line, right the archive ID or place. */
export function RegistryFooter({
  left,
  right,
  className,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <footer className={cx("registry", className)}>
      <span>{left}</span>
      <span>{right}</span>
    </footer>
  );
}

/** The centered `> PERSONNEL RECORD <` banner that opens a record. */
export function RecordBanner({ children }: { children: ReactNode }) {
  return (
    <div className="banner">
      &gt; {children} &lt;
    </div>
  );
}

/**
 * The page template every artboard outside `/` shares: status bar, bracket nav,
 * a centred 880px column (620 measure + 48 gutter + 212 rail), and the registry
 * footer. `/` does not use this — it composes its own chrome around a fixed
 * 1080px column, because the dossier grid is wider than a record page. #0019.
 */
export function RecordFrame({
  segments,
  meta,
  active,
  banner,
  footer,
  children,
}: {
  segments: string[];
  meta: ReactNode;
  active?: NavKey;
  banner?: ReactNode;
  footer: { left: ReactNode; right: ReactNode };
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader segments={segments} meta={meta} active={active} />
      <main className="record-col">
        {banner ? <RecordBanner>{banner}</RecordBanner> : null}
        {children}
        <RegistryFooter left={footer.left} right={footer.right} />
      </main>
    </>
  );
}
