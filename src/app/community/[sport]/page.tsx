import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SPORT_SLUGS, sportLabel } from "@/lib/site";
import { CommunityScreen } from "@/components/community/community-screen";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport } = await params;
  const label = sportLabel(sport);
  return label ? { title: `${label} — Community` } : {};
}

export default async function SportCommunityPage({
  params,
  searchParams,
}: {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { sport } = await params;
  if (!SPORT_SLUGS.includes(sport as never)) notFound();
  const { tab } = await searchParams;
  return <CommunityScreen sport={sport} tab={tab} />;
}
