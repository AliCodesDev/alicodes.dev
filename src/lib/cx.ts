/**
 * Join class names, dropping anything falsy.
 *
 * One copy. This lived three times over in `record.tsx`, `sourced.tsx` and
 * `dossier.tsx`, which is two chances for the three to drift apart.
 */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
