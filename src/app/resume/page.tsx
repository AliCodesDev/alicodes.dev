import type { Metadata } from "next";

export const metadata: Metadata = { title: "Résumé" };

/*
 * Deliberately plain: no chrome, no theme games, prints cleanly. Some readers
 * are non-technical, in a hurry, or forwarding this internally.
 *
 * TODO(ali): education dates below are copied from the CV draft, where the MSc
 * (2017–2021) both starts and ends before the BEng (2018–2022). Fix at source.
 * TODO(ali): drop resume.pdf into public/ and the download link goes live.
 */

type Role = {
  org: string;
  title: string;
  place: string;
  dates: string;
  points: string[];
};

const EXPERIENCE: Role[] = [
  {
    org: "Safiyr",
    title: "Founding Engineer / Tech Lead",
    place: "Paris, France",
    dates: "March 2026 – August 2026",
    points: [
      "Designed and built clinical continuity infrastructure for the EU market as sole engineer: event-sourced Python backend, application-layer PHI encryption, and two Next.js frontends.",
      "Kept an LLM extraction product outside Medical Device Regulation scope by construction — a tool-use schema with no diagnostic fields, reinforced by validation and rendering constraints.",
      "Implemented GDPR Article 9 erasure as crypto-shredding: application-level read-block plus KMS key destruction, closing both the backup and pending-deletion gaps.",
      "Maintained 215 architectural decision records and 24 specs across five months of solo delivery.",
    ],
  },
  {
    org: "Ali Codes Dev",
    title: "Freelance Full Stack Developer",
    place: "Remote",
    dates: "January 2025 – January 2026",
    points: [
      "Designed, built, and launched 4+ websites for clients around the world.",
    ],
  },
  {
    org: "Universitat Pompeu Fabra",
    title: "Research Lab Assistant",
    place: "Barcelona, Spain",
    dates: "January 2024 – September 2024",
    points: [
      "Built and deployed a context-aware AI agent capable of querying custom university knowledge bases.",
      "Researched retrieval-augmented generation and retrieval techniques, including vector stores and embeddings.",
    ],
  },
  {
    org: "Laceco",
    title: "Electrical Design Engineer",
    place: "Beirut, Lebanon",
    dates: "September 2022 – September 2023",
    points: [
      "Designed lighting and emergency systems for large-scale infrastructure projects.",
      "Managed technical documentation and compliance against strict engineering standards.",
      "Coordinated cross-functional teams to meet project specifications and deadlines.",
    ],
  },
];

const EDUCATION = [
  {
    org: "Universitat Pompeu Fabra",
    title: "MSc",
    place: "Barcelona, Spain",
    dates: "2017 – 2021",
    note: "Technology, robotics, and human cognition.",
  },
  {
    org: "American University of Beirut",
    title: "BEng, Electrical and Computer Engineering",
    place: "Beirut, Lebanon",
    dates: "2018 – 2022",
    note: "Electrical circuits, microelectronics, computing systems, and software.",
  },
];

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
