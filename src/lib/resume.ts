/*
 * The résumé's data, lifted out of the page so it has one home.
 *
 * `/resume` renders it plain and unstyled (#0010, #0016). The homepage's
 * `[3]` source quotes the BEng line from here rather than retyping it — on a
 * site whose argument is provenance, a quote that can drift from the thing it
 * quotes is the one bug that matters. #0020.
 *
 * TODO(ali): education dates below are copied from the CV draft, where the MSc
 * (2017–2021) both starts and ends before the BEng (2018–2022). Fix at source.
 */

export type Role = {
  org: string;
  title: string;
  place: string;
  dates: string;
  points: string[];
};

export type Study = {
  org: string;
  title: string;
  place: string;
  dates: string;
  note: string;
};

export const EXPERIENCE: Role[] = [
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

export const EDUCATION: Study[] = [
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

/** The degree the homepage's `[3]` cites. Quoted from here, never retyped. */
export const BENG = EDUCATION.find(
  (item) => item.org === "American University of Beirut",
)!;
