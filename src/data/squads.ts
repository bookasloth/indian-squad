import { players as cricketPlayers, type Player, type Team } from "@/data/players";
import { HOCKEY_AS_OF, hockeyPlayers, type HockeyPlayer } from "@/data/hockey-players";
import type { XIRule } from "@/lib/xi";

export type { Team };
export const TEAM_LABEL: Record<Team, string> = { men: "Men", women: "Women" };

/** One player as every squad screen sees them, whatever the sport. Serializable,
 * so server pages can hand it to the client list and XI builder. */
export interface SquadPlayer {
  sport: string;
  slug: string;
  name: string;
  team: Team;
  role: string;
  roleLabel: string;
  /** Second line on cards, e.g. "Batter · Right-handed" or "Defender · 277 caps". */
  subtitle: string;
  bio: string;
  facts: { label: string; value: string }[];
  stats: { label: string; value: number }[];
  active: boolean;
}

export interface SquadConfig {
  sport: string;
  roles: { key: string; label: string }[];
  /** "role" or "position", for filter copy. */
  roleNoun: string;
  xiLabel: string;
  xiHint: string;
  xiRules: XIRule[];
  /** localStorage key per team. */
  storageKey: Record<Team, string>;
  /** When figures were last checked, if they move between matches. */
  asOf?: string;
  roster: SquadPlayer[];
}

const CRICKET_ROLES = [
  { key: "batter", label: "Batter" },
  { key: "all-rounder", label: "All-rounder" },
  { key: "wicketkeeper", label: "Wicketkeeper" },
  { key: "bowler", label: "Bowler" },
];
const HOCKEY_ROLES = [
  { key: "goalkeeper", label: "Goalkeeper" },
  { key: "defender", label: "Defender" },
  { key: "midfielder", label: "Midfielder" },
  { key: "forward", label: "Forward" },
];
const labelOf = (roles: { key: string; label: string }[], key: string) => roles.find((r) => r.key === key)?.label ?? key;

function fromCricket(p: Player): SquadPlayer {
  const roleLabel = labelOf(CRICKET_ROLES, p.role);
  const caps = { test: "Tests", odi: "ODIs", t20: "T20Is" } as const;
  return {
    sport: "cricket",
    slug: p.slug,
    name: p.name,
    team: p.team,
    role: p.role,
    roleLabel,
    subtitle: `${roleLabel} · ${p.battingStyle}`,
    bio: p.bio,
    facts: [
      { label: "Batting", value: p.battingStyle },
      ...(p.bowlingStyle ? [{ label: "Bowling", value: p.bowlingStyle }] : []),
    ],
    stats: (Object.keys(caps) as (keyof typeof caps)[])
      .filter((f) => p.caps[f] !== undefined)
      .map((f) => ({ label: caps[f], value: p.caps[f]! })),
    active: p.active,
  };
}

function fromHockey(p: HockeyPlayer): SquadPlayer {
  const roleLabel = labelOf(HOCKEY_ROLES, p.position);
  const goals = p.position === "goalkeeper" ? "" : ` and ${p.goals} goal${p.goals === 1 ? "" : "s"}`;
  return {
    sport: "hockey",
    slug: p.slug,
    name: p.name,
    team: p.team,
    role: p.position,
    roleLabel,
    subtitle: `${roleLabel} · ${p.caps} caps`,
    bio: `${roleLabel} for India with ${p.caps} caps${goals}, as of ${HOCKEY_AS_OF}.${p.note ? ` ${p.note}` : ""}`,
    facts: [{ label: "Position", value: roleLabel }],
    stats: [
      { label: "Caps", value: p.caps },
      ...(p.position === "goalkeeper" ? [] : [{ label: "Goals", value: p.goals }]),
    ],
    active: true,
  };
}

export const SQUADS: Record<string, SquadConfig> = {
  cricket: {
    sport: "cricket",
    roles: CRICKET_ROLES,
    roleNoun: "role",
    xiLabel: "Playing XI",
    xiHint: "Pick exactly 11 with at least one wicketkeeper.",
    xiRules: [{ role: "wicketkeeper", min: 1, message: "Add at least one wicketkeeper." }],
    // Men keep the original key so XIs saved before the women's squad existed survive.
    storageKey: { men: "indian-squad:xi", women: "indian-squad:xi:women" },
    roster: cricketPlayers.map(fromCricket),
  },
  hockey: {
    sport: "hockey",
    roles: HOCKEY_ROLES,
    roleNoun: "position",
    xiLabel: "Starting XI",
    xiHint: "Pick exactly 11, including one goalkeeper.",
    xiRules: [{ role: "goalkeeper", min: 1, max: 1, message: "Pick exactly one goalkeeper." }],
    storageKey: { men: "indian-squad:hockey:xi", women: "indian-squad:hockey:xi:women" },
    asOf: HOCKEY_AS_OF,
    roster: hockeyPlayers.map(fromHockey),
  },
};

/** Sports with a roster (players pages and XI builder). */
export const SQUAD_SPORTS = Object.keys(SQUADS);

export const squadConfig = (sport: string): SquadConfig | undefined => SQUADS[sport];

/** One team's roster for a sport, in file order. */
export const rosterFor = (sport: string, team?: Team): SquadPlayer[] =>
  (SQUADS[sport]?.roster ?? []).filter((p) => !team || p.team === team);

export const getSquadPlayer = (sport: string, slug: string): SquadPlayer | undefined =>
  SQUADS[sport]?.roster.find((p) => p.slug === slug);
