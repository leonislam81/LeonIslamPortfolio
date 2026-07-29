create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  title text not null,
  status text not null default 'Planned' check (status in ('Planned', 'In progress', 'Waiting', 'Completed')),
  due_date date,
  value numeric not null default 0 check (value >= 0),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "Dashboard owners can manage projects" on public.projects for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
