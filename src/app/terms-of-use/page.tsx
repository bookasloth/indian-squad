import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The rules for using Indian Sports Club and its community.",
};

const H2 = "font-display text-xl font-semibold tracking-tight";

export default function TermsOfUsePage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 7 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Terms of Use</h1>
      </header>

      <p className="text-lg text-muted-foreground">
        By using {site.name} you agree to these terms. Short version: be a good fan, post only
        what&rsquo;s yours to post, and don&rsquo;t abuse the place.
      </p>

      <h2 className={H2}>Who we are</h2>
      <p>
        {site.name} is an independent fan club run by{" "}
        <a href={site.owner.url} className="underline underline-offset-4">
          {site.owner.name}
        </a>
        {" "}as a personal project. It is not a company, and it is not affiliated with, endorsed by, or
        connected to the BCCI, Hockey India, the Pro Kabaddi League, the Badminton Association of
        India, the All India Football Federation, Formula 1, or any team, player, or official body.
        Names are used only to identify who we&rsquo;re cheering for.
      </p>

      <h2 className={H2}>Your account</h2>
      <p>
        You must be 18 or older to create an account. Keep your password safe; you&rsquo;re
        responsible for what happens under your account. One person, one account &mdash; no
        impersonating players, officials, or other members.
      </p>

      <h2 className={H2}>Your content</h2>
      <p>
        You own what you post. By posting, you give us a non-exclusive, royalty-free licence to
        host, display, and share it on {site.name} so the community can see it. You can delete your
        posts at any time. Only upload images you have the right to share &mdash; no broadcast
        footage or photos you don&rsquo;t own.
      </p>

      <h2 className={H2}>Community rules</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>No harassment, hate speech, or threats &mdash; including against players and rival fans.</li>
        <li>No spam, scams, betting or match-fixing promotion, or ads.</li>
        <li>No sexual content, graphic violence, or anything illegal in India.</li>
        <li>No sharing other people&rsquo;s personal information.</li>
        <li>No attempts to break, overload, or scrape the site.</li>
      </ul>
      <p>
        Report anything that breaks these rules. We may remove content or suspend accounts that
        do, with or without notice.
      </p>

      <h2 className={H2}>Event tickets</h2>
      <p>
        Tickets are paid through Zoho Payments and confirmed by email. One ticket admits one person.
        If we cancel or reschedule an event, you get a full refund to your original payment method.
        Otherwise tickets are non-refundable. Venues may set their own entry rules (age, ID, dress
        code); follow them or you may be refused entry without a refund.
      </p>

      <h2 className={H2}>Merch</h2>
      <p>
        Merch is sold by {site.name}, printed to order and shipped within India. Delivery, cancellations and
        replacements follow our{" "}
        <Link href="/shipping-policy" className="underline underline-offset-4">
          Shipping
        </Link>{" "}
        and{" "}
        <Link href="/refund-policy" className="underline underline-offset-4">
          Cancellations &amp; Refunds
        </Link>{" "}
        policies.
      </p>

      <h2 className={H2}>Accuracy</h2>
      <p>
        Player stats, squads, and quiz answers are maintained by hand and may lag behind the latest
        fixtures. Treat them as fan content, not official records.
      </p>

      <h2 className={H2}>No warranty</h2>
      <p>
        {site.name} is provided as is, without guarantees of availability or accuracy. To the
        extent the law allows, we&rsquo;re not liable for losses arising from your use of the site
        or from content other members post.
      </p>

      <h2 className={H2}>Ending things</h2>
      <p>
        You can stop using {site.name} at any time and ask us to delete your account &mdash; see
        the{" "}
        <Link href="/privacy-policy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        . We may close the site or change these terms; we&rsquo;ll post changes here and update
        the date above.
      </p>

      <h2 className={H2}>Law &amp; contact</h2>
      <p>
        These terms are governed by the laws of India. Questions or complaints:{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-4">
          {site.email}
        </a>
        .
      </p>
    </article>
  );
}
