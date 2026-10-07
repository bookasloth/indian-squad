import { renderEmail } from "../template";
import { formatInr } from "../../utils";
import { type RenderedEmail, esc, p, TXN_FOOTER } from "./_shared";

type Shipping = { name: string; phone: string; address: string; city: string; state: string; pincode: string };

type MerchOrder = {
  title: string;
  size: string | null;
  quantity: number;
  amount: number;
  orderId: string;
  shipping: Shipping;
  url: string;
};

const item = (o: MerchOrder) => `${o.title}${o.size ? ` — size ${o.size}` : ""} × ${o.quantity}`;
const addressLines = (s: Shipping) => [s.name, s.address, `${s.city}, ${s.state} ${s.pincode}`, `Phone ${s.phone}`];

/** Buyer receipt, sent once when the payment is confirmed. Humour: None (it's a receipt). */
export function merchReceipt(o: MerchOrder): RenderedEmail {
  const amount = formatInr(o.amount);
  return {
    subject: `Order confirmed: ${o.title}`,
    html: renderEmail({
      preheader: `We've got your order for ${o.title}. It ships in 3–5 business days.`,
      headerTagline: "<strong>Indian Sports Club</strong>",
      title: "Your order is confirmed",
      footerNote: TXN_FOOTER,
      bodyHtml:
        p(`<strong>${esc(item(o))}</strong>`) +
        p(`Paid: ${amount}<br>Order: ${esc(o.orderId)}`) +
        p(`Shipping to:<br>${addressLines(o.shipping).map(esc).join("<br>")}`) +
        p("It's printed to order and ships in 3–5 business days. We'll email you the tracking link."),
      cta: { label: "Back to the shop", href: o.url },
    }),
    text: `Your order is confirmed.\n\n${item(o)}\nPaid: ${amount}\nOrder: ${o.orderId}\n\nShipping to:\n${addressLines(o.shipping).join("\n")}\n\nIt's printed to order and ships in 3–5 business days. We'll email you the tracking link.`,
  };
}

/** Alert to us: place this order with the print partner. */
export function merchOrderAlert(o: MerchOrder): RenderedEmail {
  const lines = [item(o), `Paid: ${formatInr(o.amount)}`, `Order: ${o.orderId}`, "", ...addressLines(o.shipping)];
  return {
    subject: `New merch order: ${item(o)}`,
    html: renderEmail({
      preheader: `Place it with Printrove: ${item(o)}`,
      headerTagline: "<strong>Indian Sports Club</strong>",
      title: "New merch order",
      footerNote: TXN_FOOTER,
      bodyHtml: p(lines.map(esc).join("<br>")) + p("Place it in Printrove, then set fulfilment_status = 'placed'."),
    }),
    text: lines.join("\n"),
  };
}
