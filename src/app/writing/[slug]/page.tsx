import type { Metadata } from "next";
import { listSlugs, loadEntry } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSlugs("writing").map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadEntry("writing", slug);
  return { title: meta.title, description: meta.summary };
}

export default async function WritingPage({ params }: Props) {
  const { slug } = await params;
  const { meta, Body } = await loadEntry("writing", slug);

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          {meta.title}
        </h1>
        <p className="u-mono u-faint text-xs tracking-wide uppercase">
          {meta.draft ? "Draft" : meta.date}
        </p>
        <p className="u-soft max-w-xl text-lg leading-snug text-pretty">
          {meta.summary}
        </p>
      </header>

      <div className="prose">
        <Body />
      </div>
    </article>
  );
}
