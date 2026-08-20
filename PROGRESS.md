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

## What's next

1. **Design direction.** The open blocker. Main site's visual identity is
   undecided; current styling is placeholder (`DECISIONS.md` #0008). The Windows
   XP desktop idea is parked as a possible standalone `/xp`, not the main site.
2. **Kirikou write-up**, once the project itself is finished.
3. **The ask-me agent** (`DECISIONS.md` #0011).

## Open threads

- **Safiyr diagram** — the provenance pipeline SVG exists only in a Claude
  artifact, not yet in the site page. Needs either an MDX-imported component or
  inline SVG. Do it when styling is settled.
- **Safiyr write-up, unconfirmed details** — whether "sole engineer" needs a
  co-founder acknowledgment, whether the €30/month figure earns its place,
  whether the demo's pinned specialty should be mentioned at all.
- **`resume.pdf`** does not exist yet. `/resume` links to it. Drop it in
  `public/`.
- **Education dates** — `TODO(ali)` in `src/app/resume/page.tsx`. The CV has the
  MSc starting and ending before the BEng. Now public on the resume page.
- **GENIELearn claim needs evidence** before that page goes live. The project is
  publicly verifiable; Ali's link to it is not. Until the thesis is deposited,
  a supervisor is a named reference, or a paper acknowledges him, phrase it as
  work done *in the lab whose work feeds* GENIELearn — not "integrated into".
- **Safiyr redeploy** — optional, wanted. Synthetic patients only: no real
  health data means no Article 9 processing and no HDS requirement, so it can be
  hosted cheaply. Frontends on Vercel, FastAPI on Fly or Railway, Postgres on
  Neon, Redis on Upstash, keep AWS KMS.

## Housekeeping outside this repo

- `AliCodesDev/wazife` has `.claude/projects/.../memory/user_profile.md`
  committed and public. Read it, then decide.
- `wazife`'s README is still the stock Vite template.
- GitHub profile has no bio, no location, no link. Pin Safiyr's public
  counterparts: Kirikou, Benzina, Wazife.
