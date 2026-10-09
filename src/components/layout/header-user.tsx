"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmitButton } from "@/components/ui/submit-button";
import { signOut } from "@/lib/auth/actions";

type Me = { user: { name: string } | null; unread: number };

// ponytail: @supabase/ssr session cookies are JS-readable (sb-<ref>-auth-token[.N]).
// No cookie → certainly signed out, so most visitors never pay for the /api/me call.
const hasSessionCookie = () => /(?:^|;\s*)sb-[^=]+-auth-token/.test(document.cookie);

/** Header auth slot. A client island so the root layout stays static: shows
 * login/signup when signed out, the bell + username + sign-out when signed in.
 * Re-reads on mount — every sign-in/out passes through a bare auth route, which
 * unmounts the header, so a fresh mount always sees the new session. */
export function HeaderUser() {
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const guest: Me = { user: null, unread: 0 };
    let live = true;
    (hasSessionCookie()
      ? fetch("/api/me").then((r) => (r.ok ? (r.json() as Promise<Me>) : guest))
      : Promise.resolve(guest)
    )
      .catch(() => guest)
      .then((d) => live && setMe(d));
    return () => {
      live = false;
    };
  }, []);

  // Opening the notifications page marks everything read server-side; clear the
  // badge to match (state adjusted during render — guarded, so it runs once).
  if (me?.unread && pathname.startsWith("/community/notifications")) setMe({ ...me, unread: 0 });

  // Fixed-width placeholder in the slot's footprint; fades in only if /api/me is slow.
  if (!me) {
    return (
      <div className="skeleton-reveal" aria-hidden>
        <Skeleton className="h-8 w-20 sm:w-36" />
      </div>
    );
  }

  if (!me.user) {
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

  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Notifications" className="relative">
        <Link href="/community/notifications">
          <Bell />
          {me.unread > 0 && (
            <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-4 text-brand-foreground">
              {me.unread > 9 ? "9+" : me.unread}
            </span>
          )}
        </Link>
      </Button>
      <span className="hidden text-sm text-muted-foreground sm:inline">{me.user.name}</span>
      <form action={signOut}>
        <SubmitButton variant="ghost" size="sm">
          Sign out
        </SubmitButton>
      </form>
    </div>
  );
}
