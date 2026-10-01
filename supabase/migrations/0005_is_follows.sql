-- Follows: who follows whom. Prefixed is_ (shared Supabase project).

create table if not exists is_follows (
  follower_id uuid not null references is_profiles(id) on delete cascade,
  followee_id uuid not null references is_profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

create index if not exists is_follows_followee_idx on is_follows (followee_id);

alter table is_follows enable row level security;

-- Follows are public (counts, follower/following lists); only the follower may
-- create or remove their own follow row.
create policy is_follows_select_all on is_follows
  for select using (true);
create policy is_follows_insert_self on is_follows
  for insert to authenticated with check (follower_id = auth.uid());
create policy is_follows_delete_self on is_follows
  for delete to authenticated using (follower_id = auth.uid());
