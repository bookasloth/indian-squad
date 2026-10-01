import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { players } from "@/data/players";

const FEATURES = [
  { href: "/players", title: "Players", desc: "Profiles, roles, and caps for the Indian squad." },
  { href: "/xi", title: "Playing XI", desc: "Pick your eleven, validate the squad, share it as an image." },
  { href: "/quiz", title: "Quiz", desc: "A shuffled cricket quiz. Score yourself and play again." },
  { href: "/community", title: "Community", desc: "Talk cricket with other fans. No sign-up — just a name." },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col items-start gap-6 py-8">
        <span className="rounded-btn bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {players.length} players · 4 ways to play
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          The Indian Squad hub
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Player profiles, a Playing XI builder, a cricket quiz, and a fan community —
          everything about the Indian cricket squad in one place.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg">
            <Link href="/players">Explore players</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/xi">Build your XI</Link>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ href, title, desc }) => (
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
