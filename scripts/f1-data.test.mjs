// Run: npm test. Parsing Jolpica responses and adding new champions.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeChampions, parseSeason } from "../src/lib/f1-data.ts";

const calendar = (total) => ({ MRData: { total: String(total) } });
const drivers = (season, round) => ({
  MRData: {
    StandingsTable: {
      StandingsLists: [
        {
          season,
          round: String(round),
          DriverStandings: [
            { position: "1", points: "320", wins: "8", Driver: { givenName: "Andrea Kimi", familyName: "Antonelli" }, Constructors: [{ name: "Mercedes" }] },
            { position: "2", points: "300", wins: "5", Driver: { givenName: "Lando", familyName: "Norris" }, Constructors: [{ name: "McLaren" }] },
          ],
        },
      ],
    },
  },
});
const constructors = (season, round) => ({
  MRData: {
    StandingsTable: {
      StandingsLists: [{ season, round: String(round), ConstructorStandings: [{ position: "1", points: "556", wins: "11", Constructor: { name: "Mercedes" } }] }],
    },
  },
});

test("parses a season in progress", () => {
  const s = parseSeason(calendar(23), drivers("2026", 16), constructors("2026", 16));
  assert.equal(s.complete, false);
  assert.equal(s.round, 16);
  assert.deepEqual(s.drivers[0], { position: 1, name: "Andrea Kimi Antonelli", team: "Mercedes", points: 320, wins: 8 });
  assert.equal(s.constructors[0].name, "Mercedes");
});

test("bad or missing responses give null", () => {
  assert.equal(parseSeason(null, drivers("2026", 1), constructors("2026", 1)), null);
  assert.equal(parseSeason(calendar(23), { MRData: {} }, constructors("2026", 1)), null);
});

test("only completed, newer seasons are added as champions", () => {
  const editions = [{ year: "2025", winner: "Lando Norris", runnerUp: "McLaren" }];
  const live = parseSeason(calendar(23), drivers("2026", 16), constructors("2026", 16));
  assert.equal(mergeChampions(editions, [live], "drivers").length, 1);

  const done = parseSeason(calendar(23), drivers("2026", 23), constructors("2026", 23));
  const merged = mergeChampions(editions, [done], "drivers");
  assert.deepEqual(merged[0], { year: "2026", winner: "Andrea Kimi Antonelli", runnerUp: "Mercedes" });
  assert.equal(mergeChampions(editions, [done], "constructors")[0].winner, "Mercedes");

  const old = parseSeason(calendar(24), drivers("2025", 24), constructors("2025", 24));
  assert.equal(mergeChampions(editions, [old], "drivers").length, 1);
});
