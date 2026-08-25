import {
  RecordBanner,
  RegistryFooter,
  SiteHeader,
  SystemOnline,
} from "@/components/site-chrome";
import { Claim, type Source } from "@/components/sourced";
import {
  Dossier,
  type Answer,
  type AnswerRow,
  type TabKey,
} from "@/components/dossier";
import {
  listEntries,
  loadEntry,
  type Evidence,
  type Meta,
  type Pull,
} from "@/lib/content";
import { BENG, EDUCATION, EXPERIENCE } from "@/lib/resume";

/*
 * The personnel record. DECISIONS.md #0019 — the dossier is the subject, and
 * the panel beside it is everything you can look up about him.
 *
 * Since #0030 the folder tabs are questions rather than sections, so what is
 * assembled here is five *answers*: a question, a reply, what the reply rests
 * on, and the sources it cites. All of it is built on the server from the
 * content files and the résumé data and handed to the client component as
 * props — the page stays prerendered, the MDX files stay the single source of
 * truth (#0002), and the client component owns nothing but which view is open.
 */

/**
 * A source's quote comes out of the record it quotes. A missing one is a claim
 * with nothing behind it, so it fails the build rather than rendering an empty
 * blockquote in front of a hiring manager — the same argument as #0017.
 */
function pull(meta: Meta, file: string, id: string): Pull {
  const found = meta.pulls?.[id];
  if (!found) {
    throw new Error(
      `${file} declares no pull "${id}", but the homepage cites it. Either add it to that file's metadata.pulls or stop citing it.`,
    );
  }
  return found;
}

/**
 * Where to find him, graded with the same vocabulary as any source: all three
 * are linkable, and the arrow renders only where a URL actually exists. #0018.
 *
 * TODO(ali): LinkedIn and Instagram URLs pending. Adding an `href` to either
 * turns the chip into a link and changes nothing else about it — that is the
 * whole point of grading the chip separately from its arrow.
 */
const PRESENCE: Evidence[] = [
  { label: "github / alicodesdev", href: "https://github.com/AliCodesDev" },
  { label: "linkedin", tone: "link" },
  { label: "instagram", tone: "link" },
];

/**
 * The education rows, oldest first.
 *
 * `resume.ts` lists the MSc as 2017–2021 and the BEng as 2018–2022, so the
 * master's both starts and ends before the bachelor's. That is a transcription
 * error in the CV, not a fact, and the answer neither repeats it nor invents a
 * replacement: it shows the two degrees in the order they were actually taken
 * and leaves the years out until the real ones arrive.
 *
 * TODO(ali): supply the MSc's real dates in `src/lib/resume.ts` and add
 * `meta: item.dates` below — one line, and both pages stop hedging.
 */
const STUDY: AnswerRow[] = [BENG, ...EDUCATION.filter((s) => s !== BENG)].map(
  (item, i) => ({
    n: String(i + 1).padStart(2, "0"),
    /*
     * The institution is the headline here, not the degree — it is what a
     * reader scans for, and "BEng, Electrical and Computer Engineering —
     * American University of Beirut" runs to three lines of uppercase mono in
     * a 420px panel. The degree leads the line underneath instead.
     */
    title: item.org,
    meta: item.place,
    summary: `${item.title}. ${item.note}`,
  }),
);

