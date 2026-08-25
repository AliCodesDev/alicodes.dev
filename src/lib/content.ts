import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type Collection = "projects" | "blog";

/**
 * An evidence chip: what backs a record, and how strongly. #0013.
 * `href` is set ONLY when the source is genuinely linkable — the arrow renders
 * from it, so a chip without a URL never claims to be one.
 */
export type Evidence = {
  label: string;
  href?: string;
  /**
   * "live" = live/verified (green). "none" = context, or not yet gathered.
   * "link" = linkable grade, URL still pending — amber, but arrow-less until
   * `href` arrives, which is #0018 doing exactly what it was written for.
   */
  tone?: "live" | "none" | "link";
};

/**
 * A quote pulled out of a record so a claim elsewhere can cite it. #0020.
 *
 * The quote is verbatim from this file's own prose — keeping it in the same
 * file means quote-and-source drift shows up in a single diff, which is the
 * whole point of a site that argues from provenance.
 */
export type Pull = {
  /** The claim this backs, in the words the claim uses. */
  backs: string;
  /** The sentence itself, verbatim from the record below. */
  quote: string;
  /** Exactly where it sits, e.g. `/projects/safiyr § "Provenance"`. */
  locus: string;
  /** Where the locus points, when it genuinely resolves. #0018. */
  href?: string;
  /** How to read this source's grade. */
  note: string;
};

/** A short value in the system voice, with the tone that grades it. */
export type Token = { label: string; tone?: "a" | "g" | "r" | "dim" };

export type Meta = {
  title: string;
  summary: string;
  draft?: boolean;
  /** Curated running order; unordered entries sink to the bottom. */
  order?: number;
  /** projects */
  role?: string;
  period?: string;
  location?: string;
  status?: string;
  stack?: string[];
  /**
   * The record's state as one short token — `DECOMMISSIONED`, `LIVE`. The
   * artboards set this in the field grid and the registry, where a sentence
   * will not fit; `status` stays the sentence. Tone follows #0014: `g` is live
   * or verified and nothing else, `r` is decommissioned.
   */
  state?: Token;
  /** Where the artefact itself sits — `Private`, `Public repo`. */
  source?: Token;
  /** What backs this record on the index and record pages. */
  evidence?: Evidence[];
  /** Archive ID, e.g. ACD-WRK-SFY-001. Absent means NOT ISSUED. */
  archiveId?: string;
  /** Quotes this record lends to claims elsewhere, keyed by source id. */
  pulls?: Record<string, Pull>;
  /** blog */
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
 * How many `##` sections a record has.
 *
 * The record voice numbers a field as "N of M" — `1_7 /` on the dossier, `2_4 /`
 * on a section head — so a section heading needs to know the total. MDX renders
 * each heading independently and cannot count its siblings, and CSS counters
 * have the same blind spot, so the total is counted here from the source and
 * handed to the page. Fenced code is skipped: a `## ` inside a code block is a
 * comment, not a section.
 *
 * This reads the content directory, which is deliberate — `content.ts` is the
 * only thing that does, and that stays true (#0002).
 */
export function countSections(collection: Collection, slug: string): number {
  const file = path.join(CONTENT_ROOT, collection, `${slug}.mdx`);
  if (!fs.existsSync(file)) return 0;
  let fenced = false;
  return fs.readFileSync(file, "utf8").split("\n").reduce((n, line) => {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      return n;
    }
    return !fenced && /^##\s+\S/.test(line) ? n + 1 : n;
  }, 0);
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
    collection === "projects"
      ? await import(`@content/projects/${slug}.mdx`)
      : await import(`@content/blog/${slug}.mdx`);
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
