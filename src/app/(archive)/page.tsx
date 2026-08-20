import Link from "next/link";
import { RecordFrame, SystemOnline } from "@/components/site-chrome";
import { ArchiveId, Chips, Field, Panel, Portrait } from "@/components/record";
import { Claim, Sourced, type Source } from "@/components/sourced";
import { listEntries } from "@/lib/content";

/*
 * The personnel record. Artboard 1 on the design canvas.
 *
 * The rail's case-study entries are cited, not linked — that is the artboard's
 * call, and #0013's whole point is that those grades render differently. The
 * index below carries the links.
 */
const SOURCES: Source[] = [
  { id: "safiyr", title: "Safiyr — full record", kind: "case study" },
  {
    id: "provenance",
    title: "Safiyr § provenance",
    kind: "case study",
    // Verbatim from content/work/safiyr.mdx, § "Provenance: verbatim or nothing".
    quote:
      "Facts marked as direct quotes are enforced verbatim against the source text, not merely requested to be.",
  },
  {
    id: "beng",
    title: "BEng elec. eng.",
    kind: "résumé",
    href: "/resume",
  },
];

export default async function HomePage() {
  const work = await listEntries("work");
  const filed = String(work.length).padStart(2, "0");

  return (
    <RecordFrame
      segments={["personnel"]}
      meta={<SystemOnline />}
      active="index"
      banner="Personnel record"
      footer={{
        left: "alicodes.dev registered record [1_6]",
        right: "Beirut, LB — 2026",
      }}
    >
      <Sourced sources={SOURCES}>
        <Panel>
          <div
            className="flex justify-between gap-6 pb-[14px]"
            style={{ borderBottom: "1px solid var(--rule)" }}
          >
            <div>
              <div className="lbl">1_6 /</div>
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

          <div className="mt-[18px] flex flex-col gap-5 sm:flex-row sm:gap-[22px]">
            <Portrait />
            <div className="grid flex-1 grid-cols-1 content-start gap-x-5 gap-y-4 sm:grid-cols-2">
              <Field n={2} label="Node">Beirut, LB</Field>
              <Field n={5} label="Status" tone="g">Open to roles</Field>
              <Field n={3} label="Discipline">Software / AI eng</Field>
              <Field n={6} label="Records">{filed} filed</Field>
              <Field n={4} label="Origin">Electrical eng</Field>
              <Field n={7} label="Lang">AR / EN / FR</Field>
            </div>
          </div>

          <div
            className="mt-[22px] pt-4"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            <div className="lbl mb-[11px]">Summary /</div>
            <p className="prose">
              Five months as sole engineer on{" "}
              <Claim src="safiyr">Safiyr</Claim>, an event-sourced clinical
              system where{" "}
              <Claim src="provenance">
                every extracted fact is traceable to the sentence it came from
              </Claim>
              . Before that, retrieval and evaluation work in a university
              research lab. I came up through{" "}
              <Claim src="beng">electrical engineering</Claim>, which is where
              the rigour comes from.
            </p>
          </div>
        </Panel>
      </Sourced>

      {/* The agent lands here. #0011 — the rail is its citation surface. */}
      <div className="record-grid mt-[26px]">
        <Panel>
          <div className="lbl" style={{ color: "var(--green)" }}>
            Query /
          </div>
          <div
            className="mt-3 flex items-center justify-between gap-3 px-[13px] py-[11px]"
            style={{ border: "1px solid var(--rule)" }}
          >
            <span
              className="mono"
              style={{
                fontSize: "12.5px",
                letterSpacing: "0.03em",
                color: "var(--ink-faint)",
              }}
            >
              &gt; what has he actually shipped?
            </span>
            <span
              className="mono"
              style={{ fontSize: "12.5px", color: "var(--green)" }}
            >
              &#9646;
            </span>
          </div>
          <div
            className="lbl mt-[11px]"
            style={{ letterSpacing: "0.1em" }}
          >
            Answers cite into archive ref. Phase two.
          </div>
        </Panel>
      </div>

      <div className="record-grid mt-[38px]">
        <div
          className="lbl pb-2"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          Index / selected records
        </div>
        <div
          className="lbl hidden pb-2 min-[900px]:block"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          Evidence /
        </div>
      </div>

      {work.map((entry, i) => (
        <div
          key={entry.slug}
          className="record-grid mt-[18px] pt-[18px]"
          style={i > 0 ? { borderTop: "1px solid var(--rule)" } : undefined}
        >
          <div className="flex items-baseline gap-[14px]">
            <span
              className="mono"
              style={{
                fontSize: "11px",
                color: "var(--amber-dim)",
                letterSpacing: "0.08em",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <Link
                href={`/work/${entry.slug}`}
                className="mono uppercase"
                style={{ fontSize: "16px", letterSpacing: "0.06em" }}
              >
                {entry.meta.title}
              </Link>
              <p
                className="mt-[5px]"
                style={{
                  fontSize: "14.5px",
                  lineHeight: 1.6,
                  color: "var(--ink-dim)",
                  textWrap: "pretty",
                }}
              >
                {entry.meta.summary}
              </p>
            </div>
          </div>
          {entry.meta.evidence ? <Chips items={entry.meta.evidence} /> : <div />}
        </div>
      ))}
    </RecordFrame>
  );
}
