import { createHmac, timingSafeEqual } from "node:crypto";

// Zoho Payments webhook header: "t=<timestamp>,v=<hex hmac-sha256 of `${t}.${rawBody}`>".
// Pure (no server-only deps) so scripts/zoho-signature.test.mjs can run it directly.
// ponytail: no timestamp window; replays are harmless because settlePayment re-fetches from Zoho and markPaid is idempotent.
export function verifyWebhookSignature(rawBody: string, header: string | null, signingKey: string) {
  const parts = new Map(
    (header ?? "").split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()] as const;
    }),
  );
  const t = parts.get("t");
  const v = parts.get("v");
  if (!t || !v) return false;
  const expected = Buffer.from(createHmac("sha256", signingKey).update(`${t}.${rawBody}`).digest("hex"));
  const given = Buffer.from(v);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
