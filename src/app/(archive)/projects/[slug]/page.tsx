import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { RecordFrame } from "@/components/site-chrome";
import { Chips, RecordHead, type FieldSpec } from "@/components/record";
import {
  countSections,
  listEntries,
  loadEntry,
  type Meta,
} from "@/lib/content";

/*
 * A project record. The `SafiyrFile` and `GenieResolved` artboards: a head panel
 * carrying the record's typed fields, the prose at the 620px measure, and the
 * 212px column beside it. #0014.
 *
 * The banner reads `> PROJECT RECORD <` rather than the record's own title. The
 * artboards disagree here — `SafiyrFile` banners the title, `GenieResolved`
 * has no banner at all — and the title is already the first line of the panel
 * directly below, so a banner repeating it is an accessory. Naming the
 * *category* instead matches `/`'s `> PERSONNEL RECORD <` and survives a title
 * as long as GENIELearn's.
 */

type Props = { params: Promise<{ slug: string }> };

/*
 * `listEntries`, not `listSlugs`: #0006 hides drafts in production, and until
 * now it only hid them from the index — the route was still prerendered, so a
 * draft was reachable by anyone who knew or guessed its URL. Building the
 * params from the filtered list means `dynamicParams = false` turns a draft
 * into a 404 in production and leaves it working in dev, which is what the
 * decision says.
 */
export async function generateStaticParams() {
  const entries = await listEntries("projects");
  return entries.map((entry) => ({ slug: entry.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadEntry("projects", slug);
  return { title: meta.title, description: meta.summary };
}

/**
 * The record's typed fields, in reading order. `RecordHead` lays them out
 * column-major and numbers them from 2, because field 1 is the title.
 *
 * A field with no value is dropped rather than rendered empty: the numbering is
 * per record, so a record with less on file visibly has fewer fields — which is
 * the same rule as an unsourced claim rendering unmarked (#0013).
 */
function fieldsFor(meta: Meta): FieldSpec[] {
  const all: FieldSpec[] = [
    { label: "Role", value: meta.role },
    { label: "Node", value: meta.location },
    { label: "Stack", value: meta.stack?.slice(0, 3).join(" / ") },
    { label: "Period", value: meta.period },
    { label: "Status", value: meta.state?.label, tone: meta.state?.tone },
    { label: "Source", value: meta.source?.label, tone: meta.source?.tone },
  ];
  return all.filter((field) => Boolean(field.value));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { meta, Body } = await loadEntry("projects", slug);
  const entries = await listEntries("projects");

  const position = entries.findIndex((entry) => entry.slug === slug) + 1;
  const total = entries.length;
  const sections = countSections("projects", slug);

  return (
    <RecordFrame
      segments={["projects", slug]}
      meta={`Record ${String(position).padStart(2, "0")} of ${String(total).padStart(2, "0")}`}
      active="projects"
      banner="Project record"
      footer={{
        left: meta.status ?? "Archive record",
        right: meta.archiveId ?? "Archive# not issued",
      }}
    >
      <div className="record-grid">
        <RecordHead
          position={position}
          total={total}
          title={meta.title}
          archiveId={meta.archiveId}
          lede={meta.summary}
          fields={fieldsFor(meta)}
        />

        {/* How to read a grade, said once, at the top of the column the
         * grades appear in. #0013's vocabulary in the reader's hands. */}
        <aside className="lbl rail-legend">
          <b>Amber opens.</b>
          <br />
          Plain is cited, not linked.
        </aside>

        <div
          className="prose prose-numbered"
          style={{ "--sec-total": `"${sections}"` } as CSSProperties}
        >
          <Body />
        </div>

        {meta.evidence?.length ? (
          <aside className="rail-block">
            <div className="lbl rail-block-h">Evidence /</div>
            <Chips items={meta.evidence} />
          </aside>
        ) : null}
      </div>
    </RecordFrame>
  );
}
