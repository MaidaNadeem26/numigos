-- Run this in Supabase Dashboard -> SQL Editor
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  roll_number text,
  department text,
  role text not null default 'student',
  is_verified boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_auth_user_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, roll_number, department, role, is_verified, updated_at
  )
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'roll_number',
    new.raw_user_meta_data->>'department',
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    true,
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    roll_number = coalesce(excluded.roll_number, public.profiles.roll_number),
    department = coalesce(excluded.department, public.profiles.department),
    role = coalesce(excluded.role, public.profiles.role),
    is_verified = true,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_or_verified on auth.users;
create trigger on_auth_user_created_or_verified
  after insert or update of email_confirmed_at, raw_user_meta_data, email
  on auth.users
  for each row
  execute function public.handle_auth_user_sync();
