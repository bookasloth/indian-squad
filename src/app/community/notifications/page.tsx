import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { requireMember } from "@/lib/members/session";
import { getNotifications, markAllRead, type CommunityNotification } from "@/lib/community-notify";
import { CommunityAvatar } from "@/components/community/community-avatar";
import { cn, timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

const VERB: Record<CommunityNotification["type"], string> = {
  like: "liked your post",
  reply: "replied to your post",
  follow: "followed you",
};

const ICON = { like: Heart, reply: MessageCircle, follow: UserPlus } as const;

export default async function NotificationsPage() {
  await requireMember("/community/notifications");
  const notes = await getNotifications();
  // Clear the unread badge for next time (after reading the current state above).
  await markAllRead();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">Notifications</h1>
        <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground">
          ← Feed
        </Link>
      </header>

      {notes.length === 0 ? (
        <p className="text-muted-foreground">Nothing yet. Likes, replies, and follows show up here.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {notes.map((n) => {
            const Icon = ICON[n.type];
            return (
              <li
                key={n.id}
                className={cn("flex items-center gap-3 py-3", !n.read && "rounded-card bg-muted/50 px-3")}
              >
                <CommunityAvatar seed={n.actorUsername ?? n.actorName} src={n.actorAvatarUrl} size={36} />
                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-semibold">{n.actorName}</span>{" "}
                  <span className="text-muted-foreground">{VERB[n.type]}</span>
                </div>
                <Icon className={cn("size-4 shrink-0", n.type === "like" ? "text-brand" : "text-muted-foreground")} />
                <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
