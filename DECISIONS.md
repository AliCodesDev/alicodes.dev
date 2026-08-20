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
(2026-08-19). Superseded by #0014.** `globals.css` holds neutral, readable
defaults behind a small token layer. The intent was to make structure reviewable
without quietly deciding the visual identity. Design direction remains an open
conversation; treat everything visual as placeholder.

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

**#0013 — The site sources its claims (2026-08-20).** Prose claims carry a
typed, addressable source, shown in a rail beside the text and collapsing to an
inline disclosure on narrow screens. Sources are graded, because the grades are
not equivalent: *linkable* (repo, live site, thesis, degree), *citable but not
linkable* (decision record, private source), and *context* — a link that proves
the thing exists but says nothing about Ali's role in it. The audience is doing
claim-verification when they read this, and the site is about provenance work
anyway: Safiyr's whole argument is that every clinical fact is traceable to the
sentence it came from, and this is the same idea one level up. The load-bearing
consequence is that a claim with no source cannot be marked, so an unbacked page
visibly looks unbacked — the editorial rule enforces itself instead of living in
a note in `PROGRESS.md`. It also gives the phase-two agent (#0011) a citation
surface that already exists, rather than one bolted on beside it. Considered
prose with ordinary inline links (rejected: a link to a repo and a line on a
résumé render identically, which is precisely the distinction worth making).

**#0014 — The visual direction is an archive record, not a terminal
(2026-08-20). Supersedes #0008.** Amber `#E3A63F` on near-black `#0A0B09`, with
green `#43D98A` reserved to mean live/verified and nothing else. Two families:
Space Mono for system voice — field labels, IDs, chips, nav, footers — and
Archivo for display *and* long-form body. Numbered field rows, an archive ID as
anchor, bracket nav, notched panels, corner status meta, registry footer.
The reference set Ali collected split into two groups, and the split decided
this: *records* (a colony personnel database, a character dossier) have an
information architecture — typed fields, an addressable ID, a subject whose
attributes can be looked up, which is structurally the same object as #0013's
rail. *Costume* (fake shell prompts, ASCII art, phosphor-green CRT) dresses an
ordinary page in terminal clothes. Taking the record and leaving the costume is
what keeps this clear of #0001's worry that retro reads "frontend hobbyist" — a
dossier is a claim about rigour, a terminal skin is a claim about nostalgia.
Rejected green-led (the most-produced look in the genre, and near-black plus one
acid accent is a stock default — hardest to make read as a decision) and
all-mono including body copy (Safiyr is ~2,500 words of argument; mono at that
length is a readability tax on exactly the reader we are trying to convince,
and the dossier references get away with it only because their bio panels are
eighty words).

**#0015 — The portrait is a deterministic dither, not a generated image
(2026-08-20).** `scripts/dither-portrait.py` takes the raw passport photo and
produces a 1-bit Floyd–Steinberg dither, white-on-transparent, tinted at render
time through a CSS mask. No image model touches it. The decisive reason is
fidelity: a generative pass subtly redraws a face — jaw, eye spacing, hairline —
and the person reading this site may later be sitting across from him. Three
lesser reasons: tinting in CSS keeps the portrait coupled to the palette token
instead of freezing it, a dither computed against the real pixel grid stays
sharp where a baked halftone gets resampled to mush at 2x, and the whole thing
is rerunnable. The raw photo stays gitignored under `assets/`; only the
processed output ships. Considered an image-to-image restyle at low strength
(rejected: still redraws the face, and it would have to be regenerated on every
palette change).

**#0016 — `/resume` is isolated by its own root layout (2026-08-20).** #0010
kept the résumé plain by convention; this makes it structural. The themed site
and `/resume` are separate route groups with separate root layouts, so
`/resume` has its own `<html>`, its own stylesheet, and no path by which the
archive theme can reach it. Considered scoping the dark theme to a wrapper
class inside one shared layout (rejected: the theme needs `body` to carry the
background and the scanline overlay, so "don't theme the résumé" would have
stayed a rule someone has to remember rather than something the tree enforces —
and the first person to add a global rule would have broken it silently). Cost
is a full page load when navigating between `/resume` and the rest of the site,
which is unobjectionable for a page people arrive at, read, and forward.

**#0017 — Claims reference declared sources by id; numbering is positional
(2026-08-20).** A `Sourced` group declares its sources in order; a `Claim`
names one by id and renders the marker for that source's position. Numbering
comes from the declaration, not from where the claim sits in the prose, so
moving a sentence does not renumber the rail. The load-bearing part is the
failure mode: a claim whose id matches no citable source renders as plain prose
with no mark, and a *context* source can never back a claim at all. That is
#0013's editorial rule executing rather than being remembered. Considered
explicit numbers in the markup (rejected: they go stale the moment a source is
inserted) and auto-registration in document order (rejected: it makes rail
order depend on render order, and leaves no way to declare a source that no
claim happens to cite yet).

**#0018 — A link's arrow renders from its URL, never from its grade
(2026-08-20).** Evidence chips and rail entries show the `→` only when an
`href` is actually present. The artboards draw `AliCodesDev/kirikou →` and
Benzina's `live →`, but no repo or deployment URL exists anywhere in this repo,
so those render as plain chips that still carry their grade and colour. This
diverges from the mockups deliberately: on a site whose whole argument is that
claims are traceable, an arrow that leads nowhere — or 404s in front of a
hiring manager — costs more than the missing affordance. The URLs are a
`TODO(ali)` in each content file, and adding one turns the chip into a link
with no other change.
