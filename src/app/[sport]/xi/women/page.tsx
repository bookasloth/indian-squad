import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SQUAD_SPORTS } from "@/lib/site";
import { XIView } from "@/components/squad-views";

export const metadata: Metadata = {
  title: "Women's Playing XI",
  description: "Pick your India women's Playing XI, validate the squad, and share it as an image.",
};

export default async function WomenXIPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  if (!SQUAD_SPORTS.includes(sport)) notFound();
  return <XIView sport={sport} team="women" />;
}
