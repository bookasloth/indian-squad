-- Moderation: post reports + author soft-delete. Prefixed is_ (shared project).

create table if not exists is_reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references is_posts(id) on delete cascade,
  reporter_id uuid not null references is_profiles(id) on delete cascade,
  reason      text,
  status      text not null default 'open' check (status in ('open', 'resolved')),
  created_at  timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create index if not exists is_reports_status_idx on is_reports (status, created_at desc);

alter table is_reports enable row level security;

-- A member files and sees only their own reports. Admin review happens
-- server-side via the service-role client (no admin policy needed here).
create policy is_reports_insert_self on is_reports
  for insert to authenticated with check (reporter_id = auth.uid());
create policy is_reports_select_self on is_reports
  for select to authenticated using (reporter_id = auth.uid());

-- Let an author edit their own post (used to set deleted_at = soft delete).
drop policy if exists is_posts_update_own on is_posts;
create policy is_posts_update_own on is_posts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
