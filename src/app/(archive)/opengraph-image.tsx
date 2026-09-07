import { ImageResponse } from "next/og";

/*
 * The share card. This site is read by people who were sent a link, and an
 * unfurled link is the first frame of the design they see — so it is the record
 * itself: archive ID, subject, status, in the palette from #0014.
 *
 * Space Mono is fetched at build time, because the renderer has no system
 * fonts to fall back to — asking for a monospace stack there silently produces
 * sans, which drops the one thing that makes the card read as the archive. The
 * fetch is wrapped: a build without network still produces a card, in the
 * default face, rather than failing. A share image is not worth a build.
 */
// The static export (#0033) requires metadata routes to declare themselves
// static; without this line `next build` refuses the route under
// `output: "export"`. It changes nothing else — the card was always built once.
export const dynamic = "force-static";

export const alt = "Ali Ezzeddine — Software / AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MONO = "Space Mono";

/**
 * The TTF behind a Google Fonts family.
 *
 * The `User-Agent` is what selects the format: modern ones are served woff2,
 * which the image renderer cannot parse, and an old one is served TTF, which it
 * can. Returns null rather than throwing, so a failure degrades the card
 * instead of the build.
 */
async function spaceMono(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const api = `https://fonts.googleapis.com/css2?family=Space+Mono:wght@${weight}`;
    const css = await fetch(api, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" },
    }).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([spaceMono(400), spaceMono(700)]);
  const fonts = [
    regular && { name: MONO, data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: MONO, data: bold, weight: 700 as const, style: "normal" as const },
  ].filter((font) => font !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0B09",
          padding: "64px 72px",
          fontFamily: MONO,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: "0.16em",
            color: "#8A6B2C",
            borderBottom: "1px solid #2A2E29",
            paddingBottom: 22,
          }}
        >
          <span>\\ALICODES.DEV\ARCHIVE\PERSONNEL\</span>
          <span style={{ display: "flex", alignItems: "center", color: "#43D98A" }}>
            OPEN TO ROLES
            {/* Drawn, not typed: Space Mono has no U+25CF and the renderer has
             * no fallback face to borrow one from, so the glyph comes out as a
             * notdef box. */}
            <span
              style={{
                width: 12,
                height: 12,
                marginLeft: 10,
                borderRadius: 6,
                background: "#43D98A",
              }}
            />
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, letterSpacing: "0.24em", color: "#8A6B2C" }}>
            1_7 /
          </span>
          <span
            style={{
              fontSize: 82,
              letterSpacing: "0.04em",
              color: "#F0EAE0",
              marginTop: 12,
            }}
          >
            EZZEDDINE, ALI
          </span>
          <span
            style={{
              fontSize: 30,
              lineHeight: 1.5,
              color: "#9A9F96",
              marginTop: 26,
              maxWidth: 900,
            }}
          >
            Software / AI engineer. Agents that carry out multi-step work inside
            real systems — and the retrieval, integrations and evaluation behind
            them.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: "0.15em",
            color: "#5F645C",
            borderTop: "1px solid #2A2E29",
            paddingTop: 22,
          }}
        >
          <span>EVERY CLAIM CARRIES ITS SOURCE</span>
          <span style={{ color: "#E3A63F" }}>ACD-2026-AI-0001</span>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
