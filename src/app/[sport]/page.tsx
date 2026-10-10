import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSport } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { rosterFor, squadConfig } from "@/data/squads";
import { quizFor } from "@/data/quiz";
import { competitionsFor } from "@/data/competitions";
import { teamsFor } from "@/data/teams";
import { rivalriesFor } from "@/data/rivalries";
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
  return sport ? pageMeta({ title: `${sport.label} in India`, description: sport.blurb, path: `/${sport.slug}` }) : {};
}

const H2 = "font-display text-xl font-semibold tracking-tight";
const MORE = "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";
const CHIP = "block rounded-btn border border-border px-3 py-1.5 text-sm transition-ui hover:border-brand";

export default async function SportHubPage({ params }: { params: Promise<{ sport: string }> }) {
  const sport = getSport((await params).sport);
  if (!sport) notFound();
  const squad = squadConfig(sport.slug);
  const hasQuiz = quizFor(sport.slug).length > 0;
  const competitions = competitionsFor(sport.slug);
  const teams = teamsFor(sport.slug);
  const rivalries = rivalriesFor(sport.slug);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const [events, posts] = configured
    ? await Promise.all([listUpcomingEvents({ sport: sport.slug, limit: 4 }), getLatestPosts(sport.slug, 3)])
    : [[], []];

  return (
    <div className="flex flex-col gap-12">
      <h1 className="sr-only">{sport.label}</h1>

      {squad ? (
        <section className="flex flex-col gap-4">
          <h2 className={H2}>The squads</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {(["men", "women"] as const).map((team) => (
              <div key={team} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold">{team === "women" ? "Women" : "Men"}</h3>
                  <Link href={`/${sport.slug}/players${team === "women" ? "/women" : ""}`} className={MORE}>
                    Full squad →
                  </Link>
                </div>
                {rosterFor(sport.slug, team)
                  .filter((p) => p.active)
                  .slice(0, 3)
                  .map((p) => (
                    <PlayerCard key={p.slug} player={p} />
                  ))}
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href={`/${sport.slug}/xi`} className="group">
              <Card className="h-full transition-ui group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>Pick your {squad.xiLabel}</CardTitle>
                  <CardDescription>Build your eleven, check the balance, share it as an image.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            {hasQuiz && (
              <Link href={`/${sport.slug}/quiz`} className="group">
                <Card className="h-full transition-ui group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Take the quiz</CardTitle>
                    <CardDescription>A shuffled {sport.label.toLowerCase()} quiz. Score yourself and go again.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )}
            {sport.slug === "cricket" && (
              <Link href="/cricket/calculator" className="group">
                <Card className="h-full transition-ui group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Cricket calculator</CardTitle>
                    <CardDescription>Averages, strike rates, economy, run rate and net run rate.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )}
          </div>
        </section>
      ) : (
        <p className="rounded-card border border-dashed border-border px-5 py-4 text-sm text-muted-foreground">
          Player profiles and a squad builder for {sport.label} are on the way. Until then, the
          events and the conversation are open.
        </p>
      )}

      {competitions.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className={H2}>Competitions</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((c) => (
              <li key={c.slug}>
                <Link href={`/${sport.slug}/${c.slug}`} className="group block h-full">
                  <Card className="h-full transition-ui group-hover:shadow-md">
                    <CardHeader>
                      <CardTitle>{c.short}</CardTitle>
                      <CardDescription>
                        {c.editions[0].year}: {c.editions[0].winner}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(teams.length > 0 || rivalries.length > 0) && (
        <section className="grid gap-8 md:grid-cols-2">
          {teams.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className={H2}>Teams</h2>
              <ul className="flex flex-wrap gap-2">
                {teams.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/${sport.slug}/teams/${t.slug}`} className={CHIP}>
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rivalries.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className={H2}>Rivalries</h2>
              <ul className="flex flex-wrap gap-2">
                {rivalries.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/${sport.slug}/rivalries/${r.slug}`} className={CHIP}>
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
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
