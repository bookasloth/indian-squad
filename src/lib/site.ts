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

/** The sports the fan club follows. Cricket is the flagship (full features today). */
export const SPORTS = [
  { slug: "cricket", label: "Cricket" },
  { slug: "hockey", label: "Hockey" },
  { slug: "kabaddi", label: "Kabaddi" },
  { slug: "badminton", label: "Badminton" },
  { slug: "football", label: "Football" },
  { slug: "f1", label: "F1" },
] as const;

export type SportSlug = (typeof SPORTS)[number]["slug"];

export const SPORT_SLUGS = SPORTS.map((s) => s.slug) as SportSlug[];

export function sportLabel(slug: string | null | undefined): string | null {
  return SPORTS.find((s) => s.slug === slug)?.label ?? null;
}
