// Run: npm test. The F1 points calculator quotes these numbers.
import { test } from "node:test";
import assert from "node:assert/strict";
import { GP_POINTS, SPRINT_POINTS, parsePositions, pointsFor, seasonPoints } from "../src/lib/f1-points.ts";

test("points tables", () => {
  assert.equal(pointsFor(GP_POINTS, 1), 25);
  assert.equal(pointsFor(GP_POINTS, 10), 1);
  assert.equal(pointsFor(GP_POINTS, 11), 0);
  assert.equal(pointsFor(SPRINT_POINTS, 1), 8);
  assert.equal(pointsFor(SPRINT_POINTS, 9), 0);
  assert.equal(pointsFor(GP_POINTS, 0), 0);
});

test("parsing positions", () => {
  assert.deepEqual(parsePositions("1, 3,12  x 2.5 -4 7"), [1, 3, 12, 7]);
  assert.deepEqual(parsePositions(""), []);
});

test("season total", () => {
  // 1st + 3rd + 12th = 25 + 15 + 0; sprint 1st + 8th = 8 + 1
  assert.equal(seasonPoints([1, 3, 12], [1, 8]), 49);
  assert.equal(seasonPoints([]), 0);
});
