import Link from "next/link";
import { cn } from "@/lib/utils";
import { SPORTS, sportLabel } from "@/lib/site";
import { getFeed } from "@/lib/community-data";
import { getMemberContext } from "@/lib/members/session";
import { CommunityFeed } from "@/components/CommunityFeed";
import { SportEmblem } from "@/components/community/sport-emblem";

export async function CommunityScreen({ sport, tab }: { sport?: string; tab?: string }) {
  const following = tab === "following";
  const saved = tab === "saved";
  const { posts, viewer, followingIds, configured } = await getFeed({ following, saved, sport });
  const { role } = await getMemberContext();
  const isAdmin = role === "admin";

  const base = sport ? `/community/${sport}` : "/community";
  const heading = sport ? `${sportLabel(sport)} community` : "Community";

  if (!configured) {
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

  return (
    <div className="flex flex-col gap-6" data-sport={sport || undefined}>
      {sport ? (
        <header className="flex items-center gap-4 overflow-hidden rounded-card border border-border bg-[color-mix(in_srgb,var(--brand)_10%,transparent)] p-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand)_18%,transparent)]">
            <SportEmblem sport={sport} size={34} />
          </span>
          <div className="flex flex-col gap-0.5">
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

      {/* Sport chips */}
      <nav className="flex flex-wrap gap-2">
        <SportChip href="/community" active={!sport}>
          All
        </SportChip>
        {SPORTS.map((s) => (
          <SportChip key={s.slug} href={`/community/${s.slug}`} active={sport === s.slug}>
            {s.label}
          </SportChip>
        ))}
      </nav>

      {viewer && (
        <div className="flex gap-1 border-b border-border">
          <Tab href={base} active={!following && !saved}>
            Latest
          </Tab>
          <Tab href={`${base}?tab=following`} active={following}>
            Following
          </Tab>
          <Tab href={`${base}?tab=saved`} active={saved}>
            Saved
          </Tab>
          {isAdmin && (
            <Tab href="/community/moderation" active={false}>
              Moderation
            </Tab>
          )}
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
          isAdmin={isAdmin}
          defaultSport={sport ?? "cricket"}
        />
      )}
    </div>
  );
}

function SportChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-ui",
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border text-muted-foreground hover:bg-accent",
      )}
    >
      {children}
    </Link>
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
