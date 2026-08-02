create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  message text not null,
  recipient_count integer not null default 0,
  status text not null default 'Draft' check (status in ('Draft', 'Sent', 'Failed')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists email_campaigns_owner_created_idx on public.email_campaigns(owner_id, created_at desc);
alter table public.email_campaigns enable row level security;

drop policy if exists "Dashboard owners can manage email campaigns" on public.email_campaigns;
create policy "Dashboard owners can manage email campaigns"
on public.email_campaigns for all to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

notify pgrst, 'reload schema';
