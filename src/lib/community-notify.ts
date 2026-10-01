import "server-only";

import { supabaseAdmin, createClient } from "@/lib/supabase/server";

export type NotificationType = "like" | "reply" | "follow" | "reblog";

export interface CommunityNotification {
  id: string;
  type: NotificationType;
  postId: string | null;
  read: boolean;
  createdAt: string;
  actorName: string;
  actorUsername: string | null;
  actorAvatarUrl: string | null;
}

function configured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

/** Unread notification count for the signed-in viewer (0 when signed out/unconfigured). */
export async function getUnreadCount(): Promise<number> {
  if (!configured()) return 0;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return 0;
  const { count } = await sb
    .from("is_notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null);
  return count ?? 0;
}

type ActorEmbed = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
} | null;

type NotifRow = {
  id: string;
  type: NotificationType;
  post_id: string | null;
  read_at: string | null;
  created_at: string;
  actor: ActorEmbed;
};

/** The viewer's latest notifications. */
export async function getNotifications(): Promise<CommunityNotification[]> {
  if (!configured()) return [];
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return [];

  const { data } = await sb
    .from("is_notifications")
    .select(
      "id, type, post_id, read_at, created_at, " +
        "actor:is_profiles!is_notifications_actor_id_fkey(username, display_name, avatar_url)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return ((data as NotifRow[] | null) ?? []).map((r) => ({
    id: r.id,
    type: r.type,
    postId: r.post_id,
    read: r.read_at !== null,
    createdAt: r.created_at,
    actorName: r.actor?.display_name?.trim() || r.actor?.username || "Someone",
    actorUsername: r.actor?.username ?? null,
    actorAvatarUrl: r.actor?.avatar_url ?? null,
  }));
}

/** Mark all of the viewer's notifications read. */
export async function markAllRead(): Promise<void> {
  if (!configured()) return;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return;
  await sb
    .from("is_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);
}

/**
 * Create a notification for `recipientId` about `actorId`'s action. Written with
 * the service-role client (recipient ≠ actor, so RLS can't be self-scoped).
 * No-ops when notifying yourself. Fail-safe: never throws into the caller.
 */
export async function notify(
  recipientId: string,
  actorId: string,
  type: NotificationType,
  postId: string | null = null,
): Promise<void> {
  if (!recipientId || recipientId === actorId) return;
  try {
    await supabaseAdmin()
      .from("is_notifications")
      .insert({ user_id: recipientId, actor_id: actorId, type, post_id: postId });
  } catch (e) {
    console.warn("[community] notify failed:", (e as Error).message);
  }
}
