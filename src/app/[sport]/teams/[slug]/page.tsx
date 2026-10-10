import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEAMS, finalsOf, getTeam, teamsFor } from "@/data/teams";
import { sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEAMS.map((t) => ({ sport: t.sport, slug: t.slug }));
}

type Params = { params: Promise<{ sport: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport, slug } = await params;
  const t = getTeam(sport, slug);
  return t ? pageMeta({ title: t.league ? `${t.name}: ${t.league} titles and history` : t.name, description: t.description, path: `/${sport}/teams/${t.slug}` }) : {};
}

const H2 = "font-display text-xl font-semibold tracking-tight";

export default async function TeamPage({ params }: Params) {
  const { sport, slug } = await params;
  const t = getTeam(sport, slug);
  if (!t) notFound();
  const label = sportLabel(sport) ?? sport;
  const path = `/${sport}/teams/${t.slug}`;
  const finals = finalsOf(t);
  const titles = finals.filter((f) => f.won);
  const siblings = teamsFor(sport).filter((o) => o.kind === t.kind && o.slug !== t.slug);

  // Franchise FAQ is derived from the finals list so it stays in step with the league page.
  const faq =
    t.faq.length > 0
      ? t.faq
      : [
          {
            q: `How many ${t.league} titles have ${t.name} won?`,
            a:
              titles.length === 0
                ? `None yet.${finals.length ? ` They have reached ${finals.length === 1 ? "one final" : `${finals.length} finals`} (${finals.map((f) => f.year).reverse().join(", ")}).` : ""}`
                : `${titles.length}: ${titles.map((f) => f.year).reverse().join(", ")}.`,
          },
          {
            q: `Where do ${t.name} play their home matches?`,
            a: `${t.facts.find((f) => f.label === "Home ground")?.value}, in ${t.facts.find((f) => f.label === "City")?.value}.`,
          },
        ];

  return (
    <article className="flex flex-col gap-8">
      <Crumbs items={[{ label, href: `/${sport}` }, { label: t.name, href: path }]} />
      <JsonLd data={{ "@type": "SportsTeam", name: t.name, sport: label, url: abs(path), description: t.description }} />

      <header className="flex max-w-prose flex-col gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight">{t.name}</h1>
        {t.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-lg" : "text-muted-foreground"}>
            {p}
          </p>
        ))}
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...t.facts, ...(t.league ? [{ label: `${t.league} titles`, value: String(titles.length) }] : [])]
          .map((f) => (
            <div key={f.label} className="rounded-card border border-border px-5 py-4">
              <dt className="text-sm text-muted-foreground">{f.label}</dt>
              <dd className="font-medium">{f.value}</dd>
            </div>
          ))}
      </dl>

      {(finals.length > 0 || t.otherHonours) && (
        <section className="flex flex-col gap-3">
          <h2 className={H2}>Finals and honours</h2>
          <ul className="flex flex-col divide-y divide-border rounded-card border border-border">
            {finals.map((f) => (
              <li key={`${f.competition.slug}-${f.year}`} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
                <span>
                  <span className="font-medium tabular-nums">{f.year}</span>{" "}
                  <Link href={`/${sport}/${f.competition.slug}`} className="underline underline-offset-4">
                    {f.competition.short}
                  </Link>{" "}
                  final v {f.opponent}
                </span>
                <span className={f.won ? "font-semibold" : "text-muted-foreground"}>{f.won ? "Won" : "Runner-up"}</span>
              </li>
            ))}
            {t.otherHonours?.map((h) => (
              <li key={h} className="px-5 py-3">
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {t.squadHref && (
        <p>
          <Link href={t.squadHref} className="underline underline-offset-4">
            See the current squad →
          </Link>
        </p>
      )}

      <Faq items={faq} />

      <nav className="flex flex-col gap-3">
        <h2 className={H2}>{t.league ? `Other ${t.league} teams` : "More teams"}</h2>
        <ul className="flex flex-wrap gap-3">
          {siblings.map((o) => (
            <li key={o.slug}>
              <Link href={`/${sport}/teams/${o.slug}`} className="block rounded-btn border border-border px-4 py-2 text-sm transition-ui hover:border-brand">
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
