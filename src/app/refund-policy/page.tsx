import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cancellations & Refunds",
  description: "When Indian Sports Club refunds or replaces merch and event tickets.",
};

const H2 = "font-display text-xl font-semibold tracking-tight";
const A = "underline underline-offset-4";

export default function RefundPolicyPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 7 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Cancellations &amp; Refunds</h1>
      </header>

      <h2 className={H2}>Merch</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Cancel before dispatch:</strong> email us within 12 hours of ordering for a full refund. After that
          your item is already being printed.
        </li>
        <li>
          <strong>Misprinted, damaged or wrong item/size sent:</strong> email us a photo within 7 days of delivery
          and we&rsquo;ll send a free replacement, or refund you if a replacement isn&rsquo;t possible.
        </li>
        <li>
          Because every item is printed to order, we don&rsquo;t accept returns for change of mind or a size you
          picked yourself — check the size details on the product page before ordering.
        </li>
      </ul>

      <h2 className={H2}>Event tickets</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Event cancelled or rescheduled</strong> by the organiser: full refund to your original payment
          method (or keep your ticket for the new date).
        </li>
        <li>Otherwise tickets are non-refundable, including if you can&rsquo;t attend.</li>
        <li>
          Venues may set entry rules (age, ID, dress code). Being refused entry for breaking them isn&rsquo;t
          refundable.
        </li>
      </ul>

      <h2 className={H2}>How refunds are paid</h2>
      <p>
        Approved refunds go back to the original payment method (UPI, card or bank) within 5–7 business days. Your
        bank may take a few more days to show it.
      </p>

      <h2 className={H2}>Ask for a refund or replacement</h2>
      <p>
        Email{" "}
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>{" "}
        with your order number (and a photo for damaged items). We acknowledge within 48 hours.
      </p>
    </article>
  );
}
