import Link from "next/link";

const FEATURES = [
  {
    href: "/players",
    title: "Players",
    desc: "Profiles, roles, and caps for the Indian squad.",
  },
  {
    href: "/xi",
    title: "Playing XI",
    desc: "Pick your eleven, validate the squad, share it.",
  },
  {
    href: "/quiz",
    title: "Quiz",
    desc: "Test your cricket knowledge. Shuffled every round.",
  },
  {
    href: "/community",
    title: "Community",
    desc: "Talk cricket with other fans. No sign-up.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          The Indian Squad hub
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Player profiles, a Playing XI builder, a cricket quiz, and a fan
          community — all in one place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ href, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-lg border border-border p-6 transition-colors hover:bg-surface"
          >
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
