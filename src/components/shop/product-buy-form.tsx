"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OUTCOME_TEXT, payZoho, post } from "@/lib/checkout";
import { site } from "@/lib/site";
import { formatInr } from "@/lib/utils";

type Message = { tone: "info" | "danger" | "success"; text: string };

const SELECT =
  "flex h-10 w-full rounded-input border border-input bg-background px-3 py-2 text-sm text-foreground transition-ui focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function ProductBuyForm({
  productId,
  price,
  sizes,
  maxQuantity,
  name: defaultName,
  email: defaultEmail,
}: {
  productId: string;
  price: number;
  sizes: string[];
  maxQuantity: number;
  name?: string;
  email?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [done, setDone] = useState(false);

  async function buy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setBusy(true);
    setMessage(null);
    try {
      const { orderId } = await post("/api/shop/order", {
        productId,
        size: get("size"),
        quantity,
        email: get("email"),
        shipping: {
          name: get("name"),
          phone: get("phone"),
          address: get("address"),
          city: get("city"),
          state: get("state"),
          pincode: get("pincode"),
        },
      });
      const outcome = await payZoho(orderId, site.name, { name: get("name"), email: get("email") });
      if (outcome === "paid") {
        setDone(true);
        setMessage({ tone: "success", text: `Order placed! A confirmation is on its way to ${get("email")}. It ships in 3–5 business days.` });
      } else {
        setMessage(OUTCOME_TEXT[outcome]);
      }
    } catch (err) {
      setMessage({ tone: "danger", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  if (done && message) {
    return (
      <Alert variant="success">
        <AlertDescription>{message.text}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={buy} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {sizes.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="size">Size</Label>
            <select id="size" name="size" required defaultValue="" className={SELECT}>
              <option value="" disabled>
                Choose
              </option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, Number(e.target.value) || 1)))}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold">Ship to (India only)</legend>
        <Input name="name" placeholder="Full name" autoComplete="name" defaultValue={defaultName} required />
        <div className="grid grid-cols-2 gap-3">
          <Input name="email" type="email" placeholder="Email" autoComplete="email" defaultValue={defaultEmail} required />
          <Input name="phone" type="tel" placeholder="Mobile (10 digits)" autoComplete="tel" required />
        </div>
        <Textarea name="address" placeholder="House, street, area" autoComplete="street-address" rows={2} required />
        <div className="grid grid-cols-3 gap-3">
          <Input name="city" placeholder="City" autoComplete="address-level2" required />
          <Input name="state" placeholder="State" autoComplete="address-level1" required />
          <Input name="pincode" inputMode="numeric" placeholder="PIN code" autoComplete="postal-code" required />
        </div>
      </fieldset>

      <Button type="submit" variant="brand" size="lg" loading={busy}>
        Pay {formatInr(price * quantity)}
      </Button>
      {message && (
        <Alert variant={message.tone}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">
        Prepaid via Zoho Payments (UPI, cards, netbanking). Free shipping. Printed to order, ships in 3–5 business days.
      </p>
    </form>
  );
}
