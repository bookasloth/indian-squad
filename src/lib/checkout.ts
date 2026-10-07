// Client-side: opens the Zoho Payments widget, then confirms server-side. Ported from Coffee and Toffee.
// The amount is never set here: Zoho charges the server-created session for a server-priced order.

export type Outcome = "paid" | "processing" | "cancelled" | "failed";

export const OUTCOME_TEXT: Record<Exclude<Outcome, "paid">, { tone: "info" | "danger"; text: string }> = {
  processing: { tone: "info", text: "Payment is processing. You'll get your ticket by email once your bank confirms." },
  cancelled: { tone: "info", text: "Payment cancelled. No charge was made." },
  failed: { tone: "danger", text: "Payment failed. No worries, try again when you're ready." },
};

declare global {
  interface Window {
    ZPayments: new (config: object) => {
      requestPaymentMethod(options: object): Promise<{ payment_id: string }>;
      close(): Promise<void>;
    };
  }
}

let widget: Promise<void> | undefined;
function loadWidget() {
  widget ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://static.zohocdn.com/zpay/zpay-js/v1/zpayments.js";
    s.onload = () => resolve();
    s.onerror = () => {
      widget = undefined; // allow a retry
      reject(new Error("Couldn't load the payment window. Check your connection."));
    };
    document.head.appendChild(s);
  });
  return widget;
}

export async function post(url: string, body: object) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong, please try again.");
  return data;
}

export async function payZoho(orderId: string, business: string, c: { name?: string; email: string }): Promise<Outcome> {
  await loadWidget();
  const zp = new window.ZPayments({
    account_id: process.env.NEXT_PUBLIC_ZOHO_PAY_ACCOUNT_ID,
    domain: "IN",
    otherOptions: {
      api_key: process.env.NEXT_PUBLIC_ZOHO_PAY_API_KEY,
      ...(process.env.NEXT_PUBLIC_ZOHO_PAY_SANDBOX === "true" && { is_test_mode: true }),
    },
  });
  try {
    const session = await post("/api/zoho/session", { orderId });
    const { payment_id } = await zp.requestPaymentMethod({
      amount: session.amount,
      currency_code: "INR",
      currency_symbol: "₹",
      payments_session_id: session.sessionId,
      business,
      description: session.description,
      reference_number: orderId,
      address: { name: c.name ?? "", email: c.email },
    });
    const r = await post("/api/zoho/verify", { paymentId: payment_id });
    if (r.paid) return "paid";
    return r.status === "failed" || r.status === "canceled" ? "failed" : "processing"; // UPI can settle late
  } catch (e) {
    if ((e as { code?: string }).code === "widget_closed") return "cancelled";
    throw e;
  } finally {
    await zp.close();
  }
}
