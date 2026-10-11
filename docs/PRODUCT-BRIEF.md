# Indian Sports Club — product brief

2026-10-09. A self-contained summary of what we are building, for writing marketing,
growth, content, partnership and monetisation strategies. Facts are drawn from the
other docs in this folder; anything not yet decided is marked **open**.

---

## In one line

**Indian Sports Club is the online home for fans of Indian sport: follow India across six
sports, talk with other fans, play fan tools, and find or host real sports events near you.**

Current tagline: *"We stand united. We are the 12th Man."* The brand idea for all sports
is **on hold** — see Strategy decisions.

---

## What it is

A fan club website, not a news or scores app. It combines four things that usually live in
separate places:

1. **Fan community** — a social feed per sport where fans post, reply, run polls and argue.
2. **Fan reference and tools** — sport hubs, player profiles, competitions, records,
   explainers, a pick-your-XI builder and quizzes.
3. **Real-world events** — watch-parties, tournaments and meetups, run by us or listed by
   partner turfs, academies and clubs.
4. **Merch** — our own "12th Man" branded clothing.

The online side brings fans in; events and merch are where it earns.

---

## Sports covered

Cricket · Hockey · Kabaddi · Badminton · Football · F1

Cricket is the most complete today and acts as the template. Each other sport gets the
same shape of hub as its data is added ([MULTISPORT.md](MULTISPORT.md)).

---

## Who it is for

| Audience | What they want | What we give them |
|---|---|---|
| **Indian sports fans** (primary) | A place to follow Team India and talk about it with people who care | Per-sport community, player pages, XI builder, quizzes, newsletter |
| **Fans of the "other" sports** — hockey, kabaddi, badminton, football | Coverage that isn't buried under cricket | Equal-standing hubs for every sport |
| **Fans who also play** | Local tournaments, box cricket, turf games, watch-parties | Events listings, free RSVP, paid tickets |
| **Partners** — turfs, academies, clubs, event organisers | Players and spectators for their events | Free listings now; paid ticketing with payouts later |
| **Searchers** | Quick answers: rules, records, winners lists, player stats | Explainers, record pages, competition pages ([ROUTES.md](ROUTES.md)) |

**Core fan: both, watchers first.** Watching fans are the base; fans who also play are
the path to events revenue.

---

## What is live today

