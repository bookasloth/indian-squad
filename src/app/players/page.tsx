import type { Metadata } from "next";
import { PlayersList } from "@/components/PlayersList";

export const metadata: Metadata = {
  title: "Players — Indian Squad",
  description: "Profiles of the Indian cricket squad, filterable by role.",
};

export default function PlayersPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
        <p className="text-muted">The Indian squad. Filter by role.</p>
      </header>
      <PlayersList />
    </div>
  );
}
