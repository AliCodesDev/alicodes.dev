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
| `/` | Hero, reserved slot for the agent, selected work |
| `/work` | Index, curated order |
| `/work/safiyr` | **Written.** The flagship case study |
| `/work/kirikou` | Stub — draft |
| `/work/genielearn` | Stub — draft |
| `/work/benzina` | Stub — draft |
| `/writing` | Index, empty in production |
| `/writing/placeholder` | Stub — draft |
| `/about` | Written from the CV |
| `/resume` | Written, plain and print-friendly |

**The design direction is settled and not yet built.** `DECISIONS.md` #0013,
#0014, #0015. Two layers, decided separately:

- **Sourced** (#0013) — claims carry typed, addressable sources in a rail.
  Grades matter: linkable (repo, live, thesis, degree), citable-but-private
  (decision record, private source), and *context* (proves the thing exists,
  not his role in it).
- **Archive record** (#0014) — amber `#E3A63F` on near-black `#0A0B09`, green
  `#43D98A` reserved for live/verified only. Space Mono is system voice,
  Archivo is display and body. Numbered field rows, archive IDs, notched
  panels, bracket nav.

`src/app/globals.css` is still the old provisional neutral styling. Nothing
visual has been implemented yet.

**Mockups:** nine artboards on a design canvas, including the homepage record,
the active-claim state, Safiyr, GENIELearn before and after its evidence lands,
mobile, and a type-and-colour specimen. A second page holds the two superseded
v1 frames.

> https://claude.ai/code/artifact/97e5a4fe-5736-4171-a3b7-adbd14414fcf

That canvas is the source of truth for the design, not this repo — the working
`.dc.html` files were not committed, because editing the canvas in the browser
would silently make a committed copy stale. A fresh session can read it back
with the `design` skill's `--extract`.

## What's next

1. **Build the design.** Replace `globals.css` and the components with #0014.
   Order that makes sense: tokens and type first, then `site-chrome.tsx`, then
   the record panel on `/`, then the claim/source components, then the work
   pages. `/resume` stays plain — #0010 is untouched by any of this.
2. **Kirikou write-up**, once the project itself is finished.
3. **The ask-me agent** (#0011). The source rail is its citation surface, so
   it lands inside the design rather than beside it.

## Open threads

- **Safiyr decision-record numbers.** The mockups cite `[NNN]` placeholders.
  Ali has 215 numbered records; the real numbers for the schema-level MDR
  boundary and the rejected classifier-gate decision need filling in.
- **Safiyr diagram** — the provenance pipeline SVG exists only in a Claude
  artifact, not yet in the site page. Needs either an MDX-imported component or
  inline SVG. Do it when the design is built.
- **Safiyr write-up, unconfirmed details** — whether "sole engineer" needs a
  co-founder acknowledgment, whether the €30/month figure earns its place,
  whether the demo's pinned specialty should be mentioned at all.
- **`resume.pdf`** does not exist yet. `/resume` links to it. Drop it in
  `public/`.
- **Education dates** — `TODO(ali)` in `src/app/resume/page.tsx`. The CV has the
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
