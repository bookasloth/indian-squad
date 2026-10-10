# Routes & SEO plan — every sport

2026-10-09. The complete list of pages Indian Sports Club will publish, what goes on each
one, and the order we build them in. Companion to:

- [MULTISPORT.md](MULTISPORT.md) — the hub model and the `/[sport]` route (phase 1)
- [CONTENT-PLAN.md](CONTENT-PLAN.md) — page types and section order, learned from a
  structural teardown of crickettaken.in

**Ground rule:** we borrow page *structure*, never another site's words or numbers. Every
sentence is written for us, every figure comes from a source we are allowed to use, and
each page names that source.

---

## 1. Blockers — fix before content

No amount of content ranks while these two are open.

| Blocker | Why it matters | Fix |
|---|---|---|
| **No own domain.** The site runs on `sports-club-djlaxne-4073.vercel.app`. | Google gives shared `*.vercel.app` subdomains little authority, and any links we earn build up a domain we don't own. | Buy a domain (via Vercel, where the rest of the DNS already lives), point `site.url` at it, keep the old URL redirecting. |
| **No `sitemap.xml` or `robots.txt`.** | Google has to discover every page by crawling links; new pages can take weeks to appear. | `src/app/sitemap.ts` and `src/app/robots.ts`, both generated from our data files so they never go stale. |

---

## 2. Site-wide routes

One of each, shared across all sports.

| Route | Purpose | Status |
|---|---|---|
| `/sitemap.xml` | Every public URL, generated from `SPORTS`, players, competitions, records and articles | **new** |
| `/robots.txt` | Allows search and AI crawlers, points to the sitemap | **new** |
| `/llms.txt` | Plain-text map of the site for ChatGPT, Perplexity, Claude and Gemini | **new** |
| `/sources` | Where every number comes from, how it is kept current, where coverage stops | **new** |
| `/editorial-policy` | Who writes, how pages are checked, how we use AI drafting | **new** |
| `/corrections` | Public log of fixes — a strong trust signal for Google and AI answers | **new** |
| `/sports` | Index of all six sport hubs | **new** |
| `/about`, `/community`, `/events`, `/shop`, `/partners`, `/newsletter` | Existing pages — need titles, descriptions and schema | exists |

---

## 3. The per-sport template

Every sport uses the same routes, built from shared components and filled from data. A new
sport is a data task, not a code task.

| Route | Page | Main schema |
|---|---|---|
| `/[sport]` | Sport hub | `CollectionPage` |
| `/[sport]/players` | Squad / roster (`/f1/drivers` for F1) | `CollectionPage` |
| `/[sport]/players/[slug]` | Player profile | `Person` |
| `/[sport]/teams/[slug]` | National side or franchise / club | `SportsTeam` |
| `/[sport]/[competition]` | Competition: what it is, teams, winners by year, records | `SportsOrganization` / `SportsEvent` |
| `/[sport]/[competition]/[year]` | One season — big competitions only | `SportsEvent` |
| `/[sport]/records` | Index of record lists | `CollectionPage` |
| `/[sport]/records/[slug]` | One record list (e.g. most Test runs for India) | `ItemList` |
| `/[sport]/learn` | Index of explainers | `CollectionPage` |
| `/[sport]/learn/[slug]` | Explainer: rules, scoring, glossary | `Article` |
| `/[sport]/schedule` | India's upcoming fixtures, hand-maintained | `ItemList` of `SportsEvent` |
| `/[sport]/quiz` | Quiz | `Quiz` |
| `/[sport]/xi` | Pick-your-team builder (team sports only) | `WebApplication` |
| `/[sport]/calculator` | Calculators (cricket and F1 only) | `WebApplication` |
| `/community/[sport]` | Fan discussion — **already exists** | `DiscussionForumPosting` |

Every page also carries `BreadcrumbList`, and `FAQPage` where it has a FAQ block.

---

## 4. Per-sport route lists

### Cricket

