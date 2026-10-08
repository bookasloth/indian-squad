import { supabaseAdmin } from "@/lib/supabase/server";
import { getMemberContext } from "@/lib/members/session";
import { sendTemplate } from "@/lib/email/send-template";
import { partnerDecision, partnerEventDecision } from "@/lib/email/templates/partners";
import { site } from "@/lib/site";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ACTIONS = ["approve_partner", "reject_partner", "suspend_partner", "approve_event", "reject_event"] as const;
type Action = (typeof ACTIONS)[number];

// Admin review of partners and partner events: { action, id }.
export async function POST(req: Request) {
  const { role } = await getMemberContext();
  if (role !== "admin") return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as { action?: unknown; id?: unknown };
  const action = body.action as Action;
  const id = body.id;
  if (!ACTIONS.includes(action) || typeof id !== "string" || !UUID.test(id)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const mail = (to: string | undefined, email: Parameters<typeof sendTemplate>[1]) =>
    to ? sendTemplate(to, email).catch((e) => console.error("[admin/partners] email failed", e)) : undefined;
  const emailOf = async (userId: string) => (await db.auth.admin.getUserById(userId)).data.user?.email;

  if (action.endsWith("_partner")) {
    const status = action === "approve_partner" ? "approved" : action === "reject_partner" ? "rejected" : "suspended";
    const { data: p, error } = await db
      .from("is_partners")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id)
      .select("user_id, org_name")
      .maybeSingle<{ user_id: string; org_name: string }>();
    if (error || !p) return Response.json({ error: "Partner not found." }, { status: 404 });
    if (status !== "suspended") {
      await mail(await emailOf(p.user_id), partnerDecision({ org_name: p.org_name, approved: status === "approved" }, `${site.url}/partners/dashboard`));
    }
    return Response.json({ ok: true });
  }

  const approved = action === "approve_event";
  const { data: ev, error } = await db
    .from("is_events")
    .update(approved ? { published: true } : { published: false, submitted_at: null })
    .eq("id", id)
    .not("partner_id", "is", null)
    .select("slug, title, partner:is_partners(user_id)")
    .maybeSingle();
  if (error || !ev) return Response.json({ error: "Event not found." }, { status: 404 });
  const e = ev as unknown as { slug: string; title: string; partner: { user_id: string } | null };
  if (e.partner) {
    await mail(await emailOf(e.partner.user_id), partnerEventDecision({ title: e.title, approved }, `${site.url}/events/${e.slug}`));
  }
  return Response.json({ ok: true });
}
