import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SQUAD_SPORTS, sportLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { SquadView } from "@/components/squad-views";

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await params;
  const label = (sportLabel(sport) ?? sport).toLowerCase();
  return pageMeta({ title: `India men's ${label} squad`, description: `Profiles of the India men's ${label} squad, filterable by role.`, path: `/${sport}/players` });
}

export default async function PlayersPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  if (!SQUAD_SPORTS.includes(sport)) notFound();
  return <SquadView sport={sport} team="men" />;
}
