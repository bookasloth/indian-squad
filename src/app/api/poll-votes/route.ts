import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Cast / change a poll vote. { postId, optionIndex }.
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { postId, optionIndex } = (payload ?? {}) as Record<string, unknown>;
  if (typeof postId !== "string" || typeof optionIndex !== "number" || optionIndex < 0) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Poll must exist, the option must be valid, and it must not be closed.
  const { data: poll } = await sb
    .from("is_polls")
    .select("options, closes_at")
    .eq("post_id", postId)
    .single();
  if (!poll) {
    return NextResponse.json({ error: "No such poll." }, { status: 404 });
  }
  const options = (poll.options as { i: number }[] | null) ?? [];
  if (optionIndex >= options.length) {
    return NextResponse.json({ error: "Invalid option." }, { status: 400 });
  }
  if (poll.closes_at && new Date(poll.closes_at as string) < new Date()) {
    return NextResponse.json({ error: "This poll has closed." }, { status: 400 });
  }

  const { error } = await sb.from("is_poll_votes").upsert(
    { post_id: postId, user_id: user.id, option_index: optionIndex },
    { onConflict: "post_id,user_id" },
  );
  if (error) {
    return NextResponse.json({ error: "Could not record your vote." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
