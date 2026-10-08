import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberContext } from "@/lib/members/session";
import { listReviewQueue } from "@/lib/partners";
import { sportLabel } from "@/lib/site";
import { formatEventTime, formatInr } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ReviewActions } from "@/components/partners/review-actions";

export const metadata: Metadata = { title: "Partner review", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PartnerReviewPage() {
  const { role } = await getMemberContext();
  if (role !== "admin") notFound();
  const { partners, events } = await listReviewQueue();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">Partner review</h1>
        <Link href="/community/moderation" className="text-sm text-muted-foreground hover:text-foreground">
          Community moderation →
        </Link>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold tracking-tight">Applications ({partners.length})</h2>
        {partners.length === 0 && <p className="text-muted-foreground">Nothing waiting.</p>}
        {partners.map((p) => (
          <Card key={p.id} className="flex flex-col gap-2 p-5">
            <h3 className="font-display text-lg font-semibold tracking-tight">{p.org_name}</h3>
            <p className="text-sm text-muted-foreground">
              {p.city} · {p.sports.map((s) => sportLabel(s)).join(", ")} · applied {new Date(p.created_at).toLocaleDateString("en-IN")}
            </p>
            <p className="text-sm">
              {p.contact_name} · <a href={`tel:+91${p.phone}`} className="underline underline-offset-4">+91 {p.phone}</a>
              {p.website && (
                <>
                  {" · "}
                  <a href={p.website} target="_blank" rel="noopener nofollow" className="underline underline-offset-4">
                    {p.website}
                  </a>
                </>
              )}
            </p>
            {p.about && <p className="whitespace-pre-line text-sm text-muted-foreground">{p.about}</p>}
            <ReviewActions id={p.id} kind="partner" />
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold tracking-tight">Events ({events.length})</h2>
        {events.length === 0 && <p className="text-muted-foreground">Nothing waiting.</p>}
        {events.map((e) => (
          <Card key={e.id} className="flex flex-col gap-2 p-5">
            <h3 className="font-display text-lg font-semibold tracking-tight">{e.title}</h3>
            <p className="text-sm text-muted-foreground">
              {e.partner?.org_name} · {formatEventTime(e.starts_at)} · {e.venue}, {e.city}
              {e.capacity ? ` · capacity ${e.capacity}` : ""}
            </p>
            <p className="text-sm">
              {e.ticketing === "rsvp" ? (
                "Free registration"
              ) : (
                <>
                  Own tickets{e.price > 0 ? ` from ${formatInr(e.price)}` : ""}:{" "}
                  <a href={e.external_url ?? "#"} target="_blank" rel="noopener nofollow" className="underline underline-offset-4">
                    {e.external_url}
                  </a>
                </>
              )}
            </p>
            {e.description && <p className="whitespace-pre-line text-sm text-muted-foreground">{e.description}</p>}
            <ReviewActions id={e.id} kind="event" />
          </Card>
        ))}
      </section>
    </div>
  );
}
