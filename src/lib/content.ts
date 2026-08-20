import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type Collection = "work" | "writing";

/**
 * An evidence chip: what backs a record, and how strongly. #0013.
 * `href` is set ONLY when the source is genuinely linkable — the arrow renders
 * from it, so a chip without a URL never claims to be one.
 */
export type Evidence = {
  label: string;
  href?: string;
  /** "live" = live/verified (green). "none" = context, or not yet gathered. */
  tone?: "live" | "none";
};

export type Meta = {
  title: string;
  summary: string;
  draft?: boolean;
  /** Curated running order; unordered entries sink to the bottom. */
  order?: number;
  /** work */
  role?: string;
  period?: string;
  location?: string;
  status?: string;
  stack?: string[];
  /** What backs this record on the index and work pages. */
  evidence?: Evidence[];
  /** Archive ID, e.g. ACD-WRK-SFY-001. Absent means NOT ISSUED. */
  archiveId?: string;
  /** writing */
  date?: string;
};

export type Entry = { slug: string; meta: Meta };

const CONTENT_ROOT = path.join(process.cwd(), "content");

/** Slugs on disk, from the filesystem — the source of truth for routing. */
export function listSlugs(collection: Collection): string[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

/**
 * The template prefix is static so the bundler can build a context module for
 * the directory; only the slug varies.
 */
export async function loadEntry(
  collection: Collection,
  slug: string,
): Promise<{ meta: Meta; Body: ComponentType }> {
  const mod =
    collection === "work"
      ? await import(`@content/work/${slug}.mdx`)
      : await import(`@content/writing/${slug}.mdx`);
  return { meta: mod.metadata as Meta, Body: mod.default as ComponentType };
}

/** Drafts are visible in dev so work-in-progress is reviewable, hidden in prod. */
export async function listEntries(collection: Collection): Promise<Entry[]> {
  const showDrafts = process.env.NODE_ENV === "development";
  const entries = await Promise.all(
    listSlugs(collection).map(async (slug) => ({
      slug,
      meta: (await loadEntry(collection, slug)).meta,
    })),
  );
  return entries
    .filter((e) => showDrafts || !e.meta.draft)
    .sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99));
}
