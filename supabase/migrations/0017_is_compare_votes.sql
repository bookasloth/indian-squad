-- Fan votes on player comparisons ("who's better?"). One vote per signed-in
-- member per pair; changing your mind overwrites it. Counts are public.
create table if not exists is_compare_votes (
  sport      text not null,
  -- Both player slugs, sorted and joined with "|", so A-vs-B and B-vs-A share votes.
  pair       text not null,
  user_id    uuid not null references is_profiles(id) on delete cascade,
  choice     text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (sport, pair, user_id),
  constraint is_compare_votes_choice_in_pair
    check (choice <> '' and (pair like choice || '|%' or pair like '%|' || choice))
);

create index if not exists is_compare_votes_pair_idx on is_compare_votes (sport, pair);

alter table is_compare_votes enable row level security;

create policy is_compare_votes_select_all on is_compare_votes
  for select using (true);
create policy is_compare_votes_insert_self on is_compare_votes
  for insert to authenticated with check (user_id = auth.uid());
create policy is_compare_votes_update_self on is_compare_votes
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy is_compare_votes_delete_self on is_compare_votes
  for delete to authenticated using (user_id = auth.uid());
