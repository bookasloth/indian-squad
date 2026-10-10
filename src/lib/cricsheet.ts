// Cricsheet (https://cricsheet.org, open data, ODC-By) ball-by-ball → per-match
// figures for the players our record lists track. Pure and dep-free: the weekly
// sync script and the record pages both use it, and the test imports it directly.
//
// Model: record lists keep hand-checked baselines as of a date (`since`). Every
// India international or IPL match after that date adds the tracked players'
// runs, wickets and appearances. Matches are stored by Cricsheet id, so re-running
// the sync never double-counts.

export type Format = "test" | "odi" | "t20i" | "ipl";

export interface MatchEntry {
  date: string;
  format: Format;
  /** Tracked players who played, keyed by Cricsheet identifier. */
  players: Record<string, { runs: number; wickets: number }>;
}

export interface CricketLive {
  /** Date of the newest match processed. */
  updated: string;
  matches: Record<string, MatchEntry>;
}

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

// Dismissals not credited to the bowler.
const NOT_BOWLER = new Set(["run out", "retired hurt", "retired out", "retired not out", "obstructing the field"]);

/** Which of our record formats a Cricsheet match counts towards, if any. Men's only;
 * internationals must involve India; IPL matches count whoever plays. */
export function formatOf(info: Json): Format | null {
  if (info?.gender !== "male") return null;
  if (info.team_type === "club") return info.event?.name === "Indian Premier League" ? "ipl" : null;
  if (info.team_type !== "international" || !info.teams?.includes("India")) return null;
  return info.match_type === "Test" ? "test" : info.match_type === "ODI" ? "odi" : info.match_type === "T20" ? "t20i" : null;
}

/** One match's figures for the tracked players, or null if the match doesn't count. */
export function summarise(match: Json, tracked: Set<string>): MatchEntry | null {
  const format = formatOf(match?.info);
  if (!format) return null;
  const registry: Record<string, string> = match.info.registry?.people ?? {};
  const players: MatchEntry["players"] = {};
  for (const name of Object.values(match.info.players ?? {}).flat() as string[]) {
    const id = registry[name];
    if (id && tracked.has(id)) players[id] = { runs: 0, wickets: 0 };
  }
  if (Object.keys(players).length === 0) return null;
  const idOf = (name: string) => registry[name];
  for (const inn of match.innings ?? []) {
    for (const over of inn.overs ?? []) {
      for (const d of over.deliveries ?? []) {
        const batter = players[idOf(d.batter)];
        if (batter) batter.runs += d.runs?.batter ?? 0;
        const bowler = players[idOf(d.bowler)];
        if (bowler) bowler.wickets += (d.wickets ?? []).filter((w: Json) => !NOT_BOWLER.has(w.kind)).length;
      }
    }
  }
  return { date: match.info.dates[0], format, players };
}

/** A tracked player's additions since a date: runs or wickets, appearances, and the newest match counted. */
export function since(
  live: CricketLive,
  player: string,
  format: Format,
  after: string,
  stat: "runs" | "wickets",
): { value: number; matches: number; latest: string | null } {
  let value = 0;
  let matches = 0;
  let latest: string | null = null;
  for (const m of Object.values(live.matches)) {
    const p = m.players[player];
    if (!p || m.format !== format || m.date <= after) continue;
    value += p[stat];
    matches += 1;
    if (!latest || m.date > latest) latest = m.date;
  }
  return { value, matches, latest };
}
