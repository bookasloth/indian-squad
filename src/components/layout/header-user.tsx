import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMemberContext } from "@/lib/members/session";
import { getUnreadCount } from "@/lib/community-notify";
import { signOut } from "@/lib/auth/actions";

// Server-rendered auth slot for the header. Shows login/signup when signed out,
// the username + sign-out when signed in.
export async function HeaderUser() {
  const { user } = await getMemberContext();

  if (!user) {
    return (
      <>
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild variant="brand" size="sm">
          <Link href="/register">Sign up</Link>
        </Button>
      </>
    );
  }

  const unread = await getUnreadCount();

  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Notifications" className="relative">
        <Link href="/community/notifications">
          <Bell />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-4 text-brand-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
      </Button>
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {user.email?.split("@")[0]}
      </span>
      <form action={signOut}>
        <Button type="submit" variant="ghost" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
