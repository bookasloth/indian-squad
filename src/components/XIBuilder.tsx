"use client";

import { useSyncExternalStore } from "react";
import type { SquadPlayer } from "@/data/squads";
import { XI_SIZE as MAX, xiStatus, type XIRule } from "@/lib/xi";

const EMPTY: string[] = [];

// localStorage-backed store for one team's selected XI. useSyncExternalStore reads
// it hydration-safely (server renders empty, client swaps in the saved value with
// no mismatch) and avoids setState-in-effect. One store per storage key (sport +
// team), created on first use and reused across renders.
function makeStore(key: string, pool: SquadPlayer[]) {
  const listeners = new Set<() => void>();
  let cacheRaw: string | null = null;
  let cache: string[] = EMPTY;

  const sanitize = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((s): s is string => typeof s === "string" && pool.some((p) => p.slug === s)).slice(0, MAX)
      : EMPTY;

  return {
    getSnapshot(): string[] {
      try {
        const raw = localStorage.getItem(key);
        if (raw === cacheRaw) return cache; // stable ref unless storage changed
        cacheRaw = raw;
        cache = raw ? sanitize(JSON.parse(raw)) : EMPTY;
      } catch {
        cache = EMPTY; // storage blocked/corrupt → empty
      }
      return cache;
    },
    getServerSnapshot: (): string[] => EMPTY,
    subscribe(cb: () => void): () => void {
      listeners.add(cb);
      window.addEventListener("storage", cb); // cross-tab sync
      return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", cb);
      };
    },
    set(next: string[]) {
      cache = next;
      cacheRaw = JSON.stringify(next);
      try {
        localStorage.setItem(key, cacheRaw);
      } catch {
        // storage blocked — selection still works for this session
      }
      listeners.forEach((cb) => cb());
    },
  };
}

const STORES = new Map<string, ReturnType<typeof makeStore>>();
function storeFor(key: string, pool: SquadPlayer[]) {
  if (!STORES.has(key)) STORES.set(key, makeStore(key, pool));
  return STORES.get(key)!;
}

export function XIBuilder({
  players,
  rules,
  storageKey,
  title,
  fileName,
}: {
  players: SquadPlayer[];
  rules: XIRule[];
  storageKey: string;
  /** Heading on the shared image, e.g. "My India Playing XI". */
  title: string;
  fileName: string;
}) {
  const store = storeFor(storageKey, players);
  const setXI = store.set;
  const selected = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  function toggle(slug: string) {
    // Read the store, not the render's `selected`: two fast taps before a re-render
    // would otherwise both start from the same list and the first pick is lost.
    const cur = store.getSnapshot();
    if (cur.includes(slug)) {
      setXI(cur.filter((s) => s !== slug));
    } else if (cur.length < MAX) {
      setXI([...cur, slug]);
    }
  }

  const chosen = selected
    .map((slug) => players.find((p) => p.slug === slug))
    .filter((p): p is SquadPlayer => Boolean(p));
  const { valid, message } = xiStatus(
    chosen.map((p) => p.role),
    rules,
  );

  return (
    <div className="flex flex-col gap-6">
      <StatusBar count={chosen.length} message={message} valid={valid} />

      <div className="grid gap-3 sm:grid-cols-2">
        {players.map((player) => {
          const isSelected = selected.includes(player.slug);
          const atCap = !isSelected && selected.length >= MAX;
          return (
            <button
              key={player.slug}
              type="button"
              onClick={() => toggle(player.slug)}
              disabled={atCap}
              aria-pressed={isSelected}
              className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-muted"
              } ${atCap ? "cursor-not-allowed opacity-40" : ""}`}
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold">{player.name}</span>
                <span className={`block text-sm ${isSelected ? "opacity-80" : "text-muted-foreground"}`}>
                  {player.roleLabel}
                </span>
              </span>
              <span className="ml-3 text-lg">{isSelected ? "−" : "+"}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setXI([])}
          disabled={selected.length === 0}
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => shareAsPng(chosen, title, fileName)}
          disabled={!valid}
          className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm text-background disabled:opacity-40"
        >
          Share as image
        </button>
      </div>
    </div>
  );
}

function StatusBar({ count, message, valid }: { count: number; message: string; valid: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3">
      <span className="font-display text-lg font-bold">
        {count}/{MAX}
      </span>
      <span className={`text-sm ${valid ? "text-foreground" : "text-muted-foreground"}`}>{message}</span>
    </div>
  );
}

// ponytail: draw the XI straight onto a canvas and download it — no html2canvas
// dependency for a plain text list. Monochrome, matches the site.
function shareAsPng(chosen: SquadPlayer[], title: string, fileName: string) {
  const W = 640;
  const PAD = 48;
  const lineH = 44;
  const headerH = 150;
  const footerH = 64;
  const H = headerH + chosen.length * lineH + footerH;

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
  ctx.font = "700 32px system-ui, sans-serif";
  ctx.fillText(title, PAD, 72);
  ctx.fillStyle = "#6b7280";
  ctx.font = "400 16px system-ui, sans-serif";
  ctx.fillText("Indian Sports Club", PAD, 104);

  chosen.forEach((p, i) => {
    const y = headerH + i * lineH;
    ctx.fillStyle = "#0a0a0a";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.fillText(`${i + 1}.`, PAD, y);
    ctx.fillText(p.name, PAD + 40, y);
    const label = p.roleLabel;
    ctx.fillStyle = "#6b7280";
    ctx.font = "400 16px system-ui, sans-serif";
    ctx.fillText(label, W - PAD - ctx.measureText(label).width, y);
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}
