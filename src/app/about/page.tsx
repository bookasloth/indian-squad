import type { Metadata } from "next";
import { SPORTS } from "@/lib/site";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Indian Squad is a fan club for Indian sport — the 12th Man backing Team India across cricket, hockey, kabaddi, badminton, football, and F1.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Fan club
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">We are the 12th Man</h1>
      </header>

      <p className="text-lg text-muted-foreground">
        At the heart of every triumph, through the highs and lows, we stand united.
      </p>

      <p>
        We are a passionate community of sports enthusiasts whose unwavering support has fuelled
        Team India&rsquo;s journey for over two decades. Our mission is simple: to be the 12th Man
        of Indian sport — to inspire and rally fans worldwide, and to create unforgettable
        experiences that connect us all through the spirit of the game.
      </p>

      <h2 className="font-display text-xl font-semibold tracking-tight">The sports we follow</h2>
      <div className="flex flex-wrap gap-2">
        {SPORTS.map((s) => (
          <Badge key={s} variant="outline">
            {s}
          </Badge>
        ))}
      </div>
      <p className="text-muted-foreground">
        Cricket is where we started, and it&rsquo;s the fullest today — profiles, a Playing XI
        builder, a quiz, and a community. Hockey, kabaddi, badminton, football, and F1 are part of
        the same family, and the club grows to meet them.
      </p>

      <h2 className="font-display text-xl font-semibold tracking-tight">The fine print</h2>
      <p className="text-muted-foreground">
        This is an independent fan club. It is not affiliated with, endorsed by, or connected to
        the BCCI or any official body. Player and team data is maintained by hand and may lag
        behind the latest fixtures.
      </p>
    </article>
  );
}
