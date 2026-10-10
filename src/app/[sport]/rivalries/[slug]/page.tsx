import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RIVALRIES, finalsBetween, getRivalry, rivalriesFor } from "@/data/rivalries";
import { sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return RIVALRIES.map((r) => ({ sport: r.sport, slug: r.slug }));
}

type Params = { params: Promise<{ sport: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport, slug } = await params;
  const r = getRivalry(sport, slug);
  const label = sportLabel(sport) ?? sport;
  return r
    ? pageMeta({ title: `${r.title} ${label.toLowerCase()}: history and biggest matches`, description: r.description, path: `/${sport}/rivalries/${r.slug}` })
    : {};
}

const H2 = "font-display text-xl font-semibold tracking-tight";

export default async function RivalryPage({ params }: Params) {
  const { sport, slug } = await params;
  const r = getRivalry(sport, slug);
  if (!r) notFound();
  const label = sportLabel(sport) ?? sport;
  const path = `/${sport}/rivalries/${r.slug}`;
  const finals = finalsBetween(r);
  const others = rivalriesFor(sport).filter((o) => o.slug !== r.slug);

  return (
    <article className="mx-auto flex w-full max-w-prose flex-col gap-8">
      <Crumbs items={[{ label, href: `/${sport}` }, { label: r.title, href: path }]} />
      <JsonLd
        data={{
          "@type": "Article",
          headline: `${r.title}: ${label.toLowerCase()} rivalry`,
          description: r.description,
          url: abs(path),
          author: { "@id": abs("/#org") },
          publisher: { "@id": abs("/#org") },
        }}
      />

      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight">{r.title}</h1>
        {r.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-lg" : "text-muted-foreground"}>
            {p}
          </p>
        ))}
      </header>

      {finals.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className={H2}>World Cup finals between them</h2>
          <ul className="flex flex-col divide-y divide-border rounded-card border border-border">
            {finals.map((f) => (
              <li key={`${f.competition.slug}-${f.year}`} className="flex items-baseline justify-between gap-4 px-5 py-3">
                <span>
                  <span className="font-medium tabular-nums">{f.year}</span>{" "}
                  <Link href={`/${sport}/${f.competition.slug}`} className="underline underline-offset-4">
                    {f.competition.short}
                  </Link>
                </span>
                <span className="font-semibold">{f.winner} won</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className={H2}>Moments that defined it</h2>
        <ol className="flex flex-col gap-4 border-l-2 border-border pl-5">
          {r.moments.map((m) => (
            <li key={m.year} className="flex flex-col gap-1">
              <span className="font-display font-bold tabular-nums">{m.year}</span>
              <span>{m.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <Faq items={r.faq} />

      <nav className="flex flex-col gap-3">
        <h2 className={H2}>More rivalries</h2>
        <ul className="flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/${sport}/rivalries/${o.slug}`} className="block rounded-btn border border-border px-4 py-2 text-sm transition-ui hover:border-brand">
                {o.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/${sport}/teams/india-men`} className="block rounded-btn border border-border px-4 py-2 text-sm transition-ui hover:border-brand">
              India men&rsquo;s team
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
