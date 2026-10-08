import "server-only";

import { supabaseAdmin, supabaseAnon } from "@/lib/supabase/server";
import { EVENT_COLS, type EventRow } from "@/lib/events";

export type PartnerStatus = "pending" | "approved" | "rejected" | "suspended";

export type Partner = {
  id: string;
  user_id: string;
  slug: string;
  org_name: string;
  contact_name: string;
  phone: string;
  city: string;
  sports: string[];
  about: string;
  website: string | null;
  status: PartnerStatus;
  created_at: string;
};

/** What the public may see (from the is_partners_public view: approved only, no phone/contact). */
export type PartnerPublic = Pick<Partner, "id" | "slug" | "org_name" | "city" | "sports" | "about" | "website">;

const PUBLIC_COLS = "id, slug, org_name, city, sports, about, website";
const PARTNER_COLS = "id, user_id, slug, org_name, contact_name, phone, city, sports, about, website, status, created_at";

export async function getPartnerForUser(userId: string): Promise<Partner | null> {
  const { data } = await supabaseAdmin().from("is_partners").select(PARTNER_COLS).eq("user_id", userId).maybeSingle<Partner>();
  return data;
}

export async function getPartnerPublic(slug: string): Promise<PartnerPublic | null> {
  const { data } = await supabaseAnon().from("is_partners_public").select(PUBLIC_COLS).eq("slug", slug).maybeSingle<PartnerPublic>();
  return data;
}

/** Approved partners by id, for "Organised by …" labels. */
export async function getPartnersPublic(ids: string[]): Promise<Map<string, PartnerPublic>> {
  if (!ids.length) return new Map();
  const { data } = await supabaseAnon().from("is_partners_public").select(PUBLIC_COLS).in("id", [...new Set(ids)]);
  return new Map(((data ?? []) as PartnerPublic[]).map((p) => [p.id, p]));
}

export async function listApprovedPartners(): Promise<PartnerPublic[]> {
  const { data } = await supabaseAnon().from("is_partners_public").select(PUBLIC_COLS).order("created_at");
  return (data ?? []) as PartnerPublic[];
}

export type PartnerEventRow = EventRow & {
  published: boolean;
  submitted_at: string | null;
  rsvps: { name: string; email: string; created_at: string }[];
};

/** All of a partner's events (incl. under review / not approved), newest first, with their RSVPs. Service role. */
export async function listPartnerEvents(partnerId: string): Promise<PartnerEventRow[]> {
  const { data } = await supabaseAdmin()
    .from("is_events")
    .select(`${EVENT_COLS}, published, submitted_at, rsvps:is_event_rsvps(name, email, created_at)`)
    .eq("partner_id", partnerId)
    .order("starts_at", { ascending: false });
  return (data ?? []) as unknown as PartnerEventRow[];
}

/** Admin queue: partners awaiting approval and partner events awaiting review. */
export async function listReviewQueue() {
  const db = supabaseAdmin();
  const [partners, events] = await Promise.all([
    db.from("is_partners").select(PARTNER_COLS).eq("status", "pending").order("created_at"),
    db
      .from("is_events")
      .select(`${EVENT_COLS}, partner:is_partners(org_name, slug, status)`)
      .eq("published", false)
      .not("submitted_at", "is", null)
      .not("partner_id", "is", null)
      .order("submitted_at"),
  ]);
  return {
    partners: (partners.data ?? []) as Partner[],
    events: (events.data ?? []) as unknown as (EventRow & { partner: { org_name: string; slug: string; status: string } | null })[],
  };
}
