import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SQUADS, TEAM_LABEL, getSquadPlayer } from "@/data/squads";
import { comparisonsFor } from "@/data/comparisons";
import { sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, JsonLd } from "@/components/seo";

export const dynamicParams = false;

// Returns both params ("bottom-up"). The per-parent form ({ params }) generated no
// pages here — the static `players` segment sits between [sport] and [slug].
export function generateStaticParams() {
  return Object.values(SQUADS).flatMap((s) => s.roster.map((p) => ({ sport: s.sport, slug: p.slug })));
}

type Params = { params: Promise<{ sport: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport, slug } = await params;
  const player = getSquadPlayer(sport, slug);
  if (!player) return { title: "Player not found" };
  return pageMeta({
    title: `${player.name} — India ${TEAM_LABEL[player.team].toLowerCase()}'s ${sportLabel(sport)?.toLowerCase()} profile`,
    description: player.bio,
    path: `/${sport}/players/${player.slug}`,
  });
}

export default async function PlayerPage({ params }: Params) {
  const { sport, slug } = await params;
  const player = getSquadPlayer(sport, slug);
  if (!player) notFound();

  const label = sportLabel(sport) ?? sport;
  const squadHref = `/${sport}/players${player.team === "women" ? "/women" : ""}`;
  const teamName = `India ${TEAM_LABEL[player.team].toLowerCase()}'s ${label.toLowerCase()} team`;
  const asOf = SQUADS[sport]?.asOf;
  const debates = comparisonsFor(sport).filter((c) => c.a === player.slug || c.b === player.slug);

  return (
    <article className="flex flex-col gap-8">
      <Crumbs
        items={[
          { label, href: `/${sport}` },
          { label: `${TEAM_LABEL[player.team]}'s squad`, href: squadHref },
          { label: player.name, href: `/${sport}/players/${player.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@type": "Person",
          name: player.name,
          description: player.bio,
          url: abs(`/${sport}/players/${player.slug}`),
          nationality: { "@type": "Country", name: "India" },
          jobTitle: `${label} ${player.roleLabel.toLowerCase()}`,
          memberOf: { "@type": "SportsTeam", name: teamName },
        }}
      />

      <header className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">
          India {TEAM_LABEL[player.team]} · {player.roleLabel}
        </span>
        <h1 className="text-4xl font-bold tracking-tight">{player.name}</h1>
      </header>

      <p className="max-w-2xl text-lg">{player.bio}</p>

      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {player.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-sm text-muted-foreground">{f.label}</dt>
            <dd className="font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      {player.stats.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-4">
            {player.stats.map((c) => (
              <div key={c.label} className="rounded-lg border border-border px-5 py-3">
                <div className="font-display text-2xl font-bold tabular-nums">{c.value}</div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </div>
          {asOf && <p className="text-sm text-muted-foreground">As of {asOf}.</p>}
        </div>
      )}

      <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href={`/${sport}/compare?a=${player.slug}`} className="underline underline-offset-4">
          Compare {player.name} with another player
        </Link>
        <Link href={squadHref} className="underline underline-offset-4">
          Back to the {TEAM_LABEL[player.team].toLowerCase()}&rsquo;s squad
        </Link>
      </p>
      {debates.length > 0 && (
        <nav className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-semibold tracking-tight">Debates</h2>
          <ul className="flex flex-wrap gap-2">
            {debates.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/${sport}/compare/${d.slug}`}
                  className="block rounded-btn border border-border px-3 py-1.5 text-sm transition-ui hover:border-brand"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
