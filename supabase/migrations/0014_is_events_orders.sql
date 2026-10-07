-- Paid events (watch-parties, box cricket, meetups) and their Zoho Payments
-- orders. Prefixed is_ (shared project). Events are created by an admin in SQL.
create table if not exists is_events (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null check (slug ~ '^[a-z0-9-]{3,80}$'),
  title       text not null check (char_length(title) between 3 and 120),
  description text not null default '',
  sport       text check (sport in ('cricket', 'hockey', 'kabaddi', 'badminton', 'football', 'f1')),
  venue       text not null,
  city        text not null,
  starts_at   timestamptz not null,
  price       numeric(10,2) not null check (price >= 1),
  capacity    int check (capacity > 0),
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table is_events enable row level security;
drop policy if exists is_events_select_published on is_events;
create policy is_events_select_published on is_events
  for select using (published);

-- One row per ticket. id is sent to Zoho as reference_number. The price is
-- copied from the event server-side; the browser never sends an amount.
-- user_id is set null on account deletion: payment records are kept.
create table if not exists is_orders (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references is_events(id),
  user_id             uuid references auth.users(id) on delete set null,
  email               text not null,
  amount              numeric(10,2) not null check (amount > 0),
  status              text not null default 'pending' check (status in ('pending', 'paid')),
  provider_payment_id text unique,
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists is_orders_event_status_idx on is_orders (event_id, status);
create index if not exists is_orders_user_idx on is_orders (user_id);

alter table is_orders enable row level security;
drop policy if exists is_orders_select_own on is_orders;
create policy is_orders_select_own on is_orders
  for select to authenticated using (user_id = auth.uid());
-- No insert/update policies: only the service role (API routes) writes orders.
