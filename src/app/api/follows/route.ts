import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Toggle a follow. { followeeId, follow: boolean }.
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to follow." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { followeeId, follow } = (payload ?? {}) as Record<string, unknown>;
  if (typeof followeeId !== "string" || typeof follow !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (followeeId === user.id) {
    return NextResponse.json({ error: "You can't follow yourself." }, { status: 400 });
  }

  const { error } = follow
    ? await sb.from("is_follows").upsert(
        { follower_id: user.id, followee_id: followeeId },
        { onConflict: "follower_id,followee_id", ignoreDuplicates: true },
      )
    : await sb
        .from("is_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("followee_id", followeeId);

  if (error) {
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
