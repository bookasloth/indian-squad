import type { Metadata } from "next";
import { CommunityScreen } from "@/components/community/community-screen";

export const metadata: Metadata = {
  title: "Community",
  description: "Talk Indian sport with other fans.",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <CommunityScreen tab={tab} />;
}
