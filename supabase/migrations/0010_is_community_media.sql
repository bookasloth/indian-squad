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
