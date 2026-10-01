import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// File a report against a post. { postId, reason? }.
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to report." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { postId, reason } = (payload ?? {}) as Record<string, unknown>;
  if (typeof postId !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const cleanReason =
    typeof reason === "string" ? reason.replace(/\s+/g, " ").trim().slice(0, 300) : null;

  const { error } = await sb
    .from("is_reports")
    .insert({ post_id: postId, reporter_id: user.id, reason: cleanReason });
  // 23505 = already reported by this user; treat as success.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Could not file report." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
