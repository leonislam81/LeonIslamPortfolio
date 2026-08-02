create table if not exists public.dashboard_notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_owner_id uuid not null references auth.users(id) on delete cascade,
  recipient_user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  kind text not null default 'info' check (kind in ('info', 'success', 'warning', 'error')),
  href text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.dashboard_notifications enable row level security;
alter table public.dashboard_notifications add column if not exists recipient_user_id uuid references auth.users(id) on delete cascade;
create index if not exists dashboard_notifications_workspace_created_idx on public.dashboard_notifications(workspace_owner_id, created_at desc);
create index if not exists dashboard_notifications_unread_idx on public.dashboard_notifications(workspace_owner_id, is_read);
create index if not exists dashboard_notifications_recipient_idx on public.dashboard_notifications(recipient_user_id, is_read, created_at desc);

drop policy if exists "Dashboard users can manage notifications" on public.dashboard_notifications;
create policy "Dashboard users can manage notifications" on public.dashboard_notifications
  for all to authenticated
  using (workspace_owner_id = auth.uid() or recipient_user_id = auth.uid() or public.is_dashboard_workspace_member(workspace_owner_id))
  with check (workspace_owner_id = auth.uid() or recipient_user_id = auth.uid() or public.is_dashboard_workspace_member(workspace_owner_id));

notify pgrst, 'reload schema';
