import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notify } from "@/lib/community-notify";

// Toggle a like on a post. { postId, like: boolean }.
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to like posts." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { postId, like } = (payload ?? {}) as Record<string, unknown>;
  if (typeof postId !== "string" || typeof like !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { error } = like
    ? await sb.from("is_post_reactions").upsert(
        { post_id: postId, user_id: user.id },
        { onConflict: "post_id,user_id", ignoreDuplicates: true },
      )
    : await sb
        .from("is_post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }

  // Notify the post's author when newly liked.
  if (like) {
    const { data: post } = await sb.from("is_posts").select("user_id").eq("id", postId).single();
    if (post?.user_id) await notify(post.user_id as string, user.id, "like", postId);
  }

  return NextResponse.json({ ok: true });
}
