import { Breadcrumb } from "@/components/ui/breadcrumb";
import { breadcrumbLd, faqLd, ldJson, type CrumbLink, type Qa } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Structured data for search engines and AI answers (schema.org JSON-LD). */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(Array.isArray(data) ? data : [data]) }} />
  );
}

/** Visible breadcrumb trail plus its BreadcrumbList. Home is prepended; the last
 * item is the current page. */
export function Crumbs({ items, className }: { items: CrumbLink[]; className?: string }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <Breadcrumb items={all} className={className} />
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}

/** FAQ block plus its FAQPage. Native <details> keeps every answer in the HTML,
 * so crawlers read them without running JS. */
export function Faq({ items, title = "Questions", className }: { items: Qa[]; title?: string; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="divide-y divide-border rounded-card border border-border">
        {items.map(({ q, a }) => (
          <details key={q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium marker:hidden">
              <span className="flex items-start justify-between gap-4">
                {q}
                <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(items)} />
    </section>
  );
}
