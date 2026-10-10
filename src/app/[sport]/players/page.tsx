import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sportLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { squadConfig } from "@/data/squads";
import { SquadView } from "@/components/squad-views";

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await params;
  const label = (sportLabel(sport) ?? sport).toLowerCase();
  return pageMeta({
    title: `India men's ${label} squad`,
    description: `Profiles of the India men's ${label} squad, filterable by ${squadConfig(sport)?.roleNoun ?? "role"}.`,
    path: `/${sport}/players`,
  });
}

export default async function PlayersPage({ params }: { params: Promise<{ sport: string }> }) {
  const config = squadConfig((await params).sport);
  if (!config) notFound();
  return <SquadView config={config} team="men" />;
}
