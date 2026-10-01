"use client";

import { useSyncExternalStore } from "react";
import { players, type Player } from "@/data/players";
import { ROLE_LABEL } from "@/components/PlayerCard";

const STORAGE_KEY = "indian-squad:xi";
const MAX = 11;

// localStorage-backed store for the selected XI. useSyncExternalStore reads it
// hydration-safely (server renders empty, client swaps in the saved value with
// no mismatch) and avoids setState-in-effect.
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cacheRaw: string | null = null;
let cache: string[] = EMPTY;

function sanitize(value: unknown): string[] {
  if (!Array.isArray(value)) return EMPTY;
  return value
    .filter((s): s is string => typeof s === "string" && players.some((p) => p.slug === s))
    .slice(0, MAX);
}

function getSnapshot(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cacheRaw) return cache; // stable ref unless storage changed
    cacheRaw = raw;
    cache = raw ? sanitize(JSON.parse(raw)) : EMPTY;
  } catch {
    cache = EMPTY; // storage blocked/corrupt → empty
  }
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb); // cross-tab sync
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function setXI(next: string[]) {
  cache = next;
  cacheRaw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, cacheRaw);
  } catch {
    // storage blocked — selection still works for this session
  }
  listeners.forEach((cb) => cb());
}

export function XIBuilder() {
  const selected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle(slug: string) {
    if (selected.includes(slug)) {
      setXI(selected.filter((s) => s !== slug));
    } else if (selected.length < MAX) {
      setXI([...selected, slug]);
    }
  }

  const chosen = selected
    .map((slug) => players.find((p) => p.slug === slug))
    .filter((p): p is Player => Boolean(p));
  const keepers = chosen.filter((p) => p.role === "wicketkeeper").length;
  const valid = chosen.length === MAX && keepers >= 1;

  return (
    <div className="flex flex-col gap-6">
      <StatusBar count={chosen.length} keepers={keepers} valid={valid} />

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
                  : "border-border hover:bg-surface"
              } ${atCap ? "cursor-not-allowed opacity-40" : ""}`}
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold">{player.name}</span>
                <span className={`block text-sm ${isSelected ? "opacity-80" : "text-muted"}`}>
                  {ROLE_LABEL[player.role]}
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
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => shareAsPng(chosen)}
          disabled={!valid}
          className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm text-background disabled:opacity-40"
        >
          Share as image
        </button>
      </div>
    </div>
  );
}

function StatusBar({
  count,
  keepers,
  valid,
}: {
  count: number;
  keepers: number;
  valid: boolean;
}) {
  const msg = valid
    ? "Valid XI — ready to share."
    : count < MAX
      ? `Pick ${MAX - count} more.`
      : keepers < 1
        ? "Add at least one wicketkeeper."
        : "";
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
      <span className="font-heading text-lg font-bold">
        {count}/{MAX}
      </span>
      <span className={`text-sm ${valid ? "text-foreground" : "text-muted"}`}>{msg}</span>
    </div>
  );
}

// ponytail: draw the XI straight onto a canvas and download it — no html2canvas
// dependency for a plain text list. Monochrome, matches the site.
function shareAsPng(chosen: Player[]) {
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
  ctx.fillText("My India Playing XI", PAD, 72);
  ctx.fillStyle = "#6b7280";
  ctx.font = "400 16px system-ui, sans-serif";
  ctx.fillText("indian-squad", PAD, 104);

  chosen.forEach((p, i) => {
    const y = headerH + i * lineH;
    ctx.fillStyle = "#0a0a0a";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.fillText(`${i + 1}.`, PAD, y);
    ctx.fillText(p.name, PAD + 40, y);
    const label = ROLE_LABEL[p.role];
    ctx.fillStyle = "#6b7280";
    ctx.font = "400 16px system-ui, sans-serif";
    ctx.fillText(label, W - PAD - ctx.measureText(label).width, y);
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-india-xi.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}
