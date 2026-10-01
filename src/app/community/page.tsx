import type { Metadata } from "next";
import { getFeed } from "@/lib/community-data";
import { CommunityFeed } from "@/components/CommunityFeed";

export const metadata: Metadata = {
  title: "Community",
  description: "Talk Indian sport with other fans.",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const { posts, viewer, configured } = await getFeed();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">
          Talk cricket — and all of Indian sport — with other fans.
        </p>
      </header>

      {configured ? (
        <CommunityFeed initialPosts={posts} viewer={viewer} />
      ) : (
        <p className="rounded-card border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          The community feed isn&apos;t configured yet. Set the Supabase environment variables and
          apply the migrations to enable it.
        </p>
      )}
    </div>
  );
}
