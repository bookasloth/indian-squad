// Run: npm test. CricketData.org responses → India's upcoming fixtures.
import { test } from "node:test";
import assert from "node:assert/strict";
import { indiaFixtures, liveSeriesIds, mergeFixtures } from "../src/lib/fixtures.ts";

test("keeps series that haven't ended", () => {
  const res = {
    data: [
      { id: "a", name: "India tour of X", endDate: "2026-12-01" },
      { id: "b", name: "Old series", endDate: "Sep 01, 2026" },
      { id: "c", name: "No end date" },
    ],
  };
  assert.deepEqual(liveSeriesIds(res, "2026-10-10"), ["a", "c"]);
  assert.deepEqual(liveSeriesIds(null, "2026-10-10"), []);
});

test("end dates without a year take the start date's year", () => {
  const res = {
    data: [
      { id: "now", startDate: "2026-09-22", endDate: "Oct 12" },
      { id: "done", startDate: "2026-08-01", endDate: "Aug 20" },
      { id: "new-year", startDate: "2026-12-26", endDate: "Jan 07" },
    ],
  };
  assert.deepEqual(liveSeriesIds(res, "2026-10-10"), ["now", "new-year"]);
});

test("India's not-yet-started matches only", () => {
  const res = {
    data: {
      info: { name: "West Indies tour of India" },
      matchList: [
        { id: 1, name: "India v West Indies, 2nd T20I", matchType: "T20", venue: "Ranchi", dateTimeGMT: "2026-10-12T13:30:00", teams: ["India", "West Indies"], matchStarted: false },
        { id: 2, name: "India v West Indies, 1st T20I", matchType: "t20", venue: "Kolkata", dateTimeGMT: "2026-10-06T13:30:00", teams: ["India", "West Indies"], matchStarted: true },
        { id: 3, name: "A v B", matchType: "odi", dateTimeGMT: "2026-10-20T08:00:00", teams: ["Australia", "England"], matchStarted: false },
        { id: 4, name: "India Women v England Women", matchType: "odi", dateTimeGMT: "2026-10-15T08:00:00", teams: ["India Women", "England Women"], matchStarted: false },
      ],
    },
  };
  const f = indiaFixtures(res, "2026-10-10T00:00:00Z");
  assert.deepEqual(f.map((x) => x.id), ["1", "4"]);
  assert.equal(f[0].start, "2026-10-12T13:30:00Z");
  assert.equal(f[0].matchType, "t20");
  assert.equal(f[0].series, "West Indies tour of India");
  assert.deepEqual(indiaFixtures({}, "2026-10-10T00:00:00Z"), []);
});

test("match names drop the repeated series; format comes from the name", () => {
  const series = "West Indies tour of India, 2026";
  const res = {
    data: {
      info: { name: series },
      matchList: [
        { id: 7, name: `India vs West Indies, 3rd T20I, ${series}`, matchType: "odi", dateTimeGMT: "2026-10-11T13:30:00", teams: ["India", "West Indies"], matchStarted: false },
        { id: 8, name: "India vs West Indies, only Test", matchType: "test", dateTimeGMT: "2026-10-20T04:00:00", teams: ["India", "West Indies"], matchStarted: false },
      ],
    },
  };
  const [t20, testMatch] = indiaFixtures(res, "2026-10-10T00:00:00Z");
  assert.equal(t20.name, "India vs West Indies, 3rd T20I");
  assert.equal(t20.matchType, "t20");
  assert.equal(testMatch.matchType, "test");
});

test("merge de-duplicates and sorts soonest first", () => {
  const a = { id: "1", start: "2026-10-12T13:30:00Z" };
  const b = { id: "2", start: "2026-10-11T08:00:00Z" };
  assert.deepEqual(mergeFixtures([[a], [b, a]]).map((x) => x.id), ["2", "1"]);
});
