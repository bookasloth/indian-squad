-- indian-squad — full database setup. Generated from supabase/migrations/*.sql
-- Run once in the Supabase SQL editor. Idempotent — safe to re-run.

-- ============================================================
-- 0001_is_posts.sql
-- ============================================================
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

-- ============================================================
-- 0002_is_profiles.sql
-- ============================================================
-- indian-squad profiles (auth). Prefixed is_ — shares the Supabase project with
-- another app, so this must never collide with its public.profiles.
-- Auth.users is shared; this app's own trigger populates is_profiles.

create table if not exists is_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text unique not null,
  display_name    text,
  avatar_url      text,
  bio             text,
  referral_source text,
  onboarded_at    timestamptz,
  created_at      timestamptz not null default now()
);

alter table is_profiles enable row level security;

-- Usernames/profiles are public; only the owner may edit their row.
create policy is_profiles_select_all on is_profiles
  for select using (true);
create policy is_profiles_self_update on is_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-create a profile row on signup with a generated, collision-resistant
-- username (email local part + 4 hex of the uuid). The user can rename later.
create or replace function is_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into is_profiles (id, username)
  values (
    new.id,
    lower(split_part(new.email, '@', 1)) || '_' || substr(md5(new.id::text), 1, 4)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists is_on_auth_user_created on auth.users;
create trigger is_on_auth_user_created
  after insert on auth.users
  for each row execute function is_handle_new_user();

-- Username setter used by onboarding. Validates + maps unique-violation to a
-- friendly error the action can detect ("taken").
create or replace function is_set_username(p_username text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v text := trim(p_username);
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if v is null or v !~ '^[a-zA-Z0-9_.]{3,30}$' then
    raise exception 'username must be 3-30 chars: letters, numbers, dot, underscore';
  end if;
  update is_profiles set username = v where id = auth.uid();
exception
  when unique_violation then
    raise exception 'username taken';
end;
$$;

revoke all on function is_set_username(text) from public, anon;
grant execute on function is_set_username(text) to authenticated;

-- ============================================================
-- 0003_is_subscribers.sql
-- ============================================================
-- indian-squad newsletter subscribers. Prefixed is_ (shared Supabase project).
-- All access is via server actions using the service-role key; RLS is on with
-- no public policies, so anon/auth clients can't read or write directly.

create table if not exists is_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text,
  status     text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);

create unique index if not exists is_subscribers_email_lower_idx
  on is_subscribers (lower(email));

alter table is_subscribers enable row level security;
-- Intentionally no anon/authenticated policies: the subscribe/unsubscribe
-- server actions write through the service-role client (RLS-bypassing) after
-- validation + rate-limiting.

-- ============================================================
-- 0004_is_community_social.sql
-- ============================================================
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

-- ============================================================
-- 0005_is_follows.sql
-- ============================================================
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

-- ============================================================
-- 0006_is_bookmarks.sql
-- ============================================================
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

-- ============================================================
-- 0007_is_notifications.sql
-- ============================================================
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

-- ============================================================
-- 0008_is_reblogs.sql
-- ============================================================
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

-- ============================================================
-- 0009_is_polls.sql
-- ============================================================
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

-- ============================================================
-- 0010_is_community_media.sql
-- ============================================================
-- Post images + a storage bucket for them. Prefixed is_ / is- (shared project).

alter table is_posts add column if not exists images text[];

-- Public bucket for community images.
insert into storage.buckets (id, name, public)
values ('is-community-media', 'is-community-media', true)
on conflict (id) do nothing;

-- Storage policies scoped to this bucket (names prefixed is_media_ so they never
-- collide with the other app's storage policies). Public read; a member may write
-- and delete only within their own uid folder.
drop policy if exists is_media_read on storage.objects;
create policy is_media_read on storage.objects
  for select using (bucket_id = 'is-community-media');

drop policy if exists is_media_insert on storage.objects;
create policy is_media_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'is-community-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists is_media_delete on storage.objects;
create policy is_media_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'is-community-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 0011_is_reports.sql
-- ============================================================
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

-- ============================================================
-- 0012_is_posts_sport.sql
-- ============================================================
-- Per-sport community: tag each post with a sport. Prefixed is_ (shared project).
alter table is_posts add column if not exists sport text
  check (sport in ('cricket', 'hockey', 'kabaddi', 'badminton', 'football', 'f1'));

create index if not exists is_posts_sport_idx on is_posts (sport);

