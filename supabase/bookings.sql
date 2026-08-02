create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  booking_uid text not null unique,
  status text not null default 'Confirmed' check (status in ('Confirmed', 'Cancelled', 'Rescheduled')),
  guest_name text,
  guest_email text,
  guest_timezone text,
  event_title text,
  start_time timestamptz,
  end_time timestamptz,
  location text,
  notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_owner_start_idx on public.bookings(owner_id, start_time desc);
create index if not exists bookings_status_idx on public.bookings(status);
alter table public.bookings enable row level security;

drop policy if exists "Dashboard owners can manage bookings" on public.bookings;
create policy "Dashboard owners can manage bookings" on public.bookings for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

notify pgrst, 'reload schema';
