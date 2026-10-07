// Run: npm test. Merch orders cross a trust boundary: the browser sends size, quantity and address.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMerchOrder } from "../src/lib/shop-validate.ts";

const good = {
  size: "M",
  quantity: 2,
  email: "fan@example.com",
  shipping: { name: "Asha", phone: "+91 98765-43210", address: "12 MG Road, Sitabuldi", city: "Nagpur", state: "Maharashtra", pincode: "440012" },
};

test("accepts a valid order and normalises the phone", () => {
  const r = parseMerchOrder(good, ["S", "M", "L"]);
  assert.equal(r.ok, true);
  assert.equal(r.value.shipping.phone, "9876543210");
  assert.equal(r.value.size, "M");
});

test("one-size products ignore the size field", () => {
  const r = parseMerchOrder({ ...good, size: "XXL" }, []);
  assert.equal(r.ok, true);
  assert.equal(r.value.size, null);
});

test("rejects bad size, quantity, email, phone and PIN", () => {
  const sizes = ["S", "M", "L"];
  for (const bad of [
    { ...good, size: "XXL" },
    { ...good, quantity: 0 },
    { ...good, quantity: 6 },
    { ...good, quantity: 1.5 },
    { ...good, email: "nope" },
    { ...good, shipping: { ...good.shipping, phone: "12345" } },
    { ...good, shipping: { ...good.shipping, pincode: "044001" } },
    { ...good, shipping: { ...good.shipping, address: "short" } },
    null,
  ]) {
    assert.equal(parseMerchOrder(bad, sizes).ok, false, JSON.stringify(bad));
  }
});
