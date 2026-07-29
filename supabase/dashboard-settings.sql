create table if not exists public.dashboard_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  first_follow_up_days integer not null default 3 check (first_follow_up_days between 1 and 60),
  re_audit_days integer not null default 30 check (re_audit_days between 7 and 365),
  updated_at timestamptz not null default now()
);

alter table public.dashboard_settings enable row level security;

create policy "Dashboard owners can view their settings"
on public.dashboard_settings for select
to authenticated
using (owner_id = auth.uid());

create policy "Dashboard owners can create their settings"
on public.dashboard_settings for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Dashboard owners can update their settings"
on public.dashboard_settings for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
