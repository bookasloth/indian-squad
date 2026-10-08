import { supabaseAdmin } from "@/lib/supabase/server";
import { getMemberContext } from "@/lib/members/session";
import { rsvpCount } from "@/lib/events";
import { allow } from "@/lib/rate-limit";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Free registration for an RSVP event: { eventId, join: boolean }. The organiser sees name + email.
export async function POST(req: Request) {
  const { user } = await getMemberContext();
  if (!user?.email) return Response.json({ error: "Sign in to register." }, { status: 401 });
  if (!user.email_confirmed_at) return Response.json({ error: "Confirm your email first." }, { status: 403 });
  if (!(await allow(`rsvp:${user.id}`, 20, 60_000))) return Response.json({ error: "Slow down." }, { status: 429 });

  const { eventId, join } = (await req.json().catch(() => ({}))) as { eventId?: unknown; join?: unknown };
  if (typeof eventId !== "string" || !UUID.test(eventId)) return Response.json({ error: "Unknown event." }, { status: 400 });

  const db = supabaseAdmin();
  const { data: ev } = await db
    .from("is_events")
    .select("id, starts_at, capacity")
    .eq("id", eventId)
    .eq("published", true)
    .eq("ticketing", "rsvp")
    .maybeSingle<{ id: string; starts_at: string; capacity: number | null }>();
  if (!ev) return Response.json({ error: "Unknown event." }, { status: 404 });
  if (new Date(ev.starts_at) <= new Date()) return Response.json({ error: "This event has already started." }, { status: 409 });

  if (join !== true) {
    await db.from("is_event_rsvps").delete().eq("event_id", ev.id).eq("user_id", user.id);
    return Response.json({ ok: true, joined: false });
  }

  // ponytail: count-then-insert can overshoot capacity by a seat or two under a burst; fine for free RSVPs.
  if (ev.capacity && (await rsvpCount(ev.id)) >= ev.capacity) return Response.json({ error: "It's full." }, { status: 409 });
  const name = (user.user_metadata?.full_name as string | undefined)?.trim() || user.email.split("@")[0];
  const { error } = await db
    .from("is_event_rsvps")
    .upsert({ event_id: ev.id, user_id: user.id, name, email: user.email }, { onConflict: "event_id,user_id", ignoreDuplicates: true });
  if (error) return Response.json({ error: "Couldn't register. Try again." }, { status: 500 });
  return Response.json({ ok: true, joined: true });
}
