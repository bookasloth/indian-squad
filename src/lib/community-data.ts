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
  reblogs: { count: number }[];
};

const POST_SELECT =
  "id, body, parent_id, created_at, author_name, user_id, " +
  "author:is_profiles!is_posts_user_id_fkey(username, display_name, avatar_url), " +
  "likes:is_post_reactions(count), reblogs:is_reblogs(count)";

type ViewerSets = {
  likedIds: Set<string>;
  bookmarkedIds: Set<string>;
  rebloggedIds: Set<string>;
};

function mapPostRow(r: PostRow, sets: ViewerSets): CommunityPost {
  const displayName =
    r.author?.display_name?.trim() || r.author?.username || r.author_name || "Member";
  return {
    rowId: r.id,
    id: r.id,
    body: r.body,
    parentId: r.parent_id,
    createdAt: r.created_at,
    userId: r.user_id,
    authorName: displayName,
    username: r.author?.username ?? null,
    avatarUrl: r.author?.avatar_url ?? null,
    likeCount: r.likes?.[0]?.count ?? 0,
    likedByViewer: sets.likedIds.has(r.id),
    bookmarkedByViewer: sets.bookmarkedIds.has(r.id),
    reblogCount: r.reblogs?.[0]?.count ?? 0,
    rebloggedByViewer: sets.rebloggedIds.has(r.id),
    rebloggedBy: null,
  };
}

export async function getFeed(opts?: { following?: boolean; saved?: boolean }): Promise<{
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
  const bookmarkedIds = new Set<string>();
  const rebloggedIds = new Set<string>();
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

    const { data: bms } = await sb.from("is_bookmarks").select("post_id").eq("user_id", user.id);
    for (const r of bms ?? []) bookmarkedIds.add(r.post_id as string);

    const { data: rbs } = await sb.from("is_reblogs").select("post_id").eq("user_id", user.id);
    for (const r of rbs ?? []) rebloggedIds.add(r.post_id as string);
  }

  const sets: ViewerSets = { likedIds, bookmarkedIds, rebloggedIds };
  let query = sb.from("is_posts").select(POST_SELECT).is("deleted_at", null);

  // "Following" feed: only posts from people you follow, plus your own.
  if (opts?.following && user) {
    query = query.in("user_id", [...followingIds, user.id]);
  }
  // "Saved" feed: only posts you've bookmarked.
  if (opts?.saved && user) {
    query = query.in("id", bookmarkedIds.size ? [...bookmarkedIds] : ["00000000-0000-0000-0000-000000000000"]);
  }

  const { data } = await query.order("created_at", { ascending: true });
  const base = ((data as PostRow[] | null) ?? []).map((r) => mapPostRow(r, sets));

  // Surface reblogs as extra feed rows in the main feed (not in following/saved).
  let reblogRows: CommunityPost[] = [];
  if (!opts?.following && !opts?.saved) {
    type RbRow = {
      created_at: string;
      reblogger: { username: string | null } | null;
      source: (PostRow & { deleted_at: string | null }) | null;
    };
    const { data: rbData } = await sb
      .from("is_reblogs")
      .select(
        "created_at, reblogger:is_profiles!is_reblogs_user_id_fkey(username), " +
          `source:is_posts!is_reblogs_post_id_fkey(${POST_SELECT}, deleted_at)`,
      )
      .order("created_at", { ascending: false })
      .limit(50);
    reblogRows = ((rbData as RbRow[] | null) ?? [])
      .filter((r) => r.source && r.source.deleted_at === null && r.source.parent_id === null)
      .map((r) => {
        const mapped = mapPostRow(r.source as PostRow, sets);
        return {
          ...mapped,
          rowId: `rb:${r.reblogger?.username}:${mapped.id}`,
          rebloggedBy: r.reblogger?.username ?? null,
          createdAt: r.created_at,
        };
      });
  }

  return { posts: [...base, ...reblogRows], viewer, followingIds, configured: true };
}

export interface ProfileView {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  followerCount: number;
  followingCount: number;
  viewerFollows: boolean;
  isSelf: boolean;
}

export async function getProfile(username: string): Promise<{
  profile: ProfileView | null;
  posts: CommunityPost[];
  viewer: Viewer | null;
  followingIds: string[];
  configured: boolean;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { profile: null, posts: [], viewer: null, followingIds: [], configured: false };
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  const { data: prof } = await sb
    .from("is_profiles")
    .select("id, username, display_name, avatar_url, bio")
    .eq("username", username)
    .maybeSingle();

  if (!prof) {
    return { profile: null, posts: [], viewer: null, followingIds: [], configured: true };
  }

  const [{ count: followerCount }, { count: followingCount }] = await Promise.all([
    sb.from("is_follows").select("follower_id", { count: "exact", head: true }).eq("followee_id", prof.id),
    sb.from("is_follows").select("followee_id", { count: "exact", head: true }).eq("follower_id", prof.id),
  ]);

  let viewer: Viewer | null = null;
  const likedIds = new Set<string>();
  const bookmarkedIds = new Set<string>();
  const rebloggedIds = new Set<string>();
  const followingIds: string[] = [];
  let viewerFollows = false;

  if (user) {
    const { data: vp } = await sb
      .from("is_profiles")
      .select("username, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    const fallback = user.email?.split("@")[0] ?? "me";
    viewer = {
      userId: user.id,
      username: vp?.username ?? fallback,
      displayName: vp?.display_name?.trim() || vp?.username || fallback,
      avatarUrl: vp?.avatar_url ?? null,
    };
    const [{ data: likes }, { data: bms }, { data: follows }, { data: rbs }] = await Promise.all([
      sb.from("is_post_reactions").select("post_id").eq("user_id", user.id),
      sb.from("is_bookmarks").select("post_id").eq("user_id", user.id),
      sb.from("is_follows").select("followee_id").eq("follower_id", user.id),
      sb.from("is_reblogs").select("post_id").eq("user_id", user.id),
    ]);
    for (const r of likes ?? []) likedIds.add(r.post_id as string);
    for (const r of bms ?? []) bookmarkedIds.add(r.post_id as string);
    for (const r of follows ?? []) followingIds.push(r.followee_id as string);
    for (const r of rbs ?? []) rebloggedIds.add(r.post_id as string);
    viewerFollows = followingIds.includes(prof.id as string);
  }

  const { data } = await sb
    .from("is_posts")
    .select(POST_SELECT)
    .eq("user_id", prof.id)
    .is("parent_id", null)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const sets: ViewerSets = { likedIds, bookmarkedIds, rebloggedIds };
  const posts = ((data as PostRow[] | null) ?? []).map((r) => mapPostRow(r, sets));

  const profile: ProfileView = {
    userId: prof.id as string,
    username: prof.username as string,
    displayName: (prof.display_name as string | null)?.trim() || (prof.username as string),
    avatarUrl: (prof.avatar_url as string | null) ?? null,
    bio: (prof.bio as string | null) ?? null,
    followerCount: followerCount ?? 0,
    followingCount: followingCount ?? 0,
    viewerFollows,
    isSelf: user?.id === prof.id,
  };

  return { profile, posts, viewer, followingIds, configured: true };
}
