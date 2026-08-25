"use client";

import { createContext, useContext, type ReactNode } from "react";

import { cx } from "@/lib/cx";

/*
 * Sourced claims. DECISIONS.md #0013, #0017, #0019.
 *
 * The grades are not equivalent, and the markup keeps them apart:
 *   - linkable        — `href` set. Amber, with an arrow. Repo, live, thesis,
 *                       degree, résumé.
 *   - cited, not linkable — no `href`. Plain ink. Decision record, private source.
 *   - context         — `context: true`. Proves the thing EXISTS, says nothing
 *                       about Ali's role in it. Unnumbered, and never citable
 *                       by a claim.
 *
 * The load-bearing rule: a claim whose `src` names no citable source renders as
 * plain prose with no mark. An unbacked page visibly looks unbacked. That is
 * the editorial rule enforcing itself, not a rendering bug.
 *
 * The rail these used to cite into is gone — #0019 moved it into the panel
 * beside the record, where a claim now *opens* its source rather than merely
 * highlighting it. Hover still previews; click commits.
 */

export type Source = {
  id: string;
  title: string;
  /** Shown under the title: "case study", "repo", "decision record", … */
  kind: string;
  /** Set only when the source is genuinely linkable. #0018. */
  href?: string;
  /** The claim this source backs, quoted back to the reader. */
  backs?: string;
  /** The sentence pulled from the record. */
  quote?: string;
  /** Exactly where it sits, e.g. `/projects/safiyr § "Provenance"`. */
  locus?: string;
  /** How to read this source's grade. */
  note?: string;
  /** Context, not credit. Never carries a number. */
  context?: boolean;
};

export type SourcedCtx = {
  /** id of the panel a claim drives, for `aria-controls`. */
  panelId: string;
  number: Record<string, number>;
  byId: Record<string, Source>;
  /** Hovered or focused — the preview tier. */
  active: string | null;
  setActive: (id: string | null) => void;
  /** Clicked — the commit tier. Opens the source in the panel. */
  open: (id: string) => void;
};

export const SourcedContext = createContext<SourcedCtx | null>(null);

/**
 * A claim in prose. `src` names a citable source in the enclosing group;
 * anything else renders unmarked, on purpose.
 *
 * Deliberately a `<span role="button">` rather than a `<button>`: a claim runs
 * mid-sentence and must fragment across lines, which a button box will not do.
 * The wrapper is one tab stop covering both the text and its marker, and the
 * marker is `aria-hidden` so the accessible name is just the claim.
 *
 * It carries `aria-controls`, not `aria-describedby`: the source it describes
 * lives in the panel, and the panel only shows that entry in its REST state,
 * so a description target would dangle the moment anything else opened.
 */
export function Claim({ src, children }: { src: string; children: ReactNode }) {
  const ctx = useContext(SourcedContext);
  const n = ctx?.number[src];
  const known = ctx && n !== undefined;

  if (process.env.NODE_ENV !== "production" && ctx && !known) {
    const source = ctx.byId[src];
    console.warn(
      source?.context
        ? `<Claim src="${src}"> cites a context source. Context proves the thing exists, not Ali's role in it — it cannot back a claim.`
        : `<Claim src="${src}"> names no source in this group. Rendering unmarked.`,
    );
  }

  if (!ctx || !known) return <>{children}</>;

  const on = ctx.active === src;
  const off = ctx.active !== null && !on;

  return (
    <span
      role="button"
      tabIndex={0}
      aria-controls={ctx.panelId}
      className="claim-hit"
      onClick={() => ctx.open(src)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ctx.open(src);
        }
      }}
      onMouseEnter={() => ctx.setActive(src)}
      onMouseLeave={() => ctx.setActive(null)}
      onFocus={() => ctx.setActive(src)}
      onBlur={() => ctx.setActive(null)}
    >
      <span className={cx("claim", on && "claim-on", off && "claim-off")}>
        {children}
      </span>
      <span
        className={cx("mk", on && "mk-on", off && "mk-off")}
        aria-hidden="true"
      >
        [{n}]
      </span>
    </span>
  );
}

/** Evidence identified but not yet gathered. It says so rather than implying it. */
export function Pending({
  title = "Nothing else to cite",
  items,
}: {
  title?: string;
  items: string[];
}) {
  return (
    <div className="pending">
      <div className="lbl" style={{ color: "var(--rust)" }}>
        {title}
      </div>
      <div className="mt-[11px] flex flex-col gap-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-[7px]">
            <svg
              width="9"
              height="9"
              viewBox="0 0 10 10"
              fill="none"
              stroke="var(--ink-faint)"
              strokeWidth="1.1"
              className="mt-px shrink-0"
              aria-hidden="true"
            >
              <rect x="1" y="1" width="8" height="8" />
            </svg>
            <span
              className="lbl"
              style={{ color: "var(--ink-dim)", letterSpacing: "0.08em" }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
