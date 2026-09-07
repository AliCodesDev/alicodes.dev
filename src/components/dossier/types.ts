import type { Evidence } from "@/lib/content";

/*
 * The vocabulary of the panel's ANSWER state. A folder tab is a question the
 * record has already answered (#0030), and an `Answer` is everything one reply
 * carries: the question, the streamed prose, the rows and figure it rests on,
 * and the sources it cites. The homepage assembles these on the server;
 * `Dossier` only decides which one is open.
 */

export type TabKey =
  | "projects"
  | "experience"
  | "education"
  | "interests"
  | "blog";

export type AnswerRow = {
  /** `01`-`04`. Curated position, not an array index. #0007. */
  n: string;
  title: string;
  /** Set only when the row genuinely goes somewhere. #0018. */
  href?: string;
  /** System-voice detail on the right of the title: a place, a period. */
  meta?: string;
  /** Grades that detail when it is a state token rather than a date. #0014. */
  metaTone?: "a" | "g" | "r" | "dim";
  summary: string;
  chips?: Evidence[];
};

/**
 * A question the record has already answered.
 *
 * `say` is the reply itself, streamed. Leaving it empty is how an answer
 * declines to have prose — the `nothing` block then becomes the whole reply,
 * which is #0013's editorial rule stated in the first person.
 */
export type Answer = {
  label: string;
  /** The question, echoed above the reply. */
  asked: string;
  say: string[];
  rows?: AnswerRow[];
  figure?: { src: string; alt: string; caption: string };
  /** Source ids this reply rests on, opened from the reply's foot. */
  cites?: string[];
  /** Rendered instead of rows when the archive has nothing filed. #0023. */
  nothing?: { head: string; body: string };
  note: string;
};
