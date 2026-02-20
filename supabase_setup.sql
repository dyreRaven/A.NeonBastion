-- Neon Bastion cloud account/progress table (run once in Supabase SQL Editor).

create table if not exists public.player_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  profile_name text not null default 'Commander',
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.player_profiles enable row level security;
grant select, insert, update, delete on table public.player_profiles to authenticated;

drop policy if exists player_profiles_select_own on public.player_profiles;
create policy player_profiles_select_own
  on public.player_profiles
  for select
  using (auth.uid() = id);

drop policy if exists player_profiles_insert_own on public.player_profiles;
create policy player_profiles_insert_own
  on public.player_profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists player_profiles_update_own on public.player_profiles;
create policy player_profiles_update_own
  on public.player_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists player_profiles_delete_own on public.player_profiles;
create policy player_profiles_delete_own
  on public.player_profiles
  for delete
  using (auth.uid() = id);
