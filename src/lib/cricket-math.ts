// Cricket arithmetic for the calculator and explainers. Pure functions, no deps.
// Overs are written "overs.balls" (37.3 = 37 overs and 3 balls), never decimals,
// so every rate converts to balls first.

/** "37.3" → 225 balls. null for anything that isn't a valid overs figure (balls part must be 0–5). */
export function parseOvers(input: string): number | null {
  const m = /^\s*(\d+)(?:\.(\d))?\s*$/.exec(input);
  if (!m) return null;
  const balls = Number(m[2] ?? 0);
  if (balls > 5) return null;
  return Number(m[1]) * 6 + balls;
}

/** 225 → "37.3". */
export const formatOvers = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

const per = (num: number, den: number) => (den > 0 ? num / den : null);

/** Runs per dismissal. Not-outs don't count as dismissals. */
export const battingAverage = (runs: number, dismissals: number) => per(runs, dismissals);

/** Runs per 100 balls. */
export const strikeRate = (runs: number, balls: number) => (balls > 0 ? (runs / balls) * 100 : null);

/** Runs per over, from runs and balls. Used for run rate and economy. */
export const runsPerOver = (runs: number, balls: number) => (balls > 0 ? (runs / balls) * 6 : null);

/** Runs conceded per wicket. */
export const bowlingAverage = (runs: number, wickets: number) => per(runs, wickets);

/** Balls bowled per wicket. */
export const bowlingStrikeRate = (balls: number, wickets: number) => per(balls, wickets);

/** Runs per over still needed: `needed` runs from `ballsLeft` balls. */
export const requiredRate = (needed: number, ballsLeft: number) => runsPerOver(Math.max(needed, 0), ballsLeft);

/** Net run rate over a tournament: runs-for rate minus runs-against rate, both from
 * totals (not an average of match NRRs). When a side is bowled out, pass its full
 * quota of balls (e.g. 120 in a T20), as the playing conditions require. */
export function netRunRate(runsFor: number, ballsFaced: number, runsAgainst: number, ballsBowled: number): number | null {
  const a = runsPerOver(runsFor, ballsFaced);
  const b = runsPerOver(runsAgainst, ballsBowled);
  return a === null || b === null ? null : a - b;
}
