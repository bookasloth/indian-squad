// Per-player career figures from Cricsheet ball-by-ball data (open data, ODC-By).
// Pure and dep-free: scripts/build-player-stats.mjs uses it to build
// src/data/player-stats.json, the compare tool reads that file, and the test
// imports this directly.

export type Fmt = "test" | "odi" | "t20i";
export type Phase = "powerplay" | "middle" | "death";

export interface Bat {
  runs: number;
  balls: number;
  outs: number;
}
export interface Bowl {
  balls: number;
  runs: number;
  wickets: number;
}

export interface FormatStats {
  matches: number;
  innings: number;
  bat: Bat & { hundreds: number; fifties: number; highest: number; highestNotOut: boolean };
  bowl: Bowl & { innings: number; best: { wickets: number; runs: number } | null };
  /** Limited-overs only. */
  phases?: Record<Phase, { bat: Bat; bowl: Bowl }>;
  /** Against Australia, England, South Africa and New Zealand. */
  vsTop: { bat: Bat; bowl: Bowl };
  /** Calendar-year totals, for best-spell windows. */
  years: Record<string, { innings: number; bat: Bat; bowl: Bowl }>;
  first: string;
  last: string;
}

export type PlayerStats = Partial<Record<Fmt, FormatStats>>;

export const TOP_SIDES = new Set(["Australia", "England", "South Africa", "New Zealand"]);

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const NOT_BOWLER = new Set(["run out", "retired hurt", "retired out", "retired not out", "obstructing the field"]);
const NOT_OUT = new Set(["retired hurt", "retired not out"]);

const fmtOf = (info: Json): Fmt | null =>
  info?.team_type !== "international" || !info.teams?.includes("India")
    ? null
    : info.match_type === "Test"
      ? "test"
      : info.match_type === "ODI"
        ? "odi"
        : info.match_type === "T20"
          ? "t20i"
          : null;

/** Overs are 0-based in Cricsheet: T20 powerplay is overs 0–5, ODI 0–9. */
export function phaseOf(fmt: Fmt, over: number): Phase | null {
  if (fmt === "t20i") return over < 6 ? "powerplay" : over < 15 ? "middle" : "death";
  if (fmt === "odi") return over < 10 ? "powerplay" : over < 40 ? "middle" : "death";
  return null;
}

const bat = (): Bat => ({ runs: 0, balls: 0, outs: 0 });
const bowl = (): Bowl => ({ balls: 0, runs: 0, wickets: 0 });

function empty(fmt: Fmt, date: string): FormatStats {
  return {
    matches: 0,
    innings: 0,
    bat: { ...bat(), hundreds: 0, fifties: 0, highest: 0, highestNotOut: false },
    bowl: { ...bowl(), innings: 0, best: null },
    ...(fmt === "test" ? {} : { phases: { powerplay: { bat: bat(), bowl: bowl() }, middle: { bat: bat(), bowl: bowl() }, death: { bat: bat(), bowl: bowl() } } }),
    vsTop: { bat: bat(), bowl: bowl() },
    years: {},
    first: date,
    last: date,
  };
}

/** Adds one Cricsheet match to `out` for every tracked player (by Cricsheet id) who
 * played for India in it. Mutates and returns `out`. */
