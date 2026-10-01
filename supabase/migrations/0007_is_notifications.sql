-- Notifications: someone liked/replied to your post, or followed you.
-- Prefixed is_ (shared Supabase project). Rows are written server-side via the
-- service-role client (notify helper), so there is no user-facing insert policy.

create table if not exists is_notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references is_profiles(id) on delete cascade, -- recipient
  actor_id   uuid references is_profiles(id) on delete set null,          -- who did it
  type       text not null check (type in ('like', 'reply', 'follow')),
  post_id    uuid references is_posts(id) on delete cascade,              -- for like/reply
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists is_notifications_user_idx on is_notifications (user_id, created_at desc);
create index if not exists is_notifications_unread_idx on is_notifications (user_id) where read_at is null;

alter table is_notifications enable row level security;

-- A member reads and marks read only their own notifications.
create policy is_notifications_select_self on is_notifications
  for select to authenticated using (user_id = auth.uid());
create policy is_notifications_update_self on is_notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
