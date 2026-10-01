# Indian Squad — Spec (v2: full site)

Cricket fan site for the Indian squad. The UI is **ported from the
shubhamdatarkar.com repo** (same owner) and reskinned to cricket — we reuse its
design system and shell, swap the content. We do **not** port the whole site
(221 routes); only the mapped subset below.

Supersedes the earlier 4-slice v1 spec. The v1 feature pages (Players, Playing
XI, Quiz, simple Community) still ship — they move under the ported shell.

## Source

- Repo: `C:\Users\shubh\OneDrive\Documents\Claude\Projects\Shubham Datarkar Website`
- A large personal CMS. We take its **shell + public pages that map to a fan
  site**, drop everything Shubham-specific.

## Port (reskin to cricket)

- **Shell / design system** — `components/ui/*` (shadcn + Radix), app-shell,
  header/nav, footer, `theme-provider`, Tailwind theme + `globals.css`, the
  `cn()` util, icons. This is the look of the site.
- **Home** — landing page, cricket content.
- **About** — from my-story / now / philosophy, rewritten for the project.
- **Auth** — login, register, forgot/reset password, verify email, Supabase
  SSR client + auth callback routes.
- **Subscribe** — newsletter signup + unsubscribe.
- **Community (social)** — feed, compose, likes, bookmarks, notifications,
  profile. Replaces the simple v1 feed.
- **Keep** — Players, Playing XI, Quiz (v1 slices), restyled with the ported
  components.

## Drop (Shubham-specific, not ported)

admin/*, books, movies, playlists, games, blog, case-studies, collections,
SEO landing pages (digital-marketer-in-*, seo-expert-*), kalamai, ai-experiments,
razorpay payments, media-kit, speaking, services, products, tools, gallery.

## Backend — Supabase (shared project)

Same Supabase project as shubhamdatarkar.com. Consequences:

- **Auth is shared** — an indian-squad account is the same Supabase Auth user as
  on shubhamdatarkar.com (accepted).
- **Every table is prefixed `is_`** (`is_posts`, `is_profiles`,
  `is_subscribers`, …) so we never collide with the other app's schema. Same for
  policy / index / trigger names.
- RLS on everything. User content: owner-write, public-read as appropriate.

## Stack additions (from source)

Radix UI primitives, `class-variance-authority`, `clsx`, `tailwind-merge`,
`next-themes`, `framer-motion`, `lucide-react` / phosphor icons,
`@supabase/ssr`, `sanitize-html`. Install only what the ported parts use.

## Phases (shell first, review between)

1. **Shell** — design system (`ui/`, `cn`, theme), app-shell + header/footer
   nav, Home, About. Reskin to cricket. Existing feature pages move under it.
2. **Auth** — Supabase SSR, login/register/forgot/reset/verify, `is_profiles`,
   auth callbacks, session-aware header.
3. **Subscribe** — newsletter + unsubscribe, `is_subscribers`, rate-limit +
   double opt-in if the source does.
4. **Community (social)** — feed/compose/likes/bookmarks/notifications/profile,
   `is_` tables, RLS, optimistic UI.

## Security

- `.env.local` gitignored; `.env.example` committed.
- No Shubham-specific secrets or content copied in; reskin all copy.
- Sanitize all user text; escape on render; RLS + per-IP rate limits on writes.
