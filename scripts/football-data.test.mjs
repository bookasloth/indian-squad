// Run: npm test. API-Football responses → ISL table and India fixtures.
import { test } from "node:test";
import assert from "node:assert/strict";
import { indiaTeamIds, islSeason, standingsTable, upcomingFixtures } from "../src/lib/football-data.ts";

test("finds the ISL and its current season", () => {
  const res = {
    errors: [],
    response: [
      { league: { id: 324, name: "I-League" }, seasons: [{ year: 2025, current: true }] },
      { league: { id: 323, name: "Indian Super League" }, seasons: [{ year: 2024, current: false }, { year: 2025, current: true }] },
    ],
  };
  assert.deepEqual(islSeason(res), { league: 323, season: 2025 });
  assert.equal(islSeason({ errors: { plan: "Free plans do not have access to this season" }, response: [] }), null);
});

test("parses the league table", () => {
  const res = {
    errors: [],
    response: [
      {
        league: {
          standings: [
            [
              { rank: 1, team: { name: "East Bengal" }, points: 40, goalsDiff: 18, all: { played: 18, win: 12, draw: 4, lose: 2 } },
              { rank: 2, team: { name: "Mohun Bagan" }, points: 38, goalsDiff: 15, all: { played: 18, win: 11, draw: 5, lose: 2 } },
            ],
          ],
        },
      },
    ],
  };
  const t = standingsTable(res);
  assert.equal(t.length, 2);
  assert.deepEqual(t[0], { rank: 1, team: "East Bengal", played: 18, won: 12, drawn: 4, lost: 2, goalDiff: 18, points: 40 });
  assert.equal(standingsTable({ errors: [], response: [] }), null);
});

test("India national teams only", () => {
  const res = {
    errors: [],
    response: [
      { team: { id: 1, name: "India", national: true } },
      { team: { id: 2, name: "India W", national: true } },
      { team: { id: 3, name: "India U23", national: true } },
      { team: { id: 4, name: "India FC", national: false } },
    ],
  };
  assert.deepEqual(indiaTeamIds(res), [1, 2]);
});

test("fixtures map to the shared shape", () => {
  const res = {
    errors: [],
    response: [
      {
        fixture: { id: 99, date: "2026-11-14T13:30:00+00:00", venue: { name: "Salt Lake Stadium", city: "Kolkata" } },
        league: { name: "AFC Asian Cup - Qualification" },
        teams: { home: { name: "India" }, away: { name: "Singapore" } },
      },
    ],
  };
  assert.deepEqual(upcomingFixtures(res)[0], {
    id: "99",
    name: "India v Singapore",
    matchType: "",
    venue: "Salt Lake Stadium, Kolkata",
    start: "2026-11-14T13:30:00.000Z",
    teams: ["India", "Singapore"],
    series: "AFC Asian Cup - Qualification",
  });
});
