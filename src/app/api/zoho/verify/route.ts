import { settlePayment } from "@/lib/zoho-payments";

export async function POST(req: Request) {
  const { paymentId } = await req.json().catch(() => ({}));
  if (typeof paymentId !== "string" || !/^\d+$/.test(paymentId)) {
    return Response.json({ error: "Invalid paymentId" }, { status: 400 });
  }
  return Response.json(await settlePayment(paymentId));
}
