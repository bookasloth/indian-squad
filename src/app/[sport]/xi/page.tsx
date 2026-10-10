import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SQUAD_SPORTS, sportLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { XIView } from "@/components/squad-views";

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await params;
  const label = (sportLabel(sport) ?? sport).toLowerCase();
  return pageMeta({ title: `India men's ${label} Playing XI`, description: "Pick your India men's Playing XI, check the balance, and share it as an image.", path: `/${sport}/xi` });
}

export default async function XIPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  if (!SQUAD_SPORTS.includes(sport)) notFound();
  return <XIView sport={sport} team="men" />;
}
