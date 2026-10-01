-- Reblogs (reposts): a member resurfaces a post into the feed.
-- Prefixed is_ (shared Supabase project).

create table if not exists is_reblogs (
  user_id    uuid not null references is_profiles(id) on delete cascade,
  post_id    uuid not null references is_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index if not exists is_reblogs_post_idx on is_reblogs (post_id);
create index if not exists is_reblogs_user_idx on is_reblogs (user_id, created_at desc);

alter table is_reblogs enable row level security;

-- Reblogs are public (they surface in the feed); only the owner creates/removes.
create policy is_reblogs_select_all on is_reblogs
  for select using (true);
create policy is_reblogs_insert_self on is_reblogs
  for insert to authenticated with check (user_id = auth.uid());
create policy is_reblogs_delete_self on is_reblogs
  for delete to authenticated using (user_id = auth.uid());

-- Allow 'reblog' as a notification type.
alter table is_notifications drop constraint if exists is_notifications_type_check;
alter table is_notifications
  add constraint is_notifications_type_check check (type in ('like', 'reply', 'follow', 'reblog'));
