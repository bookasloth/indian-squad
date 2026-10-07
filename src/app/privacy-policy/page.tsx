import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Indian Sports Club collects, why, who processes it, and how to get it deleted.",
};

const H2 = "font-display text-xl font-semibold tracking-tight";

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 7 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
      </header>

      <p className="text-lg text-muted-foreground">
        {site.name} is a fan club. We collect only what we need to run accounts, the community, and
        the newsletter. We don&rsquo;t sell your data and we don&rsquo;t run ads or third-party
        trackers.
      </p>

      <h2 className={H2}>What we collect</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Account:</strong> your email address, a password (stored hashed by our auth
          provider — we never see it), your username, and an optional display name, avatar, and bio.
        </li>
        <li>
          <strong>Community content:</strong> posts, replies, images you upload, poll votes, likes,
          reposts, bookmarks, follows, and reports you file.
        </li>
        <li>
          <strong>Newsletter:</strong> your email address, where you signed up, and whether
          you&rsquo;re subscribed.
        </li>
        <li>
          <strong>Event tickets:</strong> what you bought, the amount, the payment status, and Zoho
          Payments&rsquo; payment ID. Your card, UPI, and bank details go straight to Zoho Payments
          and never reach us.
        </li>
        <li>
          <strong>Technical:</strong> your IP address, used briefly to rate-limit abuse, and the
          cookies needed to keep you signed in. Your light/dark theme choice is stored in your
          browser only.
        </li>
      </ul>

      <h2 className={H2}>Why we use it</h2>
      <p>
        To create and secure your account, show your posts and profile to other members, send you
        account emails (confirmation, password reset, ticket receipts) and the newsletter you asked for, and keep
        the community free of spam and abuse. We process this data on the basis of your consent,
        which you give when you sign up or subscribe, and you can withdraw it at any time.
      </p>

      <h2 className={H2}>What&rsquo;s public</h2>
      <p>
        Your username, display name, avatar, bio, posts, replies, reposts, and follows are visible
        to anyone. Your email address is never shown. Don&rsquo;t post anything you wouldn&rsquo;t
        want public.
      </p>

      <h2 className={H2}>Who processes it for us</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Supabase</strong> — database, authentication, and image storage.
        </li>
        <li>
          <strong>Vercel</strong> — website hosting.
        </li>
        <li>
          <strong>Zoho Payments</strong> — processes ticket payments (UPI, cards, netbanking).
        </li>
        <li>
          <strong>Our email provider</strong> — delivers account emails and the newsletter.
        </li>
      </ul>
      <p className="text-muted-foreground">
        These providers may store data outside India. They process it only to provide their
        service to us.
      </p>

      <h2 className={H2}>How long we keep it</h2>
      <p>
        Account data and content stay until you delete them or ask us to delete your account.
        Removed posts are hidden immediately and purged with the account. Newsletter records are
        kept while you&rsquo;re subscribed, plus a record of the unsubscribe so we don&rsquo;t
        email you again. Payment records are kept for as long as tax and accounting law requires,
        even if you delete your account.
      </p>

      <h2 className={H2}>Your rights</h2>
      <p>
        Under India&rsquo;s Digital Personal Data Protection Act, 2023, you can ask us to show you
        the data we hold about you, correct it, delete it, or nominate someone to act for you. You
        can withdraw consent at any time: unsubscribe from any newsletter email, delete your posts
        yourself, or email us to delete your whole account. We respond within 30 days.
      </p>

      <h2 className={H2}>Children</h2>
      <p>
        You must be 18 or older to create an account or subscribe. If you believe a child has
        signed up, tell us and we&rsquo;ll delete the account.
      </p>

      <h2 className={H2}>Contact &amp; grievances</h2>
      <p>
        For any privacy request or complaint, email{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-4">
          {site.email}
        </a>
        . If you&rsquo;re not satisfied with our response, you can complain to the Data Protection
        Board of India.
      </p>

      <p className="text-muted-foreground">
        We&rsquo;ll post any changes to this policy here and update the date above. If a change is
        significant, we&rsquo;ll email members.
      </p>
    </article>
  );
}
