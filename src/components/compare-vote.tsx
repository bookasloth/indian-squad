"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { shares } from "@/lib/compare";

/** "Who's better?" — fan vote on a pair. Signed-in members vote; everyone sees the split. */
export function CompareVote({
  sport,
  a,
  b,
  onResult,
}: {
  sport: string;
  a: { slug: string; name: string };
  b: { slug: string; name: string };
  /** Reports the current split, e.g. for the share image. */
  onResult?: (pctA: number, pctB: number, total: number) => void;
}) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "signin" | "error">("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/compare-votes?sport=${sport}&a=${a.slug}&b=${b.slug}`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setCounts(json.counts ?? {});
      setMine(json.mine ?? null);
    } catch {
      // Votes are a bonus; the comparison works without them.
    }
  }, [sport, a.slug, b.slug]);

  // The parent keys this component by pair, so a new pair starts from fresh state.
  // State is only set in the response callback; a stale response is ignored.
  useEffect(() => {
    let ignore = false;
    fetch(`/api/compare-votes?sport=${sport}&a=${a.slug}&b=${b.slug}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (ignore || !json) return;
        setCounts(json.counts ?? {});
        setMine(json.mine ?? null);
      })
      .catch(() => {
        // Votes are a bonus; the comparison works without them.
      });
    return () => {
      ignore = true;
    };
  }, [sport, a.slug, b.slug]);

  const ca = counts[a.slug] ?? 0;
  const cb = counts[b.slug] ?? 0;
  const [pa, pb] = shares(ca, cb);
  useEffect(() => onResult?.(pa, pb, ca + cb), [pa, pb, ca, cb, onResult]);

  async function vote(choice: string) {
    setState("busy");
    const res = await fetch("/api/compare-votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sport, a: a.slug, b: b.slug, choice }),
    }).catch(() => null);
    if (res?.status === 401) return setState("signin");
    if (!res?.ok) return setState("error");
    setState("idle");
    await load();
  }

  return (
    <section className="flex flex-col gap-3 rounded-card border border-border p-5" aria-labelledby="vote-h">
      <h2 id="vote-h" className="font-display text-lg font-semibold tracking-tight">
        Who&rsquo;s better? Fans decide.
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {[a, b].map((p) => (
          <button
            key={p.slug}
            type="button"
            disabled={state === "busy"}
            onClick={() => vote(p.slug)}
            aria-pressed={mine === p.slug}
            className={`rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
              mine === p.slug ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      {ca + cb > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className="bg-foreground" style={{ width: `${pa}%` }} />
          </div>
          <p className="flex justify-between text-sm text-muted-foreground">
            <span>
              {a.name} {pa}%
            </span>
            <span>{ca + cb} vote{ca + cb === 1 ? "" : "s"}</span>
            <span>
              {pb}% {b.name}
            </span>
          </p>
        </div>
      )}
      {state === "signin" && (
        <p className="text-sm">
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>{" "}
          to vote — one vote per fan, and you can change it any time.
        </p>
      )}
      {state === "error" && <p className="text-sm text-muted-foreground">Couldn&rsquo;t save your vote. Try again.</p>}
    </section>
  );
}
