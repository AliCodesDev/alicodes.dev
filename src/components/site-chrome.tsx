import Link from "next/link";
import type { ReactNode } from "react";

/*
 * Archive chrome: the status bar across the top, the bracket nav under it, and
 * the registry footer that closes a record. #0014.
 *
 * The status-bar path and the record meta are per-page — the artboards show
 * \ARCHIVE\PERSONNEL\ + SYSTEM ONLINE on the index and \ARCHIVE\WORK\SAFIYR\ +
 * RECORD 01 OF 04 on a work file — so pages pass them rather than the chrome
 * inferring them from the route. Keeps every page a server component.
 */

type NavKey = "index" | "work" | "resume";

/*
 * `/about` is gone — its content is field rows in the record now (#0019) — and
 * `/writing` stays out until it has something in it. The homepage passes no
 * `active` at all: its navigation is the folder tabs above the record.
 */
const NAV: { key: NavKey; href: string; label: string }[] = [
  { key: "index", href: "/", label: "Index" },
  { key: "work", href: "/work", label: "Work" },
  { key: "resume", href: "/resume", label: "Résumé" },
];

/** Live indicator. Green here means the system is up — see #0014 on green. */
export function SystemOnline() {
  return (
    <span>
      System online
      <span className="ml-2" style={{ color: "var(--green)" }}>
        &#9679;
      </span>
    </span>
  );
}

export function SiteHeader({
  segments,
  meta,
  active,
}: {
  /** Path shown in the status bar, e.g. ["work", "safiyr"]. */
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
      <div
        className="mono flex items-center justify-between gap-4 px-4 py-[10px] uppercase sm:px-7"
        style={{
          fontSize: "9px",
          letterSpacing: "0.16em",
          color: "var(--amber-dim)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <span className="truncate">{path}</span>
        <span className="shrink-0">{meta}</span>
      </div>

      {active === undefined ? null : (
        <nav className="flex flex-wrap gap-x-[9px] gap-y-2 px-4 pt-[14px] sm:px-7">
          {NAV.map((item) =>
            item.key === active ? (
              <span key={item.key} className="navb navb-on">
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
  className = "mt-10",
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={`mono flex flex-wrap justify-between gap-x-6 gap-y-2 pt-3 uppercase ${className}`}
      style={{
        fontSize: "9px",
        letterSpacing: "0.15em",
        color: "var(--ink-faint)",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </footer>
  );
}

/** The centered `> PERSONNEL RECORD <` banner that opens a record. */
export function RecordBanner({ children }: { children: ReactNode }) {
  return (
    <div
      className="mono mb-4 text-center uppercase"
      style={{
        fontSize: "11px",
        letterSpacing: "0.34em",
        color: "var(--amber)",
      }}
    >
      &gt; {children} &lt;
    </div>
  );
}

/*
 * The page template every artboard shares: status bar, bracket nav, a centered
 * 880px column (620 measure + 48 gutter + 212 rail), and the registry footer.
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
      <main className="mx-auto w-full max-w-[880px] px-4 pt-8 pb-14 sm:px-7">
        {banner ? <RecordBanner>{banner}</RecordBanner> : null}
        {children}
        <RegistryFooter left={footer.left} right={footer.right} />
      </main>
    </>
  );
}
