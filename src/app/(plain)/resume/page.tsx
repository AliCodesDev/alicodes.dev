import type { Metadata } from "next";
import { EDUCATION, EXPERIENCE } from "@/lib/resume";

export const metadata: Metadata = { title: "Résumé" };

/*
 * Deliberately plain: no chrome, no theme games, prints cleanly. Some readers
 * are non-technical, in a hurry, or forwarding this internally.
 *
 * The data lives in `src/lib/resume.ts` because the homepage cites the BEng
 * line as a source and must quote it, not copy it. #0020.
 *
 * TODO(ali): drop resume.pdf into public/ and the download link goes live.
 */

export default function ResumePage() {
  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Ali Ezzeddine</h1>
        <p className="u-soft">Software / AI Engineer — Beirut, Lebanon</p>
        <p className="u-mono u-faint text-xs">
          <a href="mailto:ali@alicodes.dev">ali@alicodes.dev</a> ·{" "}
          <a href="https://github.com/AliCodesDev">github.com/AliCodesDev</a>
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="u-mono u-faint text-xs tracking-wide uppercase">
          Experience
        </h2>
        {EXPERIENCE.map((role) => (
          <div key={role.org} className="u-rule space-y-2 border-t pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                {role.org} — {role.title}
              </h3>
              <span className="u-mono u-faint text-xs">{role.place}</span>
            </div>
            <p className="u-mono u-faint text-xs">{role.dates}</p>
            <ul className="u-soft list-disc space-y-1 pl-5 text-sm">
              {role.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="u-mono u-faint text-xs tracking-wide uppercase">
          Education
        </h2>
        {EDUCATION.map((item) => (
          <div key={item.org} className="u-rule space-y-1 border-t pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                {item.org} — {item.title}
              </h3>
              <span className="u-mono u-faint text-xs">{item.place}</span>
            </div>
            <p className="u-mono u-faint text-xs">{item.dates}</p>
            <p className="u-soft text-sm">{item.note}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
