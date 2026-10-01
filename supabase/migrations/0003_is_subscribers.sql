-- indian-squad newsletter subscribers. Prefixed is_ (shared Supabase project).
-- All access is via server actions using the service-role key; RLS is on with
-- no public policies, so anon/auth clients can't read or write directly.

create table if not exists is_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text,
  status     text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);

create unique index if not exists is_subscribers_email_lower_idx
  on is_subscribers (lower(email));

alter table is_subscribers enable row level security;
-- Intentionally no anon/authenticated policies: the subscribe/unsubscribe
-- server actions write through the service-role client (RLS-bypassing) after
-- validation + rate-limiting.
