create table if not exists public.dashboard_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace_owner_id uuid references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'Viewer' check (role in ('Owner', 'Administrator', 'Editor', 'Author', 'Contributor', 'Viewer')),
  status text not null default 'Active' check (status in ('Invited', 'Active', 'Disabled')),
  invited_by uuid references auth.users(id) on delete set null,
  notification_preferences jsonb not null default '{"bookings":true,"leads":true,"campaigns":true,"users":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dashboard_users_status_idx on public.dashboard_users(status);
create index if not exists dashboard_users_role_idx on public.dashboard_users(role);

alter table public.dashboard_users enable row level security;

alter table public.dashboard_users add column if not exists notification_preferences jsonb not null default '{"bookings":true,"leads":true,"campaigns":true,"users":true}'::jsonb;

alter table public.dashboard_users add column if not exists workspace_owner_id uuid references auth.users(id) on delete cascade;
update public.dashboard_users set workspace_owner_id = user_id where workspace_owner_id is null and role = 'Owner';
update public.dashboard_users set workspace_owner_id = invited_by where workspace_owner_id is null and invited_by is not null;

create or replace function public.dashboard_workspace_owner_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select workspace_owner_id from public.dashboard_users where user_id = auth.uid() and status in ('Active', 'Invited')),
    auth.uid()
  );
$$;

create or replace function public.is_dashboard_workspace_member(record_owner_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select record_owner_id = public.dashboard_workspace_owner_id();
$$;

drop policy if exists "Users can view their own dashboard membership" on public.dashboard_users;
create policy "Users can view their own dashboard membership"
on public.dashboard_users for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can update their own last seen membership" on public.dashboard_users;
create policy "Users can update their own last seen membership"
on public.dashboard_users for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

notify pgrst, 'reload schema';
