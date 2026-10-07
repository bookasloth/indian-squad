// Pure validation for a merch order (no server-only deps), so scripts/shop.test.mjs can run it directly.
import { isEmail } from "./validation/email.ts";

export type Shipping = { name: string; phone: string; address: string; city: string; state: string; pincode: string };

export type MerchInput = { size: string | null; quantity: number; email: string; shipping: Shipping };

export const MAX_QUANTITY = 5;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validates the browser's order body against the product's sizes. Never trusts a price: there is none here. */
export function parseMerchOrder(body: unknown, sizes: string[]): { ok: true; value: MerchInput } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const s = (b.shipping ?? {}) as Record<string, unknown>;

  const size = sizes.length ? str(b.size) : null;
  if (sizes.length && !sizes.includes(size!)) return { ok: false, error: "Pick a size." };

  const quantity = Number(b.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return { ok: false, error: `Quantity must be 1–${MAX_QUANTITY}.` };
  }

  const email = str(b.email);
  if (!isEmail(email)) return { ok: false, error: "Enter a valid email." };

  const phone = str(s.phone).replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
  const shipping: Shipping = {
    name: str(s.name),
    phone,
    address: str(s.address),
    city: str(s.city),
    state: str(s.state),
    pincode: str(s.pincode),
  };
  if (shipping.name.length < 2 || shipping.name.length > 80) return { ok: false, error: "Enter the recipient's name." };
  if (!/^[6-9]\d{9}$/.test(phone)) return { ok: false, error: "Enter a 10-digit Indian mobile number." };
  if (shipping.address.length < 10 || shipping.address.length > 300) return { ok: false, error: "Enter the full address." };
  if (shipping.city.length < 2 || shipping.city.length > 60) return { ok: false, error: "Enter the city." };
  if (shipping.state.length < 2 || shipping.state.length > 40) return { ok: false, error: "Enter the state." };
  if (!/^[1-9]\d{5}$/.test(shipping.pincode)) return { ok: false, error: "Enter a 6-digit PIN code." };

  return { ok: true, value: { size, quantity, email, shipping } };
}
