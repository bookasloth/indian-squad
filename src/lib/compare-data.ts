import "server-only";

import { rosterFor } from "@/data/squads";
import { players as cricketRoster } from "@/data/players";
import statsFile from "@/data/player-stats.json";
import type { PlayerStats } from "@/lib/player-stats";
import type { ComparePlayer } from "@/components/compare-tool";

const stats = (statsFile as { updated: string; players: Record<string, PlayerStats> }).players;
const cricsheetId = new Map(cricketRoster.map((p) => [p.slug, p.cricsheet]));

/** Everyone the compare tool can pick for a sport, with official counts and, for
 * cricket, ball-by-ball figures. */
export function comparePlayers(sport: string): ComparePlayer[] {
  return rosterFor(sport).map((p) => {
    const id = sport === "cricket" ? cricsheetId.get(p.slug) : undefined;
    return {
      slug: p.slug,
      name: p.name,
      team: p.team,
      roleLabel: p.roleLabel,
      stats: p.stats,
      ...(id && stats[id] ? { deep: stats[id] } : {}),
    };
  });
}

// The debate each sport's tool opens on; falls back to the first two men listed
// if either player leaves the roster.
const OPENING_PAIR: Record<string, [string, string]> = {
  cricket: ["virat-kohli", "rohit-sharma"],
  hockey: ["harmanpreet-singh", "manpreet-singh"],
  football: ["manvir-singh", "anirudh-thapa"],
};

export function defaultPair(sport: string, list: ComparePlayer[]): [string, string] {
  const pair = OPENING_PAIR[sport];
  if (pair && pair.every((s) => list.some((p) => p.slug === s))) return pair;
  const men = list.filter((p) => p.team === "men");
  return [men[0]?.slug ?? list[0].slug, men[1]?.slug ?? list[1].slug];
}

export const statsUpdated = (statsFile as { updated: string }).updated;
