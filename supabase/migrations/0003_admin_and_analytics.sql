-- Milestone 6 start: admin flag, lightweight visitor analytics (page views),
-- and the extra read/write RLS an admin needs on top of the owner-only
-- policies from 0001_init.sql.
-- Run in the Supabase SQL editor (or `supabase db push`), after 0002_....sql.

-- ---------------------------------------------------------------------------
-- Admin flag
-- ---------------------------------------------------------------------------
alter table public.users add column is_admin boolean not null default false;

-- ---------------------------------------------------------------------------
-- Page views (lightweight first-party visitor analytics — no external
-- tracker). One row per page load; visitor_id is set when the viewer is
-- logged in, null for anonymous visitors. session_id is a client-generated
-- id (localStorage) used to count unique visitors regardless of login state.
-- ---------------------------------------------------------------------------
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  session_id text not null,
  visitor_id uuid references public.users (id) on delete set null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index page_views_created_at_idx on public.page_views (created_at desc);
create index page_views_session_id_idx on public.page_views (session_id);

alter table public.page_views enable row level security;

create policy "anyone can log a page view" on public.page_views
  for insert with check (true);

create policy "admins read page views" on public.page_views
  for select using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin)
  );

-- ---------------------------------------------------------------------------
-- Admin read/write access needed for the dashboard: bookings + reports feed,
-- and approving farmers / resolving reports.
-- ---------------------------------------------------------------------------
create policy "admins read all bookings" on public.booking_requests
  for select using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin)
  );

create policy "admins read all reports" on public.reports
  for select using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin)
  );

create policy "admins update reports" on public.reports
  for update using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin)
  );

create policy "admins verify farmer profiles" on public.farmer_profiles
  for update using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin)
  );
