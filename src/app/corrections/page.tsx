import Link from "next/link";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Crumbs } from "@/components/seo";

export const metadata = pageMeta({
  title: "Corrections",
  description: `A public log of errors fixed on ${site.name}, and how to report one.`,
  path: "/corrections",
});

const H2 = "font-display text-xl font-semibold tracking-tight";
const A = "underline underline-offset-4";

// ponytail: hand-kept log, newest first. Add an entry whenever a published fact is fixed.
const LOG: { date: string; page: string; href: string; fix: string }[] = [];

export default function CorrectionsPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <Crumbs items={[{ label: "Corrections", href: "/corrections" }]} />
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 10 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Corrections</h1>
      </header>

      <p className="text-lg text-muted-foreground">
        When a fact or figure we published turns out to be wrong, we fix the page and record the fix here. Typos and
        routine figure updates (such as a player&rsquo;s cap count going up) are not listed.
      </p>

      <h2 className={H2}>Log</h2>
      {LOG.length === 0 ? (
        <p className="rounded-card border border-dashed border-border px-5 py-4 text-muted-foreground">
          No corrections logged yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {LOG.map((c) => (
            <li key={`${c.date}-${c.href}`} className="flex flex-col gap-1 border-b border-border pb-4">
              <span className="text-sm text-muted-foreground">
                {c.date} ·{" "}
                <Link href={c.href} className={A}>
                  {c.page}
                </Link>
              </span>
              <span>{c.fix}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className={H2}>Report an error</h2>
      <p>
        Email{" "}
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>{" "}
        with the page, what is wrong, and a link to an official source if you have one. See how we check facts in our{" "}
        <Link href="/editorial-policy" className={A}>
          editorial policy
        </Link>{" "}
        and{" "}
        <Link href="/sources" className={A}>
          sources
        </Link>
        .
      </p>
    </article>
  );
}