| Area | State |
|---|---|
| **Community** | Live for all six sports. Posts, replies, polls, images, likes, reposts, bookmarks, follows, notifications, reporting and moderation. Reading is open; posting needs an account. |
| **Events** | Live. Our own paid events (Zoho Payments) and partner events (free RSVP or a link to the organiser's own tickets). |
| **Partners** | Phase P0 live: apply → admin approval → partner submits events → RSVP lists. |
| **Shop** | Live. Print-on-demand via Printrove, Zoho checkout, one product (12th Man Tee) — real product mockups still needed. |
| **Newsletter** | Live signup ("The Twelfth Man", weekly). Copy is still cricket-only. |
| **Cricket tools** | 20-player Indian squad, Playing XI builder with share image, quiz. Being moved under the `/cricket` hub. |
| **Accounts** | Email/password and magic link, verification, password reset. |
| **Legal** | About, contact, terms, privacy, refunds, shipping, partner terms. |

In progress: per-sport hubs and new navigation (phase 1). Planned: ~385 search-focused
pages across all sports ([ROUTES.md](ROUTES.md)).

---

## How it makes money

| Stream | Model | Status |
|---|---|---|
| **Partner ticketing** | 8% of ticket price, all-inclusive (we absorb gateway fees; ~5.5% net). Free events stay free. Paid via Razorpay Route on Timewheel Internet Pvt Ltd's account. | Planned (P1) — waits on own domain |
| **Featured listings** | ₹499 per event to sit at the top | Planned (P2) |
| **Co-hosted events** | Our own watch-parties and tournaments; we keep 100% | Live (Zoho) |
| **Merch** | ₹699 tee, ~₹300–375 margin, print-on-demand, no stock | Live |
| **Sponsorship** | Sponsor slots on partner tournaments; later, newsletter and community sponsors | Idea |
| **Bundles / upsell** | Merch offered on ticket confirmation; ticket + tee bundles | Planned (S2) |

Scale reality: at ~5.5% net, ₹45L a year in partner ticket sales earns ~₹2.5L. Ticketing
needs volume, so featured listings, co-hosted events and merch carry early revenue.

---

## Why it can win

- **All of Indian sport, not just cricket.** Most fan spaces are cricket-only; hockey,
  kabaddi, badminton and football fans are under-served.
- **Online fandom joined to offline events.** Score and news apps stop at the screen;
  turf-booking apps have no fan community. We sit between them.
- **Fan-first, not news-first.** We don't compete with live scores or breaking news. We own
  the conversation, the tools and the meetups.
- **Search-ready structure.** Every sport gets the same page set (players, competitions,
  records, explainers) built for Google and AI answers.
- **Low running cost.** Static pages, print-on-demand merch, no inventory, shared
  infrastructure.

### Landscape (for positioning — not an exhaustive study)

| Type | Examples | Where we differ |
|---|---|---|
| Scores and news | Cricbuzz, ESPNcricinfo | We don't do live scores; we do community, tools and events |
| Stats and explainer sites | crickettaken.in | Cricket-led; we are fan-led and multi-sport |
| Fan groups | Bharat Army, social-media fan pages | We add a permanent home, tools and events |
| Discussion | Reddit, X, WhatsApp groups | Sport-organised, moderated, tied to real events |
| Sports booking apps | Playo, KheloMore | They book courts; we bring the fans and the community |

---

## Constraints

- **A personal project** by Shubham Datarkar, not a company. Partner payments are collected
  and settled by Timewheel Internet Pvt Ltd via Razorpay.
- **Solo-run.** Content, moderation, partner approval and fulfilment are all one person
  today. Strategies must be light to run, or say who does the work.
- **Not affiliated** with the BCCI or any sports body or federation. We cannot use official
  logos, team marks or broadcast footage.
- **No own domain yet.** The site runs on a vercel.app address. This blocks SEO and paid
  ticketing. Expected around November 2026.
- **Original content only.** No copying text or stats from other sites; every number must
  come from a source we are allowed to use.

---

## Stage and roadmap

| Now (Oct 2026) | Next | Later |
|---|---|---|
| Community, events, partner listings, shop, newsletter live | Own domain · sitemap and SEO foundations · sport hubs · cricket depth (IPL, World Cups, records, explainers) | Paid partner ticketing · hockey, then the other sports · partner tools (QR check-in, promo codes) · sponsorship |

---

## What to measure

| Goal | Metric |
|---|---|
| Fans arrive | Organic search clicks · newsletter signups |
| Fans stay | Weekly active posters · replies per post · returning visitors |
| Fans meet | Events listed · RSVPs · tickets sold |
| Partners grow | Partner applications · approved partners · events per partner |
| Revenue | Ticket GMV and fee income · merch orders · featured listings sold |

---

## Strategy decisions (2026-10-09)

| # | Question | Decision |
|---|---|---|
| 1 | **Core fan** | **Both, watchers first.** Community, tools and newsletter lead; events are the next step for fans who also play. |
| 2 | **Brand idea** | **On hold.** "12th Man" is not confirmed as the idea across all sports, and no replacement is chosen yet. Ideas considered: *Home Crowd*, *One India, Every Sport*, *Galli to Glory*. Keep current copy until decided. |
| 3 | **Language** | **English site, Hinglish allowed on social and in the community.** No Hindi pages for now. |
| 4 | **Events geography** | **Nagpur first** for our own and co-hosted events; **partners anywhere in India** can list. |
| 5 | **Sport after cricket** | **Hockey.** |
| 6 | **Social channels** | **Instagram** (reels, carousels — discovery) + **WhatsApp channel** (match-day alerts, events — retention). |
| 7 | **Domain** | **Short brand `.in`.** Exact name still open; check availability before buying. |

---

## Related docs

| Doc | Covers |
|---|---|
| [SPEC.md](SPEC.md) | Original build spec and stack |
| [MULTISPORT.md](MULTISPORT.md) | Sport hubs model and phases |
| [ROUTES.md](ROUTES.md) | Every route and the SEO plan |
| [CONTENT-PLAN.md](CONTENT-PLAN.md) | Page types and section order |
| [PARTNERS.md](PARTNERS.md) | Partner ticketing, fees, payouts, risk rules |
| [SHOP.md](SHOP.md) | Merch model and margins |
| [COPY.md](COPY.md) | Copy that still needs the owner's words |
| [PERFORMANCE.md](PERFORMANCE.md) | Site speed work |
