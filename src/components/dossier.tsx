"use client";

import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { ArchiveId, Chips, Field, Panel, Portrait } from "@/components/record";
import { SourcedContext, type Source } from "@/components/sourced";
import type { Evidence } from "@/lib/content";

/*
 * The personnel record: a dossier on the left, and one panel on the right that
 * is the only content surface on the page. DECISIONS.md #0019.
 *
 * Three gestures all put something into that single panel — clicking a marked
 * claim opens its source, clicking a folder tab renders a section, and (phase
 * two, #0011) the query line returns an agent answer. The panel never becomes
 * two panels, and the page never scrolls: the grid row is a definite height and
 * the panel body is the only thing inside it that scrolls.
 */

export type TabKey = "work" | "resume" | "contact";

export type SectionRow = {
  /** `01`–`04`. Curated position, not an array index. #0007. */
  n: string;
  title: string;
  /** Set only when the row genuinely goes somewhere. #0018. */
  href?: string;
  summary: string;
  chips: Evidence[];
};

export type Section = { label: string; rows: SectionRow[]; note: string };

/*
 * `answer` (State 4) is deliberately absent: its body is agent-generated prose
 * that does not exist yet, and a stub of it would be a fiction on a page whose
 * argument is that nothing here is fabricated. Its styling is in globals.css
 * under State 4, so phase two adds a branch and no layout work. #0011.
 */
type View =
  | { k: "rest" }
  | { k: "source"; id: string }
  | { k: "section"; tab: TabKey }
  | { k: "empty"; asked: string };

const TABS: { key: TabKey; label: string }[] = [
  { key: "work", label: "Work" },
  { key: "resume", label: "Résumé" },
  { key: "contact", label: "Contact" },
];

/* Phase two turns these live. Until then they say what they are. #0021. */
const SUGGESTIONS = [
  "what has he actually shipped?",
  "does he know react native?",
];

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function isTab(value: string | null): value is TabKey {
  return value === "work" || value === "resume" || value === "contact";
}

