import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notify } from "@/lib/community-notify";

// Toggle a reblog (repost). { postId, reblog: boolean }.
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to reblog." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { postId, reblog } = (payload ?? {}) as Record<string, unknown>;
  if (typeof postId !== "string" || typeof reblog !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { error } = reblog
    ? await sb.from("is_reblogs").upsert(
        { user_id: user.id, post_id: postId },
        { onConflict: "user_id,post_id", ignoreDuplicates: true },
      )
    : await sb.from("is_reblogs").delete().eq("user_id", user.id).eq("post_id", postId);

  if (error) {
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }

  if (reblog) {
    const { data: post } = await sb.from("is_posts").select("user_id").eq("id", postId).single();
    if (post?.user_id) await notify(post.user_id as string, user.id, "reblog", postId);
  }

  return NextResponse.json({ ok: true });
}
