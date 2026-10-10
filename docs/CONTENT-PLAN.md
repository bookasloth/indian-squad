# Content & page structure — per sport

2026-10-09. Teardown of crickettaken.in (structure only) and how we apply the same
page types to every sport. Builds on [MULTISPORT.md](MULTISPORT.md) (hub routes, phases).

## Rule: copy the shape, never the words or numbers

Their text is theirs (copyright), and duplicated text also gets filtered out of Google.
We take **page types, section order, schema and internal linking**. Every sentence is
ours; every number comes from a source we're allowed to use (see Data below).

## What crickettaken.in is built from

| Page type | Their URL | Sections (in order) | Schema |
|---|---|---|---|
| Home | `/` | hero + 3 CTAs · tournament grid · community promo · player cards · "other sports" grid · XI teaser · quiz teaser · tournaments · FAQ | Organization, WebSite |
| Player | `/player/[slug]` | name + headline stats · career · highlights · "what the figures show" · career record table · season by season · articles about player · FAQ · sources | Person, FAQPage, Breadcrumb |
| Tournament | `/indian-premier-league` | intro · current teams · every season (winner per year) · FAQ | CollectionPage, FAQPage |
| Season list | `/[tournament]/season` | winners tally · season-by-season list | CollectionPage |
| Sport hub | `/sports/[sport]` | "X, explained." · article list | CollectionPage |
| Country hub | `/cricket-in-india`, `/england` | context essays · governing body · domestic calendar · guide list | CollectionPage |
| Programmatic | under country hub | A vs B comparisons · venue records · pitch reports · "best ODI average for India" lists | — |
| Explainer | `/blog/[slug]` | long-form: idea → history → how it works → criticisms → FAQ → related | Article, FAQPage |
| Tools | `/calculator`, `/playing-xi`, `/quiz` | tool on top · "how it works" · rules · FAQ | WebApplication, Quiz, FAQPage |
| Community | `/cricket-fan-community` | hot · latest · categories · trending · match hubs · house rules | CollectionPage |
| Trust | `/sources-and-methodology`, `/editorial-policy`, `/corrections` | how numbers are computed · where coverage stops | TechArticle |

Patterns worth stealing: **FAQ block on every page** (FAQPage schema → AI/Google answers),
**breadcrumbs everywhere**, **"where these figures come from" footer on data pages**,
every page links sideways (player → tournament → articles → tool).

## Our template — same nine page types for every sport

```
/[sport]                          hub
/[sport]/players                  squad / roster
/[sport]/players/[slug]           player profile
/[sport]/[competition]            tournament / league (IPL, PKL, ISL, …)
/[sport]/[competition]/[season]   one season (later)
/[sport]/learn                    explainers list
/[sport]/learn/[slug]             explainer (rules, glossary, how scoring works)
/[sport]/xi | /quiz | /calculator tools (only where they make sense)
/community/[sport]                already exists
/sources                          one site-wide methodology page
```

Each page = one shared component, data-driven by sport. Adding a sport = adding data, not pages.

### Section order per page (ours)

- **Hub:** hero · competitions grid · player strip · tools row · upcoming events (`is_events`) · latest community posts · FAQ
- **Player:** header (photo/emblem, role, team, 3 headline stats) · bio in our words · record table by format/competition · honours · related articles · FAQ · sources line
- **Competition:** what it is · teams · winners by season · records · FAQ
- **Explainer:** answer in first paragraph · how it works · examples · FAQ · related

## Per sport — what fills the template

| Sport | Competitions | Record split | Tools | Data source |
|---|---|---|---|---|
| Cricket | IPL, ODI WC, T20 WC, WTC, Asia Cup, Ranji, WPL | Test / ODI / T20I / IPL | XI, quiz, calculator (avg, SR, NRR, DLS) | Cricsheet ball-by-ball (open, attribution required) |
| Hockey | Olympics, FIH Pro League, World Cup, HIL | international / league | XI (11 incl. GK), quiz | hand-maintained |
| Kabaddi | PKL, Asian Games, World Cup | raid pts / tackle pts per season | 7-a-side builder, quiz | hand-maintained |
| Badminton | Olympics, BWF World Tour, Thomas/Uber Cup | singles / doubles, titles | quiz, "pick your favourites" | hand-maintained (BWF ranks) |
| Football | ISL, I-League, national team, Durand Cup | caps, goals by competition | XI (11 incl. GK), quiz | hand-maintained |
| F1 / motorsport | F1 seasons, Indian drivers (Karthikeyan, Chandhok, Daruvala) | season results | points calculator, quiz | Jolpica-F1 API (open, Ergast successor) |

Only cricket has a free ball-by-ball source, so only cricket gets computed stats.
Other sports: short hand-kept records (honours, caps, career totals) — enough for a
fan club, not a stats engine.

## Skip (for now)

- **Programmatic pages** (A vs B, venue, "best X for India" lists): crickettaken's bulk.
  Thousands of near-identical pages risk Google's scaled-content penalty and need a real
  stats pipeline. Revisit after Cricsheet ingest exists, cricket only.
- **Country hubs** (`/england`): we're India-only; the sport hub covers it.
- **Season pages**: winners table on the competition page is enough until traffic says otherwise.

## Order of work (slots into MULTISPORT.md phases)

1. **Phase 1 (hub)** — add FAQ block + breadcrumbs + JSON-LD helper, used by every page type.
2. **Phase 2 (cricket depth)** — player page sections above; IPL + ODI WC + T20 WC competition
   pages; 5 explainers (scorecard, DLS, NRR, LBW, formats); calculator; `/sources`.
3. **Phase 3 (hockey)** — same components, hockey data. Proves the template.
4. **Phase 4** — kabaddi, football, badminton, F1: data + 3 explainers each.

## Decisions

1. **Cricket stats depth** — ingest Cricsheet (computed career stats, ~1 PR + a build-time
   script) vs keep hand-typed totals. Recommend hand-typed for phase 2, Cricsheet later.
2. **Who writes explainers** — you, or Claude drafts and you edit. Either way, original text.
3. **First competition pages** — IPL, ODI WC, T20 WC? Recommend those three.
