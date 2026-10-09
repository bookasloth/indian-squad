import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, supabaseAdmin, supabaseAnon } from "@/lib/supabase/server";
import { getMemberContext } from "@/lib/members/session";
import type { CommunityPost, Viewer, PollOption } from "@/data/community";

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
  poll: PollEmbed;
  images: string[] | null;
  sport: string | null;
};

type PollEmbed =
  | { options: PollOption[]; closes_at: string | null }
  | { options: PollOption[]; closes_at: string | null }[]
  | null;

const POST_SELECT =
  "id, body, parent_id, created_at, author_name, user_id, images, sport, " +
  "author:is_profiles!is_posts_user_id_fkey(username, display_name, avatar_url), " +
  "likes:is_post_reactions(count), reblogs:is_reblogs(count), poll:is_polls(options, closes_at)";

type ViewerSets = {
  likedIds: Set<string>;
  bookmarkedIds: Set<string>;
  rebloggedIds: Set<string>;
};

function mapPostRow(r: PostRow, sets: ViewerSets): CommunityPost {
  const displayName =
    r.author?.display_name?.trim() || r.author?.username || r.author_name || "Member";
  const pollEmbed = Array.isArray(r.poll) ? (r.poll[0] ?? null) : r.poll;
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
    images: r.images ?? null,
    sport: r.sport ?? null,
    poll: pollEmbed
      ? {
          options: pollEmbed.options,
          closesAt: pollEmbed.closes_at,
          closed: pollEmbed.closes_at ? new Date(pollEmbed.closes_at) < new Date() : false,
          counts: {},
          total: 0,
          viewerChoice: null,
        }
      : null,
  };
}

/** Fill poll vote tallies + the viewer's choice for the posts that carry a poll. */
async function fillPolls(
  posts: CommunityPost[],
  sb: SupabaseClient,
  userId: string | null,
): Promise<void> {
  const ids = posts.filter((p) => p.poll).map((p) => p.id);
  if (ids.length === 0) return;
  const { data: votes } = await sb
    .from("is_poll_votes")
    .select("post_id, option_index, user_id")
    .in("post_id", ids);

  const byPost = new Map<string, { counts: Record<number, number>; total: number; mine: number | null }>();
  for (const v of votes ?? []) {
    const pid = v.post_id as string;
    const e = byPost.get(pid) ?? { counts: {}, total: 0, mine: null };
    const idx = v.option_index as number;
    e.counts[idx] = (e.counts[idx] ?? 0) + 1;
    e.total++;
    if (userId && v.user_id === userId) e.mine = idx;
    byPost.set(pid, e);
  }
  for (const p of posts) {
    if (!p.poll) continue;
    const e = byPost.get(p.id);
    if (e) {
      p.poll.counts = e.counts;
      p.poll.total = e.total;
      p.poll.viewerChoice = e.mine;
    }
  }
}

