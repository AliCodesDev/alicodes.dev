import type { Metadata } from "next";
import { listSlugs, loadEntry } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSlugs("work").map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadEntry("work", slug);
  return { title: meta.title, description: meta.summary };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const { meta, Body } = await loadEntry("work", slug);

  const facts = [
    ["Role", meta.role],
    ["Period", [meta.period, meta.location].filter(Boolean).join(" · ")],
    ["Stack", meta.stack?.join(" · ")],
    ["Status", meta.status],
  ].filter(([, value]) => Boolean(value));

  return (
    <article className="space-y-10">
      <header className="space-y-5">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          {meta.title}
        </h1>
        <p className="u-soft max-w-xl text-lg leading-snug text-pretty">
          {meta.summary}
        </p>

        <dl className="u-rule u-mono grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y py-4 text-xs">
          {facts.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="u-faint tracking-wide uppercase">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="prose">
        <Body />
      </div>
    </article>
  );
}
