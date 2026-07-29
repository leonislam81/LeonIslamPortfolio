alter table public.audit_leads
  add column if not exists lead_name text,
  add column if not exists message text;
