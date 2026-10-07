import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, paidTickets, paymentsEnabled } from "@/lib/events";
import { getMemberContext } from "@/lib/members/session";
import { sportLabel } from "@/lib/site";
import { formatEventTime, formatInr } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EventPayButton } from "@/components/events/event-pay-button";

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
  const [sold, mine] = await Promise.all([
    event.capacity ? paidTickets(event.id) : 0,
    user ? paidTickets(event.id, user.id) : 0,
  ]);
  const started = new Date(event.starts_at) <= new Date();
  const left = event.capacity ? Math.max(event.capacity - sold, 0) : null;
  const priceLabel = formatInr(event.price);

  let action: React.ReactNode;
  if (started) action = <p className="text-muted-foreground">This event has started.</p>;
  else if (left === 0) action = <p className="font-semibold">Sold out.</p>;
  else if (!paymentsEnabled()) action = <p className="text-muted-foreground">Ticket sales open soon.</p>;
  else if (!user?.email) {
    action = (
      <Button asChild variant="brand" size="lg">
        <Link href={`/login?next=/events/${event.slug}`}>Sign in to buy a ticket</Link>
      </Button>
    );
  } else {
    action = (
      <EventPayButton
        eventId={event.id}
        priceLabel={priceLabel}
        name={user.user_metadata?.full_name}
        email={user.email}
      />
    );
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
          <br />
          {event.venue}, {event.city}
        </p>
      </header>

      {event.description && <p className="whitespace-pre-line">{event.description}</p>}

      <div className="flex flex-col gap-3 rounded-card border border-border p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-2xl font-bold">{priceLabel}</span>
          {left !== null && left > 0 && <span className="text-sm text-muted-foreground">{left} left</span>}
        </div>
        {mine > 0 && (
          <Alert variant="success">
            <AlertDescription>
              You have {mine} ticket{mine > 1 ? "s" : ""}. Check your email for the confirmation.
            </AlertDescription>
          </Alert>
        )}
        {action}
      </div>

      <p className="text-sm text-muted-foreground">
        Payments by Zoho Payments (UPI, cards, netbanking). One ticket per purchase. See the{" "}
        <Link href="/terms-of-use" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        for refunds.
      </p>
    </article>
  );
}
