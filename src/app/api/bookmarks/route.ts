import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Toggle a bookmark. { postId, bookmark: boolean }.
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to save posts." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { postId, bookmark } = (payload ?? {}) as Record<string, unknown>;
  if (typeof postId !== "string" || typeof bookmark !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { error } = bookmark
    ? await sb.from("is_bookmarks").upsert(
        { user_id: user.id, post_id: postId },
        { onConflict: "user_id,post_id", ignoreDuplicates: true },
      )
    : await sb.from("is_bookmarks").delete().eq("user_id", user.id).eq("post_id", postId);

  if (error) {
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
