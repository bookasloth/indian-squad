import type { Team } from "@/data/players";

/** Rosters described by position, caps and goals (hockey, football). */
export type Position = "goalkeeper" | "defender" | "midfielder" | "forward";

export interface PositionalPlayer {
  slug: string;
  name: string;
  team: Team;
  position: Position;
  caps: number;
  goals: number;
  /** Optional line of our own, only for facts we can stand behind. */
  note?: string;
}

export const positional = (
  name: string,
  team: Team,
  position: Position,
  caps: number,
  goals: number,
  note?: string,
): PositionalPlayer => ({
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
  team,
  position,
  caps,
  goals,
  note,
});
