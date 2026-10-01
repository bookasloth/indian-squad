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