| Type | Routes |
|---|---|
| Competitions | `ipl` · `wpl` · `odi-world-cup` · `t20-world-cup` · `womens-world-cup` · `world-test-championship` · `champions-trophy` · `asia-cup` · `ranji-trophy` · `border-gavaskar-trophy` |
| Seasons | `ipl/[year]` (2008 → now) · `wpl/[year]` |
| Teams | `india-men` · `india-women` · the 10 IPL franchises |
| Records | most Test / ODI / T20I runs for India · most Test / ODI / T20I wickets for India · highest individual scores · best bowling figures · most centuries · India's captains · most IPL runs · most IPL wickets |
| Learn | how to read a scorecard · Duckworth-Lewis-Stern · net run rate · LBW · Test vs ODI vs T20 · cricket glossary |
| Rivalries | `rivalries/india-vs-pakistan` · `rivalries/india-vs-australia` · `rivalries/india-vs-england` |
| Tools | `xi` · `quiz` · `calculator` (average, strike rate, economy, NRR, DLS par) |

### Hockey

| Type | Routes |
|---|---|
| Competitions | `olympics` · `hockey-world-cup` · `fih-pro-league` · `asian-games` · `asia-cup` · `hockey-india-league` |
| Teams | `india-men` · `india-women` · HIL franchises |
| Records | India's Olympic medals · India's top goal-scorers · most caps for India |
| Learn | hockey rules · penalty corners · video referral · positions |
| Tools | `xi` (11 incl. goalkeeper) · `quiz` |

### Kabaddi

| Type | Routes |
|---|---|
| Competitions | `pro-kabaddi-league` · `kabaddi-world-cup` · `asian-games` |
| Seasons | `pro-kabaddi-league/[season]` |
| Teams | the 12 PKL teams |
| Records | most PKL raid points · most PKL tackle points · PKL champions |
| Learn | kabaddi rules · raids and the bonus line · do-or-die raids · super tackles |
| Tools | `xi` (7-a-side) · `quiz` |

### Badminton

| Type | Routes |
|---|---|
| Competitions | `olympics` · `bwf-world-championships` · `all-england-open` · `thomas-cup` · `uber-cup` · `india-open` |
| Records | India's Olympic medallists · World Championship medallists · India's Thomas Cup 2022 win |
| Learn | badminton scoring · how BWF rankings work · BWF tournament tiers |
| Tools | `quiz` · "pick your favourites" (no XI — individual sport) |

### Football

| Type | Routes |
|---|---|
| Competitions | `indian-super-league` · `i-league` · `durand-cup` · `super-cup` · `saff-championship` · `afc-asian-cup` · `world-cup-qualifiers` |
| Seasons | `indian-super-league/[season]` |
| Teams | `india-men` · `india-women` · ISL clubs |
| Records | India's top goal-scorers · most caps for India · ISL top scorers |
| Learn | how the ISL works · promotion and the I-League · offside · VAR |
| Tools | `xi` (11 incl. goalkeeper) · `quiz` |

### F1

F1 has no Indian team, so its shape differs slightly: drivers instead of players, and
seasons and circuits instead of competitions.

| Type | Routes |
|---|---|
| Seasons | `/f1/[year]` |
| Drivers | `/f1/drivers/[slug]` — Narain Karthikeyan, Karun Chandhok, Jehan Daruvala, plus the current grid |
| Teams | `/f1/teams/[slug]` |
| Circuits | `/f1/circuits/[slug]` · `/f1/indian-grand-prix` (Buddh, 2011–2013) |
| Records | Indian drivers' F1 results |
| Learn | points system · qualifying · tyres · DRS |
| Tools | `quiz` · `calculator` (championship points) |

---

## 5. What every page must have

The routes get us indexed; these get us ranked and cited by AI answers.

1. **Own title and meta description** — written for the query the page answers, not the
   site default. Plus a canonical URL.
2. **Answer first.** The opening paragraph answers the page's main question in one or two
   plain sentences. This is what Google snippets and AI answers quote.
