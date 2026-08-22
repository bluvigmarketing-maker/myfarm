-- Milestone 0: core schema for the Farm Training & Agro-Tourism platform.
-- Run via `supabase db push` or the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Users (profile row alongside Supabase's built-in auth.users)
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  avatar_url text,
  bio text,
  whatsapp_number text,
  created_at timestamptz not null default now()
);

-- Auto-create a public.users row whenever someone signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Farmer profiles
-- ---------------------------------------------------------------------------
create table public.farmer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  verified boolean not null default false,
  years_experience int,
  specialties text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Farms
-- ---------------------------------------------------------------------------
create type public.farm_status as enum ('open', 'closed');
create type public.visit_price_type as enum ('free', 'fixed', 'training_fee');

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.farmer_profiles (id) on delete cascade,
  name text not null,
  description text,
  cover_photo_url text,
  gmaps_link text,
  lat double precision,
  lng double precision,
  status public.farm_status not null default 'closed',
  schedule jsonb not null default '[]', -- [{day_of_week, open_time, close_time}]
  blackout_dates date[] not null default '{}',
  visit_price_type public.visit_price_type not null default 'free',
  visit_price_amount numeric(10, 2),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index farms_farmer_id_idx on public.farms (farmer_id);
create index farms_tags_idx on public.farms using gin (tags);
create index farms_status_idx on public.farms (status);

create table public.farm_photos (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  url text not null,
  caption text,
  sort_order int not null default 0
);

create table public.farm_posts (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  text text not null,
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index farm_posts_farm_id_idx on public.farm_posts (farm_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
create type public.booking_purpose as enum ('training', 'tour', 'both');
create type public.booking_status as enum ('requested', 'confirmed', 'declined', 'completed');

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  visitor_id uuid not null references public.users (id) on delete cascade,
  requested_date date not null,
  num_people int not null default 1,
  purpose public.booking_purpose not null default 'tour',
  message text,
  status public.booking_status not null default 'requested',
  whatsapp_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index booking_requests_farm_id_idx on public.booking_requests (farm_id);
create index booking_requests_visitor_id_idx on public.booking_requests (visitor_id);

-- ---------------------------------------------------------------------------
-- Farm shop
-- ---------------------------------------------------------------------------
create type public.stock_status as enum ('in_stock', 'out_of_stock', 'seasonal');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  name text not null,
  description text,
  photo_url text,
  price numeric(10, 2) not null,
  unit text not null default 'unit',
  stock_status public.stock_status not null default 'in_stock',
  created_at timestamptz not null default now()
);

create index products_farm_id_idx on public.products (farm_id);

-- ---------------------------------------------------------------------------
-- Reviews, favorites, reports
-- ---------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  visitor_id uuid not null references public.users (id) on delete cascade,
  booking_id uuid not null references public.booking_requests (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  text text,
  farmer_response text,
  created_at timestamptz not null default now(),
  unique (booking_id)
);

create index reviews_farm_id_idx on public.reviews (farm_id);

create table public.favorites (
  user_id uuid not null references public.users (id) on delete cascade,
  farm_id uuid not null references public.farms (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, farm_id)
);

create type public.report_target_type as enum ('farm', 'farm_post', 'review', 'user');
create type public.report_status as enum ('open', 'resolved', 'dismissed');

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users (id) on delete cascade,
  target_type public.report_target_type not null,
  target_id uuid not null,
  reason text not null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.farmer_profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_photos enable row level security;
alter table public.farm_posts enable row level security;
alter table public.booking_requests enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;

-- users: anyone can read basic profiles, only the owner can edit their own
create policy "users are publicly readable" on public.users
  for select using (true);
create policy "users can update own row" on public.users
  for update using (auth.uid() = id);

-- farmer_profiles: public read, owner-only write
create policy "farmer profiles are publicly readable" on public.farmer_profiles
  for select using (true);
create policy "farmers manage own profile" on public.farmer_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- farms: public read, owner-only write
create policy "farms are publicly readable" on public.farms
  for select using (true);
create policy "farmers manage own farms" on public.farms
  for all using (
    farmer_id in (select id from public.farmer_profiles where user_id = auth.uid())
  ) with check (
    farmer_id in (select id from public.farmer_profiles where user_id = auth.uid())
  );

-- farm_photos / farm_posts / products: public read, owning farmer writes
create policy "farm photos are publicly readable" on public.farm_photos
  for select using (true);
create policy "farmers manage own farm photos" on public.farm_photos
  for all using (
    farm_id in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );

create policy "farm posts are publicly readable" on public.farm_posts
  for select using (true);
create policy "farmers manage own farm posts" on public.farm_posts
  for all using (
    farm_id in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );

create policy "products are publicly readable" on public.products
  for select using (true);
create policy "farmers manage own products" on public.products
  for all using (
    farm_id in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );

-- booking_requests: visitor and the farm's owning farmer can see/manage
create policy "visitor reads own bookings" on public.booking_requests
  for select using (
    visitor_id = auth.uid()
    or farm_id in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );
create policy "visitor creates own bookings" on public.booking_requests
  for insert with check (visitor_id = auth.uid());
create policy "farmer updates bookings on own farms" on public.booking_requests
  for update using (
    farm_id in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );

-- reviews: public read, only the visitor who completed the booking can write
create policy "reviews are publicly readable" on public.reviews
  for select using (true);
create policy "visitor creates own review" on public.reviews
  for insert with check (
    visitor_id = auth.uid()
    and booking_id in (
      select id from public.booking_requests
      where visitor_id = auth.uid() and status = 'completed'
    )
  );
create policy "farmer responds to review on own farm" on public.reviews
  for update using (
    farm_id in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );

-- favorites: owner-only
create policy "user manages own favorites" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reports: reporter can create/read own; no public read
create policy "user creates own report" on public.reports
  for insert with check (reporter_id = auth.uid());
create policy "user reads own report" on public.reports
  for select using (reporter_id = auth.uid());
