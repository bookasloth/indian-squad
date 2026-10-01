-- Phase 4 (core): tie community posts to signed-in users + add likes.
-- Prefixed is_ — shared Supabase project.

-- Posts now belong to a profile. author_name stays for the older name-only rows
-- and becomes optional; new posts resolve their author via user_id -> is_profiles.
alter table is_posts add column if not exists user_id uuid references is_profiles(id) on delete cascade;
alter table is_posts alter column author_name drop not null;
alter table is_posts add column if not exists deleted_at timestamptz;

create index if not exists is_posts_user_id_idx on is_posts (user_id);

-- Posting now requires sign-in: replace the old anon-insert policy with an
-- authenticated one that forces user_id = the caller. Reads stay public.
drop policy if exists is_posts_insert_anon on is_posts;
create policy is_posts_insert_auth on is_posts
  for insert to authenticated with check (user_id = auth.uid());
create policy is_posts_delete_own on is_posts
  for delete to authenticated using (user_id = auth.uid());

-- Likes. One row per (post, user).
create table if not exists is_post_reactions (
  post_id    uuid not null references is_posts(id) on delete cascade,
  user_id    uuid not null references is_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists is_post_reactions_post_idx on is_post_reactions (post_id);

alter table is_post_reactions enable row level security;
create policy is_post_reactions_select_all on is_post_reactions
  for select using (true);
create policy is_post_reactions_insert_self on is_post_reactions
  for insert to authenticated with check (user_id = auth.uid());
create policy is_post_reactions_delete_self on is_post_reactions
  for delete to authenticated using (user_id = auth.uid());
