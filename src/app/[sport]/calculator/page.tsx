import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { abs, pageMeta, type Qa } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";
import { CricketCalculator } from "@/components/cricket-calculator";
import { F1PointsCalculator } from "@/components/f1-points-calculator";

// One calculator page per sport that has one (docs/ROUTES.md).
const CALCULATORS: Record<
  string,
  {
    label: string;
    title: string;
    description: string;
    h1: string;
    lead: string;
    Tool: () => React.ReactNode;
    faq: Qa[];
    links: { label: string; href: string }[];
  }
> = {
  cricket: {
    label: "Cricket",
    title: "Cricket calculator: average, strike rate, economy, run rate, NRR",
    description:
      "Free cricket calculators: batting and bowling average, strike rate, economy, run rate, required run rate and net run rate. Overs entered the cricket way (18.2).",
    h1: "Cricket calculator",
    lead: "Work out averages, strike rates, economy, run rates and net run rate. Enter overs the way they are written on a scorecard — 18.2 means 18 overs and two balls.",
    Tool: CricketCalculator,
    faq: [
      {
        q: "How do you calculate batting average?",
        a: "Divide the runs scored by the number of times the batter was out. Not-out innings add runs but not dismissals, so a batter with 450 runs and 10 dismissals averages 45.",
      },
      {
        q: "How do you calculate strike rate in cricket?",
        a: "For a batter, runs divided by balls faced, times 100. For a bowler, balls bowled divided by wickets taken.",
      },
      {
        q: "Why do my overs give the wrong answer in a normal calculator?",
        a: "Because 18.2 overs is 18 overs and two balls — 110 balls — not 18.2 of anything. These calculators convert overs to balls first, which is how official figures are worked out.",
      },
      {
        q: "How is net run rate calculated?",
        a: "Total runs scored divided by total overs faced, minus total runs conceded divided by total overs bowled, across the whole tournament. If a side is bowled out, its full quota of overs counts.",
      },
    ],
    links: [
      { label: "Net run rate explained", href: "/cricket/learn/net-run-rate" },
      { label: "How to read a scorecard", href: "/cricket/learn/how-to-read-a-scorecard" },
    ],
  },
  f1: {
    label: "F1",
    title: "F1 points calculator: Grand Prix and sprint points",
    description:
      "Work out Formula One championship points from finishing positions: 25-18-15-12-10-8-6-4-2-1 for a Grand Prix and 8-7-6-5-4-3-2-1 for a sprint.",
    h1: "F1 points calculator",
    lead: "Add up championship points from a run of Grand Prix and sprint finishes, using the current points system.",
    Tool: F1PointsCalculator,
    faq: [
      {
        q: "How many points does an F1 race win get?",
        a: "Twenty-five. Points go to the top ten: 25, 18, 15, 12, 10, 8, 6, 4, 2 and 1.",
      },
      {
        q: "How many points does a sprint win get?",
        a: "Eight. Sprint points go to the top eight: 8, 7, 6, 5, 4, 3, 2 and 1.",
      },
      {
        q: "Is there still a point for fastest lap?",
        a: "No. The bonus point for the fastest lap was dropped from the 2025 season.",
      },
    ],
    links: [
      { label: "The F1 points system explained", href: "/f1/learn/points-system" },
      { label: "Every F1 world champion", href: "/f1/drivers-championship" },
    ],
  },
};

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(CALCULATORS).map((sport) => ({ sport }));

type Params = { params: Promise<{ sport: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport } = await params;
  const c = CALCULATORS[sport];
  return c ? pageMeta({ title: c.title, description: c.description, path: `/${sport}/calculator` }) : {};
}

export default async function CalculatorPage({ params }: Params) {
  const { sport } = await params;
  const c = CALCULATORS[sport];
  if (!c) notFound();
  const path = `/${sport}/calculator`;

  return (
    <div className="flex flex-col gap-8">
      <Crumbs items={[{ label: c.label, href: `/${sport}` }, { label: "Calculator", href: path }]} />
      <JsonLd
        data={{
          "@type": "WebApplication",
          name: c.h1,
          url: abs(path),
          applicationCategory: "SportsApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        }}
      />
      <header className="flex max-w-prose flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">{c.h1}</h1>
        <p className="text-lg text-muted-foreground">{c.lead}</p>
      </header>

      <c.Tool />

      <Faq items={c.faq} />

      <p className="text-sm text-muted-foreground">
        Want the reasoning?{" "}
        {c.links.map((l, i) => (
          <span key={l.href}>
            {i > 0 && " · "}
            <Link href={l.href} className="underline underline-offset-4">
              {l.label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
