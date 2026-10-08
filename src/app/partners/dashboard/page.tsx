import type { Metadata } from "next";
import Link from "next/link";
import { requireMember } from "@/lib/members/session";
import { getPartnerForUser, listPartnerEvents, type PartnerEventRow } from "@/lib/partners";
import { formatEventTime } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PartnerEventForm } from "@/components/partners/partner-event-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partner dashboard", robots: { index: false } };

function eventStatus(e: PartnerEventRow): { label: string; variant: "default" | "outline" | "secondary" } {
  if (e.published) return new Date(e.starts_at) < new Date() ? { label: "Past", variant: "outline" } : { label: "Live", variant: "default" };
  return e.submitted_at ? { label: "Under review", variant: "secondary" } : { label: "Not approved", variant: "outline" };
}

export default async function PartnerDashboardPage() {
  const { user } = await requireMember("/partners/dashboard");
  const partner = await getPartnerForUser(user!.id);

  if (!partner) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">Partner dashboard</h1>
        <p className="text-muted-foreground">You haven&rsquo;t applied to be a partner yet.</p>
        <Button asChild variant="brand" className="self-start">
          <Link href="/partners/apply">Apply now</Link>
        </Button>
      </div>
    );
  }

  const events = partner.status === "approved" ? await listPartnerEvents(partner.id) : [];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">{partner.org_name}</h1>
        <p className="text-muted-foreground">
          Partner dashboard ·{" "}
          {partner.status === "approved" ? (
            <Link href={`/partners/${partner.slug}`} className="underline underline-offset-4">
              View public page
            </Link>
          ) : (
            <span className="capitalize">{partner.status}</span>
          )}
        </p>
      </header>

      {partner.status === "pending" && (
        <Alert variant="info">
          <AlertDescription>Your application is under review. We&rsquo;ll email you, usually within 2 business days.</AlertDescription>
        </Alert>
      )}
      {(partner.status === "rejected" || partner.status === "suspended") && (
        <Alert variant="warning">
          <AlertDescription>
            Your partner account is {partner.status}. Contact us at the address on the{" "}
            <Link href="/contact" className="underline underline-offset-4">
              contact page
            </Link>{" "}
            if you think this is a mistake.
          </AlertDescription>
        </Alert>
      )}

      {partner.status === "approved" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_26rem] lg:items-start">
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-semibold tracking-tight">Your events</h2>
            {events.length === 0 ? (
              <p className="text-muted-foreground">No events yet. Submit your first one.</p>
            ) : (
              events.map((e) => {
                const s = eventStatus(e);
                return (
                  <Card key={e.id} className="flex flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {e.published ? (
                          <Link href={`/events/${e.slug}`} className="hover:underline">
                            {e.title}
                          </Link>
                        ) : (
                          e.title
                        )}
                      </h3>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatEventTime(e.starts_at)} · {e.venue}, {e.city}
                    </p>
                    {e.ticketing === "rsvp" ? (
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium">
                          {e.rsvps.length} registered{e.capacity ? ` of ${e.capacity}` : ""}
                        </summary>
                        {e.rsvps.length > 0 && (
                          <ul className="mt-2 flex flex-col gap-1 text-muted-foreground">
                            {e.rsvps.map((r) => (
                              <li key={r.email}>
                                {r.name} — <a href={`mailto:${r.email}`} className="underline underline-offset-4">{r.email}</a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </details>
                    ) : (
                      <p className="text-sm text-muted-foreground">Tickets via your link: {e.external_url}</p>
                    )}
                  </Card>
                );
              })
            )}
          </section>
          <Card className="flex flex-col gap-4 p-5">
            <h2 className="font-display text-xl font-semibold tracking-tight">Submit an event</h2>
            <PartnerEventForm defaultCity={partner.city} />
          </Card>
        </div>
      )}
    </div>
  );
}
