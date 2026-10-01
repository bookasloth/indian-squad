# Indian Squad — v1 Spec

Cricket site inspired by crickettaken.in, scoped to the Indian squad. Fresh
Next.js, patterns rebuilt clean (no code copied from the founder site).

## v1 scope (4 feature slices)

1. **Players** — Indian cricketer profiles: list + filter + detail pages.
2. **Playing XI builder** — pick 11, validate squad, share as image.
3. **Quiz** — randomized cricket quiz, score, reveal answers.
4. **Community** — fan discussion feed, no sign-up, name + post + replies.

Out of v1 (crickettaken has these; we skip): Cricsheet ball-by-ball stats
pipeline, tournaments/scorecards, head-to-head compare, 13-sport hubs,
country guides, auth/accounts.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind v4 — scaffolded.
- Fonts: Plus Jakarta Sans (body) + Poppins (headings).
- Design: monochrome, no emojis. Velocity-first.
- Deploy: Vercel.
- Backend: Supabase **only where state is actually shared** — see Data below.

## Data — the lazy call

Players and quiz questions are near-static reference data. They do **not**
need a database in v1.

| Data | Store | Why |
|---|---|---|
| Players (~20) | `src/data/players.ts` (typed seed) | Roster changes rarely; a DB is overkill. |
| Quiz questions | `src/data/quiz.ts` (typed seed) | Same. |
| XI selection | `localStorage` | Per-viewer, client-only. No backend. |
| Community posts | **Supabase** | User-generated, shared across viewers, persistent. Genuinely needs a server. |

So slices 1–3 ship with **zero database**. Supabase is wired only for slice 4
(community). This also means the public repo carries no DB secrets until then.

### Types

```ts
// players.ts
type Role = "batter" | "bowler" | "all-rounder" | "wicketkeeper";
interface Player {
  slug: string; name: string; role: Role;
  battingStyle: string; bowlingStyle?: string;
  caps: { test?: number; odi?: number; t20?: number };
  photoUrl?: string; bio: string; active: boolean;
}
// quiz.ts
interface QuizQuestion {
  id: string; question: string; options: string[];
  correctIndex: number; category: string;
}
```

### Community schema (Supabase, slice 4)

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(author_name) between 1 and 40),
  body text not null check (char_length(body) between 1 and 1000),
  parent_id uuid references posts(id) on delete cascade,  -- null = top-level
  created_at timestamptz not null default now()
);
-- RLS: anon can SELECT all, INSERT only. No UPDATE/DELETE by anon.
-- Rate limit + body sanitize (escape, no raw HTML) in the route handler.
```

## Slice breakdown (PR per slice, branch from origin/main)

1. **Foundation** — fonts, monochrome tokens, `AppShell` + header nav
   (Players / XI / Quiz / Community), home page, `README`, `.env.example`.
2. **Players** — `players.ts` seed (Indian squad), list page w/ role filter,
   detail page, player card component.
3. **XI builder** — client selector reading `players.ts`, 11-slot validation
   (exactly 11, ≥1 wicketkeeper), localStorage persist, share-as-PNG (canvas).
4. **Quiz** — `quiz.ts` seed, quiz component (shuffle, score, reveal, restart).
5. **Community** — Supabase client, `posts` migration, feed + composer
   (name+body), one level of replies, optimistic insert, rate-limit + sanitize.

## Security (public repo)

- `.env.local` gitignored (Next default); only `.env.example` committed.
- No founder-site code, keys, or infra copied in.
- Community: RLS select+insert only; escape all user text; length caps above;
  simple per-IP rate limit on the insert route.

## Open decisions for you

- **Supabase project**: new project under your own Supabase org (keep separate
  from Book A Sloth). Needed only at slice 4. Your call to create it then.
- **XI rules**: "exactly 11, ≥1 keeper" — enough, or stricter (batting/bowling
  mix)? Default = the simple rule.
- **Admin for players**: crickettaken has none; we seed via file. No admin UI
  in v1. Add later only if the roster churns.
