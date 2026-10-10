// Run: npm test. The calculator and explainers quote these numbers.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  battingAverage,
  bowlingAverage,
  formatOvers,
  netRunRate,
  parseOvers,
  requiredRate,
  runsPerOver,
  strikeRate,
} from "../src/lib/cricket-math.ts";

test("overs notation is overs.balls, not a decimal", () => {
  assert.equal(parseOvers("37.3"), 225);
  assert.equal(parseOvers("20"), 120);
  assert.equal(parseOvers("0.1"), 1);
  assert.equal(parseOvers("12.6"), null);
  assert.equal(parseOvers("abc"), null);
  assert.equal(formatOvers(225), "37.3");
});

test("batting and bowling figures", () => {
  assert.equal(battingAverage(450, 10), 45);
  assert.equal(battingAverage(120, 0), null);
  assert.equal(strikeRate(75, 50), 150);
  assert.equal(bowlingAverage(300, 12), 25);
  assert.equal(runsPerOver(36, parseOvers("4")), 9);
  assert.equal(runsPerOver(30, parseOvers("3.3")).toFixed(2), "8.57");
});

test("required rate", () => {
  assert.equal(requiredRate(60, parseOvers("10")), 6);
  assert.equal(requiredRate(-5, 30), 0);
});

test("net run rate uses tournament totals", () => {
  // 180 in 20 overs, conceded 160 in 20 overs → 9.00 − 8.00
  assert.equal(netRunRate(180, 120, 160, 120), 1);
  // Two matches summed, not averaged: (150+200)/(20+20) − (151+120)/(18.4+20)
  const nrr = netRunRate(350, 240, 271, parseOvers("18.4") + 120);
  assert.equal(nrr.toFixed(3), "1.741");
});
