import type { Metadata } from "next";
import Link from "next/link";
import { RecordFrame } from "@/components/site-chrome";
import { listEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on building with LLMs, mostly about the parts that are hard to get right.",
};

/*
 * Out of the navigation until it has something in it (#0019), but the route
 * still resolves, so it still gets the design. The empty state says what would
 * fill it rather than apologising for being empty.
 */
export default async function BlogIndexPage() {
  const entries = await listEntries("blog");

  return (
    <RecordFrame
      segments={["blog"]}
      meta={
        entries.length
          ? `${String(entries.length).padStart(2, "0")} entries on file`
          : "Nothing on file"
      }
      banner="Blog index"
      footer={{ left: "Notes on building with LLMs", right: "alicodes.dev / archive" }}
    >
      <p className="reg-lede">
        Notes on building with LLMs, mostly about the parts that are hard to get
        right.
      </p>

      {entries.length === 0 ? (
        <div className="reg-empty">
          <div className="lbl" style={{ color: "var(--rust)" }}>
            Nothing on file
          </div>
          <p className="reg-s mt-[11px]">
            No entry has been filed here yet. The project records carry the
            reasoning in the meantime — start with{" "}
            <Link href="/projects/safiyr">Safiyr</Link>.
          </p>
        </div>
      ) : (
        <ol className="reg-list">
          {entries.map((entry, i) => (
            <li key={entry.slug} className="reg-row">
              <span className="reg-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link href={`/blog/${entry.slug}`} className="reg-t">
                {entry.meta.title}
              </Link>
              <span className="reg-meta">
                {entry.meta.draft ? "Draft" : entry.meta.date}
              </span>
              <div className="reg-body">
                <p className="reg-s">{entry.meta.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </RecordFrame>
  );
}
