import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CommunityPost, Viewer } from "@/data/community";

type ProfileEmbed = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
} | null;

type PostRow = {
  id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  author_name: string | null;
  user_id: string | null;
  author: ProfileEmbed;
  likes: { count: number }[];
};

const POST_SELECT =
  "id, body, parent_id, created_at, author_name, user_id, " +
  "author:is_profiles!is_posts_user_id_fkey(username, display_name, avatar_url), " +
  "likes:is_post_reactions(count)";

export async function getFeed(opts?: { following?: boolean }): Promise<{
  posts: CommunityPost[];
  viewer: Viewer | null;
  followingIds: string[];
  configured: boolean;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { posts: [], viewer: null, followingIds: [], configured: false };
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  let viewer: Viewer | null = null;
  const likedIds = new Set<string>();
  const followingIds: string[] = [];

  if (user) {
    const { data: prof } = await sb
      .from("is_profiles")
      .select("username, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    const fallback = user.email?.split("@")[0] ?? "me";
    viewer = {
      userId: user.id,
      username: prof?.username ?? fallback,
      displayName: prof?.display_name?.trim() || prof?.username || fallback,
      avatarUrl: prof?.avatar_url ?? null,
    };
    const { data: likes } = await sb
      .from("is_post_reactions")
      .select("post_id")
      .eq("user_id", user.id);
    for (const r of likes ?? []) likedIds.add(r.post_id as string);

    const { data: follows } = await sb
      .from("is_follows")
      .select("followee_id")
      .eq("follower_id", user.id);
    for (const r of follows ?? []) followingIds.push(r.followee_id as string);
  }

  let query = sb.from("is_posts").select(POST_SELECT).is("deleted_at", null);

  // "Following" feed: only posts from people you follow, plus your own.
  if (opts?.following && user) {
    query = query.in("user_id", [...followingIds, user.id]);
  }

  const { data } = await query.order("created_at", { ascending: true });

  const posts = ((data as PostRow[] | null) ?? []).map((r): CommunityPost => {
    const displayName =
      r.author?.display_name?.trim() || r.author?.username || r.author_name || "Member";
    return {
      id: r.id,
      body: r.body,
      parentId: r.parent_id,
      createdAt: r.created_at,
      userId: r.user_id,
      authorName: displayName,
      username: r.author?.username ?? null,
      avatarUrl: r.author?.avatar_url ?? null,
      likeCount: r.likes?.[0]?.count ?? 0,
      likedByViewer: likedIds.has(r.id),
    };
  });

  return { posts, viewer, followingIds, configured: true };
}
