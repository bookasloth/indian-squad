import type { MetadataRoute } from "next";
import { SPORT_SLUGS } from "@/lib/site";
import { abs } from "@/lib/seo";
import { rosterFor, squadConfig } from "@/data/squads";
import { competitionsFor } from "@/data/competitions";
import { explainersFor } from "@/data/learn";
import { recordsFor } from "@/data/records";
import { quizFor } from "@/data/quiz";
import { teamsFor } from "@/data/teams";
import { rivalriesFor } from "@/data/rivalries";
import { listUpcomingEvents } from "@/lib/events";
import { listProducts } from "@/lib/shop";
import { listApprovedPartners } from "@/lib/partners";

// Rebuilt at most hourly so new events, products and partners show up without a deploy.
export const revalidate = 3600;

const STATIC = [
  "/",
  "/community",
  "/events",
  "/shop",
  "/partners",
  "/partners/terms",
  "/newsletter",
  "/about",
  "/contact",
  "/sources",
  "/editorial-policy",
  "/corrections",
  "/privacy-policy",
  "/terms-of-use",
  "/shipping-policy",
  "/refund-policy",
];

function sportPaths(sport: string): string[] {
  const learn = explainersFor(sport);
  const records = recordsFor(sport);
  const paths = [
    `/${sport}`,
    `/community/${sport}`,
    ...competitionsFor(sport).map((c) => `/${sport}/${c.slug}`),
    ...(learn.length ? [`/${sport}/learn`, ...learn.map((e) => `/${sport}/learn/${e.slug}`)] : []),
    ...(records.length ? [`/${sport}/records`, ...records.map((r) => `/${sport}/records/${r.slug}`)] : []),
    ...teamsFor(sport).map((t) => `/${sport}/teams/${t.slug}`),
    ...rivalriesFor(sport).map((r) => `/${sport}/rivalries/${r.slug}`),
    ...(sport === "cricket" ? ["/cricket/calculator"] : []),
    ...(quizFor(sport).length ? [`/${sport}/quiz`] : []),
  ];
  if (squadConfig(sport)) {
    paths.push(
      `/${sport}/players`,
      `/${sport}/players/women`,
      `/${sport}/xi`,
      `/${sport}/xi/women`,
      ...rosterFor(sport).map((p) => `/${sport}/players/${p.slug}`),
    );
  }
  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const [events, products, partners] = configured
    ? await Promise.all([listUpcomingEvents(), listProducts(), listApprovedPartners()])
    : [[], [], []];

  const paths = [
    ...STATIC,
    ...SPORT_SLUGS.flatMap(sportPaths),
    ...events.map((e) => `/events/${e.slug}`),
    ...products.map((p) => `/shop/${p.slug}`),
    ...partners.map((p) => `/partners/${p.slug}`),
  ];
  return paths.map((path) => ({ url: abs(path) }));
}
