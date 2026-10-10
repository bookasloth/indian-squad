// Jolpica-F1 (Ergast-compatible) response parsing and merging. Pure and dep-free
// so the test can import it; fetching lives in src/lib/live/f1.ts.

export interface DriverStanding {
  position: number;
  name: string;
  team: string;
  points: number;
  wins: number;
}

export interface ConstructorStanding {
  position: number;
  name: string;
  points: number;
  wins: number;
}

export interface F1Season {
  season: string;
  round: number;
  /** Races on the calendar. */
  total: number;
  /** All rounds run, so the leader is champion. */
  complete: boolean;
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
}

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Builds a season from the three Jolpica responses: `/{season}.json` (calendar),
 * `/{season}/driverstandings.json` and `/{season}/constructorstandings.json`.
 * null when any is missing or malformed — callers fall back to static data. */
export function parseSeason(calendar: Json | null, drivers: Json | null, constructors: Json | null): F1Season | null {
  const total = Number(calendar?.MRData?.total);
  const dl = drivers?.MRData?.StandingsTable?.StandingsLists?.[0];
  const cl = constructors?.MRData?.StandingsTable?.StandingsLists?.[0];
  if (!total || !dl?.DriverStandings?.length || !cl?.ConstructorStandings?.length) return null;
  const round = Number(dl.round);
  return {
    season: String(dl.season),
    round,
    total,
    complete: round >= total,
    drivers: dl.DriverStandings.map((d: Json) => ({
      position: Number(d.position),
      name: `${d.Driver.givenName} ${d.Driver.familyName}`,
      team: d.Constructors?.at(-1)?.name ?? "",
      points: Number(d.points),
      wins: Number(d.wins),
    })),
    constructors: cl.ConstructorStandings.map((c: Json) => ({
      position: Number(c.position),
      name: c.Constructor.name,
      points: Number(c.points),
      wins: Number(c.wins),
    })),
  };
}

export interface Edition {
  year: string;
  winner: string;
  runnerUp: string;
}

/** Adds champions from completed seasons newer than the newest static edition.
 * Editions are newest first; returns a new array. */
export function mergeChampions(editions: Edition[], seasons: F1Season[], kind: "drivers" | "constructors"): Edition[] {
  const newest = Number(editions[0]?.year ?? 0);
  const added = seasons
    .filter((s) => s.complete && Number(s.season) > newest)
    .sort((a, b) => Number(b.season) - Number(a.season))
    .map((s) =>
      kind === "drivers"
        ? { year: s.season, winner: s.drivers[0].name, runnerUp: s.drivers[0].team }
        : // Engine supplier isn't in the standings; the team name stands in until the
          // static list is updated by hand.
          { year: s.season, winner: s.constructors[0].name, runnerUp: "—" },
    );
  return [...added, ...editions];
}
