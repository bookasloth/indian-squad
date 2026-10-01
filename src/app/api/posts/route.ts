import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateBody } from "@/data/community";

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
  const { body, parent_id } = (payload ?? {}) as Record<string, unknown>;

  const result = validateBody(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Replies are one level deep: a parent must exist and itself be top-level.
  let parent: string | null = null;
  if (parent_id != null) {
    if (typeof parent_id !== "string") {
      return NextResponse.json({ error: "Invalid parent." }, { status: 400 });
    }
    const { data: found } = await sb
      .from("is_posts")
      .select("id, parent_id")
      .eq("id", parent_id)
      .single();
    if (!found || found.parent_id !== null) {
      return NextResponse.json({ error: "Invalid parent." }, { status: 400 });
    }
    parent = parent_id;
  }

  const { data, error } = await sb
    .from("is_posts")
    .insert({ user_id: user.id, body: result.body, parent_id: parent })
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save your post." }, { status: 500 });
  }
  return NextResponse.json({ post: data }, { status: 201 });
}
