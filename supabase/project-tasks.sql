create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);
alter table public.project_tasks enable row level security;
create policy "Dashboard owners can manage project tasks" on public.project_tasks for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
