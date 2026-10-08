import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, paidTickets, paymentsEnabled, rsvpCount } from "@/lib/events";
import { getPartnersPublic } from "@/lib/partners";
import { getMemberContext } from "@/lib/members/session";
import { site, sportLabel } from "@/lib/site";
import { formatEventEnd, formatEventTime, formatInr } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EventPayButton } from "@/components/events/event-pay-button";
import { RsvpButton } from "@/components/events/rsvp-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return event ? { title: event.title, description: `${formatEventTime(event.starts_at)} · ${event.venue}, ${event.city}` } : {};
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const { user } = await getMemberContext();
  const partner = event.partner_id ? (await getPartnersPublic([event.partner_id])).get(event.partner_id) ?? null : null;
  const organiser = partner?.org_name ?? site.name;
  const isRsvp = event.ticketing === "rsvp";
  const count = (userId?: string) => (isRsvp ? rsvpCount(event.id, userId) : paidTickets(event.id, userId));
  const [taken, mine] = await Promise.all([event.capacity ? count() : 0, user ? count(user.id) : 0]);

  const started = new Date(event.starts_at) <= new Date();
  const left = event.capacity ? Math.max(event.capacity - taken, 0) : null;
  const priceLabel =
    event.ticketing === "rsvp" ? "Free" : event.ticketing === "external" ? (event.price > 0 ? `From ${formatInr(event.price)}` : "Tickets") : formatInr(event.price);
  const signIn = (label: string) => (
    <Button asChild variant="brand" size="lg">
      <Link href={`/login?next=/events/${event.slug}`}>{label}</Link>
    </Button>
  );

  let action: React.ReactNode;
  if (started) action = <p className="text-muted-foreground">This event has started.</p>;
  else if (event.ticketing === "external") {
    action = (
      <>
        <Button asChild variant="brand" size="lg">
          <a href={event.external_url!} target="_blank" rel="noopener nofollow">
            Get tickets on {organiser}&rsquo;s site
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">
          Tickets are sold by {organiser}, who handles payment and refunds. {site.name} isn&rsquo;t part of that sale.
        </p>
      </>
    );
  } else if (isRsvp) {
    if (left === 0 && !mine) action = <p className="font-semibold">It&rsquo;s full.</p>;
    else if (!user?.email) action = signIn("Sign in to register — free");
    else action = <RsvpButton eventId={event.id} joined={mine > 0} organiser={organiser} />;
  } else if (left === 0) action = <p className="font-semibold">Sold out.</p>;
  else if (!paymentsEnabled()) action = <p className="text-muted-foreground">Ticket sales open soon.</p>;
  else if (!user?.email) action = signIn("Sign in to buy a ticket");
  else {
    action = <EventPayButton eventId={event.id} priceLabel={priceLabel} name={user.user_metadata?.full_name} email={user.email} />;
  }

  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
          ← All events
        </Link>
        {event.sport && (
          <Badge variant="outline" className="self-start">
            {sportLabel(event.sport)}
          </Badge>
        )}
        <h1 className="font-display text-4xl font-bold tracking-tight">{event.title}</h1>
        <p className="text-lg text-muted-foreground">
          {formatEventTime(event.starts_at)}
          {event.ends_at && <> – {formatEventEnd(event.starts_at, event.ends_at)}</>}
          <br />
          {event.venue}, {event.city}
        </p>
      </header>

      {event.description && <p className="whitespace-pre-line">{event.description}</p>}

      <div className="flex flex-col gap-3 rounded-card border border-border p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-2xl font-bold">{priceLabel}</span>
          {left !== null && left > 0 && event.ticketing !== "external" && (
            <span className="text-sm text-muted-foreground">{left} left</span>
          )}
        </div>
        {event.ticketing === "paid" && mine > 0 && (
          <Alert variant="success">
            <AlertDescription>
              You have {mine} ticket{mine > 1 ? "s" : ""}. Check your email for the confirmation.
            </AlertDescription>
          </Alert>
        )}
        {action}
      </div>

      {/* Seller details, as the Consumer Protection (E-Commerce) Rules require for marketplace listings. */}
      <p className="text-sm text-muted-foreground">
        Organised by{" "}
        {partner ? (
          <>
            <Link href={`/partners/${partner.slug}`} className="underline underline-offset-4">
              {partner.org_name}
            </Link>
            , {partner.city}.
          </>
        ) : (
          <>{site.name}.</>
        )}{" "}
        {event.ticketing === "paid" && "Payments by Zoho Payments (UPI, cards, netbanking). One ticket per purchase. "}
        See the{" "}
        <Link href="/refund-policy" className="underline underline-offset-4">
          refund policy
        </Link>
        .
      </p>
    </article>
  );
}
