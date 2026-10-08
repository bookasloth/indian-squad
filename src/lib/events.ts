import "server-only";

import { supabaseAdmin, supabaseAnon } from "@/lib/supabase/server";

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sport: string | null;
  venue: string;
  city: string;
  starts_at: string;
  ends_at: string | null;
  price: number;
  capacity: number | null;
  /** paid = our own Zoho-ticketed event; rsvp = free registration; external = organiser's own ticket link. */
  ticketing: "paid" | "rsvp" | "external";
  external_url: string | null;
  partner_id: string | null;
};

export const EVENT_COLS =
  "id, slug, title, description, sport, venue, city, starts_at, ends_at, price, capacity, ticketing, external_url, partner_id";

/** Published events that haven't started, soonest first. RLS hides unpublished ones from the anon client. */
export async function listUpcomingEvents(partnerId?: string): Promise<EventRow[]> {
  let q = supabaseAnon().from("is_events").select(EVENT_COLS).gte("starts_at", new Date().toISOString());
  if (partnerId) q = q.eq("partner_id", partnerId);
  const { data } = await q.order("starts_at");
  return (data ?? []) as EventRow[];
}

export async function getEvent(slug: string): Promise<EventRow | null> {
  const { data } = await supabaseAnon().from("is_events").select(EVENT_COLS).eq("slug", slug).maybeSingle<EventRow>();
  return data;
}

/** Paid tickets for an event, optionally only one user's. Service role: buyers can't see each other's orders. */
export async function paidTickets(eventId: string, userId?: string): Promise<number> {
  let q = supabaseAdmin()
    .from("is_orders")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("status", "paid");
  if (userId) q = q.eq("user_id", userId);
  const { count } = await q;
  return count ?? 0;
}

/** Free registrations for an event, optionally only one user's (0/1). Service role. */
export async function rsvpCount(eventId: string, userId?: string): Promise<number> {
  let q = supabaseAdmin().from("is_event_rsvps").select("id", { count: "exact", head: true }).eq("event_id", eventId);
  if (userId) q = q.eq("user_id", userId);
  const { count } = await q;
  return count ?? 0;
}

/** Zoho is configured in this environment (ticket sales open). */
export const paymentsEnabled = () =>
  !!process.env.NEXT_PUBLIC_ZOHO_PAY_ACCOUNT_ID && !!process.env.ZOHO_PAY_REFRESH_TOKEN;
