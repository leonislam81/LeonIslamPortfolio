create table if not exists public.audit_scheduled_emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.audit_leads(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  template text not null check (template in ('follow-up', 're-audit')),
  scheduled_for timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'processing', 'sent', 'cancelled')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists audit_scheduled_emails_due_idx on public.audit_scheduled_emails(status, scheduled_for);
alter table public.audit_scheduled_emails enable row level security;

create policy "Dashboard owners can view scheduled emails"
on public.audit_scheduled_emails for select to authenticated
using (owner_id = auth.uid());

create policy "Dashboard owners can schedule emails"
on public.audit_scheduled_emails for insert to authenticated
with check (owner_id = auth.uid());

create policy "Dashboard owners can update scheduled emails"
on public.audit_scheduled_emails for update to authenticated
using (owner_id = auth.uid()) with check (owner_id = auth.uid());
