import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getFeed } from "@/lib/community-data";
import { CommunityFeed } from "@/components/CommunityFeed";

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
  const following = tab === "following";
  const saved = tab === "saved";
  const { posts, viewer, followingIds, configured } = await getFeed({ following, saved });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">
          Talk cricket — and all of Indian sport — with other fans.
        </p>
      </header>

      {configured ? (
        <>
          {viewer && (
            <div className="flex gap-1 border-b border-border">
              <Tab href="/community" active={!following && !saved}>
                Latest
              </Tab>
              <Tab href="/community?tab=following" active={following}>
                Following
              </Tab>
              <Tab href="/community?tab=saved" active={saved}>
                Saved
              </Tab>
            </div>
          )}
          {following && posts.length === 0 ? (
            <p className="text-muted-foreground">
              Nothing here yet. Follow some fans to fill your Following feed.
            </p>
          ) : saved && posts.length === 0 ? (
            <p className="text-muted-foreground">No saved posts yet. Tap the bookmark on any post.</p>
          ) : (
            <CommunityFeed
              initialPosts={posts}
              viewer={viewer}
              followingIds={followingIds}
              flat={saved}
            />
          )}
        </>
      ) : (
        <p className="rounded-card border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          The community feed isn&apos;t configured yet. Set the Supabase environment variables and
          apply the migrations to enable it.
        </p>
      )}
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "-mb-px border-b-2 px-4 py-2 text-sm transition-ui",
        active
          ? "border-foreground font-semibold text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
