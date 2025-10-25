-- Ensure storage buckets exist for profile avatars and freelancer certificates
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('certificates', 'certificates', false)
on conflict (id) do update set public = excluded.public;

-- Public read access for profile avatars
create policy "Avatar files are public"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

-- Allow authenticated users to manage their own avatar files
create policy "Users can upload avatar"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "Users can update own avatar"
  on storage.objects
  for update
  using (
    bucket_id = 'avatars'
    and auth.uid() = owner
  );

create policy "Users can delete own avatar"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars'
    and auth.uid() = owner
  );

-- Private bucket for freelancer certificates (owners and admins only)
create policy "Owners and admins can view certificates"
  on storage.objects
  for select
  using (
    bucket_id = 'certificates'
    and (auth.uid() = owner or public.is_admin())
  );

create policy "Owners can upload certificates"
  on storage.objects
  for insert
  with check (
    bucket_id = 'certificates'
    and auth.uid() = owner
  );

create policy "Owners and admins can update certificates"
  on storage.objects
  for update
  using (
    bucket_id = 'certificates'
    and (auth.uid() = owner or public.is_admin())
  );

create policy "Owners and admins can delete certificates"
  on storage.objects
  for delete
  using (
    bucket_id = 'certificates'
    and (auth.uid() = owner or public.is_admin())
  );
