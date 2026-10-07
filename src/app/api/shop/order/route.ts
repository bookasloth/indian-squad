import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";
import { paymentsEnabled } from "@/lib/events";
import { getMemberContext } from "@/lib/members/session";
import { allow, clientIp } from "@/lib/rate-limit";
import { parseMerchOrder } from "@/lib/shop-validate";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Creates a pending merch order (guest checkout allowed). The amount is price × quantity from the product row;
// the browser only sends the product id, size, quantity and shipping address.
export async function POST(req: Request) {
  if (!paymentsEnabled()) return Response.json({ error: "The shop isn't open yet." }, { status: 503 });
  if (!(await allow(`shop:${clientIp(await headers())}`, 5, 60_000))) {
    return Response.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const productId = (body as { productId?: unknown } | null)?.productId;
  if (typeof productId !== "string" || !UUID.test(productId)) {
    return Response.json({ error: "Unknown product." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: product } = await db
    .from("is_products")
    .select("id, price, sizes")
    .eq("id", productId)
    .eq("active", true)
    .maybeSingle<{ id: string; price: number; sizes: string[] }>();
  if (!product) return Response.json({ error: "Unknown product." }, { status: 404 });

  const parsed = parseMerchOrder(body, product.sizes);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const { size, quantity, email, shipping } = parsed.value;

  const { user } = await getMemberContext();
  const { data: order, error } = await db
    .from("is_orders")
    .insert({
      kind: "merch",
      product_id: product.id,
      size,
      quantity,
      shipping,
      email,
      user_id: user?.id ?? null,
      amount: Number(product.price) * quantity,
      fulfilment_status: "new",
    })
    .select("id")
    .single();
  if (error || !order) return Response.json({ error: "Couldn't start checkout. Try again." }, { status: 500 });

  return Response.json({ orderId: order.id });
}
