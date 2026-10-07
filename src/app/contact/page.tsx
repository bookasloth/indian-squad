import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach Indian Sports Club about orders, tickets, your account or a complaint.",
};

const H2 = "font-display text-xl font-semibold tracking-tight";
const A = "underline underline-offset-4";

export default function ContactPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">Contact</h1>
        <p className="text-lg text-muted-foreground">
          {site.name} is a personal project run by{" "}
          <a href={site.owner.url} className={A}>
            {site.owner.name}
          </a>
          , {site.location}.
        </p>
      </header>

      <h2 className={H2}>Email</h2>
      <p>
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>{" "}
        — orders, tickets, your account, partnerships. We reply within 2 business days. Include your order number
        if it&rsquo;s about a purchase.
      </p>

      <h2 className={H2}>Complaints &amp; grievances</h2>
      <p>
        Grievance officer: {site.owner.name},{" "}
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>
        . We acknowledge complaints within 48 hours and resolve them within one month.
      </p>

      <p className="text-muted-foreground">
        See also:{" "}
        <Link href="/shipping-policy" className={A}>
          Shipping
        </Link>
        ,{" "}
        <Link href="/refund-policy" className={A}>
          Cancellations &amp; Refunds
        </Link>
        ,{" "}
        <Link href="/terms-of-use" className={A}>
          Terms
        </Link>
        ,{" "}
        <Link href="/privacy-policy" className={A}>
          Privacy
        </Link>
        .
      </p>
    </article>
  );
}
