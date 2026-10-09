import Link from "next/link";
import type { EventRow } from "@/lib/events";
import { sportLabel } from "@/lib/site";
import { formatEventTime, formatInr } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

/** Event tile for listings (/events, sport hubs). `organiser` = partner org name, if any. */
export function EventCard({ event: e, organiser, showSport = true }: { event: EventRow; organiser?: string; showSport?: boolean }) {
  return (
    <Link href={`/events/${e.slug}`} className="block h-full">
      <Card interactive className="flex h-full flex-col gap-2 p-5">
        {showSport && e.sport && (
          <Badge variant="outline" className="self-start">
            {sportLabel(e.sport)}
          </Badge>
        )}
        <h2 className="font-display text-lg font-semibold tracking-tight">{e.title}</h2>
        <p className="text-sm text-muted-foreground">{formatEventTime(e.starts_at)}</p>
        <p className="text-sm text-muted-foreground">
          {e.venue}, {e.city}
          {organiser && <> · by {organiser}</>}
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
  );
}
