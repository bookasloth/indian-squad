import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What Indian Squad is, and who it's for.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">About</h1>
        <p className="text-lg text-muted-foreground">A fan hub for the Indian cricket squad.</p>
      </header>

      <p>
        Indian Squad is a small, fast fan site built around the players who wear the India
        shirt. No ball-by-ball stats pipelines, no accounts you don&apos;t want — just the
        parts fans actually reach for.
      </p>

      <h2 className="font-display text-xl font-semibold tracking-tight">What&apos;s here</h2>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-muted-foreground">
        <li>
          <span className="text-foreground">Players</span> — profiles, roles, and caps across
          formats, filterable at a glance.
        </li>
        <li>
          <span className="text-foreground">Playing XI</span> — pick your eleven, check it
          against the rules, and share it as an image.
        </li>
        <li>
          <span className="text-foreground">Quiz</span> — a shuffled round of Indian cricket
          trivia.
        </li>
        <li>
          <span className="text-foreground">Community</span> — talk cricket with other fans,
          no sign-up required.
        </li>
      </ul>

      <h2 className="font-display text-xl font-semibold tracking-tight">The fine print</h2>
      <p className="text-muted-foreground">
        This is an independent fan project. It is not affiliated with, endorsed by, or
        connected to the BCCI or any official body. Player data is maintained by hand and may
        lag behind the latest matches.
      </p>
    </article>
  );
}
