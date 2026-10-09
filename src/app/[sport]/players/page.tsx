import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SQUAD_SPORTS } from "@/lib/site";
import { PlayersList } from "@/components/PlayersList";

export const metadata: Metadata = {
  title: "Players",
  description: "Profiles of the Indian cricket squad, filterable by role.",
};

export default async function PlayersPage({ params }: { params: Promise<{ sport: string }> }) {
  if (!SQUAD_SPORTS.includes((await params).sport)) notFound();
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
        <p className="text-muted-foreground">The Indian squad. Filter by role.</p>
      </header>
      <PlayersList />
    </div>
  );
}
