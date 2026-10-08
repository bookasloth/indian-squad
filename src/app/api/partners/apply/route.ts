import { randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getMemberContext } from "@/lib/members/session";
import { allow } from "@/lib/rate-limit";
import { parsePartnerApplication } from "@/lib/partner-validate";
import { sendTemplate, sendToOps } from "@/lib/email/send-template";
import { partnerApplicationAlert, partnerApplicationReceived } from "@/lib/email/templates/partners";
import { site } from "@/lib/site";
import { slugify } from "@/lib/utils";

// A signed-in, email-confirmed user applies to become a partner. One application per account; admin approves.
export async function POST(req: Request) {
  const { user } = await getMemberContext();
  if (!user?.email) return Response.json({ error: "Sign in to apply." }, { status: 401 });
  if (!user.email_confirmed_at) return Response.json({ error: "Confirm your email first." }, { status: 403 });
  if (!(await allow(`partner-apply:${user.id}`, 3, 60_000))) {
    return Response.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const parsed = parsePartnerApplication(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const a = parsed.value;

  const db = supabaseAdmin();
  const { data: existing } = await db.from("is_partners").select("id").eq("user_id", user.id).maybeSingle();
  if (existing) return Response.json({ error: "You've already applied." }, { status: 409 });

  const slug = `${slugify(a.org_name).slice(0, 60).replace(/^-|-$/g, "") || "partner"}-${randomBytes(2).toString("hex")}`;
  const { error } = await db
    .from("is_partners")
    .insert({ ...a, user_id: user.id, slug, agreement_accepted_at: new Date().toISOString() });
  if (error) return Response.json({ error: "Couldn't save your application. Try again." }, { status: 500 });

  await Promise.all([
    sendToOps(partnerApplicationAlert({ ...a, email: user.email }, `${site.url}/partners/review`)),
    sendTemplate(user.email, partnerApplicationReceived(a, `${site.url}/partners/dashboard`)).catch((e) =>
      console.error("[partners] applicant email failed", e),
    ),
  ]);
  return Response.json({ ok: true });
}
