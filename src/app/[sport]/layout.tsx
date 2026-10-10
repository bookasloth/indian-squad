import { notFound } from "next/navigation";
import { SPORT_SLUGS, SQUAD_SPORTS, getSport } from "@/lib/site";
import { SportEmblem } from "@/components/community/sport-emblem";
import { SportTabs } from "@/components/layout/sport-tabs";
import { explainersFor } from "@/data/learn";
import { recordsFor } from "@/data/records";

// One hub per sport (/cricket, /kabaddi, …), all prerendered. Any other top-level
// slug 404s — real routes like /events are static folders and match first.
export const dynamicParams = false;

export function generateStaticParams() {
  return SPORT_SLUGS.map((sport) => ({ sport }));
}

export default async function SportLayout({
  params,
  children,
}: {
  params: Promise<{ sport: string }>;
  children: React.ReactNode;
}) {
  const sport = getSport((await params).sport);
  if (!sport) notFound();
  const base = `/${sport.slug}`;
  const squad = SQUAD_SPORTS.includes(sport.slug);

  return (
    <div className="flex flex-col gap-8" data-sport={sport.slug}>
      <div className="flex flex-col gap-5">
        <header className="sport-hero anim-fade-up flex items-center gap-4 overflow-hidden rounded-card border border-border bg-[color-mix(in_srgb,var(--brand)_10%,transparent)] p-5">
          <SportEmblem sport={sport.slug} size={150} className="sport-hero-mark" />
          <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand)_18%,transparent)]">
            <SportEmblem sport={sport.slug} size={34} />
          </span>
          <div className="relative flex flex-col gap-0.5">
            <p className="font-display text-2xl font-bold tracking-tight">{sport.label}</p>
            <p className="text-sm text-muted-foreground">{sport.blurb}</p>
          </div>
        </header>
        <SportTabs
          items={[
            { href: base, label: "Overview" },
            ...(squad
              ? [
                  { href: `${base}/players`, label: "Players" },
                  { href: `${base}/xi`, label: "Playing XI" },
                  { href: `${base}/quiz`, label: "Quiz" },
                ]
              : []),
            ...(recordsFor(sport.slug).length > 0 ? [{ href: `${base}/records`, label: "Records" }] : []),
            ...(explainersFor(sport.slug).length > 0 ? [{ href: `${base}/learn`, label: "Learn" }] : []),
            { href: `/community/${sport.slug}`, label: "Community" },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
