-- Bookmarks: a member's saved posts. Prefixed is_ (shared Supabase project).

create table if not exists is_bookmarks (
  user_id    uuid not null references is_profiles(id) on delete cascade,
  post_id    uuid not null references is_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index if not exists is_bookmarks_post_idx on is_bookmarks (post_id);

alter table is_bookmarks enable row level security;

-- Private: a member sees and manages only their own bookmarks.
create policy is_bookmarks_select_self on is_bookmarks
  for select to authenticated using (user_id = auth.uid());
create policy is_bookmarks_insert_self on is_bookmarks
  for insert to authenticated with check (user_id = auth.uid());
create policy is_bookmarks_delete_self on is_bookmarks
  for delete to authenticated using (user_id = auth.uid());
