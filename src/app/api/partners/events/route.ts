import { randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getMemberContext } from "@/lib/members/session";
import { getPartnerForUser } from "@/lib/partners";
import { allow } from "@/lib/rate-limit";
import { parsePartnerEvent } from "@/lib/partner-validate";
import { sendToOps } from "@/lib/email/send-template";
import { partnerEventAlert } from "@/lib/email/templates/partners";
import { site } from "@/lib/site";
import { formatEventTime, slugify } from "@/lib/utils";

// An approved partner submits an event. It stays unpublished until an admin approves it.
export async function POST(req: Request) {
  const { user } = await getMemberContext();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  const partner = await getPartnerForUser(user.id);
  if (partner?.status !== "approved") return Response.json({ error: "Only approved partners can submit events." }, { status: 403 });
  if (!(await allow(`partner-event:${user.id}`, 10, 60 * 60_000))) {
    return Response.json({ error: "Too many events submitted. Try again later." }, { status: 429 });
  }

  const parsed = parsePartnerEvent(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const e = parsed.value;

  const slug = `${slugify(e.title).slice(0, 60).replace(/^-|-$/g, "") || "event"}-${randomBytes(2).toString("hex")}`;
  const { error } = await supabaseAdmin()
    .from("is_events")
    .insert({ ...e, slug, partner_id: partner.id, published: false, submitted_at: new Date().toISOString() });
  if (error) return Response.json({ error: "Couldn't save the event. Try again." }, { status: 500 });

  await sendToOps(
    partnerEventAlert({ title: e.title, org_name: partner.org_name, starts_at: formatEventTime(e.starts_at) }, `${site.url}/partners/review`),
  );
  return Response.json({ ok: true, slug });
}
