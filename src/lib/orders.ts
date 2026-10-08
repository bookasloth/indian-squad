// Zoho Payments <-> is_orders (event tickets and merch). orderId = is_orders.id, sent to Zoho as reference_number.
import "server-only";

import type { ZohoPayment } from "./zoho-payments";
import type { Shipping } from "./shop-validate";
import { supabaseAdmin } from "./supabase/server";
import { sendTemplate, sendToOps } from "./email/send-template";
import { eventTicket } from "./email/templates/events";
import { merchOrderAlert, merchReceipt } from "./email/templates/shop";
import { site } from "./site";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type EventRef = { title: string; slug: string; venue: string; city: string; starts_at: string };
type ProductRef = { title: string; slug: string };

// Many-to-one embeds come back as objects at runtime, though the untyped client infers arrays.
type OrderRow = {
  kind: "ticket" | "merch";
  email: string;
  amount: number;
  status: string;
  size: string | null;
  quantity: number;
  shipping: Shipping | null;
  event: EventRef | null;
  product: ProductRef | null;
};

const COLS =
  "kind, email, amount, status, size, quantity, shipping, event:is_events(title, slug, venue, city, starts_at), product:is_products(title, slug)";

function describe(o: OrderRow) {
  if (o.kind === "merch") return `${o.product?.title ?? "Merch"}${o.size ? ` (${o.size})` : ""} × ${o.quantity}`;
  return `${o.event?.title ?? site.name} — ticket`;
}

// Price ALWAYS comes from the DB row (set at /api/events/order or /api/shop/order), never from the browser.
export async function getOrder(orderId: string) {
  if (!UUID.test(orderId)) return null;
  const { data } = await supabaseAdmin().from("is_orders").select(COLS).eq("id", orderId).maybeSingle();
  const o = data as unknown as OrderRow | null;
  return o && { amount: Number(o.amount), status: o.status, description: describe(o) };
}

// Called by both the verify route and the webhook: idempotent, only flips a row that isn't paid yet.
export async function markPaid(orderId: string, payment: ZohoPayment) {
  const { data: flipped, error } = await supabaseAdmin()
    .from("is_orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), provider_payment_id: payment.payment_id })
    .eq("id", orderId)
    .neq("status", "paid")
    .select(COLS);
  if (error) throw error; // webhook returns 500 -> Zoho redelivers
  const o = flipped?.[0] as unknown as OrderRow | undefined;
  if (!o) return; // only the call that flipped the row sends emails

  // The payment is recorded either way; a failed email is logged, never retried.
  const send = (to: string, email: Parameters<typeof sendTemplate>[1]) =>
    sendTemplate(to, email).catch((e) => console.error("[orders] email failed", orderId, e));

  if (o.kind === "ticket" && o.event) {
    await send(o.email, eventTicket({ ...o.event, amount: Number(o.amount), orderId, url: `${site.url}/events/${o.event.slug}` }));
  } else if (o.kind === "merch" && o.product && o.shipping) {
    const order = {
      title: o.product.title,
      size: o.size,
      quantity: o.quantity,
      amount: Number(o.amount),
      orderId,
      shipping: o.shipping,
      url: `${site.url}/shop`,
    };
    await send(o.email, merchReceipt(order));
    // ponytail: fulfilment is manual (place it in Printrove's dashboard); automate via its API past ~20 orders/month.
    await sendToOps(merchOrderAlert(order));
  }
}
