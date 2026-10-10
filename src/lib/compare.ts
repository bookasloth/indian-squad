// Player-comparison helpers shared by the compare tool, the vote API and the
// curated comparison pages. Pure and dep-free so the test can import it.

/** Order-independent key for a pair: A-vs-B and B-vs-A share one vote tally. */
export const pairKey = (a: string, b: string) => [a, b].sort().join("|");

/** URL slug for a curated pair page, in the order given ("virat-kohli-vs-rohit-sharma"). */
export const pairSlug = (a: string, b: string) => `${a}-vs-${b}`;

/** Validates a vote: two different known players, and a choice that is one of them. */
export function validVote(
  known: (slug: string) => boolean,
  a: unknown,
  b: unknown,
  choice: unknown,
): { pair: string; choice: string } | null {
  if (typeof a !== "string" || typeof b !== "string" || typeof choice !== "string") return null;
  if (a === b || !known(a) || !known(b) || (choice !== a && choice !== b)) return null;
  return { pair: pairKey(a, b), choice };
}

/** Vote counts → percentages that add up to 100 (or both 0 with no votes). */
export function shares(countA: number, countB: number): [number, number] {
  const total = countA + countB;
  if (total === 0) return [0, 0];
  const a = Math.round((countA / total) * 100);
  return [a, 100 - a];
}
