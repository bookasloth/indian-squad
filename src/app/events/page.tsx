import type { Metadata } from "next";
import Link from "next/link";
import { listUpcomingEvents } from "@/lib/events";
import { getPartnersPublic } from "@/lib/partners";
import { sportLabel } from "@/lib/site";
import { formatEventTime, formatInr } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Indian Sports Club watch-parties, box cricket, tournaments and fan meetups near you.",
};

export default async function EventsPage() {
  const events = await listUpcomingEvents();
  const partners = await getPartnersPublic(events.flatMap((e) => (e.partner_id ? [e.partner_id] : [])));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Watch-parties, tournaments and meetups.{" "}
          <Link href="/partners" className="underline underline-offset-4">
            Run sports events? List yours free.
          </Link>
        </p>
      </header>

      {events.length === 0 ? (
        <EmptyState
          title="No events scheduled yet"
          description="The next watch-party is in the works. Join the newsletter to hear first."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {events.map((e) => (
            <li key={e.id}>
              <Link href={`/events/${e.slug}`} className="block h-full">
                <Card interactive className="flex h-full flex-col gap-2 p-5">
                  {e.sport && (
                    <Badge variant="outline" className="self-start">
                      {sportLabel(e.sport)}
                    </Badge>
                  )}
                  <h2 className="font-display text-lg font-semibold tracking-tight">{e.title}</h2>
                  <p className="text-sm text-muted-foreground">{formatEventTime(e.starts_at)}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.venue}, {e.city}
                    {e.partner_id && partners.get(e.partner_id) && <> · by {partners.get(e.partner_id)!.org_name}</>}
                  </p>
                  <p className="mt-auto pt-2 font-semibold">
                    {e.ticketing === "rsvp"
                      ? "Free"
                      : e.ticketing === "external"
                        ? e.price > 0
                          ? `From ${formatInr(e.price)}`
                          : "Tickets via organiser"
                        : formatInr(e.price)}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
