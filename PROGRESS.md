# alicodes.dev — Progress

Running state. Updated at the end of every session. Detail lives in
`DECISIONS.md` and the git log; this file answers "where are we, what's next".

**Last updated:** 2026-08-22

---

## Where we are

Scaffold is built and green. Next.js 16 App Router, TypeScript, Tailwind v4,
MDX content. `pnpm dev` is all it takes to run.

Eleven routes, all prerendering static:

| Route | State |
|---|---|
| `/` | **Built.** The dossier + panel record — #0019 |
| `/work` | Index, curated order — still on the old provisional classes |
| `/work/safiyr` | **Written**, not yet in the design |
| `/work/kirikou` | Stub — no write-up, but listed (#0024) |
| `/work/genielearn` | Stub — no write-up, but listed (#0024) |
| `/work/benzina` | Stub — no write-up, but listed (#0024) |
| `/writing` | Index, empty in production — old classes, out of nav |
| `/writing/placeholder` | Stub — draft |
| `/resume` | Plain and print-friendly. Own root layout, outside the design |

`/about` is deleted. Its content is field rows in the record now — #0019.

**The homepage is the dossier record.** `DECISIONS.md` #0019–#0024, on top of
#0013 (sourced claims), #0014 (archive record) and #0015 (the portrait).

The shape: a 620px dossier beside a 420px panel on a definite 608px row, with
folder tabs on the record's top edge. The panel is the page's only content
surface, and three gestures feed it — a marked claim opens its source, a tab
renders a section, and the query line will return an agent answer (#0011).

Standing as of this session:

- `src/app/(archive)/page.tsx` — assembles every source, section and row on the
  server from `content/` and `src/lib/resume.ts`, then hands them to the client
  component as props. The whole record is in the static HTML.
- `src/components/dossier.tsx` — the record, the folder tabs, and the panel's
  state machine. Sections sync to `?s=<tab>` through the History API rather than
  `useSearchParams`, which would have pushed the panel out of the prerender and
  failed the build without a Suspense boundary.
- `src/components/sourced.tsx` — `Claim` and its context. Hover previews, click
  commits. The rail-as-column is gone; the panel replaced it.
- `src/components/record.tsx` — panel, numbered field row, portrait, chips.
- `src/components/site-chrome.tsx` — status bar, registry footer, and a bracket
  nav that is now optional and unused by `/`.

The three homepage sources quote out of `content/work/safiyr.mdx`'s
`metadata.pulls` and `src/lib/resume.ts`; a missing pull fails the build (#0020).

Archive IDs follow `ACD-WRK-<mnemonic>-<order>` and live in each content file's
`metadata.archiveId`. A record with none reads NOT ISSUED — which is what
GENIELearn's shows, deliberately.

**Mockups:** the homepage was built from the `design_handoff_homepage_dossier`
bundle in the parent directory — a README, an interactive `.dc.html` prototype,
and its runtime. The nine earlier artboards on the design canvas still govern
the work pages:

> https://claude.ai/code/artifact/97e5a4fe-5736-4171-a3b7-adbd14414fcf

That canvas is the source of truth for the design, not this repo. A fresh
session can read it back with the `design` skill's `--extract`.

## What's next

1. **The work pages.** `/work/safiyr` has its own artboards (`SafiyrFile`,
   `GenieResolved`) and is the next design pass, then `/work` and `/writing`,
   which still carry the old provisional `u-*` classes. Wire `Claim` into
   `src/mdx-components.tsx` so a case study can source its own prose.
2. **Mobile.** Blocked on a design decision, not on implementation — #0022. The
   homepage is a fixed 1080px column and scrolls sideways on a phone. Get an
   artboard for the panel before touching it.
3. **Kirikou and Benzina write-ups**, which is what makes #0024 sit right.
4. **The ask-me agent** (#0011). The panel is its citation surface and its
   `NOTHING ON FILE` state is already built (#0023); enabling the input is
   #0021's one-line change.

## Open threads

- **Safiyr decision-record numbers.** The mockups cite `[NNN]` placeholders.
  Ali has 215 numbered records; the real numbers for the schema-level MDR
  boundary and the rejected classifier-gate decision need filling in.
- **Kirikou and Benzina URLs.** Neither a repo nor a deployment URL exists
  anywhere in this repo, so their evidence chips render without an arrow
  (#0018). `TODO(ali)` in each content file; one line each makes them links.
- **Mobile is undesigned, and now deliberately so** — #0022. The homepage is a
  fixed 1080px column on a definite 608px row; a phone scrolls it sideways. The
  likely shape is the panel becoming a drawer. Needs an artboard, not a guess.
- **Panel work-row copy.** The rows read `metadata.summary` straight from each
  content file, which is the right source (#0002) but was written for a full
  page: Safiyr's runs four lines in a 420px column, and GENIELearn's title wraps
  to two. Tighten the summaries at source rather than adding a second field.
- **Source states are not linkable.** `?s=<tab>` makes a section shareable, but
  an open source is client state only. `?ref=<id>` would make any claim's source
  a URL — small, and very much in the spirit of the thing.
- **Safiyr diagram** — the provenance pipeline SVG exists only in a Claude
  artifact, not yet in the site page. Needs either an MDX-imported component or
  inline SVG. Do it when the design is built.
- **Safiyr write-up, unconfirmed details** — whether "sole engineer" needs a
  co-founder acknowledgment, whether the €30/month figure earns its place,
  whether the demo's pinned specialty should be mentioned at all.
- **`resume.pdf`** does not exist yet. `/resume` links to it. Drop it in
  `public/`.
- **Education dates** — `TODO(ali)` in `src/lib/resume.ts`. The CV has the MSc
  starting and ending before the BEng. Now public on the resume page, and the
  homepage's `[3]` quotes the BEng line out of that same file.
- **No LinkedIn or Instagram URL** anywhere in the repo. Both presence chips
  carry the linkable grade (`tone: "link"`) and render amber but arrow-less
  until Ali supplies them; one `href` each in `PRESENCE` makes them links.
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
