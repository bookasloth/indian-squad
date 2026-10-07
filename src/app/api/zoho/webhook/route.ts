import { settlePayment, verifyWebhookSignature } from "@/lib/zoho-payments";

// Catches payments where the buyer closed the tab before /verify ran.
// Throwing returns 500, so Zoho retries delivery.
export async function POST(req: Request) {
  const raw = await req.text(); // raw body: the signature covers exact bytes
  const key = process.env.ZOHO_PAY_WEBHOOK_SIGNING_KEY;
  if (!key || !verifyWebhookSignature(raw, req.headers.get("x-zoho-webhook-signature"), key)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(raw);
  if (event.event_type === "payment.succeeded") {
    await settlePayment(String(event.event_object.payment.payment_id));
  }
  return new Response("ok");
}
