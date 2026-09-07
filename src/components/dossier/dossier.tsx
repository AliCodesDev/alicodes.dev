"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArchiveId,
  Chips,
  Field,
  FieldGrid,
  Panel,
  Portrait,
} from "@/components/record";
import { SourcedContext, type Source } from "@/components/sourced";
import type { Evidence } from "@/lib/content";
import { AnswerView, RestView, SourceView } from "./views";
import type { Answer, TabKey } from "./types";

/*
 * The personnel record: a dossier on the left, and one panel on the right that
 * is the only content surface on the page. DECISIONS.md #0019.
 *
 * Every gesture on this page puts something into that one panel, and since
 * #0030 they all put the same *kind* of thing into it. A folder tab is a
 * question the record has already answered: it streams a reply, shows what the
 * reply rests on, and cites the same numbered sources a marked claim opens. The
 * query line at the foot is the one gesture still unbuilt, and when it lands it
 * will render into a shape the reader has already been taught.
 *
 * The panel never becomes two panels, and the page never scrolls: the grid row
 * is a definite height and the panel body is the only thing inside it that
 * scrolls.
 *
 * This file is the state machine — which view is open, what has been heard,
 * where `[ ← ]` goes — and the record beside it. What each view renders lives
 * in `views.tsx`; the `Answer` vocabulary lives in `types.ts`.
 */

type View =
  | { k: "rest" }
  | { k: "source"; id: string }
  | { k: "answer"; tab: TabKey };

const TABS: { key: TabKey; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "interests", label: "Interests" },
  { key: "blog", label: "Blog" },
];

const TAB_KEYS: string[] = TABS.map((t) => t.key);

/* Below this the layout is stacked and the panel sits under the record. */
const STACKED = "(max-width: 1139px)";

/**
 * On the stacked layout, a tapped tab or claim changes a panel that is
 * off-screen below the record. Bring it into view.
 *
 * Guarded on the media query rather than on width alone, so the wide layout —
 * where the panel is already beside the record — is untouched.
 *
 * The jump is instant on purpose. A smooth scroll can be silently dropped by
 * the environment, which leaves the reader looking at an unchanged screen after
 * a tap; landing there immediately always works. It also has to finish before
 * the reply streams, or the answer writes itself off-screen.
 */
function revealPanel(id: string) {
  if (typeof window === "undefined") return;
  if (!window.matchMedia(STACKED).matches) return;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "auto", block: "start" });
}

function isTab(value: string | null): value is TabKey {
  return value !== null && TAB_KEYS.includes(value);
}

