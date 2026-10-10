"use client";

import { useState } from "react";
import type { SquadPlayer } from "@/data/squads";
import { PlayerCard } from "@/components/PlayerCard";

export function PlayersList({ players, roles }: { players: SquadPlayer[]; roles: { key: string; label: string }[] }) {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? players : players.filter((p) => p.role === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {roles.map((r) => (
          <FilterChip key={r.key} label={r.label} active={filter === r.key} onClick={() => setFilter(r.key)} />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((player) => (
          <PlayerCard key={player.slug} player={player} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
