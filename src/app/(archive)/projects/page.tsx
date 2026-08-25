import type { Metadata } from "next";
import Link from "next/link";
import { RecordFrame } from "@/components/site-chrome";
import { Chips } from "@/components/record";
import { listEntries } from "@/lib/content";
import { cx } from "@/lib/cx";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Four records: clinical infrastructure, a media intelligence agent, retrieval research, and a live product. Each one carries what backs it.",
};

/*
 * The project index as a registry listing, not a blog roll. Each row is a filed
 * record: its curated position (#0007), what it is, what backs it, and the
 * archive ID it sits under — NOT ISSUED where the record is unresolved.
 *
 * The lede is the grading legend rather than a count of the projects. A count
 * goes stale the moment a record is added, and on a site whose argument is that
 * its claims are checkable, the index should not open with the one sentence
 * nothing verifies.
 */
export default async function ProjectsIndexPage() {
  const entries = await listEntries("projects");

  return (
    <RecordFrame
      segments={["projects"]}
      meta={`${String(entries.length).padStart(2, "0")} records on file`}
      active="projects"
      banner="Project index"
      footer={{
        left: "Curated order, never alphabetical",
        right: "alicodes.dev / archive",
      }}
    >
      <p className="reg-lede">
        Every record carries what backs it. A chip is amber when it links
        somewhere, green when the thing is live or verified, and dashed when the
        evidence is named but not yet gathered.
      </p>

      <ol className="reg-list">
        {entries.map((entry, i) => (
          <li key={entry.slug} className="reg-row">
            <span className="reg-n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>

            <Link href={`/projects/${entry.slug}`} className="reg-t">
              {entry.meta.title}
            </Link>

            <span className="reg-meta">
              {entry.meta.archiveId ?? "Not issued"}
              {entry.meta.state ? (
                <>
                  <br />
                  <span
                    className={cx(
                      entry.meta.state.tone && `val-${entry.meta.state.tone}`,
                    )}
                  >
                    {entry.meta.state.label}
                  </span>
                </>
              ) : null}
            </span>

            <div className="reg-body">
              <p className="reg-s">{entry.meta.summary}</p>
              {entry.meta.evidence?.length ? (
                <div className="reg-chips">
                  <Chips items={entry.meta.evidence} />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </RecordFrame>
  );
}
