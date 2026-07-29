create table if not exists public.audit_lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.audit_leads(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null check (activity_type in ('status_changed', 'notes_saved', 'email_sent')),
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_lead_activities_lead_created_idx on public.audit_lead_activities(lead_id, created_at desc);
alter table public.audit_lead_activities enable row level security;

create policy "Dashboard owners can view their lead activities"
on public.audit_lead_activities for select
to authenticated
using (owner_id = auth.uid());

create policy "Dashboard owners can create their lead activities"
on public.audit_lead_activities for insert
to authenticated
with check (owner_id = auth.uid());
