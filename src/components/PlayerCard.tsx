import Link from "next/link";
import type { SquadPlayer } from "@/data/squads";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export function PlayerCard({ player }: { player: SquadPlayer }) {
  return (
    <Link
      href={`/${player.sport}/players/${player.slug}`}
      className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted font-display text-sm font-semibold">
        {initials(player.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold">{player.name}</span>
        <span className="block text-sm text-muted-foreground">{player.subtitle}</span>
      </span>
    </Link>
  );
}
