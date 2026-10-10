// Run: npm test. Cricsheet ball-by-ball → per-player figures for the compare tool.
import { test } from "node:test";
import assert from "node:assert/strict";
import { addMatch, bestSpell, economy, phaseOf, strikeRate } from "../src/lib/player-stats.ts";

const K = "ba607b88"; // batter
const B = "462411b3"; // bowler
const tracked = new Set([K, B]);

const t20 = {
  info: {
    team_type: "international",
    match_type: "T20",
    gender: "male",
    teams: ["India", "Australia"],
    dates: ["2026-02-01"],
    players: { India: ["V Kohli", "JJ Bumrah", "X"], Australia: ["A", "C"] },
    registry: { people: { "V Kohli": K, "JJ Bumrah": B, X: "x", A: "a", C: "c" } },
  },
  innings: [
    {
      team: "India",
      overs: [
        { over: 0, deliveries: [
          { batter: "V Kohli", non_striker: "X", bowler: "A", runs: { batter: 4, extras: 0, total: 4 } },
          { batter: "V Kohli", non_striker: "X", bowler: "A", runs: { batter: 0, extras: 1, total: 1 }, extras: { wides: 1 } },
        ] },
        { over: 17, deliveries: [
          { batter: "V Kohli", non_striker: "X", bowler: "A", runs: { batter: 6, extras: 0, total: 6 } },
          { batter: "V Kohli", non_striker: "X", bowler: "A", runs: { batter: 0, extras: 0, total: 0 }, wickets: [{ kind: "caught", player_out: "V Kohli" }] },
        ] },
      ],
    },
    {
      team: "Australia",
      overs: [
        { over: 2, deliveries: [
          { batter: "A", non_striker: "C", bowler: "JJ Bumrah", runs: { batter: 1, extras: 0, total: 1 } },
          { batter: "A", non_striker: "C", bowler: "JJ Bumrah", runs: { batter: 0, extras: 1, total: 1 }, extras: { noballs: 1 } },
          { batter: "A", non_striker: "C", bowler: "JJ Bumrah", runs: { batter: 0, extras: 2, total: 2 }, extras: { legbyes: 2 } },
          { batter: "A", non_striker: "C", bowler: "JJ Bumrah", runs: { batter: 0 }, wickets: [{ kind: "bowled", player_out: "A" }] },
          { batter: "C", non_striker: "D", bowler: "JJ Bumrah", runs: { batter: 0 }, wickets: [{ kind: "run out", player_out: "C" }] },
        ] },
      ],
    },
  ],
};

test("phases by format", () => {
  assert.equal(phaseOf("t20i", 5), "powerplay");
  assert.equal(phaseOf("t20i", 6), "middle");
  assert.equal(phaseOf("t20i", 15), "death");
  assert.equal(phaseOf("odi", 39), "middle");
  assert.equal(phaseOf("test", 3), null);
});

test("batting: runs, balls (wides excluded), outs, phases, vs top sides", () => {
  const s = addMatch({}, t20, tracked)[K].t20i;
  assert.equal(s.matches, 1);
  assert.equal(s.innings, 1);
  assert.deepEqual({ runs: s.bat.runs, balls: s.bat.balls, outs: s.bat.outs }, { runs: 10, balls: 3, outs: 1 });
  assert.deepEqual(s.phases.powerplay.bat, { runs: 4, balls: 1, outs: 0 });
  assert.deepEqual(s.phases.death.bat, { runs: 6, balls: 2, outs: 1 });
  assert.deepEqual(s.vsTop.bat, { runs: 10, balls: 3, outs: 1 });
  assert.equal(s.bat.highest, 10);
  assert.equal(s.bat.highestNotOut, false);
});

test("bowling: legal balls, byes/leg byes not charged, run outs not credited", () => {
  const s = addMatch({}, t20, tracked)[B].t20i;
  assert.deepEqual({ balls: s.bowl.balls, runs: s.bowl.runs, wickets: s.bowl.wickets }, { balls: 4, runs: 2, wickets: 1 });
  assert.deepEqual(s.bowl.best, { wickets: 1, runs: 2 });
  assert.equal(s.innings, 0); // didn't bat
  assert.equal(Math.round(economy(s.bowl.runs, s.bowl.balls) * 10) / 10, 3);
});

test("non-India and other formats are ignored", () => {
  const club = { ...t20, info: { ...t20.info, team_type: "club" } };
  assert.deepEqual(addMatch({}, club, tracked), {});
});

test("best three-year spell", () => {
  const years = {
    2018: { innings: 10, bat: { runs: 300, balls: 400, outs: 10 }, bowl: { balls: 0, runs: 0, wickets: 0 } },
    2019: { innings: 10, bat: { runs: 600, balls: 600, outs: 10 }, bowl: { balls: 0, runs: 0, wickets: 0 } },
    2020: { innings: 10, bat: { runs: 600, balls: 600, outs: 10 }, bowl: { balls: 0, runs: 0, wickets: 0 } },
    2021: { innings: 10, bat: { runs: 600, balls: 600, outs: 10 }, bowl: { balls: 0, runs: 0, wickets: 0 } },
  };
  assert.deepEqual(bestSpell(years, "bat", 20), { from: "2019", to: "2021", value: 60 });
  assert.equal(bestSpell(years, "bat", 100), null);
  assert.equal(Math.round(strikeRate(50, 40)), 125);
});

test("comparison rows mark the better side", async () => {
  const { compareRows } = await import("../src/lib/compare-rows.ts");
  const stats = (runs, outs, balls) => ({
    matches: 20, innings: 20,
    bat: { runs, balls, outs, hundreds: 1, fifties: 2, highest: 120, highestNotOut: true },
    bowl: { balls: 0, runs: 0, wickets: 0, innings: 0, best: null },
    vsTop: { bat: { runs: 0, balls: 0, outs: 0 }, bowl: { balls: 0, runs: 0, wickets: 0 } },
    years: {}, first: "2020-01-01", last: "2020-12-31",
  });
  const rows = compareRows("test", stats(500, 10, 900), stats(400, 10, 600));
  const by = (l) => rows.find((r) => r.label === l);
  assert.equal(by("Average").better, "a");
  assert.equal(by("Strike rate").better, "b");
  assert.equal(by("Highest score").a, "120*");
  assert.equal(by("100s / 50s").a, "1 / 2");
  assert.equal(rows.some((r) => r.group === "Bowling"), false);
});
