# FarmVisit

A webapp connecting experienced farmers (who open their farms for training
visits and agro-tourism) with visitors who want to learn or tour — booking
handled via WhatsApp, no paid Maps API required.

See [FEATURES.md](./FEATURES.md), [DESIGN.md](./DESIGN.md), and
[MILESTONES.md](./MILESTONES.md) for the product spec, architecture, and
build tracking.

## Stack
- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- WhatsApp `wa.me` deep links for booking/orders
- Google Maps share-link embedding (no API key)

> Next.js 16 renamed Middleware to **Proxy** (`src/proxy.ts`) and recommends
> a Data Access Layer for real auth checks (`src/lib/auth/dal.ts`) rather
> than relying on Proxy alone — see the inline comments in those files.

## Local setup
1. `npm install`
2. Create a free project at [supabase.com](https://supabase.com).
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase
   project URL and anon key (Project Settings → API).
4. Apply the schema: open the Supabase SQL editor and run the contents of
   `supabase/migrations/0001_init.sql` (or `supabase db push` if you have the
   Supabase CLI linked to your project).
5. `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Deploying
Push this repo to GitHub and import it on [Vercel](https://vercel.com/new).
Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
environment variables in the Vercel project settings.
