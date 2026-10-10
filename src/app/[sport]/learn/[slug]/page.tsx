import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXPLAINERS, getExplainer } from "@/data/learn";
import { site, sportLabel } from "@/lib/site";
import { abs, pageMeta } from "@/lib/seo";
import { Crumbs, Faq, JsonLd } from "@/components/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return EXPLAINERS.map((e) => ({ sport: e.sport, slug: e.slug }));
}

type Params = { params: Promise<{ sport: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sport, slug } = await params;
  const e = getExplainer(sport, slug);
  return e ? pageMeta({ title: e.title, description: e.description, path: `/${sport}/learn/${e.slug}` }) : {};
}

const H2 = "font-display text-xl font-semibold tracking-tight";
const RULEBOOK: Record<string, string> = {
  cricket: "the Laws of Cricket and ICC playing conditions",
  hockey: "the FIH Rules of Hockey",
  kabaddi: "international kabaddi rules and Pro Kabaddi League rules",
  football: "the IFAB Laws of the Game and AIFF competition rules",
  badminton: "the BWF Laws of Badminton and World Tour regulations",
  f1: "the FIA Formula One Sporting and Technical Regulations",
};
const reviewedLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function ExplainerPage({ params }: Params) {
  const { sport, slug } = await params;
  const e = getExplainer(sport, slug);
  if (!e) notFound();
  const label = sportLabel(sport) ?? sport;
  const path = `/${sport}/learn/${e.slug}`;

  return (
    <article className="mx-auto flex w-full max-w-prose flex-col gap-6">
      <Crumbs
        items={[
          { label, href: `/${sport}` },
          { label: "Learn", href: `/${sport}/learn` },
          { label: e.title, href: path },
        ]}
      />
      <JsonLd
        data={{
          "@type": "Article",
          headline: e.title,
          description: e.description,
          url: abs(path),
          dateModified: e.reviewed,
          inLanguage: "en-IN",
          author: { "@id": abs("/#org") },
          publisher: { "@id": abs("/#org") },
        }}
      />

      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Reviewed {reviewedLabel(e.reviewed)}
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">{e.title}</h1>
      </header>

      <p className="text-lg">{e.answer}</p>

      {e.sections.map((s) => (
        <section key={s.h} className="flex flex-col gap-3">
          <h2 className={H2}>{s.h}</h2>
          {s.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}

      {e.terms && (
        <dl className="flex flex-col divide-y divide-border rounded-card border border-border">
          {e.terms.map((t) => (
            <div key={t.term} className="px-5 py-3">
              <dt className="font-semibold">{t.term}</dt>
              <dd className="text-muted-foreground">{t.def}</dd>
            </div>
          ))}
        </dl>
      )}

      <Faq items={e.faq} />

      <nav className="flex flex-col gap-3">
        <h2 className={H2}>Keep reading</h2>
        <ul className="flex flex-col gap-2">
          {e.related.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="underline underline-offset-4">
                {r.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/${sport}/learn`} className="underline underline-offset-4">
              All {label.toLowerCase()} explainers
            </Link>
          </li>
        </ul>
      </nav>

      <p className="text-sm text-muted-foreground">
        Written for {site.name} and checked against {RULEBOOK[sport] ?? "the governing body's rules"}.{" "}
        <Link href="/editorial-policy" className="underline underline-offset-4">
          Editorial policy
        </Link>
        .
      </p>
    </article>
  );
}
