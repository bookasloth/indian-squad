import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RECORDS, recordsFor } from "@/data/records";
import { withLive } from "@/lib/records-live";
import { sportLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Crumbs } from "@/components/seo";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(RECORDS.map((r) => r.sport))].map((sport) => ({ sport }));
}

type Params = { params: Promise<{ sport: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport } = await params;
  const label = sportLabel(sport) ?? sport;
  return pageMeta({
    title: `India ${label.toLowerCase()} records`,
    description: `India's leading ${label.toLowerCase()} run-scorers and wicket-takers in every format, plus all-time IPL records.`,
    path: `/${sport}/records`,
  });
}

export default async function RecordsIndexPage({ params }: Params) {
  const { sport } = await params;
  const items = recordsFor(sport).map((r) => withLive(r));
  if (items.length === 0) notFound();
  const label = sportLabel(sport) ?? sport;

  return (
    <div className="flex flex-col gap-8">
      <Crumbs items={[{ label, href: `/${sport}` }, { label: "Records", href: `/${sport}/records` }]} />
      <header className="flex max-w-prose flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">India {label.toLowerCase()} records</h1>
        <p className="text-lg text-muted-foreground">The top tens that matter, kept current and sourced.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <li key={r.slug}>
            <Link href={`/${sport}/records/${r.slug}`} className="group block h-full">
              <Card className="h-full transition-ui group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>{r.title}</CardTitle>
                  <CardDescription>
                    {r.rows[0].player} · {r.rows[0].value}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
