"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { PlayerStats, Fmt } from "@/lib/player-stats";
import { FORMAT_LABEL, compareRows, sharedFormats, type Row } from "@/lib/compare-rows";
import { ComparisonTable } from "@/components/comparison-table";
import { CompareVote } from "@/components/compare-vote";

export interface ComparePlayer {
  slug: string;
  name: string;
  team: "men" | "women";
  roleLabel: string;
  /** Official counts from the roster (caps per format, or caps and goals). */
  stats: { label: string; value: number }[];
  /** Cricket only: ball-by-ball figures. */
  deep?: PlayerStats;
}

export function CompareTool({
  sport,
  players,
  defaults,
  fixed,
  initialFormat,
}: {
  sport: string;
  players: ComparePlayer[];
  defaults: [string, string];
  /** Curated pages lock the pair and hide the pickers. */
  fixed?: boolean;
  /** Format to open on, e.g. the one a curated debate is about. */
  initialFormat?: Fmt;
}) {
  const bySlug = useMemo(() => new Map(players.map((p) => [p.slug, p])), [players]);
  // The page is static, so ?a=&b= is read from the URL as an external store: the
  // server renders the defaults, the client swaps in the shared pair without a
  // hydration mismatch. Once the user picks someone, their choice wins.
  const search = useSyncExternalStore(
    noopSubscribe,
    () => (fixed ? "" : window.location.search),
    () => "",
  );
  const fromUrl = useMemo(() => urlPair(search, bySlug, defaults, players), [search, bySlug, defaults, players]);
  const [picked, setPicked] = useState<[string, string] | null>(null);
  const [aSlug, bSlug] = picked ?? fromUrl;
  const setA = (s: string) => setPicked([s, bSlug]);
  const setB = (s: string) => setPicked([aSlug, s]);

  // Keep the URL in step so any comparison can be shared as a link — but only after
  // the user picks someone, or the first render would overwrite an incoming link.
  useEffect(() => {
    if (fixed || !picked) return;
    const url = new URL(window.location.href);
    url.searchParams.set("a", aSlug);
    url.searchParams.set("b", bSlug);
    window.history.replaceState(null, "", url);
  }, [aSlug, bSlug, fixed, picked]);

  const A = bySlug.get(aSlug)!;
  const B = bySlug.get(bSlug)!;
  const formats = sharedFormats(A.deep, B.deep);
  const [fmt, setFmt] = useState<Fmt | null>(initialFormat ?? null);
  const activeFmt = fmt && formats.includes(fmt) ? fmt : (formats[0] ?? null);
  const rows: Row[] = activeFmt ? compareRows(activeFmt, A.deep?.[activeFmt], B.deep?.[activeFmt]) : [];

  const vote = useRef({ pa: 0, pb: 0, total: 0 });
  const onResult = useCallback((pa: number, pb: number, total: number) => {
    vote.current = { pa, pb, total };
  }, []);

  const officialLabels = [...new Set([...A.stats, ...B.stats].map((s) => s.label))];
  const official = (p: ComparePlayer, label: string) => p.stats.find((s) => s.label === label)?.value;

  return (
    <div className="flex flex-col gap-8">
      {!fixed && (
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["Player 1", aSlug, setA, bSlug],
            ["Player 2", bSlug, setB, aSlug],
          ] as const).map(([label, value, set, other]) => (
            <label key={label} className="flex flex-col gap-1.5 text-sm font-medium">
              {label}
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className="h-10 rounded-input border border-input bg-background px-3 text-sm"
              >
                {(["men", "women"] as const).map((team) => (
                  <optgroup key={team} label={team === "men" ? "Men" : "Women"}>
                    {players
                      .filter((p) => p.team === team)
                      .map((p) => (
                        <option key={p.slug} value={p.slug} disabled={p.slug === other}>
                          {p.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {[A, B].map((p) => (
          <Link
            key={p.slug}
            href={`/${sport}/players/${p.slug}`}
            className="rounded-card border border-border p-4 transition-colors hover:bg-muted"
          >
            <span className="block font-display text-lg font-semibold">{p.name}</span>
            <span className="block text-sm text-muted-foreground">
              India {p.team === "women" ? "women" : "men"} · {p.roleLabel}
            </span>
          </Link>
        ))}
      </div>

      {officialLabels.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight">Appearances</h2>
          <ComparisonTable
            a={A.name}
            b={B.name}
            rows={officialLabels.map((label) => {
              const va = official(A, label);
              const vb = official(B, label);
              return { group: "Matches", label, a: va?.toLocaleString("en-IN") ?? "—", b: vb?.toLocaleString("en-IN") ?? "—", better: null };
            })}
          />
        </section>
      )}

      {activeFmt && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-xl font-semibold tracking-tight">Head to head</h2>
            <div className="flex gap-2" role="tablist" aria-label="Format">
              {formats.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={f === activeFmt}
                  onClick={() => setFmt(f)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    f === activeFmt ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {FORMAT_LABEL[f]}
                </button>
              ))}
            </div>
          </div>
          <ComparisonTable a={A.name} b={B.name} rows={rows} />
          <p className="text-sm text-muted-foreground">
            Built from Cricsheet ball-by-ball data for India internationals, which covers nearly all of each
            player&rsquo;s matches — totals can sit slightly below official figures; rates are unaffected. Phase and
            vs-top-sides rates need at least 20 overs of data; best spells need 15–25 innings or wickets.
          </p>
        </section>
      )}

      <CompareVote key={`${A.slug}|${B.slug}`} sport={sport} a={A} b={B} onResult={onResult} />

      <div>
        <button
          type="button"
          onClick={() => shareAsPng(A, B, activeFmt, rows, vote.current)}
          className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm text-background"
        >
          Share as image
        </button>
      </div>
    </div>
  );
}

const noopSubscribe = () => () => {};

/** The pair named in ?a=&b=, falling back to the defaults. With only ?a= (from a
 * player profile) that clashes with the default second player, pick the other
 * default or anyone else from the same team. */
function urlPair(
  search: string,
  bySlug: Map<string, ComparePlayer>,
  defaults: [string, string],
  players: ComparePlayer[],
): [string, string] {
  const q = new URLSearchParams(search);
  const qa = q.get("a");
  const qb = q.get("b");
  const a = qa && bySlug.has(qa) ? qa : defaults[0];
  if (qb && bySlug.has(qb) && qb !== a) return [a, qb];
  if (defaults[1] !== a) return [a, defaults[1]];
  const team = bySlug.get(a)?.team;
  const other = defaults[0] !== a ? defaults[0] : players.find((p) => p.slug !== a && p.team === team)?.slug;
  return [a, other ?? defaults[1]];
}

// ponytail: canvas drawing like the XI builder — no html2canvas for a few lines of text.
function shareAsPng(
  A: ComparePlayer,
  B: ComparePlayer,
  fmt: Fmt | null,
  rows: Row[],
  vote: { pa: number; pb: number; total: number },
) {
  const picked = rows.filter((r) => r.a !== "—" || r.b !== "—").slice(0, 8);
  const W = 720;
  const PAD = 40;
  const lineH = 40;
  const H = 190 + picked.length * lineH + (vote.total ? 70 : 0) + 50;
  const canvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#0a0a0a";
  ctx.font = "700 30px system-ui, sans-serif";
  ctx.fillText(`${A.name} vs ${B.name}`, PAD, 64);
  ctx.fillStyle = "#6b7280";
  ctx.font = "400 16px system-ui, sans-serif";
  ctx.fillText(`${fmt ? FORMAT_LABEL[fmt] : "Head to head"} · Indian Sports Club`, PAD, 94);

  const colA = W - PAD - 220;
  const colB = W - PAD;
  ctx.font = "600 15px system-ui, sans-serif";
  ctx.fillStyle = "#0a0a0a";
  ctx.textAlign = "right";
  ctx.fillText(A.name, colA, 140);
  ctx.fillText(B.name, colB, 140);
  picked.forEach((r, i) => {
    const y = 180 + i * lineH;
    ctx.textAlign = "left";
    ctx.fillStyle = "#374151";
    ctx.font = "400 16px system-ui, sans-serif";
    ctx.fillText(r.label, PAD, y);
    ctx.textAlign = "right";
    for (const [side, x] of [["a", colA], ["b", colB]] as const) {
      ctx.fillStyle = r.better === side ? "#0a0a0a" : "#6b7280";
      ctx.font = `${r.better === side ? 700 : 400} 16px system-ui, sans-serif`;
      ctx.fillText(side === "a" ? r.a : r.b, x, y);
    }
  });
  if (vote.total) {
    const y = 180 + picked.length * lineH + 30;
    ctx.textAlign = "left";
    ctx.fillStyle = "#0a0a0a";
    ctx.font = "600 16px system-ui, sans-serif";
    ctx.fillText(`Fans: ${A.name} ${vote.pa}% · ${B.name} ${vote.pb}% (${vote.total} votes)`, PAD, y);
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${A.slug}-vs-${B.slug}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}
