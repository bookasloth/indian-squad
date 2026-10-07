// Zoho Payments (India) server client. Ported from Coffee and Toffee, where it is tested.
import "server-only";

import { getOrder, markPaid } from "./orders";

export { verifyWebhookSignature } from "./zoho-signature";

const SANDBOX = process.env.NEXT_PUBLIC_ZOHO_PAY_SANDBOX === "true";
const API = SANDBOX ? "https://paymentssandbox.zoho.in/api/v1" : "https://payments.zoho.in/api/v1";

export type ZohoPayment = {
  payment_id: string;
  status: string; // initiated | succeeded | failed | canceled | incomplete | refunded | ...
  amount: string; // "200.00"
  currency: string;
  payments_session_id: string;
  reference_number?: string;
};

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

// ponytail: per-instance cache, each serverless instance refreshes once an hour.
// Zoho rate-limits refreshes per refresh token; move to a shared cache (KV/DB) if you run many instances.
let token: { value: string; expires: number } | undefined;

async function accessToken() {
  if (token && Date.now() < token.expires) return token.value;
  const params = new URLSearchParams({
    refresh_token: env("ZOHO_PAY_REFRESH_TOKEN"),
    client_id: env("ZOHO_PAY_CLIENT_ID"),
    client_secret: env("ZOHO_PAY_CLIENT_SECRET"),
    grant_type: "refresh_token",
  });
  const res = await fetch(`https://accounts.zoho.in/oauth/v2/token?${params}`, { method: "POST", cache: "no-store" });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Zoho token refresh failed: ${data.error ?? res.status}`);
  // Zoho India returns expires_in in MILLISECONDS (3600000) and the seconds in expires_in_sec (3600).
  token = { value: data.access_token, expires: Date.now() + ((data.expires_in_sec ?? 3600) - 60) * 1000 };
  return token.value;
}

async function zoho(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}?account_id=${env("NEXT_PUBLIC_ZOHO_PAY_ACCOUNT_ID")}`, {
    ...init,
    headers: { Authorization: `Zoho-oauthtoken ${await accessToken()}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Zoho ${path} failed: ${data.message ?? res.status}`);
  return data;
}

export async function createPaymentSession(o: { amount: number; description: string; referenceNumber: string }) {
  const data = await zoho("/paymentsessions", {
    method: "POST",
    body: JSON.stringify({
      amount: o.amount,
      currency: "INR",
      description: o.description.slice(0, 500),
      reference_number: o.referenceNumber,
    }),
  });
  return data.payments_session.payments_session_id as string;
}

export async function getPayment(paymentId: string): Promise<ZohoPayment> {
  return (await zoho(`/payments/${encodeURIComponent(paymentId)}`)).payment;
}

// Single source of truth for "is this order paid". Used by the verify route and the webhook.
// Never trusts the browser or the webhook body: re-fetches the payment from Zoho and checks it against our order.
export async function settlePayment(paymentId: string) {
  const p = await getPayment(paymentId);
  if (p.status !== "succeeded") return { paid: false, status: p.status };

  const orderId = p.reference_number;
  const order = orderId ? await getOrder(orderId) : null;
  if (!orderId || !order) throw new Error(`Payment ${paymentId}: unknown order ${orderId}`);
  if (p.currency !== "INR" || Number(p.amount).toFixed(2) !== order.amount.toFixed(2)) {
    throw new Error(`Payment ${paymentId}: paid ${p.currency} ${p.amount}, order ${orderId} expects INR ${order.amount}`);
  }

  await markPaid(orderId, p);
  return { paid: true, status: p.status, orderId };
}
