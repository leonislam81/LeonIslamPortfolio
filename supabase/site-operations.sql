create table if not exists public.site_operations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  task_key text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (owner_id, task_key)
);

alter table public.site_operations enable row level security;

create policy "Owners manage their site operations"
on public.site_operations for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