3. **FAQ block** — 4–6 real questions people search for, each answered in its first
   sentence, marked up as `FAQPage`.
4. **Breadcrumbs** — visible and as `BreadcrumbList`.
5. **Schema** — the type from the table in section 3, via one shared JSON-LD helper.
6. **Share image** — a generated Open Graph image (`opengraph-image.tsx`) per page type.
7. **Sideways links** — player → team → competition → record → explainer → quiz → community.
   No page is a dead end.
8. **Freshness and sources** — a "last updated" date and a one-line source note on any page
   with numbers, linking to `/sources`.

---

## 6. Deliberately not building

| Not building | Why |
|---|---|
| Bulk "Player A vs Player B" pages | Thousands of near-identical pages trigger Google's scaled-content penalty. |
| Venue / pitch-report pages | Need ball-by-ball data per ground; thin without it. Revisit once a cricket stats pipeline exists. |
| Auto-generated "best X for India" lists | Same penalty risk; the ~35 hand-picked record pages cover the searches that matter. |
| Country hubs (`/england`, `/australia`) | We cover Indian sport; the sport hubs already do this job. |
| Season pages for small competitions | Too little to say per season. Winners tables live on the competition page instead. |

---

## 7. Size

| Group | Pages |
|---|---|
| Sport hubs | 6 |
| Competitions | ~37 |
| Seasons (IPL, WPL, PKL, ISL, F1) | ~60 |
| Players / drivers (~25 per sport) | ~150 |
| Teams | ~40 |
| Records | ~35 |
| Explainers | ~30 |
| Rivalries | 3 |
| Tools | ~15 |
| Site-wide | ~8 |
| **Total** | **~385** |

---

## 8. Build order

| Phase | Scope | Size |
|---|---|---|
| **0 — Foundations** | Domain switch · `sitemap.ts` · `robots.ts` · `llms.txt` · shared JSON-LD helper · `<Faq>` and `<Breadcrumbs>` components · per-page metadata on existing pages · `/sources`, `/editorial-policy`, `/corrections` | 1 PR |
| **1 — Sport hubs** | `/[sport]` hubs, cricket tools moved under `/cricket`, redirects, nav ([MULTISPORT.md](MULTISPORT.md)) | in progress |
| **2 — Cricket depth** | `ipl`, `odi-world-cup`, `t20-world-cup` (+ IPL seasons) · `india-men`, `india-women` + IPL teams · 8 record pages · 6 explainers · calculator · 3 rivalries · `/cricket/schedule` | 2–3 PRs + writing |
| **3 — Hockey** | Full template filled with hockey data. Proves the shared components on a second sport. | 1 PR + data |
| **4 — Kabaddi, football, badminton, F1** | Mostly data entry and explainers; F1 adds drivers, circuits and seasons | data + 1 small PR for F1 |
| **5 — Expand on evidence** | More seasons, records and explainers — chosen from Search Console queries that already show impressions | ongoing |

Phase 0 is the cheapest and highest-leverage step: today even the pages we already have
are hard for Google to find.

### Data sources

| Sport | Source | Notes |
|---|---|---|
| Cricket | Hand-maintained in phase 2; Cricsheet ball-by-ball later | Cricsheet is open data and requires attribution |
| F1 | Jolpica-F1 API | Open successor to Ergast |
| Hockey, kabaddi, badminton, football | Hand-maintained TypeScript in `src/data/` | Honours, caps and career totals — no computed stats |

Data stays as static TypeScript until someone other than the owner needs to edit it; then
it moves to Supabase with an admin form.

---

## 9. Decisions

| # | Decision | Status |
|---|---|---|
| 1 | Cricket stats: hand-typed now, Cricsheet later | **decided** |
| 2 | Explainers: Claude drafts, owner edits; all text original | **decided** |
| 3 | First competition pages: IPL, ODI World Cup, T20 World Cup | **decided** |
| 4 | Domain for the site | **short brand `.in`** — exact name open, blocks phase 0 |
| 5 | Sport after cricket | **hockey** |
