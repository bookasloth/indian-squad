// Pure validation for partner applications and partner-submitted events (no server-only deps),
// so scripts/partners.test.mjs can run it directly.
import { SPORT_SLUGS } from "./site.ts";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const len = (s: string, min: number, max: number) => s.length >= min && s.length <= max;

/** Optional https URL (website / Instagram). Empty → null; anything else must parse and be https. */
function httpsUrl(v: unknown): string | null | false {
  const s = str(v);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === "https:" ? u.toString() : false;
  } catch {
    return false;
  }
}

export function normalisePhone(v: unknown) {
  return str(v).replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
}

export type PartnerApplication = {
  org_name: string;
  contact_name: string;
  phone: string;
  city: string;
  sports: string[];
  about: string;
  website: string | null;
};

export function parsePartnerApplication(body: unknown): Result<PartnerApplication> {
  const b = (body ?? {}) as Record<string, unknown>;
  const org_name = str(b.org_name);
  const contact_name = str(b.contact_name);
  const phone = normalisePhone(b.phone);
  const city = str(b.city);
  const about = str(b.about);
  const sports = Array.isArray(b.sports) ? [...new Set(b.sports.map(str))] : [];
  const website = httpsUrl(b.website);

  if (!len(org_name, 2, 100)) return { ok: false, error: "Enter your organisation's name." };
  if (!len(contact_name, 2, 80)) return { ok: false, error: "Enter the contact person's name." };
  if (!/^[6-9]\d{9}$/.test(phone)) return { ok: false, error: "Enter a 10-digit Indian mobile number." };
  if (!len(city, 2, 60)) return { ok: false, error: "Enter your city." };
  if (!sports.length || !sports.every((s) => (SPORT_SLUGS as string[]).includes(s))) {
    return { ok: false, error: "Pick at least one sport." };
  }
  if (about.length > 1000) return { ok: false, error: "Keep the description under 1,000 characters." };
  if (website === false) return { ok: false, error: "Website must be a full https:// link." };
  if (b.agree !== true) return { ok: false, error: "Accept the partner terms to apply." };

  return { ok: true, value: { org_name, contact_name, phone, city, sports, about, website } };
}

export type PartnerEvent = {
  title: string;
  description: string;
  sport: string | null;
  venue: string;
  city: string;
  starts_at: string;
  ends_at: string | null;
  ticketing: "rsvp" | "external";
  external_url: string | null;
  price: number;
  capacity: number | null;
};

/** `<input type="datetime-local">` value ("2026-10-24T19:30") read as India time → ISO with +05:30. */
function istDateTime(v: unknown): string | null {
  const s = str(v);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return null;
  const iso = `${s}:00+05:30`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

// P0: partners can only list free (rsvp) or external-ticketed events. Paid-through-us comes with Route (P1).
export function parsePartnerEvent(body: unknown, now = Date.now()): Result<PartnerEvent> {
  const b = (body ?? {}) as Record<string, unknown>;
  const title = str(b.title);
  const description = str(b.description);
  const sport = str(b.sport) || null;
  const venue = str(b.venue);
  const city = str(b.city);
  const starts_at = istDateTime(b.starts_at);
  const ends_at = str(b.ends_at) ? istDateTime(b.ends_at) : null;
  const ticketing = b.ticketing === "external" ? "external" : b.ticketing === "rsvp" ? "rsvp" : null;
  const external_url = httpsUrl(b.external_url);
  const price = ticketing === "external" ? Number(b.price || 0) : 0;
  const capacity = str(String(b.capacity ?? "")) ? Number(b.capacity) : null;

  if (!len(title, 3, 120)) return { ok: false, error: "Title must be 3–120 characters." };
  if (description.length > 2000) return { ok: false, error: "Keep the description under 2,000 characters." };
  if (sport && !(SPORT_SLUGS as string[]).includes(sport)) return { ok: false, error: "Pick a sport." };
  if (!len(venue, 2, 120)) return { ok: false, error: "Enter the venue." };
  if (!len(city, 2, 60)) return { ok: false, error: "Enter the city." };
  if (!starts_at) return { ok: false, error: "Enter the start date and time." };
  if (Date.parse(starts_at) < now + 60 * 60 * 1000) return { ok: false, error: "The event must start at least an hour from now." };
  if (str(b.ends_at) && !ends_at) return { ok: false, error: "Enter a valid end date and time." };
  if (ends_at && Date.parse(ends_at) <= Date.parse(starts_at)) return { ok: false, error: "The event must end after it starts." };
  if (!ticketing) return { ok: false, error: "Choose free registration or your own ticket link." };
  if (ticketing === "external" && !external_url) return { ok: false, error: "Add your ticket link (https://…)." };
  if (external_url === false) return { ok: false, error: "Ticket link must be a full https:// link." };
  if (!Number.isFinite(price) || price < 0 || price > 100000) return { ok: false, error: "Price must be ₹0–1,00,000." };
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1 || capacity > 100000)) {
    return { ok: false, error: "Capacity must be a whole number, or leave it empty." };
  }

  return {
    ok: true,
    value: {
      title,
      description,
      sport,
      venue,
      city,
      starts_at,
      ends_at,
      ticketing,
      external_url: ticketing === "external" ? (external_url as string) : null,
      price,
      capacity,
    },
  };
}
