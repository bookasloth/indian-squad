import "server-only";

import { mergeChampions, parseSeason, type F1Season } from "@/lib/f1-data";
import type { Competition } from "@/data/competitions";

// Jolpica-F1 (https://jolpi.ca), the free Ergast successor. Responses are cached
// and refreshed every 6 hours via ISR, so race results land the same day without
// hitting the API on every view. Any failure returns null and pages fall back to
// the static data in src/data/competitions.ts.
const BASE = "https://api.jolpi.ca/ergast/f1";
const REVALIDATE = 21600;

async function get(path: string) {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: REVALIDATE } });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

/** Standings and calendar for a season ("current" or a year). */
export async function f1Season(season: string = "current"): Promise<F1Season | null> {
  const [calendar, drivers, constructors] = await Promise.all([
    get(`/${season}.json`),
    get(`/${season}/driverstandings.json`),
    get(`/${season}/constructorstandings.json`),
  ]);
  return parseSeason(calendar, drivers, constructors);
}

/** Drivers' and constructors' championship pages with any season finished since
 * the static list was last edited added on top. Other competitions pass through. */
export async function withF1Champions(c: Competition): Promise<Competition> {
  const kind = c.slug === "drivers-championship" ? "drivers" : c.slug === "constructors-championship" ? "constructors" : null;
  if (c.sport !== "f1" || !kind) return c;

  const current = await f1Season();
  if (!current) return c;
  const newest = Number(c.editions[0]?.year ?? 0);
  // ponytail: at most the previous season can be missing (new season started
  // before the static list was updated); fetch it only in that case.
  const previous = Number(current.season) - 1 > newest ? await f1Season(String(Number(current.season) - 1)) : null;
  const editions = mergeChampions(c.editions, [current, ...(previous ? [previous] : [])], kind);
  if (editions.length === c.editions.length) return c;

  const latest = editions[0];
  return {
    ...c,
    editions,
    facts: c.facts.map((f) => (f.label === "Latest champion" ? { ...f, value: `${latest.winner}, ${latest.year}` } : f)),
  };
}
