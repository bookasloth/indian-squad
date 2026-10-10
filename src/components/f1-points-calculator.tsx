"use client";

import { useState } from "react";
import { GP_POINTS, SPRINT_POINTS, parsePositions, pointsFor, seasonPoints } from "@/lib/f1-points";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function F1PointsCalculator() {
  const [gp, setGp] = useState("");
  const [sprint, setSprint] = useState("");
  const gpPos = parsePositions(gp);
  const sprintPos = parsePositions(sprint);
  const total = seasonPoints(gpPos, sprintPos);

  return (
    <section className="flex flex-col gap-5 rounded-card border border-border p-5" aria-labelledby="f1-calc-h">
      <h2 id="f1-calc-h" className="font-display text-lg font-semibold tracking-tight">
        Championship points
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="f1-gp">Grand Prix finishes</Label>
          <Input id="f1-gp" inputMode="numeric" placeholder="1, 3, 2, 12" value={gp} onChange={(e) => setGp(e.target.value)} />
          <p className="text-sm text-muted-foreground">
            {gpPos.length} race{gpPos.length === 1 ? "" : "s"} · {gpPos.reduce((s, p) => s + pointsFor(GP_POINTS, p), 0)} pts
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="f1-sprint">Sprint finishes (optional)</Label>
          <Input id="f1-sprint" inputMode="numeric" placeholder="2, 1" value={sprint} onChange={(e) => setSprint(e.target.value)} />
          <p className="text-sm text-muted-foreground">
            {sprintPos.length} sprint{sprintPos.length === 1 ? "" : "s"} ·{" "}
            {sprintPos.reduce((s, p) => s + pointsFor(SPRINT_POINTS, p), 0)} pts
          </p>
        </div>
      </div>
      <p aria-live="polite" className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tabular-nums">{total}</span>
        <span className="text-sm text-muted-foreground">points</span>
      </p>
      <p className="text-sm text-muted-foreground">
        Enter finishing positions separated by commas. Grand Prix: {GP_POINTS.join("-")} for the top ten. Sprints:{" "}
        {SPRINT_POINTS.join("-")} for the top eight. A retirement scores nothing — leave it out or enter its classified
        position.
      </p>
    </section>
  );
}
