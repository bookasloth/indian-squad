import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/community-data";
import { getMemberContext } from "@/lib/members/session";
import { CommunityFeed } from "@/components/CommunityFeed";
import { CommunityAvatar } from "@/components/community/community-avatar";
import { ProfileFollowButton } from "@/components/community/profile-follow-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { profile, posts, viewer, followingIds, configured } = await getProfile(username);
  const { role } = await getMemberContext();

  if (!configured) {
    return (
      <p className="rounded-card border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
        The community isn&apos;t configured yet.
      </p>
    );
  }
  if (!profile) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground">
        ← Feed
      </Link>

      <header className="flex items-start gap-4">
        <CommunityAvatar seed={profile.username} src={profile.avatarUrl} size={64} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">{profile.displayName}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          {profile.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{profile.followerCount}</span> followers
            {" · "}
            <span className="font-semibold text-foreground">{profile.followingCount}</span> following
          </p>
        </div>
        {viewer && !profile.isSelf && (
          <ProfileFollowButton followeeId={profile.userId} initialFollowing={profile.viewerFollows} />
        )}
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <CommunityFeed
          initialPosts={posts}
          viewer={viewer}
          followingIds={followingIds}
          flat
          isAdmin={role === "admin"}
        />
      )}
    </div>
  );
}