export default async function HomePage() {
  const projects = await listEntries("projects");
  const posts = await listEntries("blog");
  const safiyr = await loadEntry("projects", "safiyr");

  const sources: Source[] = [
    {
      id: "safiyr",
      title: "Safiyr — full record",
      kind: "case study",
      ...pull(safiyr.meta, "content/projects/safiyr.mdx", "safiyr"),
    },
    {
      id: "provenance",
      title: "Safiyr § provenance",
      kind: "case study",
      ...pull(safiyr.meta, "content/projects/safiyr.mdx", "provenance"),
    },
    {
      id: "beng",
      title: "BEng elec. eng.",
      kind: "résumé",
      backs: "I came up through electrical engineering",
      // Quoted out of the résumé data, not retyped beside it. #0020.
      quote: `${BENG.title} — ${BENG.org}.`,
      locus: "/resume → education",
      href: "/resume",
      note: "Linkable. Plain page, outside the archive theme.",
    },
  ];

  const answers: Record<TabKey, Answer> = {
    projects: {
      label: "Projects",
      asked: "what has he actually shipped?",
      say: [
        "Four records on file. Safiyr leads them: five months as sole engineer on clinical infrastructure for the EU market, now decommissioned and private. The other three are public code — a media intelligence agent, retrieval research out of a university lab, and one product that is live today.",
      ],
      rows: projects.map((entry, i) => ({
        n: String(i + 1).padStart(2, "0"),
        title: entry.meta.title,
        href: `/projects/${entry.slug}`,
        meta: entry.meta.state?.label,
        metaTone: entry.meta.state?.tone,
        summary: entry.meta.summary,
        chips: entry.meta.evidence ?? [],
      })),
      cites: ["safiyr", "provenance"],
      note: "Curated order, never alphabetical. Open one to read its record.",
    },

    experience: {
      label: "Experience",
      asked: "where has he worked, and on what?",
      say: [
        "Four roles across four years, running backwards from Paris. Sole engineer on Safiyr through the first half of 2026; a year freelancing before that; nine months of retrieval and evaluation research at Universitat Pompeu Fabra; and, at the start, a year designing electrical systems in Beirut.",
      ],
      /*
       * Straight out of `resume.ts` — the same data `/resume` renders. The
       * first bullet of a role is its headline by construction, so the row
       * quotes it rather than paraphrasing it into a second version that can
       * drift. #0020.
       */
      rows: EXPERIENCE.map((role, i) => ({
        n: String(i + 1).padStart(2, "0"),
        title: `${role.title} — ${role.org}`,
        meta: role.dates.replace(/(\w{3})\w* (\d{4})/g, "$1 $2"),
        summary: role.points[0],
      })),
      cites: ["safiyr"],
      note: "The same entries /resume renders, read out of the same file.",
    },

    education: {
      label: "Education",
      asked: "what did he study?",
      say: [
        "Electrical and computer engineering at the American University of Beirut, then a master's at Universitat Pompeu Fabra in Barcelona — technology, robotics and human cognition.",
        "The engineering degree is where the rigour comes from. The master's is where the AI work started: the thesis became the retrieval project filed under Projects.",
      ],
      rows: STUDY,
      cites: ["beng"],
      note: "Both degrees, in the order they were taken.",
    },

    interests: {
      label: "Interests",
      asked: "what is he into outside of work?",
      /* No prose: the empty state is the whole reply. #0013, #0023. */
      say: [],
      nothing: {
        head: "Nothing on file",
        body: "Not written yet. This will say what he actually does away from a keyboard, or it will go on saying this. Something plausible would be easy to put here and would prove nothing.",
      },
      note: "Every other tab answers from something filed. This one has nothing to answer from.",
    },

    blog: {
      label: "Blog",
      asked: "does he write any of this down?",
      say: [],
      /*
       * Empty in production and honest about it, with the reader sent to the
       * long-form writing that does exist. Drafts render in dev (#0006), so in
       * development this is already the list it will become.
       */
      ...(posts.length
        ? {
            rows: posts.map((entry, i) => ({
              n: String(i + 1).padStart(2, "0"),
              title: entry.meta.title,
              href: `/blog/${entry.slug}`,
              meta: entry.meta.draft ? "Draft" : entry.meta.date,
              metaTone: entry.meta.draft ? ("dim" as const) : undefined,
              summary: entry.meta.summary,
            })),
            note: "Filed like any other record, and read the same way.",
          }
        : {
            nothing: {
              head: "Nothing on file",
              body: "No entries published under this heading. The long-form writing that exists sits inside the project records instead.",
            },
            rows: [
              {
                n: "01",
                title: "Safiyr — full record",
                href: "/projects/safiyr",
                meta: "Case study",
                summary:
                  "The nearest thing to an essay on this site: the decisions behind an event-sourced clinical system, and what each one cost.",
              },
            ],
            /* No citation: the row above already is the link, and printing
             * the same record twice under two labels is one accessory too
             * many. */
            note: "This becomes a list the day something is filed under it.",
          }),
    },
  };

  /*
   * The prose is rendered here so the copy sits with the page rather than
   * inside the state machine. Its `Claim`s pick up the panel's context by tree
   * position once React hydrates.
   */
  const summary = (
    /*
     * Keyed although it is not in a list. The React Compiler emits the panel's
     * children as a dynamic array once one of them comes from a prop, which
     * turns this element into an unkeyed array member and logs a key warning
     * in dev. One word here is cheaper than a wrapper element there.
     */
    <p key="summary" className="prose">
      Five months as sole engineer on <Claim src="safiyr">Safiyr</Claim>, an
      event-sourced clinical system where{" "}
      <Claim src="provenance">
        every extracted fact is traceable to the sentence it came from
      </Claim>
      . Before that, retrieval and evaluation work in a university research lab.
      I came up through <Claim src="beng">electrical engineering</Claim>, which
      is where the rigour comes from.
    </p>
  );

  return (
    <>
      <SiteHeader segments={["personnel"]} meta={<SystemOnline />} />
      <main className="dossier-col">
        <RecordBanner>Personnel record</RecordBanner>
        <Dossier
          sources={sources}
          answers={answers}
          summary={summary}
          presence={PRESENCE}
        />
        <RegistryFooter
          className="mt-[34px]"
          left="alicodes.dev registered record [1_7]"
          right="Beirut, LB — 2026"
        />
      </main>
    </>
  );
}
