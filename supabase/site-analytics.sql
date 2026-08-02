create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_key text not null,
  path text not null,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists site_visits_created_idx on public.site_visits(created_at desc);
create index if not exists site_visits_visitor_created_idx on public.site_visits(visitor_key, created_at desc);
alter table public.site_visits enable row level security;

notify pgrst, 'reload schema';
