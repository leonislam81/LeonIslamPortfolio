create table if not exists public.audit_leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  website_url text not null,
  email text not null,
  status text not null default 'New',
  business_goal text,
  performance integer check (performance between 0 and 100),
  seo integer not null check (seo between 0 and 100),
  audit_source text not null,
  report jsonb not null default '{}'::jsonb,
  notes text,
  follow_up_at date,
  re_audit_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists audit_leads_owner_created_idx on public.audit_leads(owner_id, created_at desc);
create index if not exists audit_leads_status_idx on public.audit_leads(status);

alter table public.audit_leads enable row level security;

create policy "Dashboard owners can view their audit leads"
on public.audit_leads for select
to authenticated
using (owner_id = auth.uid());

create policy "Dashboard owners can update their audit leads"
on public.audit_leads for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
