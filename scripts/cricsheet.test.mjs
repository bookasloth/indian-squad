// Run: npm test. Cricsheet match → tracked players' runs, wickets and appearances.
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatOf, since, summarise } from "../src/lib/cricsheet.ts";

const match = (info, deliveries) => ({
  info: {
    gender: "male",
    team_type: "international",
    match_type: "ODI",
    teams: ["India", "West Indies"],
    dates: ["2026-10-03"],
    players: { India: ["V Kohli", "JJ Bumrah"], "West Indies": ["S Hope"] },
    registry: { people: { "V Kohli": "ba607b88", "JJ Bumrah": "462411b3", "S Hope": "x1" } },
    ...info,
  },
  innings: [{ team: "India", overs: [{ over: 0, deliveries }] }],
});

const kohli = "ba607b88";
const bumrah = "462411b3";
const tracked = new Set([kohli, bumrah]);

test("format filter: men's India internationals and the IPL only", () => {
  assert.equal(formatOf(match({}).info), "odi");
  assert.equal(formatOf(match({ match_type: "T20" }).info), "t20i");
  assert.equal(formatOf(match({ gender: "female" }).info), null);
  assert.equal(formatOf(match({ teams: ["Australia", "England"] }).info), null);
  assert.equal(formatOf(match({ team_type: "club", event: { name: "Indian Premier League" } }).info), "ipl");
  assert.equal(formatOf(match({ team_type: "club", event: { name: "Big Bash League" } }).info), null);
});

test("runs to the batter, wickets to the bowler except run outs", () => {
  const m = match({}, [
    { batter: "V Kohli", bowler: "S Hope", runs: { batter: 4, extras: 0, total: 4 } },
    { batter: "V Kohli", bowler: "S Hope", runs: { batter: 0, extras: 1, total: 1 }, extras: { wides: 1 } },
    { batter: "S Hope", bowler: "JJ Bumrah", runs: { batter: 0 }, wickets: [{ kind: "bowled", player_out: "S Hope" }] },
    { batter: "S Hope", bowler: "JJ Bumrah", runs: { batter: 0 }, wickets: [{ kind: "run out", player_out: "S Hope" }] },
  ]);
  const s = summarise(m, tracked);
  assert.equal(s.format, "odi");
  assert.deepEqual(s.players[kohli], { runs: 4, wickets: 0 });
  assert.deepEqual(s.players[bumrah], { runs: 0, wickets: 1 });
});

test("additions only count matches after the baseline date", () => {
  const live = {
    updated: "2026-10-06",
    matches: {
      a: { date: "2026-09-30", format: "odi", players: { [kohli]: { runs: 50, wickets: 0 } } },
      b: { date: "2026-10-03", format: "odi", players: { [kohli]: { runs: 70, wickets: 0 } } },
      c: { date: "2026-10-06", format: "t20i", players: { [kohli]: { runs: 30, wickets: 0 } } },
    },
  };
  assert.deepEqual(since(live, kohli, "odi", "2026-09-30", "runs"), { value: 70, matches: 1, latest: "2026-10-03" });
  assert.deepEqual(since(live, bumrah, "odi", "2026-09-30", "wickets"), { value: 0, matches: 0, latest: null });
});
