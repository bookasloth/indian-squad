import { Suspense } from "react";
import { SPORTS, sportLabel } from "@/lib/site";
import { getFeed } from "@/lib/community-data";
import { getMemberContext } from "@/lib/members/session";
import { CommunityFeed } from "@/components/CommunityFeed";
import { PillNav } from "@/components/layout/pill-nav";
import { SportEmblem } from "@/components/community/sport-emblem";
import { FeedSkeleton } from "@/components/layout/page-skeletons";

export async function CommunityScreen({ sport, tab }: { sport?: string; tab?: string }) {
  const following = tab === "following";
  const saved = tab === "saved";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Community</h1>
        <p className="rounded-card border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          The community feed isn&apos;t configured yet. Set the Supabase environment variables and
          apply the migrations to enable it.
        </p>
      </div>
    );
  }

  // Only the (cached) auth lookup gates the chrome; the feed streams in below it.
  const { user, role } = await getMemberContext();
  const isAdmin = role === "admin";

  const base = sport ? `/community/${sport}` : "/community";
  const heading = sport ? `${sportLabel(sport)} community` : "Community";
  const activeTab = following ? `${base}?tab=following` : saved ? `${base}?tab=saved` : base;

  return (
    <div className="flex flex-col gap-6" data-sport={sport || undefined}>
      {sport ? (
        <header className="sport-hero anim-fade-up flex items-center gap-4 overflow-hidden rounded-card border border-border bg-[color-mix(in_srgb,var(--brand)_10%,transparent)] p-5">
          <SportEmblem sport={sport} size={150} className="sport-hero-mark" />
          <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand)_18%,transparent)]">
            <SportEmblem sport={sport} size={34} />
          </span>
          <div className="relative flex flex-col gap-0.5">
            <h1 className="font-display text-2xl font-bold tracking-tight">{heading}</h1>
            <p className="text-sm text-muted-foreground">Talk {sportLabel(sport)} with other fans.</p>
          </div>
        </header>
      ) : (
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">{heading}</h1>
          <p className="text-muted-foreground">
            Talk cricket — and all of Indian sport — with other fans.
          </p>
        </header>
      )}

      <PillNav
        variant="chips"
        active={base}
        items={[{ href: "/community", label: "All" }, ...SPORTS.map((s) => ({ href: `/community/${s.slug}`, label: s.label }))]}
      />

      {user && (
        <PillNav
          variant="tabs"
          active={activeTab}
          items={[
            { href: base, label: "Latest" },
            { href: `${base}?tab=following`, label: "Following" },
            { href: `${base}?tab=saved`, label: "Saved" },
            ...(isAdmin ? [{ href: "/community/moderation", label: "Moderation" }] : []),
          ]}
        />
      )}

      {/* Keyed so switching sport/tab shows the skeleton for the new feed instead of
          holding the old one on screen while the server works. */}
      <Suspense key={`${sport ?? ""}:${tab ?? ""}`} fallback={<FeedSkeleton />}>
        <Feed sport={sport} following={following} saved={saved} isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}

async function Feed({
  sport,
  following,
  saved,
  isAdmin,
}: {
  sport?: string;
  following: boolean;
  saved: boolean;
  isAdmin: boolean;
}) {
  const { posts, viewer, followingIds } = await getFeed({ following, saved, sport });

  if (following && posts.length === 0) {
    return <p className="text-muted-foreground">Nothing here yet. Follow some fans to fill your Following feed.</p>;
  }
  if (saved && posts.length === 0) {
    return <p className="text-muted-foreground">No saved posts yet. Tap the bookmark on any post.</p>;
  }
  return (
    <CommunityFeed
      initialPosts={posts}
      viewer={viewer}
      followingIds={followingIds}
      flat={saved}
      isAdmin={isAdmin}
      defaultSport={sport ?? "cricket"}
    />
  );
}
