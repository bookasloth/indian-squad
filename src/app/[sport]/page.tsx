import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SQUAD_SPORTS, getSport } from "@/lib/site";
import { squad } from "@/data/players";
import { listUpcomingEvents } from "@/lib/events";
import { getLatestPosts } from "@/lib/community-data";
import { timeAgo } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerCard } from "@/components/PlayerCard";
import { EventCard } from "@/components/events/event-card";
import { CommunityAvatar } from "@/components/community/community-avatar";

// Prerendered per sport; events and posts refresh at most once a minute (ISR).
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const sport = getSport((await params).sport);
  return sport ? { title: sport.label, description: sport.blurb } : {};
}

const H2 = "font-display text-xl font-semibold tracking-tight";
const MORE = "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";

export default async function SportHubPage({ params }: { params: Promise<{ sport: string }> }) {
  const sport = getSport((await params).sport);
  if (!sport) notFound();
  const hasSquad = SQUAD_SPORTS.includes(sport.slug);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const [events, posts] = configured
    ? await Promise.all([listUpcomingEvents({ sport: sport.slug, limit: 4 }), getLatestPosts(sport.slug, 3)])
    : [[], []];

  return (
    <div className="flex flex-col gap-12">
      <h1 className="sr-only">{sport.label}</h1>

      {hasSquad ? (
        <section className="flex flex-col gap-4">
          <h2 className={H2}>The squads</h2>
          {/* ponytail: players.ts is the cricket roster; becomes per-sport in phase 3 (kabaddi). */}
          <div className="grid gap-6 md:grid-cols-2">
            {(["men", "women"] as const).map((team) => (
              <div key={team} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold">{team === "women" ? "Women" : "Men"}</h3>
                  <Link href={`/${sport.slug}/players${team === "women" ? "/women" : ""}`} className={MORE}>
                    Full squad →
                  </Link>
                </div>
                {squad(team)
                  .filter((p) => p.active)
                  .slice(0, 3)
                  .map((p) => (
                    <PlayerCard key={p.slug} player={p} />
                  ))}
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href={`/${sport.slug}/xi`} className="group">
              <Card className="h-full transition-ui group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>Pick your Playing XI</CardTitle>
                  <CardDescription>Build your eleven, check the balance, share it as an image.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href={`/${sport.slug}/quiz`} className="group">
              <Card className="h-full transition-ui group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>Take the quiz</CardTitle>
                  <CardDescription>A shuffled {sport.label.toLowerCase()} quiz. Score yourself and go again.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>
      ) : (
        <p className="rounded-card border border-dashed border-border px-5 py-4 text-sm text-muted-foreground">
          Player profiles and a squad builder for {sport.label} are on the way. Until then, the
          events and the conversation are open.
        </p>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={H2}>Upcoming events</h2>
          <Link href="/events" className={MORE}>
            All events →
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-muted-foreground">
            No {sport.label.toLowerCase()} events listed yet.{" "}
            <Link href="/partners" className="underline underline-offset-4">
              Run one? List it free.
            </Link>
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {events.map((e) => (
              <li key={e.id}>
                <EventCard event={e} showSport={false} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={H2}>From the community</h2>
          <Link href={`/community/${sport.slug}`} className={MORE}>
            Join the conversation →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            Nobody&rsquo;s posted about {sport.label.toLowerCase()} yet.{" "}
            <Link href={`/community/${sport.slug}`} className="underline underline-offset-4">
              Start it off.
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {posts.map((p) => (
              <li key={p.id} className="flex gap-3">
                <CommunityAvatar seed={p.username ?? p.authorName} src={p.avatarUrl} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{p.authorName}</span>{" "}
                    <span className="text-xs text-muted-foreground">· {timeAgo(p.createdAt)}</span>
                  </p>
                  <p className="line-clamp-3 whitespace-pre-wrap break-words">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
