import Link from "next/link";
import { listEntries } from "@/lib/content";

export default async function HomePage() {
  const work = await listEntries("work");

  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          Ali Ezzeddine
        </h1>
        <p className="u-mono u-faint text-xs tracking-wide uppercase">
          Software / AI Engineer — Beirut, Lebanon
        </p>
        <p className="max-w-xl text-lg leading-relaxed text-pretty">
          I build LLM applications: agents that carry out multi-step work inside
          real systems, and the retrieval, integrations, and evaluation behind
          them. I came up through electrical engineering, so I care about rigour
          — and I do my best thinking across disciplines.
        </p>
      </section>

      {/* The agent lands here. Static shell first, retrieval second. */}
      <section className="u-rule rounded border border-dashed p-6">
        <p className="u-mono u-faint text-xs tracking-wide uppercase">
          Reserved — ask-me agent
        </p>
        <p className="u-soft mt-2 text-sm">
          Retrieval over this site&rsquo;s content, with citations back to source.
          Phase two.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="u-mono u-faint text-xs tracking-wide uppercase">
          Selected work
        </h2>
        <ul className="space-y-6">
          {work.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/work/${entry.slug}`} className="group block">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold group-hover:underline">
                    {entry.meta.title}
                  </h3>
                  {entry.meta.draft ? (
                    <span className="u-mono u-faint shrink-0 text-[0.65rem] tracking-wide uppercase">
                      draft
                    </span>
                  ) : null}
                </div>
                <p className="u-soft mt-1 max-w-xl text-sm text-pretty">
                  {entry.meta.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
