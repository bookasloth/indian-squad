-- Hardening before launch. Prefixed is_ (shared project).

-- 1. Authors may only soft-delete their own post; nothing else is editable, and
--    a removed post can't be brought back. Service role (admin) bypasses grants
--    but not the trigger, which is fine: nothing restores deleted posts.
revoke update on is_posts from anon, authenticated;
grant update (deleted_at) on is_posts to authenticated;

create or replace function is_posts_no_undelete()
returns trigger language plpgsql as $$
begin
  if old.deleted_at is not null then
    raise exception 'post is deleted';
  end if;
  return new;
end;
$$;

drop trigger if exists is_posts_no_undelete on is_posts;
create trigger is_posts_no_undelete
  before update on is_posts
  for each row execute function is_posts_no_undelete();

-- 2. auth.users is shared with another app: a user with no email (phone /
--    anonymous signup there) made username NULL and aborted their signup.
create or replace function is_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into is_profiles (id, username)
  values (
    new.id,
    lower(coalesce(split_part(new.email, '@', 1), 'fan')) || '_' || substr(md5(new.id::text), 1, 4)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
