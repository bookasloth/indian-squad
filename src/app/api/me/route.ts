import { NextResponse } from "next/server";
import { getMemberContext } from "@/lib/members/session";
import { getUnreadCount } from "@/lib/community-notify";

// The header's signed-in slot: who's here + unread notification count.
// Fetched client-side so the root layout (and every content page) stays static.
export async function GET() {
  const { user } = await getMemberContext();
  const body = user
    ? { user: { name: user.email?.split("@")[0] ?? "me" }, unread: await getUnreadCount() }
    : { user: null, unread: 0 };
  return NextResponse.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