export async function getFeed(opts?: {
  following?: boolean;
  saved?: boolean;
  sport?: string;
}): Promise<{
  posts: CommunityPost[];
  viewer: Viewer | null;
  followingIds: string[];
  configured: boolean;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { posts: [], viewer: null, followingIds: [], configured: false };
  }

  // Same validated user the rest of the render already looked up (React cache) —
  // no extra Supabase Auth round-trip.
  const [sb, { user }] = await Promise.all([createClient(), getMemberContext()]);

  let viewer: Viewer | null = null;
  const likedIds = new Set<string>();
  const bookmarkedIds = new Set<string>();
  const rebloggedIds = new Set<string>();
  const followingIds: string[] = [];

  type RbRow = {
    created_at: string;
    reblogger: { username: string | null } | null;
    source: (PostRow & { deleted_at: string | null }) | null;
  };
  // Surface reblogs as extra feed rows in the main feed (not in following/saved).
  const withReblogs = !opts?.following && !opts?.saved;

  // Posts + reblog rows. Reads followingIds/bookmarkedIds at call time, so the
  // following/saved feeds call it after the viewer lookups below.
  const fetchPosts = () => {
    let query = sb.from("is_posts").select(POST_SELECT).is("deleted_at", null);
    // Per-sport feed.
    if (opts?.sport) {
      query = query.eq("sport", opts.sport);
    }
    // "Following" feed: only posts from people you follow, plus your own.
    if (opts?.following && user) {
      query = query.in("user_id", [...followingIds, user.id]);
    }
    // "Saved" feed: only posts you've bookmarked.
    if (opts?.saved && user) {
      query = query.in("id", bookmarkedIds.size ? [...bookmarkedIds] : ["00000000-0000-0000-0000-000000000000"]);
    }
    return Promise.all([
      query.order("created_at", { ascending: true }),
      withReblogs
        ? sb
            .from("is_reblogs")
            .select(
              "created_at, reblogger:is_profiles!is_reblogs_user_id_fkey(username), " +
                `source:is_posts!is_reblogs_post_id_fkey(${POST_SELECT}, deleted_at)`,
            )
            .order("created_at", { ascending: false })
            .limit(50)
        : Promise.resolve({ data: null }),
    ]);
  };
  // The main and per-sport feeds don't filter on viewer data: start them now, in
  // parallel with the viewer lookups, instead of after.
  const early = withReblogs ? fetchPosts() : null;

  if (user) {
    const [{ data: prof }, { data: likes }, { data: follows }, { data: bms }, { data: rbs }] = await Promise.all([
      sb.from("is_profiles").select("username, display_name, avatar_url").eq("id", user.id).maybeSingle(),
      sb.from("is_post_reactions").select("post_id").eq("user_id", user.id),
      sb.from("is_follows").select("followee_id").eq("follower_id", user.id),
      sb.from("is_bookmarks").select("post_id").eq("user_id", user.id),
      sb.from("is_reblogs").select("post_id").eq("user_id", user.id),
    ]);
    const fallback = user.email?.split("@")[0] ?? "me";
    viewer = {
      userId: user.id,
      username: prof?.username ?? fallback,
      displayName: prof?.display_name?.trim() || prof?.username || fallback,
      avatarUrl: prof?.avatar_url ?? null,
    };
    for (const r of likes ?? []) likedIds.add(r.post_id as string);
    for (const r of follows ?? []) followingIds.push(r.followee_id as string);
    for (const r of bms ?? []) bookmarkedIds.add(r.post_id as string);
    for (const r of rbs ?? []) rebloggedIds.add(r.post_id as string);
  }

  const sets: ViewerSets = { likedIds, bookmarkedIds, rebloggedIds };
  const [{ data }, { data: rbData }] = await (early ?? fetchPosts());
  const base = ((data as PostRow[] | null) ?? []).map((r) => mapPostRow(r, sets));

  let reblogRows: CommunityPost[] = [];
  if (withReblogs) {
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

  const posts = [...base, ...reblogRows];
  await fillPolls(posts, sb, user?.id ?? null);
  return { posts, viewer, followingIds, configured: true };
}

export interface LatestPost {
  id: string;
  body: string;
  createdAt: string;
  authorName: string;
  username: string | null;
  avatarUrl: string | null;
}

/** Newest top-level posts for a sport hub's preview. Anon client (public reads, no
 * cookies) so the hub can prerender and revalidate; no viewer state needed. */
