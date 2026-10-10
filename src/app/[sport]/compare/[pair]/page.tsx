import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPARISONS, comparisonsFor, getComparison } from "@/data/comparisons";
import { sportLabel } from "@/lib/site";
import { abs, pageMeta, type Qa } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";
import { CompareTool } from "@/components/compare-tool";
import { comparePlayers, statsUpdated } from "@/lib/compare-data";
import { FORMAT_LABEL, compareRows, type Row } from "@/lib/compare-rows";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ sport: c.sport, pair: c.slug }));
}

type Params = { params: Promise<{ sport: string; pair: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport, pair } = await params;
  const c = getComparison(sport, pair);
  return c ? pageMeta({ title: `${c.title}: who's better?`, description: c.description, path: `/${sport}/compare/${c.slug}` }) : {};
}

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** FAQ answers built from the table, so they always match it. */
function generatedFaq(a: string, b: string, format: string, rows: Row[], group: "Batting" | "Bowling"): Qa[] {
  const pick = (label: string) => rows.find((r) => r.group === group && r.label === label);
  const out: Qa[] = [];
  const ask = (label: string, noun: string, lowerIsBetter = false) => {
    const r = pick(label);
    if (!r || r.better === null) return;
    const [win, lose, wv, lv] = r.better === "a" ? [a, b, r.a, r.b] : [b, a, r.b, r.a];
    out.push({
      q: `Who has the better ${format} ${noun}, ${a} or ${b}?`,
      a: `${win}: ${wv} to ${lose}'s ${lv}${lowerIsBetter ? " (lower is better)" : ""}, in India internationals covered by Cricsheet ball-by-ball data.`,
    });
  };
  if (group === "Batting") {
    ask("Average", "batting average");
    ask("Strike rate", "strike rate");
    ask("Average vs top sides", "average against the top sides");
  } else {
    ask("Average", "bowling average", true);
    ask("Economy", "economy rate", true);
    ask("Strike rate (balls per wicket)", "bowling strike rate", true);
  }
  return out;
}

export default async function ComparisonPage({ params }: Params) {
  const { sport, pair } = await params;
  const c = getComparison(sport, pair);
  if (!c) notFound();
  const label = sportLabel(sport) ?? sport;
  const list = comparePlayers(sport);
  const A = list.find((p) => p.slug === c.a);
  const B = list.find((p) => p.slug === c.b);
  if (!A || !B) notFound();
  const path = `/${sport}/compare/${c.slug}`;
  const rows = compareRows(c.format, A.deep?.[c.format], B.deep?.[c.format]);
  const fmtLabel = FORMAT_LABEL[c.format];
  const faq: Qa[] = [
    { q: `Who is better in ${fmtLabel}, ${A.name} or ${B.name}?`, a: c.verdict },
    ...generatedFaq(A.name, B.name, fmtLabel.replace(/s$/, ""), rows, c.kind === "batting" ? "Batting" : "Bowling"),
  ];
  const others = comparisonsFor(sport).filter((o) => o.slug !== c.slug);

  return (
    <article className="flex flex-col gap-10">
      <Crumbs
        items={[
          { label, href: `/${sport}` },
          { label: "Compare", href: `/${sport}/compare` },
          { label: `${A.name} vs ${B.name}`, href: path },
        ]}
      />
      <JsonLd
        data={{
          "@type": "Article",
          headline: c.title,
          description: c.description,
          url: abs(path),
          dateModified: statsUpdated,
          about: [
            { "@type": "Person", name: A.name, url: abs(`/${sport}/players/${A.slug}`) },
            { "@type": "Person", name: B.name, url: abs(`/${sport}/players/${B.slug}`) },
          ],
          author: { "@id": abs("/#org") },
          publisher: { "@id": abs("/#org") },
        }}
      />

      <header className="flex max-w-prose flex-col gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight">{c.title}</h1>
        {c.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-lg" : "text-muted-foreground"}>
            {p}
          </p>
        ))}
      </header>

      <section className="flex max-w-prose flex-col gap-2 rounded-card border border-border bg-muted/40 p-5">
        <h2 className="font-display text-lg font-semibold tracking-tight">Our take</h2>
        <p>{c.verdict}</p>
      </section>

      <CompareTool sport={sport} players={[A, B]} defaults={[A.slug, B.slug]} fixed initialFormat={c.format} />

      <p className="text-sm text-muted-foreground">
        Figures from Cricsheet ball-by-ball data, updated weekly; newest match {longDate(statsUpdated)}.{" "}
        <Link href={`/${sport}/compare?a=${A.slug}&b=${B.slug}`} className="underline underline-offset-4">
          Compare either player with someone else
        </Link>
        .
      </p>

      <Faq items={faq} />

      {others.length > 0 && (
        <nav className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight">More debates</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/${sport}/compare/${o.slug}`}
                  className="block rounded-btn border border-border px-3 py-1.5 text-sm transition-ui hover:border-brand"
                >
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
