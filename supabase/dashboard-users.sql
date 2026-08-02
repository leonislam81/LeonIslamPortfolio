create table if not exists public.dashboard_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'Viewer' check (role in ('Owner', 'Administrator', 'Editor', 'Author', 'Contributor', 'Viewer')),
  status text not null default 'Active' check (status in ('Invited', 'Active', 'Disabled')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dashboard_users_status_idx on public.dashboard_users(status);
create index if not exists dashboard_users_role_idx on public.dashboard_users(role);

alter table public.dashboard_users enable row level security;

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
