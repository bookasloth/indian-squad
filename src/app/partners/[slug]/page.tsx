import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPartnerPublic } from "@/lib/partners";
import { listUpcomingEvents } from "@/lib/events";
import { sportLabel } from "@/lib/site";
import { formatEventTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPartnerPublic((await params).slug);
  return p ? { title: p.org_name, description: `${p.org_name}, ${p.city} — sports events on Indian Sports Club.` } : {};
}

export default async function PartnerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const partner = await getPartnerPublic((await params).slug);
  if (!partner) notFound();
  const events = await listUpcomingEvents({ partnerId: partner.id });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex max-w-prose flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Partner</span>
        <h1 className="font-display text-4xl font-bold tracking-tight">{partner.org_name}</h1>
        <p className="text-muted-foreground">
          {partner.city} · {partner.sports.map((s) => sportLabel(s)).join(", ")}
          {partner.website && (
            <>
              {" · "}
              <a href={partner.website} target="_blank" rel="noopener nofollow" className="underline underline-offset-4">
                Website
              </a>
            </>
          )}
        </p>
        {partner.about && <p className="whitespace-pre-line pt-2">{partner.about}</p>}
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold tracking-tight">Upcoming events</h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground">No upcoming events right now.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {events.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.slug}`} className="block h-full">
                  <Card interactive className="flex h-full flex-col gap-1 p-5">
                    <h3 className="font-display text-lg font-semibold tracking-tight">{e.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatEventTime(e.starts_at)}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.venue}, {e.city}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
