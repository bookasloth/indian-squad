import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEAM_LABEL, getPlayer, players } from "@/data/players";
import { SQUAD_SPORTS, sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { ROLE_LABEL } from "@/components/PlayerCard";
import { Crumbs, JsonLd } from "@/components/seo";

export const dynamicParams = false;

// Returns both params ("bottom-up"). The per-parent form ({ params }) generated no
// pages here — the static `players` segment sits between [sport] and [slug].
export function generateStaticParams() {
  return SQUAD_SPORTS.flatMap((sport) => players.map((p) => ({ sport, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string; slug: string }>;
}): Promise<Metadata> {
  const { sport, slug } = await params;
  const player = getPlayer(slug);
  if (!player) return { title: "Player not found" };
  return pageMeta({
    title: `${player.name} — India ${TEAM_LABEL[player.team].toLowerCase()}'s ${sportLabel(sport)?.toLowerCase()} profile`,
    description: player.bio,
    path: `/${sport}/players/${player.slug}`,
  });
}

const CAP_LABELS = { test: "Tests", odi: "ODIs", t20: "T20Is" } as const;

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ sport: string; slug: string }>;
}) {
  const { sport, slug } = await params;
  const player = getPlayer(slug);
  if (!player || !SQUAD_SPORTS.includes(sport)) notFound();

  const caps = (Object.keys(CAP_LABELS) as (keyof typeof CAP_LABELS)[])
    .map((format) => ({ label: CAP_LABELS[format], value: player.caps[format] }))
    .filter((c) => c.value !== undefined);

  const label = sportLabel(sport) ?? sport;
  const squadHref = `/${sport}/players${player.team === "women" ? "/women" : ""}`;

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
          jobTitle: `${label} ${ROLE_LABEL[player.role].toLowerCase()}`,
          memberOf: { "@type": "SportsTeam", name: `India ${TEAM_LABEL[player.team].toLowerCase()}'s ${label.toLowerCase()} team` },
        }}
      />

      <header className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">
          India {TEAM_LABEL[player.team]} · {ROLE_LABEL[player.role]}
        </span>
        <h1 className="text-4xl font-bold tracking-tight">{player.name}</h1>
      </header>

      <p className="max-w-2xl text-lg">{player.bio}</p>

      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Batting</dt>
          <dd className="font-medium">{player.battingStyle}</dd>
        </div>
        {player.bowlingStyle && (
          <div>
            <dt className="text-sm text-muted-foreground">Bowling</dt>
            <dd className="font-medium">{player.bowlingStyle}</dd>
          </div>
        )}
      </dl>

      {caps.length > 0 && (
        <div className="flex gap-4">
          {caps.map((c) => (
            <div key={c.label} className="rounded-lg border border-border px-5 py-3">
              <div className="font-display text-2xl font-bold">{c.value}</div>
              <div className="text-sm text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
