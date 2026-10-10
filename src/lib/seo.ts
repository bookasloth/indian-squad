import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Absolute URL on the live site. Everything routes through `site.url`, so the
 * domain switch (docs/ROUTES.md §1) is a one-line change in site.ts. */
export const abs = (path = "/") => new URL(path, site.url).toString();

/** Title, description and self-canonical for an indexable page. Relative URLs
 * resolve against `metadataBase` in the root layout. */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { ...(title ? { title } : {}), description, url: path },
  };
}

export type Qa = { q: string; a: string };
export type CrumbLink = { label: string; href: string };

export const orgLd = () => ({
  "@type": "Organization",
  "@id": abs("/#org"),
  name: site.name,
  url: abs(),
  email: site.email,
  description: site.description,
  founder: { "@type": "Person", name: site.owner.name, url: site.owner.url },
});

export const websiteLd = () => ({
  "@type": "WebSite",
  "@id": abs("/#website"),
  name: site.name,
  url: abs(),
  inLanguage: "en-IN",
  publisher: { "@id": abs("/#org") },
});

export const breadcrumbLd = (crumbs: CrumbLink[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: abs(c.href) })),
});

export const faqLd = (qas: Qa[]) => ({
  "@type": "FAQPage",
  mainEntity: qas.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

/** `<` escaped so user- or data-supplied strings can't close the script tag. */
export const ldJson = (graph: object[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
