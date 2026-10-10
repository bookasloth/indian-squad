import Link from "next/link";
import { notFound } from "next/navigation";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";
import { CricketCalculator } from "@/components/cricket-calculator";

// Cricket only for now; F1 gets a points calculator in phase 4 (docs/ROUTES.md).
export const dynamicParams = false;
export const generateStaticParams = () => [{ sport: "cricket" }];

export const metadata = pageMeta({
  title: "Cricket calculator: average, strike rate, economy, run rate, NRR",
  description:
    "Free cricket calculators: batting and bowling average, strike rate, economy, run rate, required run rate and net run rate. Overs entered the cricket way (18.2).",
  path: "/cricket/calculator",
});

export default async function CalculatorPage({ params }: { params: Promise<{ sport: string }> }) {
  if ((await params).sport !== "cricket") notFound();

  return (
    <div className="flex flex-col gap-8">
      <Crumbs items={[{ label: "Cricket", href: "/cricket" }, { label: "Calculator", href: "/cricket/calculator" }]} />
      <JsonLd
        data={{
          "@type": "WebApplication",
          name: "Cricket calculator",
          url: abs("/cricket/calculator"),
          applicationCategory: "SportsApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        }}
      />
      <header className="flex max-w-prose flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">Cricket calculator</h1>
        <p className="text-lg text-muted-foreground">
          Work out averages, strike rates, economy, run rates and net run rate. Enter overs the way they are written on a
          scorecard — 18.2 means 18 overs and two balls.
        </p>
      </header>

      <CricketCalculator />

      <Faq
        items={[
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
        ]}
      />

      <p className="text-sm text-muted-foreground">
        Want the reasoning?{" "}
        <Link href="/cricket/learn/net-run-rate" className="underline underline-offset-4">
          Net run rate explained
        </Link>{" "}
        ·{" "}
        <Link href="/cricket/learn/how-to-read-a-scorecard" className="underline underline-offset-4">
          How to read a scorecard
        </Link>
      </p>
    </div>
  );
}
