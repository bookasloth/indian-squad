import { renderEmail } from "../template";
import { formatEventTime, formatInr } from "../../utils";
import { type RenderedEmail, esc, p, TXN_FOOTER } from "./_shared";

/** Event ticket receipt, sent once when the payment is confirmed. Humour: None (it's a receipt). */
export function eventTicket(a: {
  title: string;
  venue: string;
  city: string;
  starts_at: string;
  amount: number;
  orderId: string;
  url: string;
}): RenderedEmail {
  const when = formatEventTime(a.starts_at);
  const amount = formatInr(a.amount);
  return {
    subject: `You're in: ${a.title}`,
    html: renderEmail({
      preheader: `Ticket confirmed for ${a.title}, ${when}.`,
      headerTagline: "<strong>Indian Squad</strong>",
      title: "Your ticket is confirmed",
      footerNote: TXN_FOOTER,
      bodyHtml:
        p(`<strong>${esc(a.title)}</strong>`) +
        p(`${esc(when)}<br>${esc(a.venue)}, ${esc(a.city)}`) +
        p(`Paid: ${amount}<br>Order: ${esc(a.orderId)}`) +
        p("Show this email at the entrance. See you there."),
      cta: { label: "Event details", href: a.url },
    }),
    text: `Your ticket is confirmed.\n\n${a.title}\n${when}\n${a.venue}, ${a.city}\n\nPaid: ${amount}\nOrder: ${a.orderId}\n\nShow this email at the entrance. Event details: ${a.url}`,
  };
}
