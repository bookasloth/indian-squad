# All sports — plan (cricket first)

2026-10-09. Goal: Indian Sports Club reads as a club for **all Indian sport**, with each
sport getting the same shape of home. Cricket is built out first and becomes the
template every other sport copies.

## Where we are

Already sport-aware (no work needed): **community** (`/community/[sport]`, posts tagged
by sport), **events** (`sport` column), **partners** (list sports they run).

Cricket-only and sitting at the top level as if they were the whole site:
`/players`, `/xi`, `/quiz` — data in `src/data/players.ts` (20 men's players, roles
batter/bowler/all-rounder/wicketkeeper, caps by Test/ODI/T20I) and `src/data/quiz.ts`.
Three of eight nav slots are cricket tools.

## The model: one hub per sport

```
/cricket                 hub: hero, squad strip, tools, upcoming events, latest posts
/cricket/players         squad (was /players)
/cricket/players/[slug]  player (was /players/[slug])
/cricket/xi              Playing XI (was /xi)
/cricket/quiz            quiz (was /quiz)
/hockey, /kabaddi, …     same hub; sections appear as their data exists
```

Every hub is built from what already exists, so **all six hubs go live on day one**:

| Hub section | Source | Cricket | Others (day one) |
|---|---|---|---|
| Hero (name, emblem, one line) | `site.ts` + `SportEmblem` | ✅ | ✅ |
| Upcoming events for this sport | `is_events.sport` | ✅ | ✅ |
| Latest posts for this sport | community feed, sport filter | ✅ | ✅ |
| Squad strip → players page | `src/data/players.ts` | ✅ | "Squad coming" until a roster exists |
| Tools (XI builder, quiz) | per-sport data | ✅ | hidden until built |

Old URLs (`/players`, `/xi`, `/quiz`, `/players/[slug]`) get permanent redirects in
`next.config.ts` — shared links and search results keep working.

**Nav:** `Sports ▾ (Cricket, Hockey, Kabaddi, Badminton, Football, F1) · Community · Events · Shop · Newsletter · About`.
Cricket tools move inside the cricket hub (a tab row on cricket pages).

**Homepage:** a sports grid (six hub cards) replaces "Cricket, right now"; Events, Shop
and Partners get cards too.

## Phases

| Phase | What | Size |
|---|---|---|
| **1 — Cricket hub** | `/[sport]` hub route (static, 6 sports), move players/XI/quiz under `/cricket`, redirects, nav + homepage restructure, light theme ships with it | ~1 PR |
| **2 — Cricket depth** | Women's squad (if yes), quiz categories/sizes, squad by format (Test/ODI/T20I), fixtures list (hand-maintained) | per item |
| **3 — Second sport: Kabaddi** | Generalise the data: `Player { sport, position, stats }`, XI rules per sport (hockey/football: 11 incl. 1 GK; kabaddi: 7; badminton/F1: no XI → "pick your favourites"), quiz gains `sport` | ~1 PR + roster data |
| **4 — Rest** | Hockey, football, badminton, F1 rosters + quizzes — mostly data entry, no code | data |

**Phase 1 status (built 2026-10-09):** `src/app/[sport]/` — layout (hero + tabs), hub page
(squad strip, events, latest posts; ISR 60 s), `players`, `players/[slug]`, `xi`, `quiz`
(cricket only via `SQUAD_SPORTS` in `src/lib/site.ts`). Redirects in `next.config.ts`.
Header "Sports" menu, footer sport links, homepage sports grid + "Around the club".
Per-sport `blurb` in `SPORTS` is placeholder copy. Turning a sport's tools on = add it to
`SQUAD_SPORTS` once its roster/quiz data exists (phase 3).

**Phase 2 — women's squad (built 2026-10-09):** `Player.team` (`men` | `women`) in
`src/data/players.ts`, 16 India women (no caps yet — add them from a citable source).
Static pages `/cricket/players/women` and `/cricket/xi/women` with a Men / Women switch;
each team's XI saved separately (men keep the original storage key). Hub shows both
squads. Left in phase 2: women's quiz questions, squad by format, fixtures.

Phase 3 is where the data model generalises — deliberately not before, so the shape
is designed against two real sports instead of guessed from one.

Data stays as hand-maintained TypeScript (static, instant, zero DB load) until someone
other than the owner needs to edit rosters; then move to a Supabase table with an admin
form.

## Decisions (2026-10-09)

1. **Hub URL** — `/cricket`, `/kabaddi`, … (short, shareable).
2. **Women's cricket** — yes, phase 2: Men / Women toggle on squad + XI.
3. **Second sport** — **Kabaddi** (7-a-side: XI builder becomes a "VII", positions raiders /
   defenders / all-rounders).
4. **Copy** — build phase 1 now on current text; swap in `docs/COPY.md` copy when it arrives.
