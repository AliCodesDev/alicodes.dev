# alicodes.dev — Progress

Running state. Updated at the end of every session. Detail lives in
`DECISIONS.md` and the git log; this file answers "where are we, what's next".

**Last updated:** 2026-08-20

---

## Where we are

Scaffold is built, pushed, and green. Next.js 16 App Router, TypeScript,
Tailwind v4, MDX content. `pnpm dev` is all it takes to run.

Twelve routes, all prerendering static:

| Route | State |
|---|---|
| `/` | **Built.** The personnel record, sourced, with the agent slot |
| `/work` | Index, curated order — still on the old provisional classes |
| `/work/safiyr` | **Written**, not yet in the design |
| `/work/kirikou` | Stub — draft |
| `/work/genielearn` | Stub — draft |
| `/work/benzina` | Stub — draft |
| `/writing` | Index, empty in production — old classes |
| `/writing/placeholder` | Stub — draft |
| `/about` | Written from the CV — old classes |
| `/resume` | Plain and print-friendly. Own root layout, outside the design |

**The design is built as far as the homepage.** `DECISIONS.md` #0013, #0014,
#0015. Two layers, decided separately:

- **Sourced** (#0013) — claims carry typed, addressable sources in a rail.
  Grades matter: linkable (repo, live, thesis, degree), citable-but-private
  (decision record, private source), and *context* (proves the thing exists,
  not his role in it).
- **Archive record** (#0014) — amber `#E3A63F` on near-black `#0A0B09`, green
  `#43D98A` reserved for live/verified only. Space Mono is system voice,
  Archivo is display and body. Numbered field rows, archive IDs, notched
  panels, bracket nav.

Standing as of `2532ae4`:

- `src/app/globals.css` — record tokens and type, lifted from the `Spec2`
  artboard. The provisional neutral defaults are gone.
- `src/components/site-chrome.tsx` — status bar, bracket nav, registry footer,
  and `RecordFrame`, the page template every artboard shares.
- `src/components/sourced.tsx` — `Claim`, `Sourced`, the rail and its active
  state. #0017.
- `src/components/record.tsx` — panel, numbered field row, portrait, chips.
- `/` is built. Every other themed route still carries the old provisional
  `u-*` classes and renders unstyled until the work-page pass lands.

Archive IDs follow `ACD-WRK-<mnemonic>-<order>` and live in each content file's
`metadata.archiveId`. A record with none reads NOT ISSUED — which is what
GENIELearn's shows, deliberately.

**Mockups:** nine artboards on a design canvas, across two pages. Page
"Archive" holds seven — the homepage record, the active-claim state, Safiyr,
GENIELearn before and after its evidence lands, mobile, and a type-and-colour
specimen. Page "Sourced — v1" holds the other two, both superseded; ignore
them.

> https://claude.ai/code/artifact/97e5a4fe-5736-4171-a3b7-adbd14414fcf

That canvas is the source of truth for the design, not this repo — the working
`.dc.html` files were not committed, because editing the canvas in the browser
would silently make a committed copy stale. A fresh session can read it back
with the `design` skill's `--extract`.

## What's next

1. **Finish the design build.** Wire `Claim`/`Source` into
   `src/mdx-components.tsx`, then the work pages and `/work/safiyr`, then
   `/work`, `/writing` and `/about`, which are still unstyled. `/resume` stays
   plain — #0010, now enforced by its own root layout rather than by
   convention (#0016).
2. **Kirikou write-up**, once the project itself is finished.
3. **The ask-me agent** (#0011). The source rail is its citation surface, so
   it lands inside the design rather than beside it.

## Open threads

- **Safiyr decision-record numbers.** The mockups cite `[NNN]` placeholders.
  Ali has 215 numbered records; the real numbers for the schema-level MDR
  boundary and the rejected classifier-gate decision need filling in.
- **Kirikou and Benzina URLs.** Neither a repo nor a deployment URL exists
  anywhere in this repo, so their evidence chips render without an arrow
  (#0018). `TODO(ali)` in each content file; one line each makes them links.
- **Mobile is written but not seen.** The rail collapses to a `<details>`
  disclosure under 900px and the record stacks, but Chrome clamped the window
  width during the build session, so none of it has been looked at. Check it
  on a real phone width before this ships.
- **No mobile nav.** The mobile artboard shows a hamburger; the five bracket
  items wrap to a second line instead. Fine for now, but it is a divergence.
- **Case-study rail entries are cited, not linked** — the artboards render them
  plain, so `[1]`/`[2]` on the homepage do not navigate to the Safiyr page.
  Faithful to the mockups; worth a second look once the work pages exist.
- **Safiyr diagram** — the provenance pipeline SVG exists only in a Claude
  artifact, not yet in the site page. Needs either an MDX-imported component or
  inline SVG. Do it when the design is built.
- **Safiyr write-up, unconfirmed details** — whether "sole engineer" needs a
  co-founder acknowledgment, whether the €30/month figure earns its place,
  whether the demo's pinned specialty should be mentioned at all.
- **`resume.pdf`** does not exist yet. `/resume` links to it. Drop it in
  `public/`.
- **Education dates** — `TODO(ali)` in `src/app/(plain)/resume/page.tsx`. The CV has the
  MSc starting and ending before the BEng. Now public on the resume page.
- **GENIELearn evidence — path identified, not yet gathered.** The thesis on
  the UPF record is the piece that unblocks the page: authored, dated, titled,
  institution-hosted. The degree proves the credential, not the work — link
  UPF's verification page rather than hosting the certificate PDF, which
  carries a student number and verification code. The GENIELearn project link
  is *context*, never a citation: it proves the project exists, not that he was
  on it. Keep the "the lab whose work feeds GENIELearn" phrasing.
- **Safiyr redeploy** — optional, wanted. Synthetic patients only: no real
  health data means no Article 9 processing and no HDS requirement, so it can be
  hosted cheaply. Frontends on Vercel, FastAPI on Fly or Railway, Postgres on
  Neon, Redis on Upstash, keep AWS KMS.

## Assets

- `public/portrait.png` — 1-bit dither of Ali's passport photo,
  white-on-transparent, tinted at render time through a CSS mask so it follows
  the amber token. Built by `scripts/dither-portrait.py`; rerun it if the
  palette or the frame size changes. #0015.
- `assets/` and `frontend-inspo/` are gitignored. `assets/` holds the raw ID
  photo (only the processed output ships); `frontend-inspo/` holds visual
  reference scraped from the web.

## Housekeeping outside this repo

- `AliCodesDev/wazife` has `.claude/projects/.../memory/user_profile.md`
  committed and public. Read it, then decide.
- `wazife`'s README is still the stock Vite template.
- GitHub profile has no bio, no location, no link. Pin Safiyr's public
  counterparts: Kirikou, Benzina, Wazife.
