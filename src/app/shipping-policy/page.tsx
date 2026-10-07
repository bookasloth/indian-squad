import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "How Indian Sports Club merch and event tickets are delivered.",
};

const H2 = "font-display text-xl font-semibold tracking-tight";
const A = "underline underline-offset-4";

export default function ShippingPolicyPage() {
  return (
    <article className="mx-auto flex max-w-prose flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Last updated 7 October 2026
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight">Shipping Policy</h1>
      </header>

      <h2 className={H2}>Merch</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>We ship within India only, to the address you enter at checkout.</li>
        <li>
          Every item is printed to order by our print partner and <strong>dispatched within 3–5 business days</strong>.
          Delivery usually takes a further 3–7 days depending on your PIN code.
        </li>
        <li>Shipping is free. Orders are prepaid only; we don&rsquo;t offer cash on delivery.</li>
        <li>We email you a tracking link when your order ships.</li>
        <li>
          If a parcel is lost or returned to us because of a wrong address, write to us and we&rsquo;ll help; a
          re-ship for a wrong address may cost the shipping charge.
        </li>
      </ul>

      <h2 className={H2}>Event tickets</h2>
      <p>
        Tickets are delivered by email as soon as your payment is confirmed. Nothing is posted. Show the
        confirmation email at the entrance.
      </p>

      <h2 className={H2}>Questions</h2>
      <p>
        Email{" "}
        <a href={`mailto:${site.email}`} className={A}>
          {site.email}
        </a>{" "}
        with your order number. For returns and replacements, see{" "}
        <Link href="/refund-policy" className={A}>
          Cancellations &amp; Refunds
        </Link>
        .
      </p>
    </article>
  );
}
