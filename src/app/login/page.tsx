import { redirect } from "next/navigation";
import { AuthShell } from "@/components/app/auth-shell";
import { LoginForm } from "@/components/app/login-form";
import { supabaseAuthServer } from "@/lib/supabase/auth-server";
import { loginDestination, safeNext } from "@/lib/auth/redirect";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your account.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; check?: string; error?: string; next?: string }>;
}) {
  const { reset, check, error, next } = await searchParams;

  // Already signed in? Skip the form and go straight to the destination.
  // (Guarded: when Supabase env isn't configured yet, just render the form.)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const {
      data: { user },
    } = await (await supabaseAuthServer()).auth.getUser();
    if (user) redirect(loginDestination(next ?? null, user.email));
  }

  return (
    <AuthShell>
      <LoginForm
        next={safeNext(next ?? null) ?? ""}
        check={check === "1"}
        reset={reset === "1"}
        errorParam={error}
      />
    </AuthShell>
  );
}
