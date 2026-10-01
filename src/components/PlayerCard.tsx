import Link from "next/link";
import type { Player } from "@/data/players";

const ROLE_LABEL: Record<Player["role"], string> = {
  batter: "Batter",
  bowler: "Bowler",
  "all-rounder": "All-rounder",
  wicketkeeper: "Wicketkeeper",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/players/${player.slug}`}
      className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-surface"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface font-heading text-sm font-semibold">
        {initials(player.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold">{player.name}</span>
        <span className="block text-sm text-muted">
          {ROLE_LABEL[player.role]} · {player.battingStyle}
        </span>
      </span>
    </Link>
  );
}

export { ROLE_LABEL };
