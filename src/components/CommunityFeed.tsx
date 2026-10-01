"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark, Repeat2 } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommunityAvatar } from "@/components/community/community-avatar";
import { type CommunityPost, type Viewer, BODY_MAX, sanitize } from "@/data/community";

export function CommunityFeed({
  initialPosts,
  viewer,
  followingIds = [],
  flat = false,
}: {
  initialPosts: CommunityPost[];
  viewer: Viewer | null;
  followingIds?: string[];
  flat?: boolean;
}) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [following, setFollowing] = useState<Set<string>>(() => new Set(followingIds));
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleFollow(followeeId: string) {
    if (!viewer) {
      setError("Sign in to follow.");
      return;
    }
    const next = !following.has(followeeId);
    setFollowing((cur) => {
      const s = new Set(cur);
      if (next) s.add(followeeId);
      else s.delete(followeeId);
      return s;
    });
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followeeId, follow: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setFollowing((cur) => {
        const s = new Set(cur);
        if (next) s.delete(followeeId);
        else s.add(followeeId);
        return s;
      });
      setError("Could not update follow.");
    }
  }

  function followProps(post: CommunityPost) {
    if (!viewer || !post.userId || post.userId === viewer.userId) return null;
    return { following: following.has(post.userId), onToggle: () => toggleFollow(post.userId!) };
  }

  async function toggleReblog(id: string) {
    if (!viewer) {
      setError("Sign in to reblog.");
      return;
    }
    const post = posts.find((p) => p.id === id);
    if (!post || post.pending) return;
    const next = !post.rebloggedByViewer;
    // Update every row that shows this post (base + any reblog rows).
    setPosts((cur) =>
      cur.map((p) =>
        p.id === id
          ? { ...p, rebloggedByViewer: next, reblogCount: p.reblogCount + (next ? 1 : -1) }
          : p,
      ),
    );
    try {
      const res = await fetch("/api/reblogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, reblog: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setPosts((cur) =>
        cur.map((p) =>
          p.id === id
            ? { ...p, rebloggedByViewer: !next, reblogCount: p.reblogCount + (next ? -1 : 1) }
            : p,
        ),
      );
      setError("Could not reblog.");
    }
  }

  async function toggleBookmark(id: string) {
    if (!viewer) {
      setError("Sign in to save posts.");
      return;
    }
    const post = posts.find((p) => p.id === id);
    if (!post || post.pending) return;
    const next = !post.bookmarkedByViewer;
    setPosts((cur) => cur.map((p) => (p.id === id ? { ...p, bookmarkedByViewer: next } : p)));
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, bookmark: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setPosts((cur) => cur.map((p) => (p.id === id ? { ...p, bookmarkedByViewer: !next } : p)));
      setError("Could not update saved.");
    }
  }

  const tops = posts
    .filter((p) => p.parentId === null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const repliesOf = (id: string) =>
    posts.filter((p) => p.parentId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  async function submit(parentId: string | null, body: string): Promise<boolean> {
    if (!viewer) return false;
    setError(null);
    const clean = sanitize(body);
    if (!clean) {
      setError("Write something first.");
      return false;
    }

    const tempId = `temp-${crypto.randomUUID()}`;
    const temp: CommunityPost = {
      rowId: tempId,
      id: tempId,
      body: clean,
      parentId,
      createdAt: new Date().toISOString(),
      userId: viewer.userId,
      authorName: viewer.displayName,
      username: viewer.username,
      avatarUrl: viewer.avatarUrl,
      likeCount: 0,
      likedByViewer: false,
      bookmarkedByViewer: false,
      reblogCount: 0,
      rebloggedByViewer: false,
      rebloggedBy: null,
      pending: true,
    };
    setPosts((cur) => [...cur, temp]);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: clean, parent_id: parentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not post.");
      setPosts((cur) =>
        cur.map((p) =>
          p.id === temp.id
            ? { ...p, rowId: json.post.id, id: json.post.id, createdAt: json.post.created_at, pending: false }
            : p,
        ),
      );
      return true;
    } catch (e) {
      setPosts((cur) => cur.filter((p) => p.id !== temp.id));
      setError(e instanceof Error ? e.message : "Could not post.");
      return false;
    }
  }

  async function toggleLike(id: string) {
    if (!viewer) {
      setError("Sign in to like posts.");
      return;
    }
    const post = posts.find((p) => p.id === id);
    if (!post || post.pending) return;
    const nextLiked = !post.likedByViewer;

    // Optimistic.
    setPosts((cur) =>
      cur.map((p) =>
        p.id === id
          ? { ...p, likedByViewer: nextLiked, likeCount: p.likeCount + (nextLiked ? 1 : -1) }
          : p,
      ),
    );

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, like: nextLiked }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert.
      setPosts((cur) =>
        cur.map((p) =>
          p.id === id
            ? { ...p, likedByViewer: !nextLiked, likeCount: p.likeCount + (nextLiked ? -1 : 1) }
            : p,
        ),
      );
      setError("Could not update your like.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {viewer ? (
        <Composer
          avatar={<CommunityAvatar seed={viewer.username} src={viewer.avatarUrl} size={40} />}
          placeholder="Share something about Indian sport…"
          submitLabel="Post"
          onSubmit={(body) => submit(null, body)}
        />
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-card border border-border bg-card p-6">
          <p className="text-muted-foreground">Sign in to post and like. Reading is open to all.</p>
          <div className="flex gap-2">
            <Button asChild variant="brand" size="sm">
              <Link href="/login?next=/community">Sign in</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {flat ? (
        <ul className="flex flex-col gap-6">
          {[...posts]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((post) => (
              <li key={post.rowId}>
                <PostView
                  post={post}
                  onLike={() => toggleLike(post.id)}
                  onBookmark={() => toggleBookmark(post.id)}
                  onReblog={() => toggleReblog(post.id)}
                  canReply={false}
                  follow={followProps(post)}
                />
              </li>
            ))}
        </ul>
      ) : tops.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Be the first.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {tops.map((post) => (
            <li key={post.rowId} className="flex flex-col gap-3">
              {post.rebloggedBy && (
                <span className="flex items-center gap-1.5 pl-1 text-xs text-muted-foreground">
                  <Repeat2 className="size-3.5" /> Reblogged by @{post.rebloggedBy}
                </span>
              )}
              <PostView
                post={post}
                onLike={() => toggleLike(post.id)}
                onBookmark={() => toggleBookmark(post.id)}
                onReblog={() => toggleReblog(post.id)}
                canReply={!post.rebloggedBy && !!viewer}
                onReply={() => { setReplyTo(replyTo === post.rowId ? null : post.rowId); setError(null); }}
                follow={followProps(post)}
              />

              {!post.rebloggedBy && (
                <div className="ml-6 flex flex-col gap-3 border-l border-border pl-4">
                  {repliesOf(post.id).map((reply) => (
                    <PostView key={reply.rowId} post={reply} onLike={() => toggleLike(reply.id)} onBookmark={() => toggleBookmark(reply.id)} onReblog={() => toggleReblog(reply.id)} canReply={false} follow={followProps(reply)} />
                  ))}

                  {viewer && replyTo === post.rowId && (
                    <Composer
                      avatar={<CommunityAvatar seed={viewer.username} src={viewer.avatarUrl} size={32} />}
                      placeholder={`Reply to ${post.authorName}…`}
                      submitLabel="Reply"
                      compact
                      onSubmit={async (body) => {
                        const ok = await submit(post.id, body);
                        if (ok) setReplyTo(null);
                        return ok;
                      }}
                    />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PostView({
  post,
  onLike,
  onBookmark,
  onReblog,
  canReply,
  onReply,
  follow,
}: {
  post: CommunityPost;
  onLike: () => void;
  onBookmark: () => void;
  onReblog: () => void;
  canReply: boolean;
  onReply?: () => void;
  follow?: { following: boolean; onToggle: () => void } | null;
}) {
  return (
    <div className={cn("flex gap-3", post.pending && "opacity-60")}>
      <CommunityAvatar seed={post.username ?? post.authorName} src={post.avatarUrl} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          {post.username ? (
            <Link href={`/community/u/${post.username}`} className="font-semibold hover:underline">
              {post.authorName}
            </Link>
          ) : (
            <span className="font-semibold">{post.authorName}</span>
          )}
          {post.username && (
            <Link
              href={`/community/u/${post.username}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              @{post.username}
            </Link>
          )}
          <span className="text-xs text-muted-foreground">· {timeAgo(post.createdAt)}</span>
          {follow && (
            <button
              type="button"
              onClick={follow.onToggle}
              className={cn(
                "ml-auto rounded-btn border px-2.5 py-1 text-xs font-medium transition-ui",
                follow.following
                  ? "border-border text-muted-foreground hover:text-foreground"
                  : "border-foreground text-foreground hover:bg-accent",
              )}
            >
              {follow.following ? "Following" : "Follow"}
            </button>
          )}
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words">{post.body}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={onLike}
            className={cn(
              "inline-flex items-center gap-1.5 transition-ui hover:text-foreground",
              post.likedByViewer && "text-brand",
            )}
            aria-pressed={post.likedByViewer}
          >
            <Heart className={cn("size-4", post.likedByViewer && "fill-current")} />
            {post.likeCount > 0 && <span>{post.likeCount}</span>}
          </button>
          {canReply && onReply && (
            <button
              type="button"
              onClick={onReply}
              className="inline-flex items-center gap-1.5 transition-ui hover:text-foreground"
            >
              <MessageCircle className="size-4" />
              Reply
            </button>
          )}
          <button
            type="button"
            onClick={onReblog}
            aria-pressed={post.rebloggedByViewer}
            className={cn(
              "inline-flex items-center gap-1.5 transition-ui hover:text-foreground",
              post.rebloggedByViewer && "text-success",
            )}
          >
            <Repeat2 className="size-4" />
            {post.reblogCount > 0 && <span>{post.reblogCount}</span>}
          </button>
          <button
            type="button"
            onClick={onBookmark}
            aria-pressed={post.bookmarkedByViewer}
            className={cn(
              "inline-flex items-center gap-1.5 transition-ui hover:text-foreground",
              post.bookmarkedByViewer && "text-foreground",
            )}
          >
            <Bookmark className={cn("size-4", post.bookmarkedByViewer && "fill-current")} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Composer({
  avatar,
  placeholder,
  submitLabel,
  compact,
  onSubmit,
}: {
  avatar: React.ReactNode;
  placeholder: string;
  submitLabel: string;
  compact?: boolean;
  onSubmit: (body: string) => Promise<boolean>;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (busy || !body.trim()) return;
    setBusy(true);
    const ok = await onSubmit(body);
    setBusy(false);
    if (ok) setBody("");
  }

  return (
    <div className={cn("flex gap-3", !compact && "rounded-card border border-border p-4")}>
      {avatar}
      <div className="flex flex-1 flex-col gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={BODY_MAX}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="resize-y rounded-input border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
        />
        <Button
          type="button"
          onClick={handle}
          disabled={busy || !body.trim()}
          variant="brand"
          size="sm"
          className="self-end"
        >
          {busy ? "Posting…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
