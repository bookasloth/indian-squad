// Run: npm test. Comparison vote keys and validation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pairKey, pairSlug, shares, validVote } from "../src/lib/compare.ts";

const known = (s) => ["virat-kohli", "rohit-sharma", "jasprit-bumrah"].includes(s);

test("pair key ignores order", () => {
  assert.equal(pairKey("virat-kohli", "rohit-sharma"), pairKey("rohit-sharma", "virat-kohli"));
  assert.equal(pairSlug("virat-kohli", "rohit-sharma"), "virat-kohli-vs-rohit-sharma");
});

test("vote validation", () => {
  assert.deepEqual(validVote(known, "virat-kohli", "rohit-sharma", "rohit-sharma"), {
    pair: "rohit-sharma|virat-kohli",
    choice: "rohit-sharma",
  });
  assert.equal(validVote(known, "virat-kohli", "virat-kohli", "virat-kohli"), null);
  assert.equal(validVote(known, "virat-kohli", "nobody", "virat-kohli"), null);
  assert.equal(validVote(known, "virat-kohli", "rohit-sharma", "jasprit-bumrah"), null);
  assert.equal(validVote(known, "virat-kohli", 3, "virat-kohli"), null);
});

test("shares add up to 100", () => {
  assert.deepEqual(shares(0, 0), [0, 0]);
  assert.deepEqual(shares(1, 2), [33, 67]);
  assert.deepEqual(shares(5, 0), [100, 0]);
});
