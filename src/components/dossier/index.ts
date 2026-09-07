/*
 * The dossier module: the homepage's record, folder tabs and panel.
 * `dossier.tsx` owns the state machine, `views.tsx` renders the panel's
 * states, `types.ts` is the `Answer` vocabulary the homepage assembles into.
 * Imported as `@/components/dossier`, same as when it was one file.
 */
export { Dossier } from "./dossier";
export type { Answer, AnswerRow, TabKey } from "./types";
