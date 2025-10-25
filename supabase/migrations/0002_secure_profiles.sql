-- Prevent privilege escalation by sanitizing onboarding metadata role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata jsonb := new.raw_user_meta_data;
  raw_role text := metadata->>'role';
  safe_role public.profile_role := case
    when raw_role in ('freelancer', 'employer') then raw_role::public.profile_role
    else 'freelancer'::public.profile_role
  end;
  safe_company text := case when safe_role = 'employer' then metadata->>'company_name' else null end;
begin
  insert into public.profiles (id, full_name, role, company_name, bio)
  values (
    new.id,
    coalesce(metadata->>'full_name', new.email),
    safe_role,
    safe_company,
    metadata->>'short_bio'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Ensure users cannot update their profile role to admin and allow admins to manage profiles
alter policy "Users can update their own profile"
  on public.profiles
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role != 'admin'
  );

create policy "Admin manage profiles"
  on public.profiles
  for update
  using (public.is_admin())
  with check (public.is_admin());
