-- indian-squad community feed (slice 4 of docs/SPEC.md).
-- Tables are prefixed is_ because this project shares a Supabase project with
-- another app — never create an unprefixed `posts` here.

create table if not exists is_posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(author_name) between 1 and 40),
  body text not null check (char_length(body) between 1 and 1000),
  parent_id uuid references is_posts(id) on delete cascade, -- null = top-level
  created_at timestamptz not null default now()
);

create index if not exists is_posts_parent_id_idx on is_posts (parent_id);
create index if not exists is_posts_created_at_idx on is_posts (created_at);

alter table is_posts enable row level security;

-- Everyone (anon + authenticated) may read posts. (Role-less so logged-in users
-- can read the feed and read a row back after inserting it.)
drop policy if exists is_posts_select_anon on is_posts;
drop policy if exists is_posts_select_all on is_posts;
create policy is_posts_select_all on is_posts
  for select using (true);

drop policy if exists is_posts_insert_anon on is_posts;
create policy is_posts_insert_anon on is_posts
  for insert to anon with check (true);
