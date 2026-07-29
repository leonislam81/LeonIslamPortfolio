alter table public.audit_leads
  add column if not exists priority text not null default 'normal' check (priority in ('high', 'normal', 'low')),
  add column if not exists tags text[] not null default '{}';
