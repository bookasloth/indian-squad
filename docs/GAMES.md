# Fan games — This or That, Blind Rank, Tier Ranking

2026-10-11. Design spec. Companion to [ROUTES.md](ROUTES.md) and [CONTENT-PLAN.md](CONTENT-PLAN.md).

## Goal

Three quick games, on all six sports, that do three jobs at once:

1. **Bring new fans in.** Every result ends in a share image and a share link that previews well on WhatsApp, Instagram and X.
2. **Keep fans on the site.** Each game takes under two minutes, then offers "what fans picked" and the next deck.
3. **Feed the community.** One tap posts the result to `/community/[sport]`, where people argue about it.

**Decided (2026-10-11):**
- Crowd stats are on. Votes are anonymous, so anyone can play without logging in.
- Games run on curated decks, not on the player roster.
- Claude drafts the decks and the owner edits them.

## The games

| Game | How it plays | Needs |
|---|---|---|
| **This or That** | Two cards and a prompt ("Who do you want batting for your life?"). Tap one, the next pair loads. 8–12 rounds, then a recap of your picks with the fan split for each pair. | A **pair set**: hand-picked pairs, each with an optional prompt |
| **Blind Rank** | Items are revealed one at a time. Drop each into slot 1–5 without seeing what comes next. A placed item can't move. Then the recap: your order next to the fans' average order. | A **rank deck** with at least 5 items; each game draws 5 at random |
| **Tier Ranking** | 8–16 items. Tap or drag each one into S / A / B / C / D. Then the recap: your tiers next to the fans' average tier per item. | The same **rank deck** |

Blind Rank and Tier Ranking share one deck format. This or That has its own, because a good pair is chosen on purpose, not drawn at random.

## Where they live

| Route | Page |
|---|---|
| `/games` | All decks across all sports, grouped by sport. Linked in the header. |
| `/[sport]/games` | The sport's decks, grouped by game. New **Games** tab on **every** sport, not only `SQUAD_SPORTS`. |
| `/[sport]/games/this-or-that/[deck]` | Play a pair set |
| `/[sport]/games/blind-rank/[deck]` | Play Blind Rank on a rank deck |
| `/[sport]/games/tier/[deck]` | Play Tier Ranking on a rank deck |

All of these pages are prerendered from the data files (`generateStaticParams`, `dynamicParams = false`), so each deck is its own page that search engines can find. The cricket quiz also gets a card on `/cricket/games`, but its route doesn't change.

The hub page (`/[sport]`) gets a "Games" row of cards, the same way the XI and Quiz cards sit there today. It shows on every sport, so sports without a roster finally have something to play.

## Data — `src/data/games.ts`

The same approach as `quiz.ts`: a typed, hand-maintained seed with no database for content.

```ts
export interface GameItem { id: string; name: string; sub?: string }   // sub: "Captain, 2007–2016"
export interface RankDeck {
  slug: string; sport: SportSlug; title: string; blurb: string;
  items: GameItem[];                       // 5–16
}
export interface PairSet {
  slug: string; sport: SportSlug; title: string; blurb: string;
  pairs: { a: GameItem; b: GameItem; prompt?: string }[];   // 8–12
}
export const rankDecks: RankDeck[];
export const pairSets: PairSet[];
```

- Item ids are stable slugs (`ms-dhoni`). Votes refer to them, so **never rename an id**. To fix a typo, change `name`.
- The first version has no photos. Player images need licences we don't have, so cards show the name, the `sub` line and the sport emblem. A `photoUrl` field can be added once there are licensed images.
- A self-check runs at build time (an assert in a small script, or in `generateStaticParams`). It checks that ids are unique within each deck, deck sizes are in range, and every `sport` is a valid slug.

**Launch content.** Claude drafts 2 rank decks and 1 pair set per sport, which comes to 18 decks:

| Sport | Rank decks | Pair set |
|---|---|---|
| Cricket | Greatest India batters · India captains | Legends face-off |
| Hockey | India's Olympic heroes · Modern India XI stars | Then vs now |
| Kabaddi | Greatest PKL raiders · PKL teams | Raider vs raider |
| Badminton | India's shuttlers · Big tournament wins | Singles legends |
| Football | Blue Tigers legends · ISL clubs | Club vs club |
| F1 | Greatest F1 drivers · F1 circuits | Rivalries |

## Crowd stats — anonymous votes

### Table

New migration `0017_is_game_results.sql`:

```sql
create table is_game_results (
  id         bigint generated always as identity primary key,
  game       text not null check (game in ('tot','blind','tier')),
  deck       text not null,          -- deck slug (unique per game type)
  voter      uuid not null,          -- anonymous cookie id, not a user
  picks      jsonb not null,         -- see shapes below
  created_at timestamptz not null default now(),
  unique (game, deck, voter)         -- one result per voter per deck; replays overwrite
);
alter table is_game_results enable row level security;  -- no policies: API route writes with service role
```

