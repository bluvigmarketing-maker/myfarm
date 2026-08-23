-- Milestone 2 add-on: farm gallery/featured images, intro video link,
-- farm category, and split agro-visit/training pricing.
-- Run in the Supabase SQL editor (or `supabase db push`), after 0001_init.sql.

-- ---------------------------------------------------------------------------
-- Storage bucket for farm photos (featured image + up to 5 gallery photos).
-- Public read (farms are publicly browsable); writes restricted to the
-- owning farmer via a folder-per-farm convention: "{farm_id}/{filename}".
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('farm-media', 'farm-media', true)
on conflict (id) do nothing;

create policy "public can view farm media"
  on storage.objects for select
  using (bucket_id = 'farm-media');

create policy "farmers upload own farm media"
  on storage.objects for insert
  with check (
    bucket_id = 'farm-media'
    and (storage.foldername(name))[1]::uuid in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );

create policy "farmers delete own farm media"
  on storage.objects for delete
  using (
    bucket_id = 'farm-media'
    and (storage.foldername(name))[1]::uuid in (
      select f.id from public.farms f
      join public.farmer_profiles fp on fp.id = f.farmer_id
      where fp.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Farm category
-- ---------------------------------------------------------------------------
create type public.farm_category as enum ('company_organization', 'school', 'family_personal');

alter table public.farms
  add column category public.farm_category not null default 'family_personal';

alter table public.farms alter column category drop default;

-- ---------------------------------------------------------------------------
-- Intro video link (Facebook, YouTube, or TikTok)
-- ---------------------------------------------------------------------------
alter table public.farms add column intro_video_url text;

-- ---------------------------------------------------------------------------
-- Split pricing: pure agro-visit vs. training, replacing the old single
-- visit_price_type/visit_price_amount pair (never wired up in the app).
-- ---------------------------------------------------------------------------
alter table public.farms drop column visit_price_type;
alter table public.farms drop column visit_price_amount;
drop type public.visit_price_type;

alter table public.farms add column price_agro_visit numeric(10, 2);
alter table public.farms add column price_training numeric(10, 2);
