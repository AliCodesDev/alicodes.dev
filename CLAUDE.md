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
- **A running `next dev` poisons `pnpm build` if you check out an older
  commit.** The dev server regenerates `.next/dev/types/validator.ts` against
  whatever is on disk, so checking out a commit from before the `(archive)` /
  `(plain)` route groups leaves the validator importing `src/app/page.js`, and
  the next build fails type-checking on a file that no longer exists. It is a
  stale artifact, never a real error: `rm -rf .next/dev/types` and rebuild.

## Style

The visual direction is `DECISIONS.md` #0014 and #0019, and `globals.css` holds
it: amber `#E3A63F` on near-black `#0A0B09`; green `#43D98A` means live/verified
and nothing else — never decoration, and never a disabled control (#0021); Space
Mono is the system voice (labels, IDs, chips, tabs, notes, footers) and Archivo
is display *and* body prose. Claims carry typed sources — and a claim with no
source gets no mark, which is the point, not an oversight.

`/` is the dossier record (#0019): a 620px dossier beside a 420px panel on a
definite 608px row, with folder tabs for navigation. **That row height is
load-bearing** — replace it with `auto` or `min-height` and the single-screen
premise collapses. The panel is the page's only content surface; resist adding a
second one. Desktop only, on purpose: a phone scrolls it sideways until someone
draws a mobile artboard (#0022).

The remaining themed routes still carry the old provisional `u-*` classes;
extend the design onto them rather than reviving those. Take exact values from
the artboards, not from screenshots — `PROGRESS.md` links the canvas and the
`design` skill reads it back with `--extract`.

Anything a claim quotes lives in the record it quotes — `metadata.pulls` in the
content file, or `src/lib/resume.ts` — never retyped into a component (#0020).

`/resume` stays plain and unstyled (#0010). It is deliberately outside all of
this, and has its own root layout under `src/app/(plain)/` so the theme cannot
reach it (#0016).
