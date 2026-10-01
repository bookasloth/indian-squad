import { NextResponse } from "next/server";
import { createClient, supabaseAdmin } from "@/lib/supabase/server";
import { validateBody, validatePollOptions } from "@/data/community";
import { notify } from "@/lib/community-notify";
import { getMemberContext } from "@/lib/members/session";

// ponytail: in-memory per-user rate limit. Best-effort (resets per instance);
// fine for a fan feed. Move to a DB counter if abused.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Community is not configured yet." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  }

  if (rateLimited(user.id)) {
    return NextResponse.json({ error: "Slow down — too many posts." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { body, parent_id, poll, images } = (payload ?? {}) as Record<string, unknown>;

  const result = validateBody(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Optional images — must be URLs in our own community bucket (uploaded via
  // /api/upload), capped at 4.
  let imageUrls: string[] | null = null;
  if (images != null) {
    if (
      !Array.isArray(images) ||
      images.length > 4 ||
      !images.every((u) => typeof u === "string" && u.includes("/is-community-media/"))
    ) {
      return NextResponse.json({ error: "Invalid images." }, { status: 400 });
    }
    if (images.length > 0) imageUrls = images as string[];
  }

  // Optional poll (top-level posts only).
  let pollOptions: string[] | null = null;
  if (poll != null) {
    if (parent_id != null) {
      return NextResponse.json({ error: "Replies can't carry a poll." }, { status: 400 });
    }
    const pv = validatePollOptions(poll);
    if (!pv.ok) {
      return NextResponse.json({ error: pv.error }, { status: 400 });
    }
    pollOptions = pv.options;
  }

  // Replies are one level deep: a parent must exist and itself be top-level.
  let parent: string | null = null;
  let parentAuthor: string | null = null;
  if (parent_id != null) {
    if (typeof parent_id !== "string") {
      return NextResponse.json({ error: "Invalid parent." }, { status: 400 });
    }
    const { data: found } = await sb
      .from("is_posts")
      .select("id, parent_id, user_id")
      .eq("id", parent_id)
      .single();
    if (!found || found.parent_id !== null) {
      return NextResponse.json({ error: "Invalid parent." }, { status: 400 });
    }
    parent = parent_id;
    parentAuthor = (found.user_id as string | null) ?? null;
  }

  const { data, error } = await sb
    .from("is_posts")
    .insert({ user_id: user.id, body: result.body, parent_id: parent, images: imageUrls })
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save your post." }, { status: 500 });
  }

  // Attach a poll if one was supplied.
  if (pollOptions && data?.id) {
    const options = pollOptions.map((label, i) => ({ i, label }));
    const { error: pollErr } = await sb
      .from("is_polls")
      .insert({ post_id: data.id, options });
    if (pollErr) {
      // The post is saved; surface a soft failure so the client can note it.
      return NextResponse.json({ post: data, pollError: true }, { status: 201 });
    }
  }

  // Notify the parent author of a reply.
  if (parentAuthor && data?.id) {
    await notify(parentAuthor, user.id, "reply", data.id as string);
  }

  return NextResponse.json({ post: data }, { status: 201 });
}

// Soft-delete a post: its author, or an admin. { postId }.
export async function DELETE(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { postId } = (payload ?? {}) as Record<string, unknown>;
  if (typeof postId !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { role } = await getMemberContext();
  const now = new Date().toISOString();

  const { error } =
    role === "admin"
      ? await supabaseAdmin().from("is_posts").update({ deleted_at: now }).eq("id", postId)
      : await sb
          .from("is_posts")
          .update({ deleted_at: now })
          .eq("id", postId)
          .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
