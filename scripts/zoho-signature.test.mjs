// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "../src/lib/zoho-signature.ts";

const key = "test-signing-key";
const body = '{"event_type":"payment.succeeded"}';
const sign = (t, b, k = key) => `t=${t},v=${createHmac("sha256", k).update(`${t}.${b}`).digest("hex")}`;

test("accepts a correctly signed body", () => {
  assert.equal(verifyWebhookSignature(body, sign("1700000000", body), key), true);
});

test("rejects a tampered body, wrong key, or malformed header", () => {
  assert.equal(verifyWebhookSignature(body + " ", sign("1700000000", body), key), false);
  assert.equal(verifyWebhookSignature(body, sign("1700000000", body, "other-key"), key), false);
  assert.equal(verifyWebhookSignature(body, "v=abc", key), false);
  assert.equal(verifyWebhookSignature(body, null, key), false);
});
