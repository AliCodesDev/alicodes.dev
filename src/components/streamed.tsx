"use client";

import { useEffect, useState } from "react";

/*
 * The answer arriving.
 *
 * Every folder tab is a question the record has already answered (#0030), and
 * the reply arrives the way a model's reply arrives: streamed. That is the
 * whole reason this file exists — the tabs would work as plain sections, and
 * the stream is what makes the panel read as a response rather than a drawer.
 *
 * It streams *tokens*, not characters. A character-at-a-time reveal is a
 * typewriter, which is a different and older machine; a language model emits
 * whole chunks, so here words land in small bursts with their spaces already
 * attached. That detail is the difference between observing the metaphor and
 * decorating with it.
 *
 * The text is in the DOM from the first frame for assistive technology: the
 * visible copy is `aria-hidden` and a complete copy sits beside it inside the
 * panel's live region. A screen reader gets the whole reply at once, which is
 * the correct behaviour — nobody should have to wait out an animation to hear
 * a sentence.
 */

/** Tokens per second. ~45 words lands in a little over a second. */
const RATE = 34;

type Tok = { p: number; text: string };

/** Words carrying their own leading space, tagged with their paragraph. */
function tokenize(paragraphs: string[]): Tok[] {
  return paragraphs.flatMap((para, p) =>
    para
      .split(" ")
      .filter(Boolean)
      .map((word, i) => ({ p, text: i === 0 ? word : ` ${word}` })),
  );
}

export function Streamed({
  paragraphs,
  /** Skip the stream: an answer already read this session. */
  instant = false,
  onDone,
}: {
  paragraphs: string[];
  instant?: boolean;
  onDone?: () => void;
}) {
  const toks = tokenize(paragraphs);
  const total = toks.length;

  /*
   * Both of these are decided once, at mount, and the parent remounts this
   * component per answer with a `key`. Snapshotting keeps the stream from
   * restarting when a re-render arrives mid-flight — including the re-render
   * this component's own completion causes.
   */
  const [immediate] = useState(
    () =>
      instant ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches),
  );
  const [shown, setShown] = useState(() => (immediate ? total : 0));

  useEffect(() => {
    if (immediate) return;

    let raf = 0;
    let landed = false;

    const finish = () => {
      if (landed) return;
      landed = true;
      setShown(total);
      onDone?.();
    };

    /*
     * Driven by elapsed time rather than a per-frame increment, so the reply
     * takes the same time to arrive on a 120Hz display as on a 60Hz one and
     * self-corrects after a dropped frame.
     */
    const start = performance.now();
    const step = (now: number) => {
      const n = Math.min(total, Math.floor(((now - start) / 1000) * RATE));
      if (n >= total) {
        finish();
        return;
      }
      setShown(n);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    /*
     * `requestAnimationFrame` does not fire at all in a backgrounded tab, so a
     * reader who switches away mid-reply would come back to an empty one and a
     * tail that never arrived. Timers are throttled there rather than stopped:
     * this one lands the whole answer if the stream is overdue, which also
     * covers any environment that never paints. The content is the point; the
     * stream is only how it arrives.
     */
    const watchdog = setTimeout(finish, (total / RATE) * 1000 + 600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
    };
  }, [immediate, total, onDone]);

  const streaming = shown < total;

  return (
    <>
      {/* The complete reply, for the panel's live region. Announced once. */}
      <p className="sr-only">{paragraphs.join(" ")}</p>

      <div aria-hidden="true">
        {paragraphs.map((_, p) => {
          const text = toks
            .slice(0, shown)
            .filter((t) => t.p === p)
            .map((t) => t.text)
            .join("");

          /* A paragraph that has not started yet does not reserve a gap. */
          if (!text) return null;

          const last = toks[shown - 1]?.p === p;
          return (
            <p key={p} className="ans-p">
              {text}
              {streaming && last ? <i className="ans-caret" /> : null}
            </p>
          );
        })}
      </div>
    </>
  );
}