/** `Link` for routes we own, a plain anchor for mail and the outside world. */
function Anchor({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return /^(https?:|mailto:)/.test(href) ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Dossier({
  sources,
  sections,
  summary,
  presence,
}: {
  sources: Source[];
  sections: Record<TabKey, Section>;
  /** The summary prose, with its `Claim`s, rendered on the server. */
  summary: ReactNode;
  presence: Evidence[];
}) {
  const panelId = useId();
  const [view, setView] = useState<View>({ k: "rest" });
  /* Shallow stack, so `[ ← ]` returns where you came from rather than home. */
  const [stack, setStack] = useState<View[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const cited = sources.filter((s) => !s.context);
  const number: Record<string, number> = {};
  cited.forEach((s, i) => {
    number[s.id] = i + 1;
  });
  const byId: Record<string, Source> = {};
  sources.forEach((s) => {
    byId[s.id] = s;
  });

  /*
   * Sections are linkable and the back button behaves, without the panel
   * leaving the static HTML: `useSearchParams` would push everything above it
   * to client rendering and fail the production build without a Suspense
   * boundary, so we read the URL on mount and drive it with the History API,
   * which Next integrates with its router.
   */
  useEffect(() => {
    const sync = () => {
      const s = new URLSearchParams(window.location.search).get("s");
      setStack([]);
      setView(isTab(s) ? { k: "section", tab: s } : { k: "rest" });
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  function openSource(id: string) {
    setStack((s) => [...s, view]);
    setView({ k: "source", id });
  }

  function openTab(tab: TabKey) {
    setStack([]);
    setView({ k: "section", tab });
    window.history.pushState(null, "", `?s=${tab}`);
  }

  function back() {
    const prev = stack[stack.length - 1];
    if (prev) {
      setStack((s) => s.slice(0, -1));
      setView(prev);
      return;
    }
    setView({ k: "rest" });
    if (window.location.search) {
      window.history.pushState(null, "", window.location.pathname);
    }
  }

  const openSection = view.k === "section" ? sections[view.tab] : null;
  const openSrc = view.k === "source" ? byId[view.id] : null;

  const headLabel =
    view.k === "rest"
      ? `Archive ref / ${cited.length} on file`
      : view.k === "source"
        ? `Ref [${number[view.id]}] / ${openSrc?.title ?? ""}`
        : view.k === "section"
          ? (openSection?.label ?? "")
          : "Response / no source";

  /* The return control names where it is actually going, not always home. */
  const prev = stack[stack.length - 1];
  const backLabel =
    prev?.k === "section"
      ? sections[prev.tab].label.split("/")[0].trim()
      : prev?.k === "empty"
        ? "response"
        : "archive ref";

  return (
    <SourcedContext.Provider
      value={{ panelId, number, byId, active, setActive, open: openSource }}
    >
      {/* Navigation is the folder tabs now — the bracket nav is gone. #0019. */}
      <nav className="tabs" aria-label="Record sections">
        {TABS.map((tab) => {
          const on = view.k === "section" && view.tab === tab.key;
          return on ? (
            <button
              key={tab.key}
              type="button"
              className="tab-on tab-label"
              aria-current="true"
              onClick={() => openTab(tab.key)}
            >
              {tab.label}
            </button>
          ) : (
            <button
              key={tab.key}
              type="button"
              className="tab-off"
              onClick={() => openTab(tab.key)}
            >
              <span className="tab-off-in tab-label">{tab.label}</span>
            </button>
          );
        })}
        {/* More sections are coming. The stub says so and does nothing. */}
        <div className="tab-stub" aria-hidden="true">
          <div className="tab-stub-in tab-label">+</div>
        </div>
      </nav>

      <div className="dossier-grid">
        <Panel className="h-full" inner="h-full px-[26px] pt-[22px] pb-6">
          <div
            className="flex justify-between gap-6 pb-[14px]"
            style={{ borderBottom: "1px solid var(--rule)" }}
          >
            <div>
              <div className="lbl">1_7 /</div>
              <div
                className="val"
                style={{ fontSize: "17px", letterSpacing: "0.04em" }}
              >
                Ezzeddine, Ali
              </div>
            </div>
            <div className="text-right">
              <div className="lbl">Archive# /</div>
              <ArchiveId id="ACD-2026-AI-0001" />
            </div>
          </div>

          <div className="mt-[18px] flex gap-[22px]">
            <Portrait />
            {/* Column-major: 2/3/4 down the left, 5/6/7 down the right. */}
            <div className="grid flex-1 grid-cols-2 content-start gap-x-5 gap-y-4">
              <Field n={2} label="Node">
                Beirut, LB
              </Field>
              <Field n={5} label="Status" tone="g">
                Open to roles
              </Field>
              <Field n={3} label="Discipline">
                Software / AI eng
              </Field>
              <Field n={6} label="Lang">
                AR / EN / FR
              </Field>
              <Field n={4} label="Origin">
                Electrical eng
              </Field>
              <Field n={7} label="Contact">
                <a className="val-link" href="mailto:ali@alicodes.dev">
                  ali@alicodes.dev
                </a>
              </Field>
            </div>
          </div>

          <div
            className="mt-[22px] pt-4"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            <div className="mb-[11px] flex items-baseline justify-between gap-4">
              <div className="lbl">Summary /</div>
              {/* Without this the claim affordance is undiscoverable. */}
              <div className="hint">Click a marked claim &rarr;</div>
            </div>
            {summary}
          </div>

          <div
            className="mt-[22px] pt-4"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            <div className="lbl mb-[11px]">
              Presence / graded, same as any source
            </div>
            {/* His own presence, graded with the same vocabulary as any
             * source: the arrow appears only where a URL exists. #0018. */}
            <div className="presence-row flex flex-wrap gap-[5px]">
              <Chips items={presence} />
            </div>
          </div>
        </Panel>

        <Panel className="col-start-3 h-full min-h-0" inner="pnl-in">
          <div className="pnl-head">
            <h2 className="pnl-head-l">{headLabel}</h2>
            {view.k !== "rest" ? (
              <button type="button" className="pnl-back" onClick={back}>
                [ &larr; {backLabel} ]
              </button>
            ) : null}
          </div>

          {/*
           * The panel is the page's only content surface, so its changes are
           * announced: a claim's source lives here, not in a description
           * target beside the claim.
           */}
          <div
            className="pnl-body"
            id={panelId}
            aria-live="polite"
            aria-atomic="false"
          >
            {view.k === "rest" ? (
              <div className="pnl-refs">
                {cited.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    className={cx(
                      "ref ref-btn",
                      source.href && "ref-link",
                      active !== null && active !== source.id && "ref-off",
                    )}
                    onClick={() => openSource(source.id)}
                    onMouseEnter={() => setActive(source.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(source.id)}
                    onBlur={() => setActive(null)}
                  >
                    <span className="ref-n">[{number[source.id]}]</span>
                    <span>
                      <span className="ref-t">
                        {source.title}
                        {source.href ? " →" : null}
                      </span>
                      <span className="ref-k">{source.kind}</span>
                    </span>
                  </button>
                ))}
                <div className="pnl-note pnl-note-rule">
                  Every source backing the record. Open one, or ask below.
                </div>
              </div>
            ) : null}

            {view.k === "source" && openSrc ? (
              <div>
                <div className="flex items-start gap-[9px]">
                  <div className="src-n">[{number[openSrc.id]}]</div>
                  <div className="src-id">
                    <div className="src-t">{openSrc.title}</div>
                    <div className="src-k">{openSrc.kind}</div>
                  </div>
                </div>

                <div className="src-sec src-sec-first">
                  <div className="lbl-s">Backs /</div>
                  <p className="src-backs">&ldquo;{openSrc.backs}&rdquo;</p>
                </div>

                <div className="src-sec">
                  <div className="lbl-s">Verbatim /</div>
                  <p className="src-quote">{openSrc.quote}</p>
                </div>

                <div className="src-sec">
                  <div className="lbl-s">Located at /</div>
                  {openSrc.href ? (
                    <Anchor
                      href={openSrc.href}
                      className="src-loc src-loc-link block"
                    >
                      {openSrc.locus}
                    </Anchor>
                  ) : (
                    <div className="src-loc">{openSrc.locus}</div>
                  )}
                  <div className="src-note">{openSrc.note}</div>
                </div>
              </div>
            ) : null}

            {view.k === "section" && openSection ? (
              <div>
                {openSection.rows.map((row) => (
                  <div key={row.n} className="sec-row">
                    <div className="flex items-baseline gap-[11px]">
                      <span className="sec-n">{row.n}</span>
                      <div className="min-w-0">
                        {row.href ? (
                          <Anchor href={row.href} className="sec-t block">
                            {row.title}
                          </Anchor>
                        ) : (
                          <div className="sec-t">{row.title}</div>
                        )}
                        <p className="sec-s">{row.summary}</p>
                        <div className="mt-[9px]">
                          <Chips items={row.chips} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pnl-note">{openSection.note}</div>
              </div>
            ) : null}

            {/*
             * State 5. Not an error state — #0013's editorial rule executing at
             * the agent layer, which is why it is built first-class rather than
             * as a fallback (#0023). Unreachable until #0021's input is live.
             */}
            {view.k === "empty" ? (
              <div>
                <div className="ans-asked">&gt; {view.asked}</div>
                <div className="nof">
                  <div className="nof-h">Nothing on file</div>
                  <p className="nof-p">
                    No source in this archive backs an answer to that. Rather
                    than write one, the record says so.
                  </p>
                </div>
                <div className="pnl-note mt-4">
                  The agent answers from the same sources the claims cite. If it
                  is not filed, there is no answer to give.
                </div>
              </div>
            ) : null}
          </div>

          <div className="pnl-foot">
            <div className="flex items-baseline justify-between gap-3">
              <div className="lbl">Query /</div>
              <div className="lbl-xs">Not built yet</div>
            </div>
            {/*
             * Ships visible and inert. On a site whose argument is provenance,
             * saying "not built yet" is on-brand — but nothing in here is
             * green, because green means live and this is not. #0021.
             */}
            <div className="q-row">
              <span className="q-prompt" aria-hidden="true">
                &gt;
              </span>
              <input
                className="q-input"
                placeholder="ask the archive"
                aria-label="Ask the archive — not built yet"
                disabled
              />
              <span className="q-send" aria-hidden="true">
                [ send ]
              </span>
            </div>
            <div className="mt-[10px] flex flex-wrap gap-[5px]">
              {SUGGESTIONS.map((s) => (
                <span key={s} className="q-chip">
                  &gt; {s}
                </span>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </SourcedContext.Provider>
  );
}
