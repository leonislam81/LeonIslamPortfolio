-- Database foundation for dashboard-controlled website content.
create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  excerpt text,
  body jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  status text not null default 'Draft' check (status in ('Draft', 'Published', 'Archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, slug)
);

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.content_pages(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  body jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create index if not exists content_pages_owner_status_idx on public.content_pages(owner_id, status);
create index if not exists content_revisions_page_created_idx on public.content_revisions(page_id, created_at desc);

alter table public.content_pages enable row level security;
alter table public.content_revisions enable row level security;
drop policy if exists "Owners can manage their content pages" on public.content_pages;
drop policy if exists "Owners can manage their content revisions" on public.content_revisions;

create policy "Owners can manage their content pages" on public.content_pages for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Owners can manage their content revisions" on public.content_revisions for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'content_pages' and policyname = 'Published pages are publicly readable') then
    create policy "Published pages are publicly readable" on public.content_pages for select to anon, authenticated using (status = 'Published');
  end if;
end $$;

insert into public.content_pages (owner_id, slug, title, excerpt, status)
select id, 'home', 'Home', 'Main positioning, services, proof, and primary enquiries.', 'Published' from auth.users
where not exists (select 1 from public.content_pages where slug = 'home' and owner_id = auth.users.id);

insert into public.content_pages (owner_id, slug, title, excerpt, seo_title, seo_description, status)
select id, 'services', 'Services', 'Service overview and routes into focused service pages.', 'Services | Leon Islam', 'Explore website management, e-commerce, Amazon catalog, data entry, and virtual admin support services.', 'Draft' from auth.users
where not exists (select 1 from public.content_pages where slug = 'services' and owner_id = auth.users.id);

insert into public.content_pages (owner_id, slug, title, excerpt, seo_title, seo_description, status)
select id, 'free-audit', 'Free audit', 'Website audit conversion page and report capture.', 'Free Website Audit | Leon Islam', 'Find practical improvements for your website with a free website audit.', 'Draft' from auth.users
where not exists (select 1 from public.content_pages where slug = 'free-audit' and owner_id = auth.users.id);

insert into public.content_pages (owner_id, slug, title, excerpt, seo_title, seo_description, status)
select id, 'contact', 'Contact', 'Quote and support enquiry form.', 'Contact Leon Islam', 'Tell Leon what you need help with and get a practical next step for your website or online work.', 'Draft' from auth.users
where not exists (select 1 from public.content_pages where slug = 'contact' and owner_id = auth.users.id);

insert into public.content_pages (owner_id, slug, title, excerpt, seo_title, seo_description, status)
select id, 'start-project', 'Start a project', 'Structured project request and qualification.', 'Start a Project | Leon Islam', 'Share your project goals, priorities, and timeline to start a practical conversation.', 'Draft' from auth.users
where not exists (select 1 from public.content_pages where slug = 'start-project' and owner_id = auth.users.id);
