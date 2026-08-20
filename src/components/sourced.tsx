"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";

/*
 * Sourced claims and the rail they cite into. DECISIONS.md #0013.
 *
 * The grades are not equivalent, and the markup keeps them apart:
 *   - linkable        — `href` set. Amber, with an arrow. Repo, live, thesis,
 *                       degree, résumé.
 *   - cited, not linkable — no `href`. Plain ink. Decision record, private source.
 *   - context         — `context: true`. Proves the thing EXISTS, says nothing
 *                       about Ali's role in it. Unnumbered, below a dashed
 *                       rule, and never citable by a claim.
 *
 * The load-bearing rule: a claim whose `src` names no citable source renders as
 * plain prose with no mark. An unbacked page visibly looks unbacked. That is
 * the editorial rule enforcing itself, not a rendering bug.
 */

export type Source = {
  id: string;
  title: string;
  /** Shown under the title: "case study", "repo", "decision record", … */
  kind: string;
  /** Set only when the source is genuinely linkable. */
  href?: string;
  /** Pulled quote, revealed while the claim is active. */
  quote?: string;
  /** Context, not credit. Never carries a number. */
  context?: boolean;
};

type Ctx = {
  group: string;
  number: Record<string, number>;
  byId: Record<string, Source>;
  active: string | null;
  setActive: (id: string | null) => void;
};

const SourcedContext = createContext<Ctx | null>(null);

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Sourced({
  sources,
  label = "Archive ref",
  children,
}: {
  sources: Source[];
  label?: string;
  children: ReactNode;
}) {
  const group = useId();
  const [active, setActive] = useState<string | null>(null);

  const cited = sources.filter((s) => !s.context);
  const context = sources.filter((s) => s.context);
  const number: Record<string, number> = {};
  cited.forEach((s, i) => {
    number[s.id] = i + 1;
  });
  const byId: Record<string, Source> = {};
  sources.forEach((s) => {
    byId[s.id] = s;
  });

  return (
    <SourcedContext.Provider
      value={{ group, number, byId, active, setActive }}
    >
      <div className="record-grid">
        <div className="min-w-0">{children}</div>

        <details className="rail" open>
          <summary>
            <span>
              {label} /<span className="rail-count"> {cited.length}</span>
            </span>
            <svg
              className="rail-chev"
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--amber)"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M2 5l5 5 5-5" />
            </svg>
          </summary>

          <div className="rail-body">
            {cited.map((source) => (
              <RefEntry
                key={source.id}
                source={source}
                n={number[source.id]}
                group={group}
                active={active}
              />
            ))}
            {context.map((source) => (
              <div key={source.id} className="ref-context">
                <RefEntry source={source} group={group} active={active} />
              </div>
            ))}
          </div>
        </details>
      </div>
    </SourcedContext.Provider>
  );
}

function RefEntry({
  source,
  n,
  group,
  active,
}: {
  source: Source;
  n?: number;
  group: string;
  active: string | null;
}) {
  const on = active === source.id;
  const off = active !== null && !on;

  const title = source.href ? (
    <a href={source.href}>{source.title} &rarr;</a>
  ) : (
    source.title
  );

  return (
    <div
      id={`${group}-${source.id}`}
      className={cx("ref", source.href && !source.context && "ref-link", off && "ref-off")}
    >
      <div className={cx("ref-n", on && "ref-n-on")}>
        [{n ?? <>&middot;</>}]
      </div>
      <div className={on ? "ref-body" : undefined}>
        <div className="ref-t">{title}</div>
        <div className="ref-k">{source.kind}</div>
        {on && source.quote ? (
          <div className="ref-quote">&ldquo;{source.quote}&rdquo;</div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * A claim in prose. `src` names a citable source in the enclosing `Sourced`
 * group; anything else renders unmarked, on purpose.
 */
export function Claim({
  src,
  children,
}: {
  src: string;
  children: ReactNode;
}) {
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
  const bind = {
    onMouseEnter: () => ctx.setActive(src),
    onMouseLeave: () => ctx.setActive(null),
    onFocus: () => ctx.setActive(src),
    onBlur: () => ctx.setActive(null),
  };

  return (
    <>
      <span
        className={cx("claim", on && "claim-on", off && "claim-off")}
        tabIndex={0}
        aria-describedby={`${ctx.group}-${src}`}
        {...bind}
      >
        {children}
      </span>
      <span className={cx("mk", on && "mk-on", off && "mk-off")} {...bind}>
        [{n}]
      </span>
    </>
  );
}

/** The rail legend on a record's first row. */
export function RailLegend() {
  return (
    <div
      className="lbl"
      style={{
        borderBottom: "1px solid var(--rule)",
        paddingBottom: "8px",
        lineHeight: 1.8,
      }}
    >
      <span style={{ color: "var(--amber)" }}>Amber opens.</span>
      <br />
      Plain is cited, not linked.
    </div>
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