export async function getLatestPosts(sport: string, limit = 3): Promise<LatestPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const { data } = await supabaseAnon()
    .from("is_posts")
    .select("id, body, created_at, author_name, author:is_profiles!is_posts_user_id_fkey(username, display_name, avatar_url)")
    .eq("sport", sport)
    .is("parent_id", null)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  type Row = { id: string; body: string; created_at: string; author_name: string | null; author: ProfileEmbed };
  return ((data as Row[] | null) ?? []).map((r) => ({
    id: r.id,
    body: r.body,
    createdAt: r.created_at,
    authorName: r.author?.display_name?.trim() || r.author?.username || r.author_name || "Member",
    username: r.author?.username ?? null,
    avatarUrl: r.author?.avatar_url ?? null,
  }));
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

  // Same validated user the rest of the render already looked up (React cache) —
  // no extra Supabase Auth round-trip.
  const [sb, { user }] = await Promise.all([createClient(), getMemberContext()]);

  const { data: prof } = await sb
    .from("is_profiles")
    .select("id, username, display_name, avatar_url, bio")
    .eq("username", username)
    .maybeSingle();

  if (!prof) {
    return { profile: null, posts: [], viewer: null, followingIds: [], configured: true };
  }

  const none = Promise.resolve({ data: null });
  // Everything else needs only prof.id / user.id: one parallel round.
  const [
    { count: followerCount },
    { count: followingCount },
    { data },
    { data: vp },
    { data: likes },
    { data: bms },
    { data: follows },
    { data: rbs },
  ] = await Promise.all([
    sb.from("is_follows").select("follower_id", { count: "exact", head: true }).eq("followee_id", prof.id),
    sb.from("is_follows").select("followee_id", { count: "exact", head: true }).eq("follower_id", prof.id),
    sb
      .from("is_posts")
      .select(POST_SELECT)
      .eq("user_id", prof.id)
      .is("parent_id", null)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    user ? sb.from("is_profiles").select("username, display_name, avatar_url").eq("id", user.id).maybeSingle() : none,
    user ? sb.from("is_post_reactions").select("post_id").eq("user_id", user.id) : none,
    user ? sb.from("is_bookmarks").select("post_id").eq("user_id", user.id) : none,
    user ? sb.from("is_follows").select("followee_id").eq("follower_id", user.id) : none,
    user ? sb.from("is_reblogs").select("post_id").eq("user_id", user.id) : none,
  ]);

  let viewer: Viewer | null = null;
  const likedIds = new Set<string>();
  const bookmarkedIds = new Set<string>();
  const rebloggedIds = new Set<string>();
  const followingIds: string[] = [];
  let viewerFollows = false;

  if (user) {
    const fallback = user.email?.split("@")[0] ?? "me";
    viewer = {
      userId: user.id,
      username: vp?.username ?? fallback,
      displayName: vp?.display_name?.trim() || vp?.username || fallback,
      avatarUrl: vp?.avatar_url ?? null,
    };
    for (const r of likes ?? []) likedIds.add(r.post_id as string);
    for (const r of bms ?? []) bookmarkedIds.add(r.post_id as string);
    for (const r of follows ?? []) followingIds.push(r.followee_id as string);
    for (const r of rbs ?? []) rebloggedIds.add(r.post_id as string);
    viewerFollows = followingIds.includes(prof.id as string);
  }

  const sets: ViewerSets = { likedIds, bookmarkedIds, rebloggedIds };
  const posts = ((data as PostRow[] | null) ?? []).map((r) => mapPostRow(r, sets));
  await fillPolls(posts, sb, user?.id ?? null);

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

export interface OpenReport {
  id: string;
  reason: string | null;
  createdAt: string;
  postId: string | null;
  postBody: string;
  authorUsername: string | null;
  reporterUsername: string | null;
}

type ReportRow = {
  id: string;
  reason: string | null;
  created_at: string;
  post: { id: string; body: string; author: { username: string | null } | null } | null;
  reporter: { username: string | null } | null;
};

/** Open reports for admin review (service-role; call only from an admin-gated page). */
export async function getOpenReports(): Promise<OpenReport[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const { data } = await supabaseAdmin()
    .from("is_reports")
    .select(
      "id, reason, created_at, " +
        "post:is_posts!is_reports_post_id_fkey(id, body, author:is_profiles!is_posts_user_id_fkey(username)), " +
        "reporter:is_profiles!is_reports_reporter_id_fkey(username)",
    )
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(100);

  return ((data as ReportRow[] | null) ?? []).map((r) => ({
    id: r.id,
    reason: r.reason,
    createdAt: r.created_at,
    postId: r.post?.id ?? null,
    postBody: r.post?.body ?? "(removed)",
    authorUsername: r.post?.author?.username ?? null,
    reporterUsername: r.reporter?.username ?? null,
  }));
}
