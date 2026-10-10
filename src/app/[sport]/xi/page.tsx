import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sportLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { squadConfig } from "@/data/squads";
import { XIView } from "@/components/squad-views";

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await params;
  const label = (sportLabel(sport) ?? sport).toLowerCase();
  const xi = squadConfig(sport)?.xiLabel ?? "Playing XI";
  return pageMeta({
    title: `India men's ${label} ${xi}`,
    description: `Pick your India men's ${label} ${xi}, check the balance, and share it as an image.`,
    path: `/${sport}/xi`,
  });
}

export default async function XIPage({ params }: { params: Promise<{ sport: string }> }) {
  const config = squadConfig((await params).sport);
  if (!config) notFound();
  return <XIView config={config} team="men" />;
}
