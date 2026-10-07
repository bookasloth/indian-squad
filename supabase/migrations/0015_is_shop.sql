-- Merch shop: our own products, sold by us and paid via Zoho Payments, printed and
-- shipped by a print-on-demand partner (Printrove). Prefixed is_ (shared project).
create table if not exists is_products (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique not null check (slug ~ '^[a-z0-9-]{3,80}$'),
  title                text not null check (char_length(title) between 3 and 120),
  description          text not null default '',
  price                numeric(10,2) not null check (price >= 1),
  images               text[] not null default '{}',
  sizes                text[] not null default '{}', -- empty = one size
  printrove_product_id text,
  active               boolean not null default false,
  sort                 int not null default 0,
  created_at           timestamptz not null default now()
);

alter table is_products enable row level security;
drop policy if exists is_products_select_active on is_products;
create policy is_products_select_active on is_products
  for select using (active);

-- One orders table for tickets and merch: same Zoho session/verify/webhook flow.
alter table is_orders alter column event_id drop not null;
alter table is_orders add column if not exists kind text not null default 'ticket'
  check (kind in ('ticket', 'merch'));
alter table is_orders add column if not exists product_id uuid references is_products(id);
alter table is_orders add column if not exists size text;
alter table is_orders add column if not exists quantity int not null default 1
  check (quantity between 1 and 10);
-- { name, phone, address, city, state, pincode } for merch; null for tickets.
alter table is_orders add column if not exists shipping jsonb;
alter table is_orders add column if not exists fulfilment_status text
  check (fulfilment_status in ('new', 'placed', 'shipped', 'delivered'));
alter table is_orders add column if not exists tracking_url text;

alter table is_orders drop constraint if exists is_orders_kind_target;
alter table is_orders add constraint is_orders_kind_target check (
  (kind = 'ticket' and event_id is not null) or (kind = 'merch' and product_id is not null)
);
