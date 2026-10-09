import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { listApprovedPartners } from "@/lib/partners";
import { sportLabel } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partners",
  description: "Run sports events? List your tournaments, camps and watch-parties on Indian Sports Club for free.",
};

const H2 = "font-display text-xl font-semibold tracking-tight";

export default function PartnersPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex max-w-prose flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">For organisers</span>
        <h1 className="font-display text-4xl font-bold tracking-tight">List your sports event</h1>
        <p className="text-lg text-muted-foreground">
          Turfs, academies, clubs and organisers: put your tournaments, camps, meetups and watch-parties in front of
          fans who actually turn up. Listing is free.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild variant="brand" size="lg">
            <Link href="/partners/apply">Apply to be a partner</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/partners/dashboard">Partner dashboard</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["1. Apply", "Tell us about your club. We review every partner by hand, usually within 2 business days."],
          ["2. Submit events", "Add dates, venue, format and capacity. Each event is checked before it goes live."],
          ["3. Fill them up", "Fans register for free, or buy through your own ticket link. You get the list of names."],
        ].map(([title, body]) => (
          <Card key={title} className="flex flex-col gap-2 p-5">
            <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{body}</p>
          </Card>
        ))}
      </section>

      <section className="flex max-w-prose flex-col gap-3">
        <h2 className={H2}>What it costs</h2>
        <p>
          Listing free and external-ticket events costs nothing. Paid ticketing through Indian Sports Club — fans pay
          on our site and we pay you out after the event — is coming soon at <strong>8% all-inclusive</strong>.
        </p>
        <h2 className={`${H2} pt-2`}>What you can list</h2>
        <p className="text-muted-foreground">
          Physical sports tournaments, coaching camps, meetups, and watch-parties at venues that hold a screening
          licence. No betting, no paid fantasy or prediction contests, no official team or league logos. Full rules in
          the{" "}
          <Link href="/partners/terms" className="underline underline-offset-4">
            partner terms
          </Link>
          .
        </p>
      </section>

      {/* Last section: streams in after the copy above, which needs no data. No
          fallback — nothing above it moves, and an empty list renders nothing. */}
      <Suspense fallback={null}>
        <PartnerList />
      </Suspense>
    </div>
  );
}

async function PartnerList() {
  const partners = await listApprovedPartners();
  if (partners.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className={H2}>Our partners</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <li key={p.id}>
            <Link href={`/partners/${p.slug}`} className="block h-full">
              <Card interactive className="flex h-full flex-col gap-1 p-5">
                <h3 className="font-display text-lg font-semibold tracking-tight">{p.org_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {p.city} · {p.sports.map((s) => sportLabel(s)).join(", ")}
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
