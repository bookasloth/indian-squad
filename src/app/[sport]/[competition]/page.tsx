import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPETITIONS, competitionsFor, getCompetition, titleCounts } from "@/data/competitions";
import { sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamicParams = false;

// Bottom-up params, like the player page: the [sport] layout's params don't reach here.
export function generateStaticParams() {
  return COMPETITIONS.map((c) => ({ sport: c.sport, competition: c.slug }));
}

type Params = { params: Promise<{ sport: string; competition: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport, competition } = await params;
  const c = getCompetition(sport, competition);
  if (!c) return {};
  return pageMeta({ title: `${c.short} winners list and history`, description: c.description, path: `/${sport}/${c.slug}` });
}

const H2 = "font-display text-xl font-semibold tracking-tight";

export default async function CompetitionPage({ params }: Params) {
  const { sport, competition } = await params;
  const c = getCompetition(sport, competition);
  if (!c) notFound();
  const label = sportLabel(sport) ?? sport;
  const path = `/${sport}/${c.slug}`;
  const hasHost = c.editions.some((e) => e.host);
  const others = competitionsFor(sport).filter((o) => o.slug !== c.slug);

  return (
    <article className="flex flex-col gap-10">
      <Crumbs items={[{ label, href: `/${sport}` }, { label: c.short, href: path }]} />
      <JsonLd
        data={{
          "@type": "SportsOrganization",
          name: c.name,
          sport: label,
          url: abs(path),
          description: c.description,
        }}
      />

      <header className="flex max-w-prose flex-col gap-4">
        <h1 className="font-display text-4xl font-bold tracking-tight">{c.name}</h1>
        {c.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-lg" : "text-muted-foreground"}>
            {p}
          </p>
        ))}
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.facts.map((f) => (
          <div key={f.label} className="rounded-card border border-border px-5 py-4">
            <dt className="text-sm text-muted-foreground">{f.label}</dt>
            <dd className="font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      <section className="flex max-w-prose flex-col gap-2">
        <h2 className={H2}>India at the {c.short}</h2>
        <p>{c.india}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={H2}>Every {c.short} winner</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Champion</TableHead>
              <TableHead>Runner-up</TableHead>
              {hasHost && <TableHead>Host</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {c.editions.map((e) => (
              <TableRow key={e.year}>
                <TableCell className="font-medium tabular-nums">{e.year}</TableCell>
                <TableCell className="font-medium">{e.winner}</TableCell>
                <TableCell className="text-muted-foreground">{e.runnerUp}</TableCell>
                {hasHost && <TableCell className="text-muted-foreground">{e.host}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={H2}>Titles by team</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {titleCounts(c).map((t) => (
            <li key={t.team} className="flex items-baseline justify-between gap-4 rounded-card border border-border px-5 py-3">
              <span>{t.team}</span>
              <span className="font-display text-xl font-bold tabular-nums">{t.titles}</span>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={c.faq} />

      <p className="text-sm text-muted-foreground">
        Last reviewed {c.reviewed}. Checked against {c.checkedAgainst}.{" "}
        <Link href="/sources" className="underline underline-offset-4">
          How we source facts
        </Link>
        .
      </p>

      {others.length > 0 && (
        <nav className="flex flex-col gap-3">
          <h2 className={H2}>More {label.toLowerCase()} competitions</h2>
          <ul className="flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/${sport}/${o.slug}`} className="block rounded-btn border border-border px-4 py-2 text-sm transition-ui hover:border-brand">
                  {o.short}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/community/${sport}`} className="block rounded-btn border border-border px-4 py-2 text-sm transition-ui hover:border-brand">
                Talk {label.toLowerCase()} in the community
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </article>
  );
}
