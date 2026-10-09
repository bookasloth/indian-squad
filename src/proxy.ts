import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next 16 Proxy (renamed from middleware). Refreshes the Supabase auth session
 * cookie on every request.
 * (The source site's admin/games/kalamai gates + community permalink redirect
 * were dropped — pages guard themselves via requireMember().)
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response; // not configured yet — skip session refresh
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Honor "remember me": sd_remember=0 keeps refreshed cookies session-only.
          const sessionOnly = request.cookies.get("sd_remember")?.value === "0";
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(
              name,
              value,
              sessionOnly ? { ...options, maxAge: undefined, expires: undefined } : options,
            ),
          );
        },
      },
    },
  );

  // getClaims refreshes an expired session like getUser did, but verifies the JWT
  // locally when the project uses asymmetric signing keys — no Auth round-trip on
  // every request. (Falls back to a getUser call on legacy HS256 projects.)
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
