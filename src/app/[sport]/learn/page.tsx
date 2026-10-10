import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXPLAINERS, explainersFor } from "@/data/learn";
import { sportLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Crumbs } from "@/components/seo";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(EXPLAINERS.map((e) => e.sport))].map((sport) => ({ sport }));
}

type Params = { params: Promise<{ sport: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport } = await params;
  const label = sportLabel(sport) ?? sport;
  return pageMeta({
    title: `${label} explained: rules and guides`,
    description: `Plain-English guides to ${label.toLowerCase()}: the rules, how scoring works, and the terms you hear on commentary.`,
    path: `/${sport}/learn`,
  });
}

export default async function LearnIndexPage({ params }: Params) {
  const { sport } = await params;
  const items = explainersFor(sport);
  if (items.length === 0) notFound();
  const label = sportLabel(sport) ?? sport;

  return (
    <div className="flex flex-col gap-8">
      <Crumbs items={[{ label, href: `/${sport}` }, { label: "Learn", href: `/${sport}/learn` }]} />
      <header className="flex max-w-prose flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">{label}, explained</h1>
        <p className="text-lg text-muted-foreground">
          The rules, the maths and the language of {label.toLowerCase()}, written plainly.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((e) => (
          <li key={e.slug}>
            <Link href={`/${sport}/learn/${e.slug}`} className="group block h-full">
              <Card className="h-full transition-ui group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>{e.title}</CardTitle>
                  <CardDescription>{e.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
