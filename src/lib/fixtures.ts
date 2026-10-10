// Upcoming-fixture parsing for CricketData.org (CricAPI v1). Pure and dep-free so
// the test can import it; fetching lives in src/lib/live/cricket-fixtures.ts.

export interface Fixture {
  id: string;
  name: string;
  /** "test" | "odi" | "t20" as the API labels it. */
  matchType: string;
  venue: string;
  /** ISO date-time, UTC. */
  start: string;
  teams: string[];
  series: string;
}

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Series from a `series` search response that haven't finished by `today` (YYYY-MM-DD). */
export function liveSeriesIds(res: Json | null, today: string): string[] {
  const rows: Json[] = Array.isArray(res?.data) ? res.data : [];
  return rows
    .filter((s) => typeof s.id === "string" && (!s.endDate || endIso(s.startDate, s.endDate) >= today))
    .map((s) => s.id);
}

/** CricketData writes series end dates without a year ("Oct 12"); take the year from
 * the start date, rolling into the next year for series that cross New Year. */
function endIso(start: string | undefined, end: string): string {
  if (/\d{4}/.test(end)) return toIso(end);
  const startIso = toIso(start ?? "");
  if (!startIso) return "";
  const year = Number(startIso.slice(0, 4));
  const sameYear = toIso(`${end} ${year}`);
  return sameYear && sameYear < startIso ? toIso(`${end} ${year + 1}`) : sameYear;
}

/** India's matches from a `series_info` response that haven't started yet. */
export function indiaFixtures(res: Json | null, now: string): Fixture[] {
  const info = res?.data?.info ?? {};
  const list: Json[] = Array.isArray(res?.data?.matchList) ? res.data.matchList : [];
  return list
    .filter((m) => Array.isArray(m.teams) && m.teams.some((t: string) => /^India( Women)?$/.test(t)))
    .filter((m) => typeof m.dateTimeGMT === "string" && !m.matchStarted && m.dateTimeGMT >= now)
    .map((m) => ({
      id: String(m.id),
      name: String(m.name ?? m.teams.join(" v ")),
      matchType: String(m.matchType ?? "").toLowerCase(),
      venue: String(m.venue ?? ""),
      start: m.dateTimeGMT.endsWith("Z") ? m.dateTimeGMT : `${m.dateTimeGMT}Z`,
      teams: m.teams,
      series: String(info.name ?? ""),
    }));
}

/** Merge per-series lists, drop duplicates, soonest first. */
export function mergeFixtures(lists: Fixture[][], limit = 12): Fixture[] {
  const seen = new Set<string>();
  return lists
    .flat()
    .filter((f) => (seen.has(f.id) ? false : (seen.add(f.id), true)))
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, limit);
}

// "Oct 09, 2026" or "2026-10-09" → "2026-10-09"; unparseable → "" (treated as finished).
function toIso(d: string): string {
  const t = Date.parse(d);
  return Number.isNaN(t) ? "" : new Date(t).toISOString().slice(0, 10);
}
