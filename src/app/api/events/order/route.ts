import { supabaseAdmin } from "@/lib/supabase/server";
import { paidTickets, paymentsEnabled } from "@/lib/events";
import { getMemberContext } from "@/lib/members/session";
import { allow } from "@/lib/rate-limit";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Creates a pending one-ticket order. The amount is copied from the event row here; the browser only sends the event id.
export async function POST(req: Request) {
  if (!paymentsEnabled()) return Response.json({ error: "Ticket sales aren't open yet." }, { status: 503 });
  const { user } = await getMemberContext();
  if (!user?.email) return Response.json({ error: "Sign in to buy a ticket." }, { status: 401 });
  if (!user.email_confirmed_at) {
    return Response.json({ error: "Confirm your email first — your ticket is sent there." }, { status: 403 });
  }
  if (!(await allow(`order:${user.id}`, 5, 60_000))) {
    return Response.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const { eventId } = await req.json().catch(() => ({}));
  if (typeof eventId !== "string" || !UUID.test(eventId)) {
    return Response.json({ error: "Unknown event." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: ev } = await db
    .from("is_events")
    .select("id, price, capacity, starts_at")
    .eq("id", eventId)
    .eq("published", true)
    .eq("ticketing", "paid")
    .maybeSingle<{ id: string; price: number; capacity: number | null; starts_at: string }>();
  if (!ev) return Response.json({ error: "Unknown event." }, { status: 404 });
  if (new Date(ev.starts_at) <= new Date()) {
    return Response.json({ error: "This event has already started." }, { status: 409 });
  }

  // ponytail: capacity is checked on order, not on payment, so two buyers racing for the last seat can both pay.
  // Fine at watch-party scale; move the check into markPaid (and refund the loser) if events sell out fast.
  if (ev.capacity && (await paidTickets(ev.id)) >= ev.capacity) {
    return Response.json({ error: "Sold out." }, { status: 409 });
  }

  const { data: order, error } = await db
    .from("is_orders")
    .insert({ event_id: ev.id, user_id: user.id, email: user.email, amount: ev.price })
    .select("id")
    .single();
  if (error || !order) return Response.json({ error: "Couldn't start checkout. Try again." }, { status: 500 });

  return Response.json({ orderId: order.id });
}
