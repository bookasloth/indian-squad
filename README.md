# Indian Sports Club

Fan hub for the Indian cricket squad: player profiles, a Playing XI builder, a
quiz, and a no-sign-up community feed.

See [`docs/SPEC.md`](docs/SPEC.md) for the full v1 scope.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind v4
- Fonts: Plus Jakarta Sans (body) + Poppins (headings)
- Supabase — auth, community, events
- Zoho Payments — event tickets (setup: `Indian Squad/docs/PAYMENTS.md`)
- Deploy: Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and fill in values. Only the community
slice (4) needs Supabase; slices 1–3 run with no backend.

```bash
cp .env.example .env.local
```

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
