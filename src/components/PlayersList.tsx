"use client";

import { useState } from "react";
import { players, ROLES, type Role } from "@/data/players";
import { PlayerCard, ROLE_LABEL } from "@/components/PlayerCard";

type Filter = Role | "all";

export function PlayersList() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? players : players.filter((p) => p.role === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {ROLES.map((role) => (
          <FilterChip
            key={role}
            label={ROLE_LABEL[role]}
            active={filter === role}
            onClick={() => setFilter(role)}
          />
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
          : "border-border text-muted hover:bg-surface"
      }`}
    >
      {label}
    </button>
  );
}
