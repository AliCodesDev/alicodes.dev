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

**#0013 — The site sources its claims (2026-08-20). Presentation superseded by
#0019; the rule stands.** Prose claims carry a typed, addressable source. This
entry describes it as a rail beside the text collapsing to an inline disclosure
on narrow screens, which is how it was built on 2026-08-20 — #0019 moved that
rail into the panel, where a claim now *opens* its source rather than merely
highlighting it. Everything below about grading and about unbacked claims is
unchanged. Sources are graded, because the grades are
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
eighty words). *Note:* this entry lists bracket nav among the direction's
elements. #0019 replaced it on `/` with folder tabs; the bracket nav survives
only for the themed routes that are still unstyled.

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
with no other change. *Extended 2026-08-22:* a chip can now declare
`tone: "link"` — linkable grade, URL still pending — so it carries the amber of
a link without the arrow of one. LinkedIn and Instagram use it. This is the
same rule stated positively: the grade is the colour, the arrow is the URL.

**#0019 — The homepage is a personnel dossier beside one panel (2026-08-22).
Supersedes #0001's work-showcase framing.** `/` stops being a scrolling
portfolio index. It is a single screen: a dossier on the left that is *the
subject*, and one panel on the right that is *everything you can look up about
him*. Three different gestures all put something into that same panel — a
marked claim opens its source, a folder tab renders a section, and the query
line (#0011) will return an agent answer. #0001's audience call still holds;
what changes is that the site argues from a person rather than from a list of
projects, so the work index moves off the page and into the panel. Three
consequences: `/about` is deleted, because the content it carried is field rows
in the record now; `/writing` leaves the navigation until it has something in
it; and the bracket nav is gone, replaced by folder tabs on the top edge of the
record. Considered keeping the index below the fold (rejected: it reinstates
the scrolling portfolio the panel exists to replace, and splits the reader's
attention between two surfaces that say the same thing). Considered opening
each section as its own route (rejected: a page load per section discards the
panel's whole premise, which is that one window answers everything).

**#0020 — A cited quote lives in the record it quotes (2026-08-22).** The
homepage's three sources pull verbatim sentences out of Safiyr's case study and
the résumé. Those quotes are declared in `metadata.pulls` in
`content/work/safiyr.mdx` and read out of `src/lib/resume.ts` — never retyped
into the component that renders them. A quote and the prose it quotes then live
in one file and move in one diff. The résumé's data moved out of its page into
`src/lib/resume.ts` for exactly this reason and for no other. A missing pull
throws at build rather than rendering an empty blockquote, on the same argument
as #0017: on a site whose entire claim is that the sources are real, a citation
that has quietly gone hollow is the one failure that costs more than a crash.
Considered scraping the sentence out of the MDX body at build time (rejected:
it makes every prose edit a potential silent citation break, and the fragility
is in the regex rather than in the content).

**#0021 — The query line ships visible, inert, and not green (2026-08-22).**
The panel foot carries the phase-two agent's input, labelled `NOT BUILT YET`,
with the field disabled and the suggestion chips inert. On a site whose argument
is provenance, saying "not built yet" is more on-brand than hiding the thing or
faking it. The divergence from the artboards is the colour: the prototype draws
the `>` prompt and `[ SEND ]` in green, and green under #0014 means live or
verified and nothing else. A disabled control painted in the one colour reserved
for "this works" is the same lie as an arrow that leads nowhere, so the whole
foot renders in `--ink-faint` until the agent lands, at which point it is a
token swap. This is #0018's rule applied to a control instead of a link.
Considered wiring the input to always return State 5 (rejected: "no source in
this archive backs an answer to that" is false for questions the archive
demonstrably answers, and shipping a false statement to demonstrate honesty is
self-defeating).

**#0022 — The homepage is desktop-only until a mobile artboard exists
(2026-08-22).** The column is a fixed `1080px` and the grid is `620 / 40 / 420`
on a definite `608px` row; a narrow screen scrolls it sideways rather than
reflowing. That row height is load-bearing, not decoration — without a definite
height the panel's scroll container has nothing to be capped against, the taller
column defines the row, and long panel content grows the page, which destroys
the single-screen premise the design exists to deliver. No mobile layout has
been drawn. The likely shape is the panel becoming a drawer, but that is a
design decision and improvising it in CSS would quietly make it one nobody took.
Considered a stacking fallback under ~1100px (rejected: it would be thrown away
when the real artboard lands, and in the meantime it hides the fact that the
question is still open).

**#0023 — `NOTHING ON FILE` is a first-class state, not a fallback
(2026-08-22).** When the agent has no source that backs an answer, the panel
renders a dedicated state in `--rust`: the question echoed back, then a box
saying the archive has nothing on file and would rather say so than write one.
It is built and styled as a peer of the answer state rather than as an error
branch, because it is #0013's editorial rule executing one level up — the same
rule that makes an unsourced claim render unmarked. It is also the most
persuasive screen in the design, and error states do not get designed twice.
Unreachable until #0021's input is enabled; the markup and tokens ship now so
phase two adds a branch and no layout work.

**#0024 — The four work records leave draft together (2026-08-22).** Kirikou,
GENIELearn and Benzina drop `draft: true`, so the panel's Work section shows
four rows in production instead of the one Safiyr. Their detail pages are still
write-up-pending stubs, which is the cost: a reader who opens Kirikou gets role,
period, stack and an honest note rather than a case study. Taken because the
Work tab is the section a recruiter opens first, and a portfolio for AI
engineering roles that lists a single project understates the work far more than
a thin detail page overstates it. #0006 still governs everything else — the
writing placeholder stays drafted. Revisit per-record once the write-ups land.

**#0025 — The themed routes get the record design (2026-08-24).** `/work`,
`/work/[slug]`, `/writing` and `/writing/[slug]` now render inside
`RecordFrame` — status bar, bracket nav, the 880px column, registry footer —
with the head panel, numbered field grid and numbered section heads from the
`SafiyrFile` and `GenieResolved` artboards. What they carried before was not
"the old provisional styling"; it was nothing. Those pages styled themselves
with `u-soft`, `u-mono`, `u-rule` and `u-faint`, which are defined in
`plain.css` — the stylesheet belonging to the *other* root layout — so on an
archive route all four resolved to no rule at all. The `(archive)` root layout
is `<body>{children}</body>` and only `/` supplied its own chrome, so those
pages also had no header, no footer, no column and no measure: Safiyr's 2,500
words set at whatever the viewport was, flush to both edges. This is the page
every citation on the homepage points at. `RecordFrame` and the source-rail CSS
had been written for exactly this and were rendered by nothing. Considered
copying the `u-*` rules into `globals.css` (rejected: it makes four dead
classes into four live ones that mean nothing in this design's vocabulary, and
the point of #0016's split is that the two stylesheets do not share a language).

**#0026 — Mobile is built, from the artboard that already existed (2026-08-24).
Supersedes #0022.** #0022 held the phone layout back because no artboard had
been drawn, and improvising one in CSS would have made a design decision nobody
took. The artboard existed: `MobileRec`, 390px, the fifth board on the canvas.
It had simply fallen out of the repo's memory. Below 1140px the layout is that
board — the record panel stacked, the portrait at 104×124 with the first fields
flowing around it, `Archive#` dropping under the title, and the panel following
underneath the record rather than beside it. Above 1140px the desktop design
runs exactly as drawn on its fixed 1080px column, untouched. Two states, both
drawn; nothing in between is invented, because nothing in between was drawn.
The 608px row #0022 called load-bearing is released only inside the narrow
breakpoint, and only because the panel stops being a capped scroll container in
the same rule — the single-screen premise the definite height protects is a
wide-layout premise. One behaviour is new rather than drawn: on the stacked
layout a tapped claim changes a panel that is off-screen below, so the panel is
scrolled into view. Considered keeping #0022 and shipping desktop-only
(rejected: the artboard's absence was the entire stated reason for the hold,
and it was not absent).

**#0027 — The 404 is the NOTHING ON FILE state (2026-08-24).** An unmatched URL
renders the archive's own "no source backs this" screen — same rust, same box,
same sentence structure — rather than an error page. A 404 *is* #0023 one layer
down: the archive was asked for a record it does not hold, and it would rather
say so than improvise one. It is `global-not-found.tsx` rather than
`not-found.tsx` because this app has two root layouts (#0016), so there is no
single layout a global 404 could compose from; that is the documented case the
convention exists for, and the cost is that the file carries its own `<html>`,
fonts and stylesheet, plus one experimental flag in `next.config.ts`. Considered
a `not-found.tsx` inside `(archive)` (rejected: it catches `notFound()` thrown
inside that segment, not the mistyped URL, which is the case that actually
happens — and the stock Next 404 is Helvetica on white, which is the single
most off-key screen the site could show).

**#0028 — The site ships a share card (2026-08-24).** `opengraph-image.tsx`
renders the record itself at 1200×630: the status path, `1_7 /`,
`EZZEDDINE, ALI`, the archive ID, and OPEN TO ROLES in green. This site is read
by people who were *sent* a link, so an unfurl in Slack or LinkedIn is the first
frame of the design most readers see, and the default is a bare title and a grey
box. Two details are load-bearing. Space Mono is fetched at build time, because
the image renderer has no system fonts and a monospace stack silently becomes
sans — which drops the one thing that makes the card read as the archive; the
fetch is wrapped so a build without network degrades the card rather than
failing, since a share image is not worth a build. And the green live dot is
drawn as a box, not typed as `●`: Space Mono has no U+25CF and there is no
fallback face to borrow one from, so the glyph renders as notdef. The file lives
in `(archive)/`, not at the app root — at the root it built as a route but was
linked from nothing.

**#0029 — A draft is hidden by URL, not only from the index (2026-08-24).**
#0006 says drafts render in dev and are hidden in production. It was half true:
`listEntries` filtered them out of the indexes, but `generateStaticParams` was
built from `listSlugs`, which reads the filesystem, so every draft was
prerendered and served to anyone with the URL. Params now come from the filtered
list, and with `dynamicParams = false` a draft is a 404 in production and works
in dev — which is what #0006 always said. Found because the production build
listed `/writing/placeholder`.

**#0030 — The folder tabs are questions the record has already answered
(2026-08-25).** Ali reversed #0011's shape without giving up its idea: instead
of a visitor typing a question and a model composing an answer, the questions
are fixed and the answers are written in advance. Pressing a tab echoes its
question — `> what has he actually shipped?` — and streams a reply into the
panel, followed by the rows it rests on and the sources it cites. The panel's
State 4 was already drawn for this and rendered by nothing: `.ans-asked`,
`.ans-p`, and an `.ans-fig` figure slot with a mono caption.

Three things make it more than a section list with a delay. The reply cites the
same numbered sources a marked claim opens, so the panel has one apparatus
rather than two, and a reader who has clicked `[1]` in the summary already knows
what a citation does. The stream is by token, not by character — a typewriter is
a different and older machine, and a language model emits chunks, so words land
in small bursts. And an answer with nothing behind it says so: Interests has no
prose at all, only #0023's NOTHING ON FILE block, which is #0013's editorial
rule arriving at the answer layer exactly as #0023 predicted it would.

The stream is decoration over content, so it is built never to be the reason
content is missing. It runs once per answer per session — returning from a cited
source restores the reply rather than replaying it — it is skipped entirely
under `prefers-reduced-motion`, the complete text sits in the panel's live
region from the first frame so a screen reader never waits out an animation, and
a timer watchdog lands the whole answer if `requestAnimationFrame` never fires,
which is what happens in a backgrounded tab. Considered a fade-in instead of a
stream (rejected: the fade is what any panel does, and the stream is the entire
reason the tabs are questions), and considered leaving the suggestion chips
under the query line (rejected: the tabs are the suggestions now, and one line
of prose says so without duplicating them).

**#0031 — Route names follow the tab names (2026-08-25).** `/work` became
`/projects` and `/writing` became `/blog`, with `content/` moving to match. A
tab reading PROJECTS over an address bar reading `/work` and a status path
reading `\ARCHIVE\WORK\` is a seam a careful reader sees, and nothing is
deployed yet (#0012), so the rename costs nothing now and gets more expensive
every day after. Archive IDs were left alone: `ACD-WRK-SFY-001` stays `WRK`,
because an identifier that changes when a shelf is relabelled is not an
identifier, and a classification code that no longer matches the current folder
name is what real archives look like.
