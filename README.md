# alicodes.dev

Personal site for Ali Ezzeddine — software / AI engineer, Beirut.

The homepage is a personnel record: a dossier beside a single panel that answers
everything you can look up about him. Claims in the prose carry numbered,
addressable sources, and clicking one opens the source in the panel — the quote,
where it came from, and whether it is genuinely linkable or merely cited. A claim
with nothing behind it gets no mark, which is the point rather than an oversight.

## Running it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

```bash
pnpm build   # type-checks and prerenders every route
pnpm lint
```

Run `pnpm build` before committing. It catches broken content imports that
`pnpm dev` will happily tolerate.

## Stack

Next.js 16 (App Router, Turbopack), TypeScript, Tailwind v4, MDX. Every route
prerenders static. Archivo and Space Mono, self-hosted through `next/font`.

## Layout

```
content/work/*.mdx        case studies — the source of truth for the site
content/writing/*.mdx
src/app/(archive)/        the themed site
src/app/(plain)/resume/   the résumé, deliberately outside the theme
src/components/           record, dossier, claims, chrome
src/lib/content.ts        the only thing that reads content/
```

Content is MDX reached through the `@content/*` alias, and each file exports a
`metadata` object rather than carrying YAML frontmatter. `draft: true` renders in
dev and is hidden in production. Work ordering is curated via `metadata.order`,
never alphabetical.

## Docs

- [`PROGRESS.md`](PROGRESS.md) — where the build stands, what is next, what is
  still open
- [`DECISIONS.md`](DECISIONS.md) — every non-trivial decision, with the reasoning
  and the alternatives that lost
- [`CLAUDE.md`](CLAUDE.md) — conventions and the gotchas worth knowing first
