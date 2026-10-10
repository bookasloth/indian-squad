import "server-only";

import { indiaTeamIds, islSeason, standingsTable, upcomingFixtures, type TableRow } from "@/lib/football-data";
import { mergeFixtures, type Fixture } from "@/lib/fixtures";

// API-Football (https://www.api-football.com, api-sports.io v3). Needs
// API_FOOTBALL_KEY. Free plan: 100 calls a day, and it may not cover the current
// season — then `errors` comes back set, these return null and pages fall back.
// Each refresh is a handful of calls every 6 hours.
const BASE = "https://v3.football.api-sports.io";
const REVALIDATE = 21600;

async function get(path: string) {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "x-apisports-key": key },
      next: { revalidate: REVALIDATE },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

/** Current ISL season and table. null without a key, on plan limits or failures. */
export async function islStandings(): Promise<{ season: number; rows: TableRow[] } | null> {
  const s = islSeason(await get("/leagues?country=India&type=league"));
  if (!s) return null;
  const rows = standingsTable(await get(`/standings?league=${s.league}&season=${s.season}`));
  return rows ? { season: s.season, rows } : null;
}

/** India men's and women's next fixtures, soonest first. null without a key. */
export async function indiaFootballFixtures(): Promise<Fixture[] | null> {
  if (!process.env.API_FOOTBALL_KEY) return null;
  const ids = indiaTeamIds(await get("/teams?search=India"));
  if (ids.length === 0) return null;
  const lists = await Promise.all(ids.map(async (id) => upcomingFixtures(await get(`/fixtures?team=${id}&next=5`))));
  return mergeFixtures(lists, 10);
}
