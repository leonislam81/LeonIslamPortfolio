-- Lead attribution and explicit marketing permission for the unified Leads Inbox.
alter table public.audit_leads
  add column if not exists lead_type text not null default 'Audit',
  add column if not exists lead_source text not null default 'Free audit',
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists marketing_consent_at timestamptz,
  add column if not exists marketing_unsubscribed_at timestamptz;

create index if not exists audit_leads_lead_type_idx on public.audit_leads (lead_type);
create index if not exists audit_leads_lead_source_idx on public.audit_leads (lead_source);
create index if not exists audit_leads_marketing_consent_idx on public.audit_leads (marketing_consent);
