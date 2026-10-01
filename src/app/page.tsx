import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SPORTS } from "@/lib/site";

const FEATURES = [
  { href: "/players", title: "Players", desc: "Profiles, roles, and caps for the Indian squad." },
  { href: "/xi", title: "Playing XI", desc: "Pick your eleven, validate the squad, share it as an image." },
  { href: "/quiz", title: "Quiz", desc: "A shuffled cricket quiz. Score yourself and play again." },
  { href: "/community", title: "Community", desc: "Talk sport with other fans. No sign-up — just a name." },
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
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((s) => (
            <Badge key={s} variant="outline" className="text-sm">
              {s}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Cricket is the fullest today. The rest grow with the club.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Cricket, right now</h2>
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
