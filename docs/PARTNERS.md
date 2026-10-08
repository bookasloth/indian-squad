# Partners — sell tickets to your sports event (the money engine)

Partners (turfs, academies, clubs, organisers) list sports events on Indian Sports Club and sell tickets.
Buyers pay through **Razorpay**; **Razorpay Route** splits each payment: the partner's share is held, then paid out
after the event; we keep a platform fee. Our own events and merch keep using **Zoho Payments** (already live).

Status: plan, 7 Oct 2026. Nothing below is built yet unless marked.

## Route eligibility — solved

Since the RBI's Payment Aggregator directions (Sept 2025), Route needs >₹40L domestic turnover. **Route is already
approved on Timewheel Internet Pvt Ltd's Razorpay account**, so partner ticketing runs on that account: add the
Indian Sports Club website to it (Razorpay website review) and create partners as linked accounts under it.

Consequences:
- **Timewheel is the e-commerce operator for partner sales** (TCS/TDS, GSTR-8, commission invoices are in
  Timewheel's name). The site stays "a personal project by Shubham Datarkar"; Terms add one line: *partner-event
  payments are collected and settled by Timewheel Internet Pvt Ltd via Razorpay*.
- Timewheel's Razorpay account is shared with other apps → the webhook must ack payments that aren't ours
  (same fix as Zoho), and transfers must only ever reference our own orders.
- Never collect partner money on Zoho and pay out by hand (unlicensed pooling).

## Phases

| Phase | When | What | Money |
| --- | --- | --- | --- |
| **P0 — Listings** | Now (no domain needed) | Partner applications, admin approval, partner event pages, free RSVP / "register interest", our own co-hosted events paid via Zoho | Zoho, our own events only |
| **P1 — Paid tickets** | Domain live + site added to Timewheel's Razorpay | Razorpay Checkout + Route transfers on hold, auto-release after the event, refunds, debt ledger, payout statement | Route |
| **P2 — Partner tools** | After ~10 paid events | QR check-in, promo codes, featured listings, GST commission invoices, payout CSV | Route |

P1 is mostly a port: Coffee and Toffee already runs Route (linked-account onboarding, held transfers, daily
reconcile cron, reversals + debt ledger, GST invoices) with tests. Build it in **Razorpay test mode during P0**
so it's ready when approval lands.

## P0 status (built 8 Oct 2026, migration `0016_is_partners.sql`)

- `/partners` landing, `/partners/apply` (signed-in + confirmed email), `/partners/dashboard` (status, events,
  RSVP lists, submit-event form), `/partners/[slug]` public profile, `/partners/terms`, `/partners/review` (admin).
- Events gain `partner_id`, `ticketing` (`paid` = ours via Zoho, `rsvp` = free, `external` = organiser's link),
  `external_url`, `ends_at`, `submitted_at`. Partner events stay unpublished until approved.
- `is_event_rsvps` + `/api/events/rsvp`; event page shows "Organised by" (seller details) and the right action.
- Emails: application alert/received, partner decision, event alert/decision. Validation + tests in
  `src/lib/partner-validate.ts` / `scripts/partners.test.mjs`.
- Not in P0: editing a submitted event (ask us), paid partner ticketing (P1), check-in, promo codes.

## Revenue model (decided: 8% all-inclusive)

- **Platform fee: 8% of the ticket price**, + 18% GST on the fee, deducted from the partner's payout.
  **We absorb the gateway** (~2.48% incl. GST + Route's 0.1%), so buyers pay exactly the ticket price.
- **Free events stay free** (no fee) — they're the funnel.
- Extra levers: featured listing (₹499/event), "co-hosted by Indian Sports Club" events where we keep 100%
  (Zoho), sponsor slots on partner tournaments, merch upsell on the ticket confirmation page.

Benchmarks: AllEvents 10% + ₹10, Townscript ~8% all-in on ₹1,000, KonfHub 2–3.75%. 8% with no buyer fee matches
Townscript and is the simplest message for partners ("you get 92% minus GST on our fee and statutory TCS/TDS").

**Worked example, ₹500 ticket** (CA to confirm the tax lines):

| Line | ₹ |
| --- | --- |
| Buyer pays | **500.00** |
| Platform fee 8% | 40.00 |
| GST 18% on platform fee (we remit) | 7.20 |
| GST TCS 0.5% (we remit, partner claims credit) | ~2.50 |
| Income-tax TDS 0.1% (we remit) | ~0.50 |
| **Partner payout** | **~449.80** |
| Razorpay + Route fees (~2.48% of 500), paid by us | −12.40 |
| **Our net per ticket** | **~27.60 (≈5.5%)** |

At ~5.5% net, ₹45L/yr of partner ticket sales (the plan's tournament line) ≈ ₹2.5L — real money needs volume, so
push featured listings and co-hosted events alongside.

## Trust & risk rules (non-negotiable)

1. **KYC before payouts**: Route linked account (individual PAN + bank, penny-tested). Ticket sales open only
   when the linked account is `activated`.
2. **Manual approval** of every partner and of each partner's first event.
3. **Payout holds**: every transfer `on_hold_until` = event end + 3 days (7 days for a partner's first 2 events).
   Refunds before release use `reverse_all`; after release, refunds come out of our balance → debt ledger
   (ported) nets it from the partner's next payout.
4. **Caps for new partners**: ₹50,000 gross per event until 2 events complete with no disputes.
5. **Allowed events**: physical sports tournaments, coaching camps, meetups, watch-parties **only at venues holding
   a screening licence** (partner declares it, we keep a copy). **Banned**: betting, paid fantasy/prediction
   contests (Online Gaming Act 2025), anything using ICC/BCCI marks or player photos.
6. **Cancellation default**: event cancelled → full refund (fee included); partner cancellations count against
   their cap.
7. **Seller details on every event page** (legal name, city, contact, GSTIN if any) and a partner agreement
   accepted at signup — required by the Consumer Protection (E-Commerce) Rules 2020.

## Compliance checklist (CA to confirm before P1)

- **GST registration is mandatory** for us as an e-commerce operator collecting TCS (any turnover); monthly GSTR-8.
- **TCS 0.5%** (Sec 52) on partner sales; **TDS 0.1%** (old 194-O, now Sec 393(1)), exempt for individual
  partners under ₹5L/yr who give PAN.
- **18% GST on our platform fee**; issue a commission invoice to partners (not built in C&T — new).
- **Ticket GST** is the partner's: recognised sporting events ≤ ₹500 exempt, else 18% — CA to say whether
  amateur/community events count as "recognised".
- **E-commerce rules**: grievance officer (you), 48h acknowledgement, 1-month resolution, refund policy page.
- **Razorpay website review** needs: Terms ✓, Privacy ✓, **Contact, Shipping, Cancellation & Refunds** (to add),
  and a custom domain (no evidence they accept `*.vercel.app`).

## Data model (P0 + P1)

- `is_partners`: user_id, legal_name, display_name, phone, city, status (`pending|approved|suspended`),
  events_completed, linked_account_id, route_product_id, kyc_status, agreement_accepted_at.
- `is_events` (exists) + `partner_id` (null = ours/Zoho), `ends_at`, `payment_provider` (`zoho|razorpay|none`),
  `approved_at`.
- `is_orders` (exists) + `quantity`, `booking_fee`, `platform_fee`, `provider`, `transfer_id`,
  `transfer_hold_until`, `refund_status`.
- `is_attendees`: order_id, name, qr_token, checked_in_at (P2 check-in).
- `is_partner_debts` + `claim_partner_debt()` — ported from C&T `creator_debts`.
- RLS like C&T: base tables service-role only; partners read their own rows; public reads via views.

## What ports from Coffee and Toffee

Nearly as-is: `lib/razorpay.ts` (orders → settle → `ensureTransfer` → reversals/disputes), `lib/kyc.ts`,
`lib/hmac.ts`, fee/payout/reversal/GST maths in `lib/money.ts` + tests, webhook / confirm / cron routes,
debt-ledger SQL, `accepts_payments` gate trigger, payouts onboarding UI, `scripts/check-razorpay.mts`.
New for tickets: quantity + capacity per order, attendee names, event-end-based holds, commission invoices.
Known C&T traps to carry over: `payment.fee` can be null right after capture (retry); PAN goes on the
stakeholder; `reference_id` ≤ 20 chars; a shared Razorpay account needs "not ours → ack" (same fix as Zoho).

## Razorpay setup (when the domain is live)

1. Timewheel's Razorpay dashboard → Account & Settings → **Website and app details** → add the Indian Sports Club
   domain. Review needs Terms, Privacy, Contact, Shipping, Cancellation & Refunds pages live (built with the shop).
2. Confirm with Razorpay that Route linked accounts may be created for this website's partners.
3. Webhook → `https://<domain>/api/razorpay/webhook` with the C&T events (payment.captured, payment.failed,
   refund.processed, payment.dispute.*). Keys + webhook secret into Vercel as `RAZORPAY_*`.
4. Build and test P1 in Razorpay test mode first (`scripts/check-razorpay.mts` from C&T).
