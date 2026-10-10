// Run: npm test. The XI builder's validity check, for cricket and hockey rules.
import { test } from "node:test";
import assert from "node:assert/strict";
import { xiStatus } from "../src/lib/xi.ts";

const keeper = [{ role: "wicketkeeper", min: 1, message: "Add at least one wicketkeeper." }];
const goalie = [{ role: "goalkeeper", min: 1, max: 1, message: "Pick exactly one goalkeeper." }];
const of = (role, n) => Array(n).fill(role);

test("needs eleven first", () => {
  assert.deepEqual(xiStatus(of("batter", 9), keeper), { valid: false, message: "Pick 2 more." });
});

test("cricket: at least one wicketkeeper", () => {
  assert.equal(xiStatus(of("batter", 11), keeper).valid, false);
  assert.equal(xiStatus([...of("batter", 9), ...of("wicketkeeper", 2)], keeper).valid, true);
});

test("hockey: exactly one goalkeeper", () => {
  assert.equal(xiStatus(of("defender", 11), goalie).message, "Pick exactly one goalkeeper.");
  assert.equal(xiStatus([...of("defender", 9), ...of("goalkeeper", 2)], goalie).valid, false);
  assert.equal(xiStatus([...of("defender", 10), "goalkeeper"], goalie).valid, true);
});
