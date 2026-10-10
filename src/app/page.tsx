import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SportEmblem } from "@/components/community/sport-emblem";
import { SPORTS, site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta({ description: site.description, path: "/" }),
  title: { absolute: `${site.name} — fan club for Indian cricket, hockey, kabaddi, badminton, football and F1` },
};

// Placeholder copy until docs/COPY.md is filled in.
const CLUB = [
  { href: "/community", title: "Community", desc: "Talk sport with other fans. Reading is open; posting takes a free account." },
  { href: "/events", title: "Events", desc: "Watch-parties, tournaments and meetups near you." },
  { href: "/shop", title: "Shop", desc: "Club merch, printed to order and shipped across India." },
  { href: "/partners", title: "Run sports events?", desc: "List your tournaments, camps and watch-parties here for free." },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col items-start gap-6 py-8">
        <span className="rounded-btn bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Fan club · The 12th Man
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          We stand united. We are the 12th Man.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          A passionate community backing Team India across cricket, hockey, kabaddi, badminton,
          football, and F1. Our mission: inspire and rally fans worldwide through the spirit of the
          game.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg">
            <Link href="/community">Join the community</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Our mission</Link>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight">The sports we follow</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPORTS.map((s) => (
            <li key={s.slug}>
              <Link href={`/${s.slug}`} data-sport={s.slug} className="group block h-full">
                <Card className="flex h-full items-start gap-4 p-5 transition-ui group-hover:border-brand group-hover:shadow-md">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand)_14%,transparent)]">
                    <SportEmblem sport={s.slug} size={24} animate={false} className="transition-transform group-hover:scale-110" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-lg font-semibold tracking-tight">{s.label}</span>
                    <span className="text-sm text-muted-foreground">{s.blurb}</span>
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Around the club</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CLUB.map(({ href, title, desc }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full transition-ui group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
