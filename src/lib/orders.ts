// Zoho Payments <-> is_orders. orderId = is_orders.id, sent to Zoho as reference_number.
import "server-only";

import type { ZohoPayment } from "./zoho-payments";
import { supabaseAdmin } from "./supabase/server";
import { sendTemplate } from "./email/send-template";
import { eventTicket } from "./email/templates/events";
import { site } from "./site";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type EventRef = { title: string; slug: string; venue: string; city: string; starts_at: string };

// Price ALWAYS comes from the DB row (copied from the event at /api/events/order), never from the browser.
export async function getOrder(orderId: string) {
  if (!UUID.test(orderId)) return null;
  const { data } = await supabaseAdmin()
    .from("is_orders")
    .select("amount, status, event:is_events(title)")
    .eq("id", orderId)
    .maybeSingle<{ amount: number; status: string; event: { title: string } | null }>();
  return (
    data && {
      amount: Number(data.amount),
      status: data.status,
      description: `${data.event?.title ?? site.name} — ticket`,
    }
  );
}

// Called by both the verify route and the webhook: idempotent, only flips a row that isn't paid yet.
export async function markPaid(orderId: string, payment: ZohoPayment) {
  const { data: flipped, error } = await supabaseAdmin()
    .from("is_orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), provider_payment_id: payment.payment_id })
    .eq("id", orderId)
    .neq("status", "paid")
    .select("email, amount, event:is_events(title, slug, venue, city, starts_at)");
  if (error) throw error; // webhook returns 500 -> Zoho redelivers
  // Many-to-one embed: an object at runtime, though the untyped client infers an array.
  const row = flipped?.[0] as unknown as { email: string; amount: number; event: EventRef | null } | undefined;
  if (!row?.event) return; // only the call that flipped the row sends the receipt

  // The payment is recorded either way; a failed receipt is logged, never retried.
  await sendTemplate(
    row.email,
    eventTicket({ ...row.event, amount: Number(row.amount), orderId, url: `${site.url}/events/${row.event.slug}` }),
  ).catch((e) => console.error("[orders] receipt failed", orderId, e));
}
