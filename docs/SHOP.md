# Shop — Indian Sports Club merchandise

Our own branded merch, sold by us (merchant of record) and paid through **Zoho Payments** (already live and
tested). No Route, no partners involved.

Status: plan, 7 Oct 2026.

## Model: print-on-demand, white-label

**Printrove** (recommended): no inventory, white-label packaging, documented REST API for custom sites (create
design / create order / confirm order), ships India-wide.
([product](https://printrove.com/custom/mens-clothing/mens-round-neck-tshirt/),
[API](https://community.printrove.com/portal/en/kb/articles/printrove-api-documentation))
Backup: Qikink (cheaper base, no RTO charges, API not publicly documented).

| Per tee (Printrove) | ₹ |
| --- | --- |
| Blank + front print | ~245–320 |
| Shipping | ~60 |
| Zoho gateway (~2.4% of ₹699) | ~17 |
| **Cost** | **~322–397** |
| **Sell at ₹699** → margin | **~₹300–375** |

Launch range: 3 designs × tee (and maybe a cap and a mug). Original designs only — "12th Man", "We stand
united", sport emblems we already have.

## Phases

| Phase | What | Effort |
| --- | --- | --- |
| **S0 — Shop live, manual fulfilment** | `/shop` + product pages, size picker, shipping address, Zoho checkout, order email to you; you place the order in Printrove's dashboard (2 min/order) | Small — reuses the Zoho flow + `is_orders` |
| **S1 — Automated** | On paid: call Printrove create-order + confirm; save tracking; "shipped" email | When orders > ~20/month |
| **S2 — Upsell** | Merch card on ticket confirmation + receipt email; bundles (ticket + tee) | With partner P1 |

## Build notes (S0)

- **One orders table, one checkout.** Generalise `is_orders`: `kind` (`ticket|merch`), nullable `event_id`,
  `product_id`, `size`, `quantity`, `shipping` (jsonb: name, phone, address, pincode, state),
  `fulfilment_status` (`new|placed|shipped|delivered`), `tracking_url`. `markPaid` picks the receipt template by
  `kind`. Price still comes only from the DB.
- `is_products`: slug, title, description, price, images[], sizes[], printrove_product_id, active.
  Seeded by SQL like events; admin UI later.
- **Prepaid only (no COD)** — no RTO losses. India only. Flat ₹0 shipping (baked into price) or free above ₹999.
- **Returns**: replacement for misprints / damage / wrong size within 7 days (Printrove handles damage claims);
  no change-of-mind returns. Needs a **Shipping policy** and **Cancellation & Refunds** page (Razorpay wants
  both too).

## Status (S0 built, 7 Oct 2026)

`/shop`, `/shop/[slug]` (size, quantity, shipping address, guest checkout), `POST /api/shop/order`, Zoho
checkout via the shared session/verify/webhook flow, buyer receipt + "new merch order" alert to `SMTP_TO_EMAIL`,
`/contact`, `/shipping-policy`, `/refund-policy`. Migration `0015_is_shop.sql`.

**Add a product** (Supabase SQL editor; images = Printrove mockup URLs):

```sql
insert into is_products (slug, title, description, price, images, sizes, active, sort)
values ('12th-man-tee', '12th Man Tee', '180 GSM cotton, regular fit. Size chart: S 38", M 40", L 42", XL 44".',
        699, array['https://…/front.png', 'https://…/back.png'], array['S','M','L','XL'], true, 1);
```

**Fulfil an order**: open the alert email → place it in Printrove → then
`update is_orders set fulfilment_status = 'placed' where id = '<order id>';`

## Rules

- No ICC/BCCI/IPL/team logos, kits that copy official jerseys, or player names/faces (Delhi HC
  personality-rights orders).
- **Don't print the national flag itself** on apparel (Flag Code / Prevention of Insults to National Honour Act
  limits flag use on clothing); use tricolour colours and our own marks instead.
- GST: selling goods inter-state usually needs GST registration — we'll need it anyway for partner ticketing
  (see PARTNERS.md). CA to confirm.
