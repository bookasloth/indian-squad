-- Partners (P0): organisers apply, an admin approves them, they submit events (admin-approved too).
-- P0 events are free RSVP or link out to the organiser's own ticketing — we touch no partner money.
-- Prefixed is_ (shared project).
create table if not exists is_partners (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid unique not null references auth.users(id) on delete cascade,
  slug                  text unique not null check (slug ~ '^[a-z0-9-]{3,80}$'),
  org_name              text not null check (char_length(org_name) between 2 and 100),
  contact_name          text not null check (char_length(contact_name) between 2 and 80),
  phone                 text not null check (phone ~ '^[6-9][0-9]{9}$'),
  city                  text not null check (char_length(city) between 2 and 60),
  sports                text[] not null default '{}',
  about                 text not null default '' check (char_length(about) <= 1000),
  website               text check (website is null or website ~ '^https://'),
  status                text not null default 'pending'
                        check (status in ('pending', 'approved', 'rejected', 'suspended')),
  agreement_accepted_at timestamptz not null,
  reviewed_at           timestamptz,
  created_at            timestamptz not null default now()
);

alter table is_partners enable row level security;
drop policy if exists is_partners_select_own on is_partners;
create policy is_partners_select_own on is_partners
  for select to authenticated using (user_id = auth.uid());
-- No insert/update policies: the service role (API routes) writes partners.

-- Public face of approved partners: no phone, contact name or status.
create or replace view is_partners_public as
  select id, slug, org_name, city, sports, about, website, created_at
  from is_partners
  where status = 'approved';
grant select on is_partners_public to anon, authenticated;

-- Events can belong to a partner. ticketing: paid (our Zoho events), rsvp (free), external (organiser's link).
alter table is_events add column if not exists partner_id uuid references is_partners(id);
alter table is_events add column if not exists ticketing text not null default 'paid'
  check (ticketing in ('paid', 'rsvp', 'external'));
alter table is_events add column if not exists external_url text
  check (external_url is null or external_url ~ '^https://');
alter table is_events add column if not exists ends_at timestamptz;
alter table is_events add column if not exists submitted_at timestamptz;

alter table is_events drop constraint if exists is_events_price_check;
alter table is_events add constraint is_events_price_check check (price >= 0);
alter table is_events drop constraint if exists is_events_paid_price;
alter table is_events add constraint is_events_paid_price check (ticketing <> 'paid' or price >= 1);
alter table is_events drop constraint if exists is_events_external_url;
alter table is_events add constraint is_events_external_url check (ticketing <> 'external' or external_url is not null);

create index if not exists is_events_partner_idx on is_events (partner_id);

-- Free registrations. The organiser sees name + email (disclosed on the RSVP button).
create table if not exists is_event_rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references is_events(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  email      text not null,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table is_event_rsvps enable row level security;
drop policy if exists is_event_rsvps_select_own on is_event_rsvps;
create policy is_event_rsvps_select_own on is_event_rsvps
  for select to authenticated using (user_id = auth.uid());
