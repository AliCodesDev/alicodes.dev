@AGENTS.md

# alicodes.dev

Personal site for Ali Ezzeddine. Its job is to land **AI engineering roles** —
when a choice trades AI-engineering credibility against breadth or playfulness,
take credibility.

## Read these first

- `PROGRESS.md` — current state, what's next
- `DECISIONS.md` — why things are the way they are

## Conventions

- Content is MDX in `content/{projects,blog}/`, reached via the `@content/*`
  alias. Each file exports a `metadata` object — **not** YAML frontmatter.
- `src/lib/content.ts` is the only thing that reads the content directory.
  Keep it that way: those same files become the retrieval corpus for the agent.
- Draft entries (`draft: true`) render in dev and are hidden in production.
  One consequence bites: the static export refuses a dynamic route that
  generates zero pages, so while no blog entry is published, the blog's
  `[slug]` folder is parked as `_slug` (Next's private-folder convention).
  Renaming it back and publishing the first entry are the same PR — the build
  fails on either half alone (#0033).
- Project ordering is curated via `metadata.order`, never alphabetical.
- The build is a static export (#0033): `pnpm build` emits the site into
  `out/`, `next start` no longer runs it, and every push to `main` deploys
  `out/` to GitHub Pages at alicodes.dev via `.github/workflows/deploy.yml`.
- Run `pnpm build` before committing. It type-checks and prerenders every route,
  so it catches broken content imports that `pnpm dev` will happily tolerate.
  CI (`.github/workflows/ci.yml`) runs `pnpm lint` and `pnpm build` on every PR
  and on `main`, so a miss cannot land silently — but it is a backstop, not a
  substitute for running the build locally first.
- A record's short state and source tokens (`metadata.state`, `metadata.source`)
  are what the field grid and the registry render; `metadata.status` stays the
  sentence, and closes the record in the registry footer.

## Gotchas

- **Turbopack cannot serialise JS functions to its Rust core.** remark/rehype
  plugins in `next.config.ts` must be strings (`"remark-gfm"`), not imported
  functions. This is the single easiest thing to get wrong here.
- This is **Next.js 16**. Its APIs may differ from model training data — read
  `node_modules/next/dist/docs/` before writing routing or config code. `params`
  is a `Promise` and must be awaited.
- `create-next-app` refuses to scaffold into a non-empty directory.
- **Tailwind v4 scans every non-gitignored file for class candidates —
  markdown included.** A word in this file or `DECISIONS.md` that happens to
  spell a utility name gets its rule emitted into the compiled CSS of both
  root layouts. Found when a decision-log sentence grew the CSS chunks by one
  positioning rule. Harmless unless markup accidentally uses the class, but it
  breaks byte-identical CSS comparisons; prefer a synonym in prose.
- **A running `next dev` poisons `pnpm build` if you check out an older
  commit.** The dev server regenerates `.next/dev/types/validator.ts` against
  whatever is on disk, so checking out a commit from before the `(archive)` /
  `(plain)` route groups leaves the validator importing `src/app/page.js`, and
  the next build fails type-checking on a file that no longer exists. It is a
  stale artifact, never a real error: `rm -rf .next/dev/types` and rebuild.

## Style

The visual direction is `DECISIONS.md` #0014 and #0019, and `src/styles/` holds
it — one file per concern, imported by `src/app/globals.css` in an order that is
load-bearing (#0032): the cascade resolves same-specificity conflicts by source
position, so never sort or regroup that import list. The palette: amber
`#E3A63F` on near-black `#0A0B09`; green `#43D98A` means live/verified
and nothing else — never decoration, and never a disabled control (#0021); Space
Mono is the system voice (labels, IDs, chips, tabs, notes, footers) and Archivo
is display *and* body prose. Claims carry typed sources — and a claim with no
source gets no mark, which is the point, not an oversight.

`/` is the dossier record (#0019): a 620px dossier beside a 420px panel on a
definite 608px row. **That row height is load-bearing above 1140px** — replace
it with `auto` or `min-height` there and the single-screen premise collapses.
The panel is the page's only content surface; resist adding a second one.

The folder tabs are not navigation. Each one is a question the record has
already answered (#0030): pressing it echoes the question, streams a reply into
the panel, and lands the rows and citations under it. A reply cites the same
numbered sources a marked claim opens — one apparatus, never two — and an
answer with nothing behind it renders #0023's NOTHING ON FILE rather than prose
(Interests does, deliberately). The stream is `src/components/streamed.tsx`; it
is decoration over content, so it runs once per answer per session, is skipped
under `prefers-reduced-motion`, keeps the full text in the live region from the
first frame, and has a timer watchdog because `requestAnimationFrame` never
fires in a backgrounded tab. Route names follow the tab names (#0031).

An `Answer` also takes an optional `figure: { src, alt, caption }` — a bordered
image with a mono caption, drawn on the artboards and wired up, and shipping
unfilled because no image was supplied. It is there; do not rebuild it.

Below 1140px the layout is the `MobileRec` artboard (#0026, superseding #0022):
one column, the panel stacked under the record, and the 608px row released —
which is safe only because the panel stops being a capped scroll container in
the same breakpoint. Two states, both drawn. Do not invent a third one in
between. The tabs are the one thing that changes shape there: five will not fit
on a line at 390px, so they drop the folder shoulder and wrap as square chips.

Every themed route outside `/` renders inside `RecordFrame`: status bar,
bracket nav, an 880px column (620 measure + 48 gutter + 212 rail), registry
footer. No themed route writes a `u-*` class any more — but **the four of them
still exist and `/resume` still depends on them**, in
`src/app/(plain)/plain.css`, which belongs to the other root layout (#0025).
They were never live on archive routes, which is why #0025 stopped using them
there; they are not dead code, and deleting them takes the résumé's styling
with it.

Take exact values from the artboards, not from screenshots; `PROGRESS.md` links
the canvas and says how to read the boards back out of it.

Anything a claim quotes lives in the record it quotes — `metadata.pulls` in the
content file, or `src/lib/resume.ts` — never retyped into a component (#0020).
That covers the tab answers too: their rows read out of `listEntries` and
`resume.ts`, and only the reply prose is written on the page.

`/resume` stays plain and unstyled (#0010). It is deliberately outside all of
this, and has its own root layout under `src/app/(plain)/` so the theme cannot
reach it (#0016).
