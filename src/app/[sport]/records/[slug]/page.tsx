import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RECORDS, getRecord, ranked, recordsFor } from "@/data/records";
import { withLive } from "@/lib/records-live";
import { sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamicParams = false;

export function generateStaticParams() {
  return RECORDS.map((r) => ({ sport: r.sport, slug: r.slug }));
}

type Params = { params: Promise<{ sport: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport, slug } = await params;
  const r = getRecord(sport, slug);
  return r ? pageMeta({ title: `${r.title}: top ${r.rows.length} list`, description: r.description, path: `/${sport}/records/${r.slug}` }) : {};
}

const H2 = "font-display text-xl font-semibold tracking-tight";

export default async function RecordPage({ params }: Params) {
  const { sport, slug } = await params;
  const base = getRecord(sport, slug);
  const r = base && withLive(base);
  if (!r) notFound();
  const label = sportLabel(sport) ?? sport;
  const path = `/${sport}/records/${r.slug}`;
  const rows = ranked(r.rows);
  const top = rows[0];
  const second = rows.find((x) => x.rank > 1);
  const leader = rows.filter((x) => x.value === top.value);
  const bestActive = rows.find((x) => x.active);
  const anyActive = !!bestActive;
  const others = recordsFor(sport).filter((o) => o.slug !== r.slug);

  // FAQ answers come from the table, so they can't disagree with it.
  const unit = r.valueLabel.toLowerCase();
  const faq = [
    {
      q: r.question,
      a: `${leader.map((x) => x.player).join(" and ")}, with ${top.value} ${unit}${leader.length > 1 ? " each" : ""}${second ? `. ${second.player} is next with ${second.value}` : ""}. Figures as of ${r.asOf}.`,
    },
    // Only worth asking when the leader has retired.
    ...(bestActive && bestActive.rank > 1
      ? [
          {
            q: `Which current player has the most ${r.metric}?`,
            a: `${bestActive.player}, with ${bestActive.value} ${unit} as of ${r.asOf}, which ranks number ${bestActive.rank} on the list.`,
          },
        ]
      : []),
  ];

  return (
    <article className="flex flex-col gap-8">
      <Crumbs
        items={[
          { label, href: `/${sport}` },
          { label: "Records", href: `/${sport}/records` },
          { label: r.title, href: path },
        ]}
      />
      <JsonLd
        data={{
          "@type": "ItemList",
          name: r.title,
          url: abs(path),
          numberOfItems: rows.length,
          itemListElement: rows.map((x, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${x.player} — ${x.value} ${r.valueLabel.toLowerCase()}`,
          })),
        }}
      />

      <header className="flex max-w-prose flex-col gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight">{r.title}</h1>
        {r.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-lg" : "text-muted-foreground"}>
            {p}
          </p>
        ))}
      </header>

      <section className="flex flex-col gap-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">{r.valueLabel}</TableHead>
              <TableHead>{r.detailLabel}</TableHead>
              <TableHead>Span</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((x) => (
              <TableRow key={x.player}>
                <TableCell className="tabular-nums text-muted-foreground">{x.rank}</TableCell>
                <TableCell className="font-medium">
                  {x.player}
                  {x.active && <span aria-label="still playing"> *</span>}
                </TableCell>
                <TableCell className="text-right font-display font-bold tabular-nums">{x.value}</TableCell>
                <TableCell className="text-muted-foreground">{x.detail}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{x.span}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-sm text-muted-foreground">
          Figures as of {r.asOf}.
          {anyActive &&
            (r.live
              ? " * Still playing — updated weekly with new matches from Cricsheet open data."
              : " * Still playing — these figures will rise and may lag the latest match.")}{" "}
          <Link href="/sources" className="underline underline-offset-4">
            How we source figures
          </Link>
          . Spotted an error?{" "}
          <Link href="/corrections" className="underline underline-offset-4">
            Tell us
          </Link>
          .
        </p>
      </section>

      <Faq items={faq} />

      <nav className="flex flex-col gap-3">
        <h2 className={H2}>More {label.toLowerCase()} records</h2>
        <ul className="flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/${sport}/records/${o.slug}`} className="block rounded-btn border border-border px-4 py-2 text-sm transition-ui hover:border-brand">
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