export function addMatch(out: Record<string, PlayerStats>, match: Json, tracked: Set<string>): Record<string, PlayerStats> {
  const info = match?.info;
  const fmt = fmtOf(info);
  if (!fmt) return out;
  const reg: Record<string, string> = info.registry?.people ?? {};
  const date: string = info.dates[0];
  const year = date.slice(0, 4);
  const opponent = info.teams.find((t: string) => t !== "India");
  const top = TOP_SIDES.has(opponent);

  const ids = new Map<string, string>(); // name -> id, India's tracked players only
  for (const name of info.players?.India ?? []) if (tracked.has(reg[name])) ids.set(name, reg[name]);
  if (ids.size === 0) return out;

  const get = (id: string) => {
    const p = (out[id] ??= {});
    const s = (p[fmt] ??= empty(fmt, date));
    if (date < s.first) s.first = date;
    if (date > s.last) s.last = date;
    s.years[year] ??= { innings: 0, bat: bat(), bowl: bowl() };
    return s;
  };
  for (const id of ids.values()) get(id).matches += 1;

  for (const inn of match.innings ?? []) {
    if (inn.super_over) continue;
    const battingIndia = inn.team === "India";
    const inningsBat = new Map<string, { runs: number; out: boolean }>();
    const inningsBowl = new Map<string, Bowl>();
    for (const over of inn.overs ?? []) {
      const phase = phaseOf(fmt, over.over);
      for (const d of over.deliveries ?? []) {
        const ex = d.extras ?? {};
        if (battingIndia) {
          for (const name of [d.batter, d.non_striker]) if (ids.has(name) && !inningsBat.has(name)) inningsBat.set(name, { runs: 0, out: false });
          const id = ids.get(d.batter);
          if (id) {
            const s = get(id);
            const r = d.runs?.batter ?? 0;
            const faced = ex.wides ? 0 : 1;
            inningsBat.get(d.batter)!.runs += r;
            s.bat.runs += r;
            s.bat.balls += faced;
            s.years[year].bat.runs += r;
            s.years[year].bat.balls += faced;
            if (phase) {
              s.phases![phase].bat.runs += r;
              s.phases![phase].bat.balls += faced;
            }
            if (top) {
              s.vsTop.bat.runs += r;
              s.vsTop.bat.balls += faced;
            }
          }
          for (const w of d.wickets ?? []) {
            const oid = ids.get(w.player_out);
            if (!oid || NOT_OUT.has(w.kind)) continue;
            const s = get(oid);
            const inn = inningsBat.get(w.player_out) ?? { runs: 0, out: false };
            inn.out = true;
            inningsBat.set(w.player_out, inn);
            s.bat.outs += 1;
            s.years[year].bat.outs += 1;
            if (phase) s.phases![phase].bat.outs += 1;
            if (top) s.vsTop.bat.outs += 1;
          }
        } else {
          const id = ids.get(d.bowler);
          if (!id) continue;
          const s = get(id);
          const legal = ex.wides || ex.noballs ? 0 : 1;
          const conceded = (d.runs?.batter ?? 0) + (ex.wides ?? 0) + (ex.noballs ?? 0);
          const wkts = (d.wickets ?? []).filter((w: Json) => !NOT_BOWLER.has(w.kind)).length;
          const b = inningsBowl.get(id) ?? bowl();
          b.balls += legal;
          b.runs += conceded;
          b.wickets += wkts;
          inningsBowl.set(id, b);
          for (const t of [s.bowl, s.years[year].bowl, ...(phase ? [s.phases![phase].bowl] : []), ...(top ? [s.vsTop.bowl] : [])]) {
            t.balls += legal;
            t.runs += conceded;
            t.wickets += wkts;
          }
        }
      }
    }
    for (const [name, i] of inningsBat) {
      const s = get(ids.get(name)!);
      s.innings += 1;
      s.years[year].innings += 1;
      if (i.runs >= 100) s.bat.hundreds += 1;
      else if (i.runs >= 50) s.bat.fifties += 1;
      if (i.runs > s.bat.highest || (i.runs === s.bat.highest && !i.out)) {
        s.bat.highest = i.runs;
        s.bat.highestNotOut = !i.out;
      }
    }
    for (const [id, b] of inningsBowl) {
      const s = get(id);
      s.bowl.innings += 1;
      const best = s.bowl.best;
      if (!best || b.wickets > best.wickets || (b.wickets === best.wickets && b.runs < best.runs)) {
        s.bowl.best = { wickets: b.wickets, runs: b.runs };
      }
    }
  }
  return out;
}

// ── Derived figures for display ──

export const average = (runs: number, outs: number) => (outs > 0 ? runs / outs : null);
export const strikeRate = (runs: number, balls: number) => (balls > 0 ? (runs / balls) * 100 : null);
export const economy = (runs: number, balls: number) => (balls > 0 ? (runs / balls) * 6 : null);

/** Best three consecutive calendar years: batting by average (min innings), bowling
 * by average (min wickets). null when no window qualifies. */
export function bestSpell(
  years: FormatStats["years"],
  kind: "bat" | "bowl",
  min: number,
): { from: string; to: string; value: number } | null {
  const ys = Object.keys(years).map(Number).sort((a, b) => a - b);
  const lastYear = ys.at(-1) ?? 0;
  let best: { from: string; to: string; value: number } | null = null;
  // Only full windows: a spell starting last year would be labelled with years not yet played.
  for (const y of ys.filter((y) => y + 2 <= lastYear)) {
    const win = [y, y + 1, y + 2].map((k) => years[String(k)]).filter(Boolean);
    if (kind === "bat") {
      const innings = win.reduce((s, w) => s + w.innings, 0);
      const runs = win.reduce((s, w) => s + w.bat.runs, 0);
      const outs = win.reduce((s, w) => s + w.bat.outs, 0);
      const avg = average(runs, outs);
      if (innings >= min && avg !== null && (!best || avg > best.value)) best = { from: String(y), to: String(y + 2), value: avg };
    } else {
      const wkts = win.reduce((s, w) => s + w.bowl.wickets, 0);
      const runs = win.reduce((s, w) => s + w.bowl.runs, 0);
      const avg = average(runs, wkts);
      if (wkts >= min && avg !== null && (!best || avg < best.value)) best = { from: String(y), to: String(y + 2), value: avg };
    }
  }
  return best;
}
