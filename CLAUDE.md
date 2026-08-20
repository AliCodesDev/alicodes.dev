@AGENTS.md

# alicodes.dev

Personal site for Ali Ezzeddine. Its job is to land **AI engineering roles** —
when a choice trades AI-engineering credibility against breadth or playfulness,
take credibility.

## Read these first

- `PROGRESS.md` — current state, what's next
- `DECISIONS.md` — why things are the way they are

## Conventions

- Content is MDX in `content/{work,writing}/`, reached via the `@content/*`
  alias. Each file exports a `metadata` object — **not** YAML frontmatter.
- `src/lib/content.ts` is the only thing that reads the content directory.
  Keep it that way: those same files become the retrieval corpus for the agent.
- Draft entries (`draft: true`) render in dev and are hidden in production.
- Work ordering is curated via `metadata.order`, never alphabetical.
- Run `pnpm build` before committing. It type-checks and prerenders every route,
  so it catches broken content imports that `pnpm dev` will happily tolerate.

## Gotchas

- **Turbopack cannot serialise JS functions to its Rust core.** remark/rehype
  plugins in `next.config.ts` must be strings (`"remark-gfm"`), not imported
  functions. This is the single easiest thing to get wrong here.
- This is **Next.js 16**. Its APIs may differ from model training data — read
  `node_modules/next/dist/docs/` before writing routing or config code. `params`
  is a `Promise` and must be awaited.
- `create-next-app` refuses to scaffold into a non-empty directory.

## Style

The visual direction is decided but **not yet built**. `src/app/globals.css`
still holds the old provisional neutral defaults — don't treat it as the design.

What to build instead is `DECISIONS.md` #0013 and #0014, with the mockups linked
from `PROGRESS.md`. In short: amber `#E3A63F` on near-black `#0A0B09`; green
`#43D98A` means live/verified and nothing else; Space Mono is the system voice
(labels, IDs, chips, nav, footers) and Archivo is display *and* body prose.
Claims carry typed sources in a rail — and a claim with no source gets no mark,
which is the point, not an oversight.

`/resume` stays plain and unstyled (#0010). It is deliberately outside all of
this.
