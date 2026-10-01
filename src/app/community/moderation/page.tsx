import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberContext } from "@/lib/members/session";
import { getOpenReports } from "@/lib/community-data";
import { ModerationList } from "@/components/community/moderation-list";

export const metadata: Metadata = { title: "Moderation", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const { role } = await getMemberContext();
  if (role !== "admin") notFound();

  const reports = await getOpenReports();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">Moderation</h1>
        <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground">
          ← Feed
        </Link>
      </header>
      <ModerationList reports={reports} />
    </div>
  );
}
