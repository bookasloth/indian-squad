"use client";

import { useState } from "react";
import {
  battingAverage,
  bowlingAverage,
  bowlingStrikeRate,
  netRunRate,
  parseOvers,
  requiredRate,
  runsPerOver,
  strikeRate,
} from "@/lib/cricket-math";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Kind = "int" | "overs";
type Calc = {
  id: string;
  title: string;
  fields: { key: string; label: string; kind: Kind; placeholder: string }[];
  /** Values arrive as numbers: ints as-is, overs already converted to balls. */
  compute: (v: Record<string, number>) => number | null;
  unit: string;
};

const CALCS: Calc[] = [
  {
    id: "bat-avg",
    title: "Batting average",
    fields: [
      { key: "runs", label: "Runs", kind: "int", placeholder: "450" },
      { key: "outs", label: "Times out", kind: "int", placeholder: "10" },
    ],
    compute: (v) => battingAverage(v.runs, v.outs),
    unit: "runs per dismissal",
  },
  {
    id: "bat-sr",
    title: "Batting strike rate",
    fields: [
      { key: "runs", label: "Runs", kind: "int", placeholder: "75" },
      { key: "balls", label: "Balls faced", kind: "int", placeholder: "50" },
    ],
    compute: (v) => strikeRate(v.runs, v.balls),
    unit: "runs per 100 balls",
  },
  {
    id: "econ",
    title: "Economy rate",
    fields: [
      { key: "runs", label: "Runs conceded", kind: "int", placeholder: "32" },
      { key: "overs", label: "Overs bowled", kind: "overs", placeholder: "4" },
    ],
    compute: (v) => runsPerOver(v.runs, v.overs),
    unit: "runs per over",
  },
  {
    id: "bowl-avg",
    title: "Bowling average",
    fields: [
      { key: "runs", label: "Runs conceded", kind: "int", placeholder: "300" },
      { key: "wkts", label: "Wickets", kind: "int", placeholder: "12" },
    ],
    compute: (v) => bowlingAverage(v.runs, v.wkts),
    unit: "runs per wicket",
  },
  {
    id: "bowl-sr",
    title: "Bowling strike rate",
    fields: [
      { key: "overs", label: "Overs bowled", kind: "overs", placeholder: "40" },
      { key: "wkts", label: "Wickets", kind: "int", placeholder: "8" },
    ],
    compute: (v) => bowlingStrikeRate(v.overs, v.wkts),
    unit: "balls per wicket",
  },
  {
    id: "rr",
    title: "Run rate",
    fields: [
      { key: "runs", label: "Runs", kind: "int", placeholder: "164" },
      { key: "overs", label: "Overs", kind: "overs", placeholder: "18.2" },
    ],
    compute: (v) => runsPerOver(v.runs, v.overs),
    unit: "runs per over",
  },
  {
    id: "rrr",
    title: "Required run rate",
    fields: [
      { key: "target", label: "Target", kind: "int", placeholder: "181" },
      { key: "score", label: "Score now", kind: "int", placeholder: "96" },
      { key: "left", label: "Overs left", kind: "overs", placeholder: "9.3" },
    ],
    compute: (v) => requiredRate(v.target - v.score, v.left),
    unit: "runs per over needed",
  },
  {
    id: "nrr",
    title: "Net run rate",
    fields: [
      { key: "rf", label: "Total runs scored", kind: "int", placeholder: "350" },
      { key: "of", label: "Total overs faced", kind: "overs", placeholder: "40" },
      { key: "ra", label: "Total runs conceded", kind: "int", placeholder: "271" },
      { key: "ob", label: "Total overs bowled", kind: "overs", placeholder: "38.4" },
    ],
    compute: (v) => netRunRate(v.rf, v.of, v.ra, v.ob),
    unit: "net run rate",
  },
];

function parse(kind: Kind, raw: string): number | null {
  if (raw.trim() === "") return null;
  if (kind === "overs") return parseOvers(raw);
  return /^\s*\d+\s*$/.test(raw) ? Number(raw) : null;
}

function CalcCard({ calc }: { calc: Calc }) {
  const [raw, setRaw] = useState<Record<string, string>>({});
  const values: Record<string, number> = {};
  let ready = true;
  let invalid = false;
  for (const f of calc.fields) {
    const n = parse(f.kind, raw[f.key] ?? "");
    if (n === null) {
      ready = false;
      if ((raw[f.key] ?? "").trim() !== "") invalid = true;
    } else values[f.key] = n;
  }
  const result = ready ? calc.compute(values) : null;
  const shown =
    result === null ? "—" : calc.id === "nrr" ? `${result >= 0 ? "+" : ""}${result.toFixed(3)}` : result.toFixed(2);

  return (
    <section className="flex flex-col gap-4 rounded-card border border-border p-5" aria-labelledby={`${calc.id}-h`}>
      <h3 id={`${calc.id}-h`} className="font-display text-lg font-semibold tracking-tight">
        {calc.title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {calc.fields.map((f) => (
          <div key={f.key} className="flex flex-col gap-1.5">
            <Label htmlFor={`${calc.id}-${f.key}`}>{f.label}</Label>
            <Input
              id={`${calc.id}-${f.key}`}
              inputMode="decimal"
              placeholder={f.placeholder}
              value={raw[f.key] ?? ""}
              aria-invalid={(raw[f.key] ?? "").trim() !== "" && parse(f.kind, raw[f.key]) === null}
              onChange={(e) => setRaw((r) => ({ ...r, [f.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <p aria-live="polite" className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tabular-nums">{shown}</span>
        <span className="text-sm text-muted-foreground">{calc.unit}</span>
      </p>
      {invalid && (
        <p className="text-sm text-muted-foreground">
          Whole numbers only. Overs are written overs.balls, so the part after the point is 0–5 (e.g. 18.2).
        </p>
      )}
    </section>
  );
}

export function CricketCalculator() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {CALCS.map((c) => (
        <CalcCard key={c.id} calc={c} />
      ))}
    </div>
  );
}
