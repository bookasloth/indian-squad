import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMemberContext } from "@/lib/members/session";
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

  return (
    <div className="flex items-center gap-2">
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
