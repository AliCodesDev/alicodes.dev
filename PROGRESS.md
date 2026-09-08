# alicodes.dev — Progress

Running state. Updated at the end of every session. Detail lives in
`DECISIONS.md` and the git log; this file answers "where are we, what's next".

**Last updated:** 2026-09-08

---

## Where we are

Next.js 16 App Router, TypeScript, Tailwind v4, MDX content. `pnpm dev` is all
it takes to run. **Live at <https://alicodes.dev> since 2026-09-07:** the
build is a static export (#0033) published to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`. HTTPS is enforced,
`www` and plain `http` both 301 to the apex, and the themed 404 serves with a
real 404 status. #0012 is resolved.

**The whole site carries the design**, and since 2026-08-25 the folder tabs
are the site's central gesture rather than its navigation. Pressing one asks a
question the record has already answered: the question is echoed, the reply
streams in, and the rows and citations behind it arrive under it. #0030.

The tabs are Projects, Experience, Education, Interests, Blog, and the routes
were renamed to match them — `/work` is `/projects`, `/writing` is `/blog`,
`content/` moved with them. #0031.

Eleven routes, all prerendering static, plus one parked:

| Route | State |
|---|---|
| `/` | **Built.** The dossier + five answered questions — #0019, #0030 |
| `/projects` | **Built.** Registry listing — #0025 |
| `/projects/safiyr` | **Built.** Record page; prose is not yet sourced |
| `/projects/kirikou` | Built page, write-up pending (#0024) |
| `/projects/genielearn` | Built page, write-up pending (#0024) |
| `/projects/benzina` | Built page, write-up pending (#0024) |
| `/blog` | **Built.** Empty state, out of the bracket nav |
| `/blog/[slug]` | **Parked** as `_slug` — the export refuses a dynamic route with zero published entries. Renaming it back and publishing the first entry are the same PR (#0033) |
| `/resume` | Plain and print-friendly. Own root layout, untouched |
| `/nope` (any 404) | **Built.** The NOTHING ON FILE state — #0027 |
| `/opengraph-image` | **Built.** The share card — #0028 |
| `/icon.svg` | The notched panel, in amber |

**Mobile is built** — #0026 supersedes #0022. Below 1140px the layout is the
`MobileRec` artboard; above it the desktop design is untouched on its fixed
1080px column. Five tabs do not fit on one line at 390px, so on that layout
they lose the folder shoulder and wrap as square chips — a wrapped folder tab
cuts into the row above it and strands the active tab away from the panel.

Standing as of this session:

- `src/app/(archive)/page.tsx` — the five answers, every source and every row,
  assembled on the server and handed to the client component as props. Nothing
  in them is retyped from a record (#0020).
- `src/components/dossier/` — the record, the folder tabs, and the panel.
  Since 2026-09-07 it is a module: `dossier.tsx` is the state machine,
  `views.tsx` renders the panel's REST / SOURCE / ANSWER states, `types.ts` is
  the `Answer` vocabulary, and `index.ts` keeps `@/components/dossier`
  resolving. Answers sync to `?s=<tab>` through the History API. On the
  stacked layout, opening one scrolls the panel into view.
- `src/components/streamed.tsx` — the reply arriving, token by token. Runs once
  per answer per session, skipped under `prefers-reduced-motion`, and backed by
  a timer watchdog because `requestAnimationFrame` does not fire at all in a
  backgrounded tab.
- `src/components/record.tsx` — `Panel`, `Field`, `FieldGrid`, `RecordHead`,
  `Portrait`, `ArchiveId`, `Chips`.
- `src/components/site-chrome.tsx` — status bar, bracket nav, registry footer,
  and `RecordFrame`, which every themed route outside `/` now renders inside.
  It was written for this and had been used by nothing.
- `src/components/sourced.tsx` — `Claim` and its context. `Pending` is still
  unused; it is the evidence-not-yet-gathered block GENIELearn's page wants.
- `src/lib/cx.ts` — one `cx`, which previously existed three times over.

The three homepage sources quote out of `content/projects/safiyr.mdx`'s
`metadata.pulls` and `src/lib/resume.ts`; a missing pull fails the build (#0020).

Archive IDs follow `ACD-WRK-<mnemonic>-<order>` in `metadata.archiveId`. A
record with none reads NOT ISSUED — GENIELearn's does, deliberately.

## The artboards

The design canvas is the source of truth for the design, not this repo:

> https://claude.ai/code/artifact/97e5a4fe-5736-4171-a3b7-adbd14414fcf

Nine boards: `Main` (the record), `Active` (claim active), `SafiyrFile`,
`GenieFile` / `GenieResolved` (before and after evidence), **`MobileRec`
(390px)**, `Spec2` (type & colour), and two v1s. `Spec2` was checked against
the stylesheet in an earlier session and the token layer is faithful to it.
(The tokens have since moved to `src/styles/base.css` in the 2026-09-07
split — `:root` travelled verbatim, so the check still stands.)

**`MobileRec` is why #0022 is gone.** That board had been drawn all along; the
repo had simply lost track of it, and its absence was the entire stated reason
mobile was blocked. If a future session needs the boards again, they are
embedded in the published artifact as JSON-escaped strings keyed by
`<Name>.dc.html` — read the artifact to a file and `json.JSONDecoder().raw_decode`
from each key. Do that before designing anything on these pages; take exact
values from the boards, not from screenshots.

## What's next

1. **Interests has nothing behind it.** The tab ships answering NOTHING ON FILE
   by Ali's own call — the honest state until he says what goes there. It is
   the one tab on the page that cannot answer.
2. **Sourcing Safiyr's prose.** `Claim` is still not wired into
   `src/mdx-components.tsx`, and the 212px column on a record page carries the
   record's evidence chips, which is real data and not a placeholder for the
   rail. Ali wants a different direction from the artboard's rail and has not
   described it yet.

   The CSS waiting for that rail is `.rail`, `.rail-body`, `.rail-chev`,
   `.rail-count`, `.ref-body` and `.ref-context` in
   `src/styles/record-rail.css`, plus `.ref-n-on` and `.ref-quote` in
   `src/styles/refs.css`.
   **Do not read that as "the `.ref-*` classes are dead"** — the rest of the
   family (`.ref`, `.ref-n`, `.ref-t`, `.ref-k`, `.ref-btn`, `.ref-link`,
   `.ref-off`) is what draws the panel's REST state, and deleting it would take
   the source list with it. This note used to say `.ref-*` as a family was
   rendered by nothing, which was wrong.
3. **Kirikou and Benzina write-ups**, which is what makes #0024 sit right.
4. **The query line** (#0011, #0021). It is now the only gesture on the page
   that does not answer, and #0030 gave it a shape to render into: whatever it
   returns is an `Answer`, and an answer nothing backs is already built.

## Built but unused

- **The answer figure slot.** `Answer` takes an optional
  `figure: { src, alt, caption }`, rendered as `.ans-fig` / `.ans-fig-img` /
  `.ans-fig-cap` — a bordered image with a mono caption under it, drawn on the
  artboards and wired but deliberately unfilled (#0030). Ali raised photos and
  then did not supply any, and no image is invented for him. Drop a file in
  `public/` and add the field to one answer in `src/app/(archive)/page.tsx`.
- **`Pending`** in `src/components/sourced.tsx` — the evidence-not-yet-gathered
  block GENIELearn's record wants. Still rendered by nothing.

(`.tab-stub` / `.tab-stub-in`, `.mono`, `.prose .table-scroll` and a duplicate
`.rec-fields` block used to be listed here; all four were deleted on
2026-09-07 after proving nothing renders them — grep across `src/` and
`content/`, plus an audit of every template-literal `className`, of which the
only dynamic form anywhere is `` `val-${tone}` ``.)

## Open threads

- **Safiyr decision-record numbers.** The mockups cite `[NNN]` placeholders.
  Ali has 215 numbered records; the real numbers for the schema-level MDR
  boundary and the rejected classifier-gate decision need filling in. Blocked
  behind the direction call above.
- **Kirikou and Benzina URLs.** Neither a repo nor a deployment URL exists
  anywhere in this repo, so their evidence chips render without an arrow
  (#0018). `TODO(ali)` in each content file; one line each makes them links.
- **Answer-row copy.** The Projects rows read `metadata.summary` straight from
  each content file, which is the right source (#0002) but was written for a
  full page: Safiyr's runs four lines in a 420px column, now underneath a reply
  that has already said much the same thing. Tighten the summaries at source
  rather than adding a second field.
- **Source states are not linkable.** `?s=<tab>` makes an answer shareable, but
  an open source is client state only. `?ref=<id>` would make any claim's source
  a URL — small, and very much in the spirit of the thing. It would also give
  an answer's citations somewhere real to point.
- **Safiyr diagram** — the provenance pipeline SVG exists only in a Claude
  artifact, not yet in the site page. Needs either an MDX-imported component or
  inline SVG.
- **Safiyr write-up, unconfirmed details** — whether "sole engineer" needs a
  co-founder acknowledgment, whether the €30/month figure earns its place,
  whether the demo's pinned specialty should be mentioned at all.
- **`resume.pdf`** does not exist, and `/resume` does not link to it — the
  page carries only the mailto and the GitHub URL, so there is no broken link
  to fix. Dropping the file in `public/` and adding the anchor is one change,
  not two; `TODO(ali)` at the top of `src/app/(plain)/resume/page.tsx`. (This
  entry used to claim the page already linked to a missing file.)
- **Education dates** — `TODO(ali)` in `src/lib/resume.ts`. The CV has the MSc
  starting and ending before the BEng (2017–2021 against 2018–2022). Public on
  the resume page, and the homepage's `[3]` quotes the BEng line out of that
  same file. The Education answer neither repeats the error nor invents a
  replacement: it shows the two degrees in the order they were taken and prints
  no years at all. One real date in `resume.ts` plus `meta: item.dates` in the
  homepage's `STUDY` map, and it stops hedging.
- **No LinkedIn or Instagram URL** anywhere in the repo. Both presence chips
  carry the linkable grade (`tone: "link"`) and render amber but arrow-less
  until Ali supplies them; one `href` each in `PRESENCE` makes them links.
- **GENIELearn evidence — path identified, not yet gathered.** The thesis on
  the UPF record is the piece that unblocks the page: authored, dated, titled,
  institution-hosted. The degree proves the credential, not the work — link
  UPF's verification page rather than hosting the certificate PDF, which
  carries a student number and verification code. The GENIELearn project link
  is *context*, never a citation. Keep the "the lab whose work feeds GENIELearn"
  phrasing.
- **`globalNotFound` is an experimental flag** (#0027). It is the documented
  route for an app with two root layouts, but it is experimental — if a future
  Next release moves it, the fallback is a `not-found.tsx` per route group.
- **Safiyr redeploy** — optional, wanted. Synthetic patients only: no real
  health data means no Article 9 processing and no HDS requirement, so it can be
  hosted cheaply. Frontends on Vercel, FastAPI on Fly or Railway, Postgres on
  Neon, Redis on Upstash, keep AWS KMS.

## Assets

- `public/portrait.png` — 1-bit dither of Ali's passport photo,
  white-on-transparent, tinted at render time through a CSS mask so it follows
  the amber token. Built by `scripts/dither-portrait.py`; rerun it if the
  palette or the frame size changes. #0015.
- `src/app/icon.svg` — the notched panel in amber. Hand-written, no build step.
- `assets/` and `frontend-inspo/` are gitignored. `assets/` holds the raw ID
  photo (only the processed output ships); `frontend-inspo/` holds visual
  reference scraped from the web.

## Housekeeping outside this repo

- `wazife`'s README is still the stock Vite template. Public, and linked from
  this site's Contact section, so it is part of what a recruiter reads.
- GitHub profile has no bio, no location, no link. Pin Safiyr's public
  counterparts: Kirikou, Benzina, Wazife.
