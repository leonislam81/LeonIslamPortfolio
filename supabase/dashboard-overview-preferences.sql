alter table public.dashboard_settings
add column if not exists overview_sections jsonb not null default '["attention","quick-actions","workspace","saved-views","reporting","recent-activity","analytics","calendar","pipeline"]'::jsonb;
