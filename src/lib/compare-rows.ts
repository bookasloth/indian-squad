// Turns two players' ball-by-ball figures into comparison rows, marking the better
// side. Pure: shared by the interactive tool and the curated comparison pages so
// both always show the same numbers.
import { average, bestSpell, economy, strikeRate, type FormatStats, type Fmt } from "./player-stats.ts";

export interface Row {
  group: "Matches" | "Batting" | "Bowling";
  label: string;
  a: string;
  b: string;
  /** Which side is better, when both have a figure and it differs. */
  better: "a" | "b" | null;
}

const MIN_INNINGS = { test: 15, odi: 20, t20i: 20 } as const;
const MIN_WICKETS = { test: 30, odi: 25, t20i: 20 } as const;
// Phase and vs-top rates need a sample before they mean anything.
const MIN_BALLS = 120;

type Num = number | null;
const fix = (n: Num, d = 1) => (n === null ? "—" : n.toFixed(d));
const int = (n: Num) => (n === null ? "—" : n.toLocaleString("en-IN"));

function row(group: Row["group"], label: string, a: Num, b: Num, higher: boolean | null, show: (n: Num) => string): Row {
  const better = higher === null || a === null || b === null || a === b ? null : (a > b) === higher ? "a" : "b";
  return { group, label, a: show(a), b: show(b), better };
}

/** A row whose display text differs from the number it's judged on. */
function custom(group: Row["group"], label: string, a: Num, b: Num, higher: boolean, showA: string, showB: string): Row {
  return { ...row(group, label, a, b, higher, () => ""), a: showA, b: showB };
}

// A player "bats" or "bowls" in a format once there's enough of it to compare.
const bats = (s?: FormatStats) => !!s && s.innings >= 15 && s.bat.runs / s.innings >= 10;
const bowls = (s?: FormatStats) => !!s && s.bowl.wickets >= 10;

/** Drop "better" marks in a group unless both players qualify for it. */
const judged = (rows: Row[], both: boolean) => (both ? rows : rows.map((r) => ({ ...r, better: null })));

const spellText = (s: { from: string; to: string; value: number } | null) => (s ? `${s.value.toFixed(2)} (${s.from}–${s.to.slice(2)})` : "—");

function battingRows(fmt: Fmt, A?: FormatStats, B?: FormatStats): Row[] {
  const avg = (s?: FormatStats) => (s ? average(s.bat.runs, s.bat.outs) : null);
  const sr = (s?: FormatStats) => (s ? strikeRate(s.bat.runs, s.bat.balls) : null);
  const tons = (s?: FormatStats) => (s ? `${s.bat.hundreds} / ${s.bat.fifties}` : "—");
  const hs = (s?: FormatStats) => (s ? `${s.bat.highest}${s.bat.highestNotOut ? "*" : ""}` : "—");
  const rows: Row[] = [
    row("Batting", "Runs", A?.bat.runs ?? null, B?.bat.runs ?? null, true, int),
    row("Batting", "Average", avg(A), avg(B), true, (n) => fix(n, 2)),
    row("Batting", "Strike rate", sr(A), sr(B), true, (n) => fix(n, 1)),
    { group: "Batting", label: "100s / 50s", a: tons(A), b: tons(B), better: null },
    custom("Batting", "Highest score", A?.bat.highest ?? null, B?.bat.highest ?? null, true, hs(A), hs(B)),
  ];
  if (fmt !== "test") {
    for (const [phase, label] of [
      ["powerplay", "Strike rate: powerplay"],
      ["middle", "Strike rate: middle overs"],
      ["death", "Strike rate: death overs"],
    ] as const) {
      const ph = (s?: FormatStats) => {
        const p = s?.phases?.[phase].bat;
        return p && p.balls >= MIN_BALLS ? strikeRate(p.runs, p.balls) : null;
      };
      rows.push(row("Batting", label, ph(A), ph(B), true, (n) => fix(n, 1)));
    }
  }
  const top = (s?: FormatStats) => (s && s.vsTop.bat.balls >= MIN_BALLS ? average(s.vsTop.bat.runs, s.vsTop.bat.outs) : null);
  rows.push(row("Batting", "Average vs top sides", top(A), top(B), true, (n) => fix(n, 2)));
  const spell = (s?: FormatStats) => (s ? bestSpell(s.years, "bat", MIN_INNINGS[fmt]) : null);
  const sa = spell(A);
  const sb = spell(B);
  rows.push(custom("Batting", "Best 3-year average", sa?.value ?? null, sb?.value ?? null, true, spellText(sa), spellText(sb)));
  return rows;
}

