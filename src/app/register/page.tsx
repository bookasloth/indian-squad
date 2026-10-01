import { redirect } from "next/navigation";
import { AuthShell } from "@/components/app/auth-shell";
import { RegisterForm } from "@/components/app/register-form";
import { supabaseAuthServer } from "@/lib/supabase/auth-server";
import { loginDestination, safeNext } from "@/lib/auth/redirect";

export const metadata = {
  title: "Create account",
  description: "Create your account.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const {
      data: { user },
    } = await (await supabaseAuthServer()).auth.getUser();
    if (user) redirect(loginDestination(next ?? null, user.email));
  }

  return (
    <AuthShell>
      <RegisterForm next={safeNext(next ?? null) ?? ""} />
    </AuthShell>
  );
}
