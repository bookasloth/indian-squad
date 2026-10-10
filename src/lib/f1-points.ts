// F1 championship points (current rules: 2025 onwards — no fastest-lap point).
// Dep-free so the test can import it directly.

/** Grand Prix points for P1–P10. */
export const GP_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
/** Sprint points for P1–P8. */
export const SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1];

/** Points for one finishing position (1-based). Out of the points, DNF or bad input → 0. */
export const pointsFor = (table: number[], position: number) =>
  Number.isInteger(position) && position >= 1 ? (table[position - 1] ?? 0) : 0;

/** "1, 3, 12" → [1, 3, 12]. Anything that isn't a whole number is dropped. */
export const parsePositions = (input: string): number[] =>
  input
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1);

/** Season total from Grand Prix and sprint finishing positions. */
export function seasonPoints(gp: number[], sprint: number[] = []): number {
  return gp.reduce((s, p) => s + pointsFor(GP_POINTS, p), 0) + sprint.reduce((s, p) => s + pointsFor(SPRINT_POINTS, p), 0);
}
