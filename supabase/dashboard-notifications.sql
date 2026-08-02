create table if not exists public.dashboard_notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  kind text not null default 'info' check (kind in ('info', 'success', 'warning', 'error')),
  href text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists dashboard_notifications_workspace_created_idx on public.dashboard_notifications(workspace_owner_id, created_at desc);
create index if not exists dashboard_notifications_unread_idx on public.dashboard_notifications(workspace_owner_id, is_read);
alter table public.dashboard_notifications enable row level security;

notify pgrst, 'reload schema';
