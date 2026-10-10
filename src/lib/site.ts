/**
 * Single source of truth for site-wide identity. Reskinned for Indian Sports Club
 * (the source site's extra nav/company config was dropped).
 */
export const site = {
  name: "Indian Sports Club",
  alias: "Indian Sports Club",
  shortName: "ISC",
  role: "The 12th Man of Indian sport",
  domain: "sports-club-djlaxne-4073.vercel.app",
  url: "https://sports-club-djlaxne-4073.vercel.app",
  email: "isc@shubhamdatarkar.com",
  /** A personal project, not a company. Linked from the footer, About, legal pages and emails. */
  owner: { name: "Shubham Datarkar", url: "https://shubhamdatarkar.com" },
  location: "Nagpur, India",
  tagline: "We stand united. We are the 12th Man.",
  description:
    "Indian Sports Club — a fan club for Indian sport. A passionate community backing Team India across cricket, hockey, kabaddi, badminton, football, and F1.",
} as const;

/** The sports the fan club follows. Each gets a hub at /<slug> (docs/MULTISPORT.md).
 * `blurb` is the hub's one-liner — placeholder until the copy in docs/COPY.md lands. */
export const SPORTS = [
  { slug: "cricket", label: "Cricket", blurb: "Team India in Tests, ODIs and T20Is — the squad, your XI, and the talk." },
  { slug: "hockey", label: "Hockey", blurb: "India on the hockey pitch, from the Pro League to the Olympics." },
  { slug: "kabaddi", label: "Kabaddi", blurb: "Raids, tackles and the Pro Kabaddi League." },
  { slug: "badminton", label: "Badminton", blurb: "India's shuttlers on the BWF World Tour and beyond." },
  { slug: "football", label: "Football", blurb: "The Blue Tigers, the ISL and Indian football." },
  { slug: "f1", label: "F1", blurb: "Formula 1, followed from India." },
] as const;

export type SportSlug = (typeof SPORTS)[number]["slug"];

export const SPORT_SLUGS = SPORTS.map((s) => s.slug) as SportSlug[];

export function getSport(slug: string | null | undefined) {
  return SPORTS.find((s) => s.slug === slug) ?? null;
}

export function sportLabel(slug: string | null | undefined): string | null {
  return getSport(slug)?.label ?? null;
}
