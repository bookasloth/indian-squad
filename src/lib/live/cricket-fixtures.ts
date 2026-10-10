import "server-only";

import { indiaFixtures, liveSeriesIds, mergeFixtures, type Fixture } from "@/lib/fixtures";

// CricketData.org (CricAPI v1). Free tier: 100 calls a day. One refresh costs one
// series search plus one call per current India series (capped at 5), and pages
// revalidate every 6 hours, so this stays well inside the limit.
const BASE = "https://api.cricapi.com/v1";
const REVALIDATE = 21600;
const MAX_SERIES = 5;

async function get(path: string, params: Record<string, string>) {
  const key = process.env.CRICKETDATA_API_KEY;
  if (!key) return null;
  const qs = new URLSearchParams({ apikey: key, offset: "0", ...params });
  try {
    const res = await fetch(`${BASE}/${path}?${qs}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) {
      console.warn(`[cricketdata] ${path}: HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    if (json?.status === "success") return json;
    // The API reports quota and key problems in `reason`; the key itself is never logged.
    console.warn(`[cricketdata] ${path}: ${json?.reason ?? json?.status ?? "unknown error"}`);
    return null;
  } catch (e) {
    console.warn(`[cricketdata] ${path}: ${(e as Error).message}`);
    return null;
  }
}

/** India's upcoming men's and women's fixtures, soonest first. null when the API
 * key isn't set or the API is unavailable; [] when nothing is scheduled. */
export async function indiaUpcomingFixtures(): Promise<Fixture[] | null> {
  if (!process.env.CRICKETDATA_API_KEY) return null;
  const now = new Date().toISOString();
  const series = await get("series", { search: "India" });
  if (!series) return null;
  const ids = liveSeriesIds(series, now.slice(0, 10)).slice(0, MAX_SERIES);
  const lists = await Promise.all(ids.map(async (id) => indiaFixtures(await get("series_info", { id }), now)));
  return mergeFixtures(lists);
}