export function Dossier({
  sources,
  answers,
  summary,
  presence,
}: {
  sources: Source[];
  answers: Record<TabKey, Answer>;
  /** The summary prose, with its `Claim`s, rendered on the server. */
  summary: ReactNode;
  presence: Evidence[];
}) {
  const panelId = useId();
  const frameId = `${panelId}-frame`;
  /* Set when the reader opens something, cleared once the panel is revealed. */
  const opened = useRef(false);
  const [view, setView] = useState<View>({ k: "rest" });
  /* Shallow stack, so `[ ← ]` returns where you came from rather than home. */
  const [stack, setStack] = useState<View[]>([]);
  const [active, setActive] = useState<string | null>(null);

  /*
   * An answer streams the first time it is asked for and never again. Coming
   * back from a source it cited should return you to the reply you were
   * reading, not replay it: streaming is how an answer arrives, not how it
   * exists.
   */
  const [heard, setHeard] = useState<ReadonlySet<TabKey>>(new Set());

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
   * Answers are linkable and the back button behaves, without the panel leaving
   * the static HTML: `useSearchParams` would push everything above it to client
   * rendering and fail the production build without a Suspense boundary, so we
   * read the URL on mount and drive it with the History API, which Next
   * integrates with its router.
   */
  useEffect(() => {
    const sync = () => {
      const s = new URLSearchParams(window.location.search).get("s");
      setStack([]);
      setView(isTab(s) ? { k: "answer", tab: s } : { k: "rest" });
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  /*
   * After the commit, not during the handler. Switching the panel changes its
   * height on the stacked layout, and a layout shift that large mid-flight
   * cancels a scroll — so the scroll has to start once the new content is
   * measured. The ref keeps it to reader-initiated opens: the mount-time URL
   * sync also sets a view, and a page that scrolls itself on load is a
   * different and worse thing.
   */
  useEffect(() => {
    if (!opened.current) return;
    opened.current = false;
    revealPanel(frameId);
  }, [view, frameId]);

  function openSource(id: string) {
    setStack((s) => [...s, view]);
    setView({ k: "source", id });
    opened.current = true;
  }

  function openTab(tab: TabKey) {
    setStack([]);
    setView({ k: "answer", tab });
    window.history.pushState(null, "", `?s=${tab}`);
    opened.current = true;
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

  const openTabKey = view.k === "answer" ? view.tab : null;
  const answer = openTabKey ? answers[openTabKey] : null;
  const openSrc = view.k === "source" ? byId[view.id] : null;

  /*
   * An answer is "heard" once its reply has finished streaming, and that one
   * fact drives both halves of the behaviour: the tail appears, and coming
   * back to this answer later replays nothing.
   */
  const onStreamed = useCallback(() => {
    if (openTabKey) {
      setHeard((prev) => new Set(prev).add(openTabKey));
    }
  }, [openTabKey]);

  const settled = openTabKey ? heard.has(openTabKey) : true;

  const headLabel =
    view.k === "rest"
      ? `Archive ref / ${cited.length} on file`
      : view.k === "source"
        ? `Ref [${number[view.id]}] / ${openSrc?.title ?? ""}`
        : `Response / ${answer?.label ?? ""}`;

  /* The return control names where it is actually going, not always home. */
  const prev = stack[stack.length - 1];
  const backLabel =
    prev?.k === "answer" ? answers[prev.tab].label : "archive ref";

  return (
    <SourcedContext.Provider
      value={{ panelId, number, byId, active, setActive, open: openSource }}
    >
      {/* Navigation is the folder tabs now — the bracket nav is gone (#0019) —
       * and each tab is a question the record answers when pressed (#0030). */}
      <nav className="tabs" aria-label="Ask the record">
        {TABS.map((tab) => {
          const on = openTabKey === tab.key;
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

          <div className="dossier-id">
            <Portrait />
            {/* Reading order. `FieldGrid` runs 2/3/4 down the left and 5/6/7
             * down the right on the wide layout, and plain rows on the narrow
             * one, without a second copy of the list. */}
            <FieldGrid rows={3} className="dossier-fields">
              <Field n={2} label="Node">
                Beirut, LB
              </Field>
              <Field n={3} label="Discipline">
                Software / AI eng
              </Field>
              <Field n={4} label="Origin">
                Electrical eng
              </Field>
              <Field n={5} label="Status" tone="g">
                Open to roles
              </Field>
              <Field n={6} label="Lang">
                AR / EN / FR
              </Field>
              <Field n={7} label="Contact">
                <a className="val-link" href="mailto:ali@alicodes.dev">
                  ali@alicodes.dev
                </a>
              </Field>
            </FieldGrid>
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

        <Panel id={frameId} className="h-full min-h-0" inner="pnl-in">
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
            {view.k === "rest" ? <RestView cited={cited} /> : null}

            {view.k === "source" && openSrc ? (
              <SourceView source={openSrc} />
            ) : null}

            {view.k === "answer" && answer && openTabKey ? (
              <AnswerView
                answer={answer}
                tab={openTabKey}
                instant={heard.has(openTabKey)}
                settled={settled}
                onDone={onStreamed}
              />
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
            {/* What the suggestion chips used to say, in one line instead:
             * the tabs are the questions this thing can already answer. */}
            <p className="q-note">
              {TABS.length} answers are already on file — the tabs above.
            </p>
          </div>
        </Panel>
      </div>
    </SourcedContext.Provider>
  );
}
