// API-Football (api-sports.io, v3) response parsing. Pure and dep-free so the test
// can import it; fetching lives in src/lib/live/football.ts.
import type { Fixture } from "./fixtures";

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface TableRow {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: number;
  points: number;
}

/** API-Football reports plan limits and bad requests in `errors`, not HTTP status. */
const ok = (res: Json | null): res is Json =>
  !!res && Array.isArray(res.response) && (!res.errors || Object.keys(res.errors).length === 0);

/** ISL league id and current season year from a `leagues?country=India` response. */
export function islSeason(res: Json | null): { league: number; season: number } | null {
  if (!ok(res)) return null;
  const isl = res.response.find((r: Json) => r.league?.name === "Indian Super League");
  const season = isl?.seasons?.find((s: Json) => s.current) ?? isl?.seasons?.at(-1);
  return isl && season ? { league: Number(isl.league.id), season: Number(season.year) } : null;
}

/** The league table from a `standings` response (first group). */
export function standingsTable(res: Json | null): TableRow[] | null {
  if (!ok(res)) return null;
  const rows: Json[] = res.response[0]?.league?.standings?.[0] ?? [];
  if (rows.length === 0) return null;
  return rows.map((r) => ({
    rank: Number(r.rank),
    team: String(r.team?.name ?? ""),
    played: Number(r.all?.played ?? 0),
    won: Number(r.all?.win ?? 0),
    drawn: Number(r.all?.draw ?? 0),
    lost: Number(r.all?.lose ?? 0),
    goalDiff: Number(r.goalsDiff ?? 0),
    points: Number(r.points ?? 0),
  }));
}

/** India men's and women's national team ids from a `teams?search=India` response. */
export function indiaTeamIds(res: Json | null): number[] {
  if (!ok(res)) return [];
  return res.response
    .filter((r: Json) => r.team?.national && /^India( W| Women)?$/.test(r.team?.name ?? ""))
    .map((r: Json) => Number(r.team.id));
}

/** Upcoming fixtures from a `fixtures?team=…&next=…` response, in the shared Fixture shape. */
export function upcomingFixtures(res: Json | null): Fixture[] {
  if (!ok(res)) return [];
  return res.response
    .filter((r: Json) => r.fixture?.id && r.fixture?.date)
    .map((r: Json) => ({
      id: String(r.fixture.id),
      name: `${r.teams?.home?.name ?? "?"} v ${r.teams?.away?.name ?? "?"}`,
      matchType: "",
      venue: [r.fixture.venue?.name, r.fixture.venue?.city].filter(Boolean).join(", "),
      start: new Date(r.fixture.date).toISOString(),
      teams: [r.teams?.home?.name, r.teams?.away?.name].filter(Boolean),
      series: String(r.league?.name ?? ""),
    }));
}
