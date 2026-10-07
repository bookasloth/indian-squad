import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabaseAuthServer } from "@/lib/supabase/auth-server";

// Reduced from the source site: no paid membership / capability tiers (that was
// its business logic). Just signed-in state + admin-by-email.
export type MemberRole = "guest" | "member" | "admin";

export type MemberContext = {
  user: User | null;
  role: MemberRole;
};

const GUEST: MemberContext = { user: null, role: "guest" };

export const getMemberContext = cache(async (): Promise<MemberContext> => {
  // Not configured yet (slices run backend-free) → treat everyone as a guest.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return GUEST;
  }
  const supabase = await supabaseAuthServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return GUEST;

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin =
    !!adminEmail && !!user.email_confirmed_at && user.email?.toLowerCase() === adminEmail.toLowerCase();
  return { user, role: isAdmin ? "admin" : "member" };
});

/** Route guard: redirect to /login (preserving return path) when signed out. */
export async function requireMember(next?: string): Promise<MemberContext> {
  const ctx = await getMemberContext();
  if (!ctx.user) {
    redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  }
  return ctx;
}
