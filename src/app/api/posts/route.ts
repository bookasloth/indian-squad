import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validatePost } from "@/data/community";

const COLUMNS = "id,author_name,body,parent_id,created_at";

// ponytail: in-memory per-IP rate limit. Resets per server instance / cold
// start, so it's best-effort — fine for a fan feed. Move to Upstash or a
// Supabase counter if it's ever actually abused.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Community is not configured yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Slow down — too many posts." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { author_name, body, parent_id } = (payload ?? {}) as Record<string, unknown>;

  const result = validatePost(author_name, body);
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
      .select("id,parent_id")
      .eq("id", parent_id)
      .single();
    if (!found || found.parent_id !== null) {
      return NextResponse.json({ error: "Invalid parent." }, { status: 400 });
    }
    parent = parent_id;
  }

  const { data, error } = await sb
    .from("is_posts")
    .insert({ author_name: result.name, body: result.body, parent_id: parent })
    .select(COLUMNS)
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save your post." }, { status: 500 });
  }
  return NextResponse.json({ post: data }, { status: 201 });
}
