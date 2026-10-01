"use client";

import { useState } from "react";
import { type Post, NAME_MAX, BODY_MAX, sanitize } from "@/data/community";

export function CommunityFeed({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [name, setName] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tops = posts
    .filter((p) => p.parent_id === null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const repliesOf = (id: string) =>
    posts
      .filter((p) => p.parent_id === id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));

  async function submit(parentId: string | null, body: string): Promise<boolean> {
    setError(null);
    const cleanName = sanitize(name);
    const cleanBody = sanitize(body);
    if (!cleanName || !cleanBody) {
      setError("Name and message are required.");
      return false;
    }

    // Optimistic insert.
    const temp: Post = {
      id: `temp-${crypto.randomUUID()}`,
      author_name: cleanName,
      body: cleanBody,
      parent_id: parentId,
      created_at: new Date().toISOString(),
    };
    setPosts((cur) => [...cur, temp]);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: cleanName, body: cleanBody, parent_id: parentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not post.");
      // Swap temp for the saved row.
      setPosts((cur) => cur.map((p) => (p.id === temp.id ? (json.post as Post) : p)));
      return true;
    } catch (e) {
      setPosts((cur) => cur.filter((p) => p.id !== temp.id));
      setError(e instanceof Error ? e.message : "Could not post.");
      return false;
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Composer
        name={name}
        onName={setName}
        placeholder="Share something about Indian cricket…"
        submitLabel="Post"
        onSubmit={(body) => submit(null, body)}
      />

      {error && <p className="text-sm text-foreground">{error}</p>}

      {tops.length === 0 ? (
        <p className="text-muted">No posts yet. Be the first.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {tops.map((post) => (
            <li key={post.id} className="flex flex-col gap-3">
              <PostView post={post} />

              <div className="ml-6 flex flex-col gap-3 border-l border-border pl-4">
                {repliesOf(post.id).map((reply) => (
                  <PostView key={reply.id} post={reply} />
                ))}

                {replyTo === post.id ? (
                  <Composer
                    name={name}
                    onName={setName}
                    placeholder={`Reply to ${post.author_name}…`}
                    submitLabel="Reply"
                    compact
                    onSubmit={async (body) => {
                      const ok = await submit(post.id, body);
                      if (ok) setReplyTo(null);
                      return ok;
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(post.id);
                      setError(null);
                    }}
                    className="self-start text-sm text-muted hover:text-foreground"
                  >
                    Reply
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PostView({ post }: { post: Post }) {
  const pending = post.id.startsWith("temp-");
  return (
    <div className={pending ? "opacity-60" : undefined}>
      <div className="flex items-baseline gap-2">
        <span className="font-semibold">{post.author_name}</span>
        <span className="text-xs text-muted">{formatTime(post.created_at)}</span>
      </div>
      <p className="mt-1 whitespace-pre-wrap break-words">{post.body}</p>
    </div>
  );
}

function Composer({
  name,
  onName,
  placeholder,
  submitLabel,
  compact,
  onSubmit,
}: {
  name: string;
  onName: (v: string) => void;
  placeholder: string;
  submitLabel: string;
  compact?: boolean;
  onSubmit: (body: string) => Promise<boolean>;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (busy) return;
    setBusy(true);
    const ok = await onSubmit(body);
    setBusy(false);
    if (ok) setBody("");
  }

  return (
    <div className={`flex flex-col gap-3 ${compact ? "" : "rounded-lg border border-border p-4"}`}>
      <input
        value={name}
        onChange={(e) => onName(e.target.value)}
        maxLength={NAME_MAX}
        placeholder="Your name"
        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={BODY_MAX}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
      />
      <button
        type="button"
        onClick={handle}
        disabled={busy || !name.trim() || !body.trim()}
        className="self-start rounded-md border border-foreground bg-foreground px-4 py-2 text-sm text-background disabled:opacity-40"
      >
        {busy ? "Posting…" : submitLabel}
      </button>
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
