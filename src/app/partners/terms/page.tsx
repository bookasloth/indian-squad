import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner Terms",
  description: "The agreement between Indian Sports Club and partners who list events.",
};

const H2 = "font-display text-xl font-semibold tracking-tight";
const A = "underline underline-offset-4";

export default function PartnerTermsPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 8 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Partner Terms</h1>
      </header>

      <p className="text-lg text-muted-foreground">
        These terms apply to organisers (&ldquo;partners&rdquo;) who list events on {site.name}, a personal project
        run by{" "}
        <a href={site.owner.url} className={A}>
          {site.owner.name}
        </a>
        . They sit alongside our{" "}
        <Link href="/terms-of-use" className={A}>
          Terms of Use
        </Link>
        .
      </p>

      <h2 className={H2}>You run the event</h2>
      <p>
        You are the organiser and are responsible for the event: the venue, safety, permissions, prizes, insurance,
        and delivering what you describe. {site.name} lists your event and passes registrations to you; we are not
        the organiser.
      </p>

      <h2 className={H2}>Accurate details</h2>
      <p>
        Your organisation name, contact person, phone and city must be true. We show your organisation name, city and
        website on your events so attendees know who they&rsquo;re dealing with, and we may share your contact details
        with an attendee who raises a complaint.
      </p>

      <h2 className={H2}>What you can list</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Physical sports tournaments, leagues, coaching camps, trials and fan meetups.</li>
        <li>Watch-parties only at venues that hold a valid public screening licence. Keep proof; we may ask for it.</li>
        <li>
          Not allowed: betting or wagering, paid fantasy or prediction contests, anything illegal, and any use of
          official team, league, ICC or BCCI logos or player photos.
        </li>
      </ul>

      <h2 className={H2}>Reviews and removal</h2>
      <p>
        We review every partner and every event before it goes live, and we may decline, edit for clarity, unpublish
        or remove any listing, or suspend a partner, at our discretion — for example after complaints, misleading
        details or a cancelled event.
      </p>

      <h2 className={H2}>Tickets and money</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Free registration:</strong> attendees register on {site.name}; you receive their name and email to
          contact them about this event only. Don&rsquo;t add them to marketing lists without their consent.
        </li>
        <li>
          <strong>Your own ticket link:</strong> you sell tickets yourself. You are the seller, you handle payments,
          GST, refunds and complaints for those tickets, and {site.name} is not a party to that sale.
        </li>
        <li>
          <strong>Paid ticketing through us</strong> (coming soon) will have its own fee (8% all-inclusive), payout
          and refund terms, which you&rsquo;ll accept separately before selling.
        </li>
      </ul>

      <h2 className={H2}>Cancellations</h2>
      <p>
        If you cancel or reschedule, tell attendees and us as soon as you can. Refunds for tickets sold through your
        own link are your responsibility.
      </p>

      <h2 className={H2}>Liability</h2>
      <p>
        {site.name} is provided as is. To the extent the law allows, we aren&rsquo;t liable for losses arising from
        your event or from attendees, and you agree to cover claims that arise from your event or your listing.
      </p>

      <h2 className={H2}>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>
        . These terms are governed by the laws of India.
      </p>
    </article>
  );
}
