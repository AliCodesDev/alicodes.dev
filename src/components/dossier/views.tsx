"use client";

import Link from "next/link";
import { useContext, type ReactNode } from "react";
import { Chips } from "@/components/record";
import {
  SourcedContext,
  type Source,
  type SourcedCtx,
} from "@/components/sourced";
import { Streamed } from "@/components/streamed";
import { cx } from "@/lib/cx";
import type { Answer, TabKey } from "./types";

/*
 * The panel's views — REST, SOURCE, ANSWER — split out of `dossier.tsx` so the
 * state machine and the states it renders read separately. Stateless on
 * purpose: which view is open, and whether an answer has been heard, stay
 * owned by `Dossier`.
 *
 * The shared plumbing — source numbering, the preview and commit handlers —
 * comes from `SourcedContext` rather than props. It is the same context a
 * `Claim` in the summary uses, and `Dossier` provides it around everything
 * here, so the views cite with the same apparatus as the prose. #0030.
 */

function useSourced(): SourcedCtx {
  const ctx = useContext(SourcedContext);
  if (!ctx) {
    throw new Error(
      "Panel views render inside Dossier's SourcedContext provider.",
    );
  }
  return ctx;
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

/** State 1: REST — every source backing the record, numbered and openable. */
export function RestView({ cited }: { cited: Source[] }) {
  const { number, active, setActive, open } = useSourced();

  return (
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
          onClick={() => open(source.id)}
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
        Every source backing the record. Open one, or press a tab above to ask.
      </div>
    </div>
  );
}

/** State 2: SOURCE — a claim or a citation was opened. */
export function SourceView({ source }: { source: Source }) {
  const { number } = useSourced();

  return (
    <div>
      <div className="flex items-start gap-[9px]">
        <div className="src-n">[{number[source.id]}]</div>
        <div className="src-id">
          <div className="src-t">{source.title}</div>
          <div className="src-k">{source.kind}</div>
        </div>
      </div>

      <div className="src-sec src-sec-first">
        <div className="lbl-s">Backs /</div>
        <p className="src-backs">&ldquo;{source.backs}&rdquo;</p>
      </div>

      <div className="src-sec">
        <div className="lbl-s">Verbatim /</div>
        <p className="src-quote">{source.quote}</p>
      </div>

      <div className="src-sec">
        <div className="lbl-s">Located at /</div>
        {source.href ? (
          <Anchor href={source.href} className="src-loc src-loc-link block">
            {source.locus}
          </Anchor>
        ) : (
          <div className="src-loc">{source.locus}</div>
        )}
        <div className="src-note">{source.note}</div>
      </div>
    </div>
  );
}

/**
 * State 4: ANSWER. The question, then the reply, then what the reply rests on.
 * The tail is held back until the stream settles, so the reply finishes being
 * a reply before it becomes a list.
 */
export function AnswerView({
  answer,
  tab,
  instant,
  settled,
  onDone,
}: {
  answer: Answer;
  tab: TabKey;
  /** Skip the stream: an answer already heard this session. */
  instant: boolean;
  /** The reply has finished streaming, so the tail may arrive. */
  settled: boolean;
  onDone: () => void;
}) {
  const { number, byId, setActive, open } = useSourced();

  return (
    <div>
      <div className="ans-asked">&gt; {answer.asked}</div>

      {answer.say.length ? (
        <div className="ans-say">
          <Streamed
            key={tab}
            paragraphs={answer.say}
            instant={instant}
            onDone={onDone}
          />
        </div>
      ) : null}

      {settled || !answer.say.length ? (
        <div className="ans-tail">
          {answer.figure ? (
            <figure className="ans-fig">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={answer.figure.src}
                alt={answer.figure.alt}
                className="ans-fig-img"
              />
              <figcaption className="ans-fig-cap">
                {answer.figure.caption}
              </figcaption>
            </figure>
          ) : null}

          {answer.nothing ? (
            <div className="nof">
              <div className="nof-h">{answer.nothing.head}</div>
              <p className="nof-p">{answer.nothing.body}</p>
            </div>
          ) : null}

          {answer.rows?.length ? (
            <div className="ans-rows">
              {answer.rows.map((row) => (
                <div key={row.n} className="sec-row">
                  <div className="flex items-baseline gap-[11px]">
                    <span className="sec-n">{row.n}</span>
                    <div className="min-w-0 flex-1">
                      <div className="sec-head">
                        {row.href ? (
                          <Anchor href={row.href} className="sec-t">
                            {row.title}
                          </Anchor>
                        ) : (
                          <div className="sec-t">{row.title}</div>
                        )}
                        {row.meta ? (
                          <div
                            className={cx(
                              "sec-meta",
                              row.metaTone && `val-${row.metaTone}`,
                            )}
                          >
                            {row.meta}
                          </div>
                        ) : null}
                      </div>
                      <p className="sec-s">{row.summary}</p>
                      {row.chips?.length ? (
                        <div className="mt-[9px]">
                          <Chips items={row.chips} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* The reply's citations, opening the same source cards a marked
           * claim opens. One apparatus, not two. #0030. */}
          {answer.cites?.length ? (
            <div className="ans-cites">
              <div className="lbl-s">Drawn from /</div>
              <div className="ans-cite-row">
                {answer.cites.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="ans-cite"
                    onClick={() => open(id)}
                    onMouseEnter={() => setActive(id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(id)}
                    onBlur={() => setActive(null)}
                  >
                    [{number[id]}] {byId[id]?.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pnl-note pnl-note-rule">{answer.note}</div>
        </div>
      ) : null}
    </div>
  );
}
