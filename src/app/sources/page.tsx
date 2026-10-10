import Link from "next/link";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Crumbs, Faq } from "@/components/seo";

export const metadata = pageMeta({
  title: "Sources and methodology",
  description: `Where the facts and figures on ${site.name} come from, how they are kept current, and where our coverage stops.`,
  path: "/sources",
});

const H2 = "font-display text-xl font-semibold tracking-tight";
const A = "underline underline-offset-4";

export default function SourcesPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <Crumbs items={[{ label: "Sources", href: "/sources" }]} />
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 10 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Where our numbers come from</h1>
      </header>

      <p className="text-lg text-muted-foreground">
        Every figure on {site.name} is entered and checked by hand against the governing body or competition that
        owns the record. We don&rsquo;t copy text or tables from other fan or stats sites, and we say plainly where our
        coverage stops.
      </p>

      <h2 className={H2}>What we use</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Official records first.</strong> Squads, results and honours are checked against the relevant
          governing body or league — for example the ICC and BCCI for cricket, Hockey India and the FIH for hockey, the
          Pro Kabaddi League for kabaddi, BWF for badminton, AIFF for football and Formula 1 for F1.
        </li>
        <li>
          <strong>Career records.</strong> Governing bodies rarely publish full all-time lists, so record tables are
          compiled from public career statistics and dated. Retired players&rsquo; figures are final; current
          players&rsquo; are marked and refreshed after each series.
        </li>
        <li>
          <strong>Open data where it exists.</strong> When we add computed statistics, we use openly licensed datasets
          and credit them on the page that uses them.
        </li>
        <li>
          <strong>Our own words.</strong> Profiles, explainers and competition guides are written for this site.
        </li>
      </ul>

      <h2 className={H2}>How current it is</h2>
      <p>
        Figures that change every match — caps, appearances, career totals — are updated by hand and can lag behind the
        latest fixture. Treat them as approximate between updates. Pages with numbers show when they were last
        reviewed.
      </p>

      <h2 className={H2}>Where coverage stops</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>We are a fan club, not a live-scores or news service. We don&rsquo;t cover matches ball by ball.</li>
        <li>Coverage centres on India&rsquo;s national teams and the leagues Indian fans follow most.</li>
        <li>
          Community posts are written by members, not by us. They are moderated but not fact-checked; see the{" "}
          <Link href="/terms-of-use" className={A}>
            terms of use
          </Link>
          .
        </li>
      </ul>

      <h2 className={H2}>Found a mistake?</h2>
      <p>
        Email{" "}
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>{" "}
        with the page and the correct figure, ideally with a link to the official source. Fixes are logged on our{" "}
        <Link href="/corrections" className={A}>
          corrections page
        </Link>
        . How pages are written and reviewed is set out in the{" "}
        <Link href="/editorial-policy" className={A}>
          editorial policy
        </Link>
        .
      </p>

      <Faq
        items={[
          {
            q: `Where do ${site.name}'s statistics come from?`,
            a: "They are entered by hand and checked against the governing body or league that owns each record, such as the ICC, BCCI, Hockey India, the Pro Kabaddi League, BWF, AIFF and Formula 1.",
          },
          {
            q: "How often are player figures updated?",
            a: "By hand, typically after a series or tournament rather than after every match, so caps and career totals can lag slightly behind the latest fixture.",
          },
          {
            q: `Is ${site.name} affiliated with any team or governing body?`,
            a: "No. It is an independent fan club and personal project, not connected to any team, league, federation or governing body.",
          },
          {
            q: "Can I report a wrong number?",
            a: `Yes. Email ${site.email} with the page and the correct figure. Confirmed fixes are listed on the corrections page.`,
          },
        ]}
      />
    </article>
  );
}
