import type { Metadata } from "next";
import Link from "next/link";
import { listEntries } from "@/lib/content";

export const metadata: Metadata = { title: "Writing" };

export default async function WritingIndexPage() {
  const entries = await listEntries("writing");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
        <p className="u-soft max-w-xl text-pretty">
          Notes on building with LLMs, mostly about the parts that are hard to
          get right.
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="u-faint text-sm">Nothing published yet.</p>
      ) : (
        <ul className="space-y-6">
          {entries.map((entry) => (
            <li key={entry.slug} className="u-rule border-t pt-5">
              <Link href={`/writing/${entry.slug}`} className="group block space-y-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold group-hover:underline">
                    {entry.meta.title}
                  </h2>
                  <span className="u-mono u-faint shrink-0 text-[0.65rem] tracking-wide uppercase">
                    {entry.meta.draft ? "draft" : entry.meta.date}
                  </span>
                </div>
                <p className="u-soft max-w-xl text-sm text-pretty">
                  {entry.meta.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
