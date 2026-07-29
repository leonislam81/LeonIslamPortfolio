alter table public.audit_leads
  add column if not exists deal_value numeric not null default 0 check (deal_value >= 0);
