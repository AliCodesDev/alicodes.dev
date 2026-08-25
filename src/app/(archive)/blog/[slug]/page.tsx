import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { RecordFrame } from "@/components/site-chrome";
import { Panel } from "@/components/record";
import { countSections, listEntries, loadEntry } from "@/lib/content";

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
  const entries = await listEntries("blog");
  return entries.map((entry) => ({ slug: entry.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadEntry("blog", slug);
  return { title: meta.title, description: meta.summary };
}

/*
 * An entry. Lighter than a work record — no field grid, because a note has no
 * role, stack or period to type — but the same measure, the same head panel and
 * the same numbered sections.
 */
export default async function BlogEntryPage({ params }: Props) {
  const { slug } = await params;
  const { meta, Body } = await loadEntry("blog", slug);
  const sections = countSections("blog", slug);

  return (
    <RecordFrame
      segments={["blog", slug]}
      meta={meta.draft ? "Draft — not published" : (meta.date ?? "Filed")}
      banner="Entry"
      footer={{ left: meta.date ?? "Undated", right: "alicodes.dev / archive" }}
    >
      <div className="record-grid">
        <Panel inner="rec-in">
          <div className="rec-top">
            <div className="min-w-0 flex-1">
              <div className="lbl">Entry /</div>
              <h1 className="val rec-title">{meta.title}</h1>
            </div>
            <div className="shrink-0 text-right">
              <div className="lbl">Filed /</div>
              <div className={`val ${meta.draft ? "val-r" : "val-a"}`}>
                {meta.draft ? "Draft" : meta.date}
              </div>
            </div>
          </div>
          <p className="rec-lede">{meta.summary}</p>
        </Panel>

        <div
          className="prose prose-numbered rec-body-col"
          style={{ "--sec-total": `"${sections}"` } as CSSProperties}
        >
          <Body />
        </div>
      </div>
    </RecordFrame>
  );
}
