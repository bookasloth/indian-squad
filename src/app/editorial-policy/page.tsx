import Link from "next/link";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Crumbs } from "@/components/seo";

export const metadata = pageMeta({
  title: "Editorial policy",
  description: `Who writes ${site.name}, how pages are checked, how we use AI drafting, and what we will and won't publish.`,
  path: "/editorial-policy",
});

const H2 = "font-display text-xl font-semibold tracking-tight";
const A = "underline underline-offset-4";

export default function EditorialPolicyPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <Crumbs items={[{ label: "Editorial policy", href: "/editorial-policy" }]} />
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 10 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Editorial policy</h1>
      </header>

      <p className="text-lg text-muted-foreground">
        {site.name} is an independent fan club for Indian sport, run as a personal project by{" "}
        <a href={site.owner.url} className={A}>
          {site.owner.name}
        </a>
        . This page explains who writes what you read here and how it is checked.
      </p>

      <h2 className={H2}>Who writes</h2>
      <p>
        Player profiles, competition guides, records and explainers are published by {site.name}. Community posts are
        written by members and appear under their own names.
      </p>

      <h2 className={H2}>How we use AI</h2>
      <p>
        Some explainers and guides are first drafted with the help of an AI writing assistant. Every draft is edited,
        fact-checked against official sources and approved by a person before it is published. AI is never the
        source of a fact or a figure.
      </p>

      <h2 className={H2}>How pages are checked</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Facts and figures are checked against the governing body or league that owns the record.</li>
        <li>
          Opinion is labelled as opinion. Explainers describe rules as the rulebook states them, not as we would like
          them to be.
        </li>
        <li>Pages with numbers show when they were last reviewed.</li>
        <li>
          Our sources and their limits are set out on the{" "}
          <Link href="/sources" className={A}>
            sources page
          </Link>
          .
        </li>
      </ul>

      <h2 className={H2}>Independence</h2>
      <p>
        We are not affiliated with any team, league, federation or governing body, and we don&rsquo;t use their logos or
        marks. If we ever publish sponsored content or partner promotions, they will be clearly labelled. Event listings
        from partner organisers are reviewed before they go live; the organiser is named on every listing.
      </p>

      <h2 className={H2}>Corrections</h2>
      <p>
        When we get something wrong, we fix it and log the fix on the{" "}
        <Link href="/corrections" className={A}>
          corrections page
        </Link>
        . To report an error, email{" "}
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>
        .
      </p>

      <h2 className={H2}>Community</h2>
      <p>
        Members&rsquo; posts are moderated for abuse, spam and safety, but they are not fact-checked and don&rsquo;t
        represent the club&rsquo;s view. Anyone can report a post. See the{" "}
        <Link href="/terms-of-use" className={A}>
          terms of use
        </Link>
        .
      </p>
    </article>
  );
}