Shape of `picks` for each game:
- `tot`: `{ "<pairIndex>": "a" | "b" }`
- `blind`: `{ "<itemId>": slot (1–5) }`
- `tier`: `{ "<itemId>": "S"|"A"|"B"|"C"|"D" }`

### API

`POST /api/games/result` with body `{ game, deck, picks }`:
- **Who's voting.** The route reads the `isg_vid` cookie: an httpOnly, random UUID that lasts 1 year. If the cookie is missing, the route sets it.
- **Rate limit.** The existing `rate-limit.ts` limits each IP to 30 results per hour.
- **Validation.** The deck must exist in the data file. Every key in `picks` must be a real pair or item in that deck, and every value must be a valid choice for the game. Anything else gets a 400.
- **Write.** Upsert on `(game, deck, voter)` through `supabaseAdmin()`. If Supabase isn't configured, the route returns 503 and the game still works solo.

### Stats

`GET /api/games/stats?game=&deck=` returns aggregates only, never single votes. It calls a Postgres function `is_game_stats(game, deck)` that computes:
- `tot`: for each pair, a/b counts.
- `blind`: for each item, its average slot and how many results it appears in.
- `tier`: for each item, the count in each tier and the average tier score (S=5 … D=1).

The response is cached for 60 seconds (`revalidate`), and each recap screen fetches it once.

### Small numbers and abuse

- **Too few votes.** When a deck or pair has fewer than 20 results, the recap says "Not enough fans yet — you're early", not a misleading percentage.
- **Ballot stuffing.** Anonymous votes can be gamed by clearing cookies. That's accepted: these are fan games, not polls of record, and the IP limit stops floods. If it ever matters, count only logged-in votes or add Turnstile.

## Sharing

1. **Image.** Each game draws its result onto a canvas, the same way `XIBuilder`'s `shareAsPng` does (no html2canvas). It shows the deck title, the result, the site URL and the sport colour. On phones it opens the native share sheet (`navigator.share` with the file), and on desktop it downloads the image.
2. **Link.** The result is packed into the URL, so no database is needed: `/[sport]/games/tier/[deck]?r=<compact code>`, where the code is item indices in base36. Opening the link shows "Here's how [friend] ranked it — your turn", with Play below.
3. **Link preview.** Each game route has `opengraph-image.tsx` (`next/og`, `ImageResponse`), which turns `?r=` into a result card. That's the preview WhatsApp and X show when the link is shared. Without `?r=`, the card shows the plain deck. **Check the `next/og` and `opengraph-image` docs in `node_modules/next/dist/docs/` before building this.** This Next version has breaking changes.

## Community hook

The recap has a **Post to community** button:
- **Logged in:** the existing `POST /api/posts` is called with `{ body: "<result text>\n<share link>", sport }`. The post appears in `/community/[sport]`.
- **Logged out:** the button opens `/login?next=<recap url>`. The result survives the redirect because it's in `?r=`.

No new tables are needed for this part, and no polls are created. Comments under the post are where the argument happens.

## Components

| Unit | Job |
|---|---|
| `src/data/games.ts` | Decks and pair sets, plus lookup helpers |
| `src/lib/games.ts` | Pure functions: draw 5 for Blind Rank, encode/decode `?r=`, turn picks into a canvas card, validate picks |
| `src/components/games/ThisOrThat.tsx` | Client component, the game loop and its recap |
| `src/components/games/BlindRank.tsx` | Client component |
| `src/components/games/TierBoard.tsx` | Client component. Tap an item, then tap a tier, so it works on phones without drag. Drag via `framer-motion` (already installed) is a desktop extra. |
| `src/components/games/Recap.tsx` | Shared end screen: your result next to the fans', plus the share, post and play-next buttons |
| `src/app/[sport]/games/**` | Thin server pages: look up the deck, `notFound()` if it's missing, render the client component |
| `src/app/api/games/{result,stats}/route.ts` | Votes in, aggregates out |

No new dependencies.

## Testing

Each of the following has one check that fails if the logic breaks:
- `lib/games.ts`: encode/decode round trip, pick validation (rejects unknown ids and bad tiers), Blind Rank draw size.
- Deck data self-check, as described under Data.
- API routes: run against the real Supabase locally once, and confirm in the browser that a vote is stored and the stats come back.
- UI: in the browser preview, play each game on a phone-width viewport, then share and check the PNG and the `?r=` link.

## Order of work — 3 PRs

1. **Play and share solo.** Data with all 18 decks, routes, the three games, the Games tab and the hub row, `/games`, PNG sharing and `?r=` links. Ships something fun on all six sports with no database work.
2. **Crowd stats.** Migration, the two API routes, and the fan columns in the recap.
3. **Previews and community.** OG result images and Post to community.

## Out of scope

- Daily challenges, streaks, leaderboards, accounts-only modes.
- Fan-made decks.
- Player photos.

Revisit these once the games have traffic.
