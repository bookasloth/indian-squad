import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";
import { CompareTool } from "@/components/compare-tool";
import { squadConfig } from "@/data/squads";
import { comparisonsFor } from "@/data/comparisons";
import { comparePlayers, defaultPair } from "@/lib/compare-data";

// One indexable page per sport; any pairing is a query string (?a=&b=) on it, so
// there is no flood of near-identical pages (docs/ROUTES.md, "not building").

type Params = { params: Promise<{ sport: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport } = await params;
  const label = sportLabel(sport) ?? sport;
  return pageMeta({
    title: `Compare India ${label.toLowerCase()} players`,
    description: `Pick any two India ${label.toLowerCase()} players and compare them side by side${
      sport === "cricket" ? " — averages, strike rates, phases of the innings, best spells" : ""
    }, then vote on who's better.`,
    path: `/${sport}/compare`,
  });
}

export default async function ComparePage({ params }: Params) {
  const { sport } = await params;
  if (!squadConfig(sport)) notFound();
  const label = sportLabel(sport) ?? sport;
  const list = comparePlayers(sport);
  const curated = comparisonsFor(sport);

  return (
    <div className="flex flex-col gap-10">
      <Crumbs items={[{ label, href: `/${sport}` }, { label: "Compare", href: `/${sport}/compare` }]} />
      <JsonLd
        data={{
          "@type": "WebApplication",
          name: `India ${label.toLowerCase()} player comparison`,
          url: abs(`/${sport}/compare`),
          applicationCategory: "SportsApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        }}
      />
      <header className="flex max-w-prose flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">Compare players</h1>
        <p className="text-lg text-muted-foreground">
          Pick any two India {label.toLowerCase()} players.{" "}
          {sport === "cricket"
            ? "Compare like with like — format by format, phase by phase, and each player's best three-year spell — then say who you'd pick."
            : "See their records side by side, then say who you'd pick."}
        </p>
      </header>

      <CompareTool sport={sport} players={list} defaults={defaultPair(sport, list)} />

      {curated.length > 0 && (
        <nav className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight">The big debates</h2>
          <ul className="flex flex-wrap gap-2">
            {curated.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${sport}/compare/${c.slug}`}
                  className="block rounded-btn border border-border px-3 py-1.5 text-sm transition-ui hover:border-brand"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <Faq
        items={[
          {
            q: "Where do the comparison figures come from?",
            a:
              sport === "cricket"
                ? "Appearances come from our hand-checked squad data. The head-to-head figures are built from Cricsheet's open ball-by-ball data for India internationals and refreshed weekly."
                : "From our hand-checked squad data: caps and, for outfield players, goals.",
          },
          {
            q: "Why compare best three-year spells instead of whole careers?",
            a: "Career totals mostly reward longevity. A player's best three consecutive years shows how good they were at their peak, which is usually what the argument is really about.",
          },
          {
            q: "How does the fan vote work?",
            a: "Signed-in members get one vote per pair and can change it any time. Everyone can see the split.",
          },
        ]}
      />
    </div>
  );
}