function bowlingRows(fmt: Fmt, A?: FormatStats, B?: FormatStats): Row[] {
  const avg = (s?: FormatStats) => (s && s.bowl.wickets > 0 ? s.bowl.runs / s.bowl.wickets : null);
  const econ = (s?: FormatStats) => (s ? economy(s.bowl.runs, s.bowl.balls) : null);
  const sr = (s?: FormatStats) => (s && s.bowl.wickets > 0 ? s.bowl.balls / s.bowl.wickets : null);
  const bestN = (s?: FormatStats) => (s?.bowl.best ? s.bowl.best.wickets * 1000 - s.bowl.best.runs : null);
  const best = (s?: FormatStats) => (s?.bowl.best ? `${s.bowl.best.wickets}/${s.bowl.best.runs}` : "—");
  const rows: Row[] = [
    row("Bowling", "Wickets", A?.bowl.wickets ?? null, B?.bowl.wickets ?? null, true, int),
    row("Bowling", "Average", avg(A), avg(B), false, (n) => fix(n, 2)),
    row("Bowling", "Economy", econ(A), econ(B), false, (n) => fix(n, 2)),
    row("Bowling", "Strike rate (balls per wicket)", sr(A), sr(B), false, (n) => fix(n, 1)),
    custom("Bowling", "Best bowling", bestN(A), bestN(B), true, best(A), best(B)),
  ];
  if (fmt !== "test") {
    for (const [phase, label] of [
      ["powerplay", "Economy: powerplay"],
      ["death", "Economy: death overs"],
    ] as const) {
      const ec = (s?: FormatStats) => {
        const p = s?.phases?.[phase].bowl;
        return p && p.balls >= MIN_BALLS ? economy(p.runs, p.balls) : null;
      };
      rows.push(row("Bowling", label, ec(A), ec(B), false, (n) => fix(n, 2)));
    }
  }
  const top = (s?: FormatStats) => (s && s.vsTop.bowl.wickets >= 10 ? s.vsTop.bowl.runs / s.vsTop.bowl.wickets : null);
  rows.push(row("Bowling", "Average vs top sides", top(A), top(B), false, (n) => fix(n, 2)));
  const spell = (s?: FormatStats) => (s ? bestSpell(s.years, "bowl", MIN_WICKETS[fmt]) : null);
  const sa = spell(A);
  const sb = spell(B);
  rows.push(custom("Bowling", "Best 3-year average", sa?.value ?? null, sb?.value ?? null, false, spellText(sa), spellText(sb)));
  return rows;
}

/** Comparison rows for one format. The batting section appears when either player
 * genuinely bats in it, the bowling section when either genuinely bowls; "better"
 * is only marked when both qualify, so a bowler's batting isn't judged against a
 * batter's, and a part-timer's two wickets aren't judged at all. */
export function compareRows(fmt: Fmt, A?: FormatStats, B?: FormatStats): Row[] {
  const rows: Row[] = [row("Matches", "Matches (ball-by-ball)", A?.matches ?? null, B?.matches ?? null, null, int)];
  if (bats(A) || bats(B)) rows.push(...judged(battingRows(fmt, A, B), bats(A) && bats(B)));
  if (bowls(A) || bowls(B)) rows.push(...judged(bowlingRows(fmt, A, B), bowls(A) && bowls(B)));
  return rows;
}

/** Formats either player has played, in display order. */
export const sharedFormats = (a?: Partial<Record<Fmt, FormatStats>>, b?: Partial<Record<Fmt, FormatStats>>): Fmt[] =>
  (["test", "odi", "t20i"] as const).filter((f) => a?.[f] || b?.[f]);

export const FORMAT_LABEL: Record<Fmt, string> = { test: "Tests", odi: "ODIs", t20i: "T20Is" };
