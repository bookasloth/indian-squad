import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SQUAD_SPORTS } from "@/lib/site";
import { SquadView } from "@/components/squad-views";

export const metadata: Metadata = {
  title: "India women's squad",
  description: "Profiles of the India women's cricket squad, filterable by role.",
};

export default async function WomenPlayersPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  if (!SQUAD_SPORTS.includes(sport)) notFound();
  return <SquadView sport={sport} team="women" />;
}
