# Copy brief — where the product is, what needs words

Status as of 2026-10-09 (`main` @ `1be0a87`). Fill the **New copy** lines and send it back;
blank = keep current. Problem in one line: the brand says "all Indian sport", but
the homepage, metadata, players, XI, quiz and newsletter copy all say *cricket*.

## Where the product is

| Area | State | Sport scope today |
|------|-------|-------------------|
| **Community** (`/community`, `/community/[sport]`) | Live. Posts, replies, polls, images, likes, reblogs, bookmarks, follows, notifications, reporting + moderation. Per-sport feeds for all 6 sports. | **All sports** ✅ |
| **Events** (`/events`) | Live. Our own paid events (Zoho) + partner events (free RSVP or external ticket link). | All sports ✅ |
| **Partners** (`/partners/*`) | P0 live: apply → admin review → submit events → RSVP lists. Paid partner ticketing (8%) is P1, waiting on Razorpay Route. | All sports ✅ |
| **Shop** (`/shop`) | Live, print-on-demand via Printrove, Zoho checkout. One product (12th Man Tee) — **its image is a placeholder URL**, needs real mockups. | Sport-neutral |
| **Newsletter** (`/newsletter`) | Live signup. "The Twelfth Man", weekly. | **Cricket-only copy** ❌ |
| **Players** (`/players`) | Static, 20 Indian **cricketers**, hand-maintained. | Cricket only |
| **Playing XI** (`/xi`) | Cricket XI builder + share image. | Cricket only |
| **Quiz** (`/quiz`) | Cricket question bank (`src/data/quiz.ts`). | Cricket only |
| Accounts | Email/password + magic link, email verification, reset. | — |
| Legal | About, contact, terms, privacy, refund, shipping, partner terms. | — |

Decision for you: Players / XI / Quiz stay cricket-only for now? If yes, copy should frame
them as "Cricket tools", not as the whole club. (Expanding them to other sports is a
data + build job, not copy.)

## Copy slots

### Global
- **Site description** (search results, link previews) — `src/app/layout.tsx`
  - Current: "Indian cricket squad hub — player profiles, a Playing XI builder, a quiz, and a fan community."
  - New copy:
- **Tagline** — `src/lib/site.ts`
  - Current: "We stand united. We are the 12th Man."
  - New copy:
- **Footer line**
  - Current: "Indian Sports Club — a fan club for Indian sport. The 12th Man. Not affiliated with the BCCI. A personal project by Shubham Datarkar"
  - New copy: (keep a non-affiliation line — "BCCI" alone is cricket-only; e.g. "not affiliated with any sports body or federation")

### Home `/`
- **Eyebrow** — Current: "Fan club · The 12th Man" — New:
- **H1** — Current: "We stand united. We are the 12th Man." — New:
- **Intro** — Current: "A passionate community backing Team India across cricket, hockey, kabaddi, badminton, football, and F1. Our mission: inspire and rally fans worldwide through the spirit of the game." — New:
- **Buttons** — Current: "Join the community" / "Our mission" — New:
- **Sports strip note** — Current: "Cricket is the fullest today. The rest grow with the club." — New:
- **Section title** — Current: "Cricket, right now" — New:
- **Feature cards** (title — description). Current:
  - Players — "Profiles, roles, and caps for the Indian squad."
  - Playing XI — "Pick your eleven, validate the squad, share it as an image."
  - Quiz — "A shuffled cricket quiz. Score yourself and play again."
  - Community — "Talk sport with other fans. No sign-up — just a name." ⚠️ **wrong**: posting needs an account.
  - Missing cards: **Events**, **Shop**, **Partners** (the money side isn't on the homepage at all).
  - New copy:

### About `/about`
- **H1** — Current: "We are the 12th Man" — New:
- **Lead** — Current: "At the heart of every triumph, through the highs and lows, we stand united." — New:
- **Body** — Current: "We are a passionate community of sports enthusiasts whose unwavering support has fuelled Team India's journey for over two decades. …" (the "two decades" claim — keep only if true) — New:
- **Sports paragraph** — Current: "Cricket is where we started, and it's the fullest today — …" — New:

### Community `/community`
- **Subtitle** — Current: "Talk cricket — and all of Indian sport — with other fans." — New:
- **Signed-out prompt** — Current: "Sign in to post and like. Reading is open to all." — New:
- **Composer placeholder** — Current: "Share something about Indian sport…" — New:

### Events `/events`
- **Intro** — Current: "Watch-parties, tournaments and meetups. Run sports events? List yours free." — New:
- **Empty state** — Current: "No events scheduled yet / The next watch-party is in the works. Join the newsletter to hear first." — New:
- **Meta description** — Current: "…watch-parties, box cricket, tournaments and fan meetups near you." — New:

### Shop `/shop`
- **Intro** — Current: "Merch for the 12th Man. Printed to order, free shipping across India." — New:
- **Empty state** — Current: "The first drop is on its way" — New:

### Newsletter `/newsletter`
- **H1** — Current: "Join The Twelfth Man" — New:
- **Promise** — Current: "Every week, one email on selection calls, likely XIs, player form, and the best of the fan community." — New:
- **Line** — Current: "No rumour mills. No rage-bait. Just the cricket, kept honest." — New:
- **Why section** — Current: "One place to keep up with the squad / Following Indian cricket shouldn't mean wading through noise…" — New:
- Is it still weekly, and still every Tuesday (signup toast says "One signal every Tuesday")? —

### Cricket tools (if they stay cricket-only)
- **Players** — Current: "The Indian squad. Filter by role." — New:
- **Playing XI** — Current: "Pick your India Playing XI, validate the squad, and share it as an image." — New:
- **Quiz** — Current: "Test your Indian cricket knowledge." — New:

### Partners `/partners`
Copy is recent and sport-neutral; only change if you want to.
- **H1** — Current: "List your sports event" — New:

## Voice notes (fill in)
- Who is it for (fans who watch? fans who play? both)?
- "12th Man" — keep as the brand idea across all sports, or retire it?
- Hindi/Hinglish anywhere?
