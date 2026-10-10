import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { Crumbs } from "@/components/seo";
import { FixtureTable } from "@/components/fixture-table";
import { indiaUpcomingFixtures } from "@/lib/live/cricket-fixtures";

// Cricket only: fixtures come from CricketData.org (needs CRICKETDATA_API_KEY).
export const dynamicParams = false;
export const generateStaticParams = () => [{ sport: "cricket" }];
export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  const fixtures = await indiaUpcomingFixtures();
  return {
    ...pageMeta({
      title: "India cricket schedule: upcoming matches",
      description: "India's upcoming men's and women's cricket fixtures — dates, venues and formats, updated automatically.",
      path: "/cricket/schedule",
    }),
    // An empty schedule is a thin page; keep it out of search until there are fixtures.
    ...(fixtures && fixtures.length > 0 ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function SchedulePage({ params }: { params: Promise<{ sport: string }> }) {
  if ((await params).sport !== "cricket") notFound();
  const fixtures = await indiaUpcomingFixtures();

  return (
    <div className="flex flex-col gap-8">
      <Crumbs items={[{ label: "Cricket", href: "/cricket" }, { label: "Schedule", href: "/cricket/schedule" }]} />
      <header className="flex max-w-prose flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">India cricket schedule</h1>
        <p className="text-lg text-muted-foreground">
          India&rsquo;s upcoming men&rsquo;s and women&rsquo;s matches. Times are in IST.
        </p>
      </header>

      {fixtures && fixtures.length > 0 ? (
        <FixtureTable fixtures={fixtures} source="CricketData.org" />
      ) : (
        <p className="rounded-card border border-dashed border-border px-5 py-4 text-muted-foreground">
          {fixtures ? "No India matches are scheduled right now." : "The fixture list isn't available at the moment."}{" "}
          <Link href="/community/cricket" className="underline underline-offset-4">
            Talk cricket in the community
          </Link>{" "}
          while you wait.
        </p>
      )}
    </div>
  );
}
