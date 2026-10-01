import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getMemberContext } from "@/lib/members/session";

// Admin moderation. { action: "remove" | "dismiss", postId?, reportId? }.
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const { role } = await getMemberContext();
  if (role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { action, postId, reportId } = (payload ?? {}) as Record<string, unknown>;
  const admin = supabaseAdmin();
  const now = new Date().toISOString();

  if (action === "remove" && typeof postId === "string") {
    await admin.from("is_posts").update({ deleted_at: now }).eq("id", postId);
    await admin.from("is_reports").update({ status: "resolved" }).eq("post_id", postId);
    return NextResponse.json({ ok: true });
  }
  if (action === "dismiss" && typeof reportId === "string") {
    await admin.from("is_reports").update({ status: "resolved" }).eq("id", reportId);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Invalid request." }, { status: 400 });
}
