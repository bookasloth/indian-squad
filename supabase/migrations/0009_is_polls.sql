-- Polls attached to a post. Prefixed is_ (shared Supabase project).

create table if not exists is_polls (
  post_id    uuid primary key references is_posts(id) on delete cascade,
  options    jsonb not null, -- [{"i":0,"label":"..."}, ...]
  closes_at  timestamptz,
  created_at timestamptz not null default now()
);

alter table is_polls enable row level security;

create policy is_polls_select_all on is_polls
  for select using (true);
-- Only the post's author may attach a poll to it.
create policy is_polls_insert_owner on is_polls
  for insert to authenticated
  with check (exists (select 1 from is_posts p where p.id = post_id and p.user_id = auth.uid()));

-- One vote per member per poll; changing your mind updates the row.
create table if not exists is_poll_votes (
  post_id      uuid not null references is_posts(id) on delete cascade,
  user_id      uuid not null references is_profiles(id) on delete cascade,
  option_index int not null,
  created_at   timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists is_poll_votes_post_idx on is_poll_votes (post_id);

alter table is_poll_votes enable row level security;
create policy is_poll_votes_select_all on is_poll_votes
  for select using (true);
create policy is_poll_votes_insert_self on is_poll_votes
  for insert to authenticated with check (user_id = auth.uid());
create policy is_poll_votes_update_self on is_poll_votes
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy is_poll_votes_delete_self on is_poll_votes
  for delete to authenticated using (user_id = auth.uid());
