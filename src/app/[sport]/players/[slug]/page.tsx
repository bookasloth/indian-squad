import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayer, players } from "@/data/players";
import { SQUAD_SPORTS } from "@/lib/site";
import { ROLE_LABEL } from "@/components/PlayerCard";

export const dynamicParams = false;

// Returns both params ("bottom-up"). The per-parent form ({ params }) generated no
// pages here — the static `players` segment sits between [sport] and [slug].
export function generateStaticParams() {
  return SQUAD_SPORTS.flatMap((sport) => players.map((p) => ({ sport, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) return { title: "Player not found" };
  return {
    title: player.name,
    description: player.bio,
  };
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

  return (
    <article className="flex flex-col gap-8">
      <Link href={`/${sport}/players`} className="text-sm text-muted-foreground hover:text-foreground">
        ← All players
      </Link>

      <header className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">{ROLE_LABEL[player.role]}</span>
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

      <div className="flex gap-4">
        {caps.map((c) => (
          <div key={c.label} className="rounded-lg border border-border px-5 py-3">
            <div className="font-display text-2xl font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
    </article>
  );
}
