import type { Metadata } from "next";
import Link from "next/link";
import { listEntries } from "@/lib/content";

export const metadata: Metadata = { title: "Work" };

export default async function WorkIndexPage() {
  const entries = await listEntries("work");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Work</h1>
        <p className="u-soft max-w-xl text-pretty">
          Four projects. One shipped and live, one shut down, one in progress,
          one research.
        </p>
      </header>

      <ul className="space-y-8">
        {entries.map((entry) => (
          <li key={entry.slug} className="u-rule border-t pt-6">
            <Link href={`/work/${entry.slug}`} className="group block space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold group-hover:underline">
                  {entry.meta.title}
                </h2>
                <span className="u-mono u-faint shrink-0 text-[0.65rem] tracking-wide uppercase">
                  {entry.meta.draft ? "draft" : entry.meta.period}
                </span>
              </div>
              <p className="u-soft max-w-xl text-sm text-pretty">
                {entry.meta.summary}
              </p>
              {entry.meta.stack ? (
                <p className="u-mono u-faint text-xs">
                  {entry.meta.stack.slice(0, 5).join(" · ")}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
