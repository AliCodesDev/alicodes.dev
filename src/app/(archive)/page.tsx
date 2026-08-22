import {
  RecordBanner,
  RegistryFooter,
  SiteHeader,
  SystemOnline,
} from "@/components/site-chrome";
import { Claim, type Source } from "@/components/sourced";
import { Dossier, type Section, type TabKey } from "@/components/dossier";
import {
  listEntries,
  loadEntry,
  type Evidence,
  type Meta,
  type Pull,
} from "@/lib/content";
import { BENG } from "@/lib/resume";

/*
 * The personnel record. DECISIONS.md #0019 — the dossier is the subject, and
 * the panel beside it is everything you can look up about him.
 *
 * Everything the panel shows is assembled here, on the server, from the content
 * files and the résumé data, and handed to the client component as props. The
 * page stays prerendered and the MDX files stay the single source of truth
 * (#0002); the client component owns nothing but which view is open.
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

export default async function HomePage() {
  const work = await listEntries("work");
  const safiyr = await loadEntry("work", "safiyr");

  const sources: Source[] = [
    {
      id: "safiyr",
      title: "Safiyr — full record",
      kind: "case study",
      ...pull(safiyr.meta, "content/work/safiyr.mdx", "safiyr"),
    },
    {
      id: "provenance",
      title: "Safiyr § provenance",
      kind: "case study",
      ...pull(safiyr.meta, "content/work/safiyr.mdx", "provenance"),
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

  const sections: Record<TabKey, Section> = {
    work: {
      label: `Work / ${String(work.length).padStart(2, "0")} records`,
      rows: work.map((entry, i) => ({
        n: String(i + 1).padStart(2, "0"),
        title: entry.meta.title,
        href: `/work/${entry.slug}`,
        summary: entry.meta.summary,
        chips: entry.meta.evidence ?? [],
      })),
      note: "Curated order, never alphabetical. Open one to read its record.",
    },
    resume: {
      label: "Résumé /",
      rows: [
        {
          n: "01",
          title: "Résumé — plain page",
          href: "/resume",
          summary:
            "Deliberately outside this design: no chrome, no theme, print-friendly. Some readers are in a hurry or forwarding it internally.",
          chips: [
            { label: "open /resume", tone: "live", href: "/resume" },
            // TODO(ali): drop resume.pdf into public/ and this becomes a link.
            { label: "pdf pending", tone: "none" },
          ],
        },
      ],
      note: "The one page that ignores everything else on this site.",
    },
    contact: {
      label: "Contact /",
      rows: [
        {
          n: "01",
          title: "ali@alicodes.dev",
          href: "mailto:ali@alicodes.dev",
          summary: "Direct. Fastest route to a reply.",
          chips: [
            { label: "email", tone: "live", href: "mailto:ali@alicodes.dev" },
          ],
        },
        {
          n: "02",
          title: "github / alicodesdev",
          href: "https://github.com/AliCodesDev",
          summary:
            "Kirikou, Benzina, Wazife. Inspectable code for the same class of problem as the private work.",
          chips: [
            {
              label: "repo",
              tone: "live",
              href: "https://github.com/AliCodesDev",
            },
          ],
        },
        {
          n: "03",
          title: "Beirut, LB",
          summary: "GMT+3. Open to remote and relocation.",
          chips: [{ label: "node" }],
        },
      ],
      note: "Every route in, graded like any other source.",
    },
  };

  /*
   * The prose is rendered here so the copy sits with the page rather than
   * inside the state machine. Its `Claim`s pick up the panel's context by tree
   * position once React hydrates.
   */
  const summary = (
    <p className="prose">
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
          sections={sections}
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
