create table if not exists public.dashboard_activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_owner_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists dashboard_activity_log_workspace_created_idx on public.dashboard_activity_log(workspace_owner_id, created_at desc);
alter table public.dashboard_activity_log enable row level security;

drop policy if exists "Workspace members can view activity log" on public.dashboard_activity_log;
create policy "Workspace members can view activity log"
on public.dashboard_activity_log for select to authenticated
using (public.is_dashboard_workspace_member(workspace_owner_id));

drop policy if exists "Workspace members can write activity log" on public.dashboard_activity_log;
create policy "Workspace members can write activity log"
on public.dashboard_activity_log for insert to authenticated
with check (public.is_dashboard_workspace_member(workspace_owner_id));

notify pgrst, 'reload schema';
