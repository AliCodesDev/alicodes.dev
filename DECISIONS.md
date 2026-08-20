# alicodes.dev — Decision Log

Non-trivial decisions, with the reasoning and the alternatives that lost.
Append new entries at the bottom. Note supersessions in-line.

---

**#0001 — AI engineering roles are the target audience (2026-08-19).** The site
serves recruiters and hiring managers for AI engineering roles first; freelance
clients and partners second. Asked directly, Ali chose AI roles. This resolves
design and content questions that would otherwise stall, because the metaphor a
portfolio picks is a claim about what you do: a retro-desktop reads "frontend
hobbyist", a services page reads "agency". Considered building for both
audiences equally (rejected: sites that address everyone convince no one).

**#0002 — Content is MDX files in `content/`, not a CMS (2026-08-19).** Content
lives in git — diffable, reviewable, free, no vendor, no database. The decisive
reason is phase two: the same files become the retrieval corpus for the ask-me
agent, so there is one source of truth feeding both the pages and the index. A
CMS would mean maintaining two. Considered Contentlayer and a headless CMS
(rejected: both add a build dependency and a second copy of the content).

**#0003 — Metadata is a JS export, not YAML frontmatter (2026-08-19).**
`@next/mdx` does not parse frontmatter, but it does support ordinary named
exports, so each content file does `export const metadata = {...}`. Considered
`gray-matter` and `remark-frontmatter` (rejected: an extra dependency and a
parsing step to reproduce something the module system already gives us).

**#0004 — remark/rehype plugins are configured as strings (2026-08-19).**
Turbopack cannot pass JavaScript functions to its Rust core, so
`next.config.ts` names plugins as strings rather than importing them. This is
not a preference; the imported-function form silently fails under Turbopack.
Documented in a comment at the config site because it is non-obvious and easy to
"fix" back into breakage.

**#0005 — `content/` sits at the repo root, not under `src/` (2026-08-19).**
Writing should be a top-level concern in the tree, not buried in application
code, and the future retrieval indexer wants an obvious directory to point at.
Cost is one extra tsconfig path alias (`@content/*`). Considered `src/content/`
(would have worked with the existing `@/*` alias and matches the Next docs
example, but buries the thing Ali will touch most often).

**#0006 — Drafts render in dev, are hidden in production (2026-08-19).**
`draft: true` in a content file's metadata keeps it off the live site while
`pnpm dev` still shows it, labelled. This lets unfinished write-ups live in the
repo and be reviewed in place rather than in a branch or a scratch file.

**#0007 — Work ordering is curated, not alphabetical (2026-08-19).** An
`order` field in metadata drives the running order; unordered entries sink.
Alphabetical sorting put Safiyr — the strongest piece — last. Current order is
Safiyr, Kirikou, GENIELearn, Benzina: AI-first, with the shipped-product proof
anchoring the end.

**#0008 — Styling is provisional until the visual direction is chosen
(2026-08-19).** `globals.css` holds neutral, readable defaults behind a small
token layer. The intent was to make structure reviewable without quietly
deciding the visual identity. Design direction remains an open conversation;
treat everything visual as placeholder.

**#0009 — The Safiyr case study describes architecture and reasoning only
(2026-08-19).** No code, no product strategy, no customers. Ali owns the IP
outright so this is not a legal constraint — it is an editorial one. The
rejected alternatives in his decision log are what demonstrate judgement, and
they travel without any implementation detail. It also means the page would
survive a change in his position on the IP.

**#0010 — `/resume` is a plain, print-friendly HTML page (2026-08-19).** No
chrome, no theme, no interaction. Some readers are non-technical, in a hurry, or
forwarding internally, and novelty is a liability in that moment. Costs an
afternoon and removes the only real downside of a distinctive site design.

**#0011 — The ask-me agent is phase two (2026-08-19).** The homepage carries a
reserved slot. Building the static site first means Ali can be interviewing
while the agent gets built, rather than after. Whether it is a Python service
(on-message for his skills) or a TypeScript route handler (far simpler to deploy
alongside the site on Vercel) is deliberately left open — it constrains nothing
built so far.

**#0012 — DNS stays unpointed until there is a deploy worth pointing at
(2026-08-19).** The domain is registered at Namecheap and untouched. Pointing it
early means a live URL showing a scaffold.
