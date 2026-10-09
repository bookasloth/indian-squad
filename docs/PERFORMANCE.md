# Performance & perceived-speed audit

Audited 2026-10-09 against `main` @ `2adf107`. Stack: Next 16.3 App Router (no Cache
Components), React 19.2, Supabase (`@supabase/ssr`), Tailwind 4, Radix + own `ui/` kit.
No client data library — Server Components fetch, client components `fetch()` the
`/api/*` route handlers.

## 1. Critical problems (ranked by impact)

| # | Problem | Affected | Evidence |
|---|---------|----------|----------|
| 1 | **Every route is dynamic.** Root layout calls `headers()` (only to read `x-pathname` for the auth-page wrapper) and renders `HeaderUser` (cookies + 2 Supabase calls). Content pages that have no data at all are server-rendered on every request, can't be served from the CDN, and can't be fully prefetched. | All 50+ routes, incl. `/`, `/about`, `/players`, `/players/[slug]` (has `generateStaticParams` — intent was static), `/quiz`, `/xi`, policies | `next build` route table: 100% `ƒ (Dynamic)`. `src/app/layout.tsx:57`, `src/components/layout/header-user.tsx` |
| 2 | **No loading boundaries anywhere** — zero `loading.tsx`, zero `<Suspense>`. Clicking a link to a data route does nothing visible until the whole server render finishes; first paint waits for the header's auth call too. | `/community/*`, `/events/*`, `/shop/*`, `/partners/*` | `grep -r Suspense src` → 0; no `loading.tsx` files |
| 3 | **Supabase Auth round-trips repeated per render.** `getUser()` is a network call to Supabase Auth. Community render did it in `HeaderUser`→`getMemberContext`, again in `getUnreadCount`, again in `getFeed`/`getProfile`/`getNotifications`/`markAllRead` — `getMemberContext` is already `cache()`d but the data layer bypassed it. Proxy adds one more per request. | All community routes; every request (proxy) | `src/lib/community-data.ts:130,249`, `src/lib/community-notify.ts:28,59,90`, `src/proxy.ts:45` |
| 4 | **Sequential query waterfall in `getFeed`.** Viewer profile → likes → follows → bookmarks → reblogs → posts → reblog rows → polls: 8 serial round-trips. `getProfile` already does the same lookups with `Promise.all`. | `/community`, `/community/[sport]` | `src/lib/community-data.ts:137-162` |
| 5 | **Duplicate fetches** — `generateMetadata` and the page each call `getEvent`/`getProduct`/`getPartnerPublic` (not `cache()`d). Event page then awaits member, partner, counts one after another. | `/events/[slug]`, `/shop/[slug]`, `/partners/[slug]` | `src/app/events/[slug]/page.tsx:18-32` |
| 6 | **Static content blocked by one query.** Partners landing page (hero, how-it-works, pricing copy) waits on `listApprovedPartners()` before anything renders. | `/partners` | `src/app/partners/page.tsx` |
| 7 | **Stale button after success.** `RsvpButton` clears `busy` before `router.refresh()` lands, so the old "Register — free" / "Cancel" button re-enables for the refresh duration and a second click re-sends. Review actions leave the sibling button clickable mid-request. | `/events/[slug]`, `/partners/review` | `src/components/events/rsvp-button.tsx:14-25`, `src/components/partners/review-actions.tsx` |
| 8 | **Optimistic-update races.** Feed like/bookmark/reblog/follow: a fast double-click sends two opposite requests that can land out of order (UI and DB disagree). Moderation rollback resets to the initial list, undoing other successful actions. | `/community/*`, `/community/moderation` | `src/components/CommunityFeed.tsx:191-359`, `src/components/community/moderation-list.tsx:28` |
| 9 | **Missing pending feedback**: header "Sign out", "Resend verification email" (repeat clicks send repeat emails). | header, `/login` | `header-user.tsx` form, `login-form.tsx:234` |
| 10 | Images: feed/shop `<img>` have no `loading`/`decoding` hints; below-fold feed images load eagerly. | `/community`, `/shop` | `CommunityFeed.tsx:596`, `shop/page.tsx:35` |

Already good (kept as-is): feed optimistic posting with temp rows + rollback, likes/votes/
bookmarks optimistic with revert, `Button loading` + shared `Spinner`, `SubmitButton` via
`useFormStatus`, `useActionState` on all auth forms, global `prefers-reduced-motion` kill
switch, fonts via `next/font` with `display: swap`.

## 2. Fixes (ranked by impact) — status

1. **Make the shell static.** Auth wrapper decision moved client-side (`MainFrame`, shares
   `BARE_PREFIXES` with `ChromeGate`); `HeaderUser` became a client island that reads
   `/api/me` (skips the request entirely when no Supabase session cookie exists). Root
   layout touches no request data, so content pages prerender. — done
2. **Loading boundaries** — contextual `loading.tsx` per data route (feed, profile, list,
   card grid, event detail, product detail), plus a keyed `<Suspense>` around the feed so
   sport chips / tabs swap the feed only while the header and chips stay. — done
3. **One auth lookup per render** — data layer uses `getMemberContext()`; proxy uses
   `getClaims()` (local JWT verification with asymmetric keys, falls back to `getUser`). — done
4. **Parallelise `getFeed`** viewer lookups and post/reblog queries. — done
5. **`cache()`** detail getters; parallel member/partner/count fetch on event page. — done
6. **Suspense the partner list** on `/partners`. — done
7. **Keep buttons pending through `router.refresh()`** via `useTransition`; disable sibling
   review buttons. — done
8. **In-flight guard** per post/action in the feed; moderation rollback restores only the
   rows that failed. — done
9. **Pending states** for Sign out + Resend verification. — done
10. **`loading="lazy" decoding="async"`** on below-fold images. — done

## 3. Loading-state rules (how to add new screens)

Smallest boundary that works:

1. Button/action → `Button loading` / `SubmitButton` (spinner inline, button disabled).
2. Component needing data → `<Suspense fallback={<XSkeleton/>}>` around just that component.
3. Route segment with data → `loading.tsx` rendering a skeleton from
   `src/components/layout/page-skeletons.tsx` that matches the page's real layout.
4. Full-screen → never needed so far.

Anti-flash: skeleton fallbacks use the `.skeleton-reveal` class (fades in after 150 ms,
pure CSS — no timers to leak). Fast loads swap content in before any skeleton is
visible; nothing ever waits on a minimum display time. 150 ms is the usual
"feels instant" threshold — tune `--skeleton-delay` in `globals.css` once real-user
latency data exists (no RUM is wired up today).

Optimistic UI only for reversible, low-stakes toggles (like, bookmark, reblog, follow,
poll vote, moderation hide). Payments, RSVPs, orders, partner approval and auth always
wait for the server.

## 4. Not done / next phase

- **Cache Components (`cacheComponents: true`)** would let dynamic routes ship a static
  shell too. Needs every `export const dynamic = "force-dynamic"` removed and each uncached
  read wrapped in `<Suspense>`; worth it once traffic justifies the migration.
- **`next/image`** for Supabase Storage / Zoho product images (needs `images.remotePatterns`
  and confirming the hosts) — would add responsive `srcset` + AVIF.
- **Feed pagination** — `getFeed` loads every post ever (`order(...)` without `limit`).
  Fine at current volume; add cursor pagination before the table grows past a few hundred rows.
- **RUM** — no Web Vitals reporting. `useReportWebVitals` → PostHog would give the real
  latency numbers to tune the skeleton delay against.
