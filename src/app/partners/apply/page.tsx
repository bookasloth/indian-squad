import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireMember } from "@/lib/members/session";
import { getPartnerForUser } from "@/lib/partners";
import { PartnerApplyForm } from "@/components/partners/partner-apply-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Apply to be a partner", robots: { index: false } };

export default async function PartnerApplyPage() {
  const { user } = await requireMember("/partners/apply");
  if (await getPartnerForUser(user!.id)) redirect("/partners/dashboard");

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Apply to be a partner</h1>
        <p className="text-muted-foreground">Takes two minutes. We review every application by hand.</p>
      </header>
      {user!.email_confirmed_at ? (
        <PartnerApplyForm defaultName={user!.user_metadata?.full_name} />
      ) : (
        <Alert variant="warning">
          <AlertDescription>Confirm your email address first — check your inbox for the link — then come back here.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
