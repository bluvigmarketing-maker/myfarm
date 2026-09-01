# Milestones — Development Tracking

Status legend: ☐ Not started · 🔄 In progress · ✅ Done

---

## Milestone 0 — Project Setup
- ✅ Initialize repo (Next.js 16 + TypeScript + Tailwind, App Router)
- 🔄 Set up Supabase project (Auth, Postgres, Storage) — client/server helpers and migration written; you still need to create the actual Supabase project and paste keys into `.env.local`
- ✅ Define core DB schema/migrations (User, FarmerProfile, Farm, FarmPost, BookingRequest, Product, Review, Favorite, Report) — `supabase/migrations/0001_init.sql`, includes RLS policies
- ☐ Set up Vercel deployment + environment variables — needs your Vercel account
- ✅ Basic project structure, linting, CI (GitHub Actions build+lint)

**Goal:** empty app deploys successfully with working auth.

---

## Milestone 1 — Accounts & Farmer Onboarding
- 🔄 Sign up / log in — email + password done (`/signup`, `/login`, Supabase auth), direct registration with a visible-password toggle; phone login not yet built
- ☐ User profile page (avatar, bio) — not started; users get a row via the `handle_new_user` trigger but there's no edit UI yet
- ✅ "Become a Model Farmer" flow → create FarmerProfile
- ✅ Create/edit Farm Profile (name, description, photos, tags) — includes featured/cover image + up to 5 gallery photos via Supabase Storage, intro video link (Facebook/YouTube/TikTok), category (Company/Organization, School, Family/Personal), and separate agro-visit/training prices
- ✅ Google Maps link input + validation + lat/lng parse (best-effort) + embed preview
- 🔄 Open/Closed toggle + weekly schedule + blackout dates — toggle and weekly schedule done; blackout dates not yet built

**Goal:** a farmer can register and publish a complete farm profile.

---

## Milestone 2 — Discovery
- 🔄 Public Farm Profile page (About / Posts / Shop / Reviews tabs) — About tab done (`/farms/[id]`: description, tags, weekly hours, Google Maps embed, WhatsApp booking form); Posts/Shop/Reviews tabs not yet built
- 🔄 Search page with filters (location text, tags, open-now, price) — `/farms` has name search + open-now filter; tag/location/price filters not yet built
- ☐ Sort (newest, rating — distance sort if lat/lng available)
- ☐ Farm Posts feed (farmer can post text + photos; visitors can view)
- ✅ Interactive onboarding tour (goat mascot "Billy") — asks new visitors if they're a Model Farmer, a learner, or both, then walks them through the matching flow

**Goal:** visitors can find and read about farms without needing an account.

---

## Milestone 3 — Booking via WhatsApp
- ☐ "Book a Visit" form (date, people count, purpose, note)
- ☐ Generate pre-filled `wa.me` link and open WhatsApp
- ☐ Log BookingRequest in DB (status: requested)
- ☐ Farmer dashboard: list of booking requests, manual status update (confirmed/declined/completed)
- ☐ Visitor: booking history page

**Goal:** end-to-end booking handoff to WhatsApp works and is tracked.

---

## Milestone 4 — Farm Shop (Inquiry Mode)
- ✅ Farmer: add/edit/delete products (name, description, photo, price, unit, stock status) — in the farm edit page's "Farm Shop" section
- 🔄 Public Shop — done as a dedicated multitenant **Market** page (`/market`) aggregating every farm's products, rather than a per-farm Shop tab; per-farm Shop tab not separately built
- 🔄 "Order via WhatsApp" — single-item order button done; multi-select cart-to-message not built
- ☐ Log ShopOrderRequest for history (optional in this milestone)

**Goal:** farmers can sell farm-gate products via WhatsApp inquiry.

---

## Milestone 5 — Trust & Engagement
- ☐ Reviews & star ratings (only after completed booking)
- ☐ Farmer response to reviews
- ☐ Favorites / follow a farm
- ☐ In-app notifications (new post from followed farm, booking status change, new review)
- ☐ Report/flag content

**Goal:** platform builds credibility and repeat engagement.

---

## Milestone 6 — Admin Panel
- 🔄 Admin login/role — `users.is_admin` flag + DAL-gated `/admin` route done; no promotion UI (must be set directly in the Supabase SQL editor)
- 🔄 Approve/verify farmer + farm listings — farmer verification (Approve button) done; no separate farm-listing approval step exists in the schema
- 🔄 Moderate reported posts/reviews/profiles — Resolve/Dismiss actions on the `reports` table done; no dedicated per-target-type moderation view (just type + reason + reporter)
- ☐ Manage tags/categories taxonomy
- ✅ Basic analytics dashboard (visitor counts via first-party page-view logging, 14-day chart, farms/bookings/products counts, recent activity feed)

**Goal:** platform owner can moderate and monitor growth.

---

## Milestone 7 — Polish & Launch Readiness
- ☐ Mobile responsiveness pass + image optimization for low bandwidth
- ☐ PWA install support (manifest + service worker, add-to-homescreen)
- ☐ SEO basics (meta tags, sitemap, per-farm shareable pages)
- ☐ Empty states, error states, loading skeletons
- ☐ User testing with a small group of real farmers/visitors
- ☐ Soft launch

**Goal:** app is stable, fast, and ready for real users.

---

## Backlog / Phase 2+ (post-launch)
- ☐ Shop "reserve mode" with in-app order tracking (still no payment gateway)
- ☐ Multi-language support
- ☐ Curated/featured agro-tourism collections
- ☐ Farmer analytics (profile views, booking conversion)
- ☐ Paid farm promotion (monetization)
- ☐ Optional payment gateway integration (if/when justified)

---

## Change Log
| Date | Change |
|---|---|
| 2026-08-23 | Initial features, design, and milestone docs created. |
| 2026-08-23 | Milestone 0 scaffolding: Next.js 16 + Tailwind app, Supabase client/server/proxy helpers, DAL auth pattern, DB schema + RLS migration, WhatsApp & Google Maps link utilities, CI workflow. |
| 2026-08-23 | Repo moved to github.com/bluvigmarketing-maker/myfarm (Vercel-linked account); Supabase project connected and migration verified live. |
| 2026-08-23 | Milestone 1 (partial): email/password signup+login, email confirmation callback, dashboard with DAL-gated auth, "Become a Model Farmer" flow, farm create/edit forms (Google Maps link + embed, tags, weekly schedule, open/closed toggle). Verified end-to-end against the live Supabase project with a real dev-server run (signup confirmed working, hit Supabase's free-tier email rate limit after 2 test signups — expected, not a bug). |
| 2026-08-23 | Fixed reported `/farms` 404 (page was linked but never built). Added Milestone 2 start: public `/farms` search + `/farms/[id]` detail page with WhatsApp booking form. Added shared SiteHeader/SiteFooter across public pages under a `(marketing)` route group. Required a WhatsApp number when becoming a Model Farmer, since the booking form needs it. |
| 2026-08-23 | Applied a full design system across the app (see DESIGN.md §4.1), adapted from a reference `DESIGN-SYSTEM.md` with navy→green, gold→brown ("for soil"). Added shadcn/ui (base-nova), Framer Motion, lucide-react, Playfair Display headings, a green/brown color token system, `Container`/`SectionHeading`/`PageHero`/`AnimatedSection` primitives, `.btn-earthy`/`.soil-line` utilities, a dark-green `PageHero` + `SiteFooter`, and a mobile nav Sheet drawer. Recolored/rebuilt every existing page and component (home, farms, farm detail, auth, dashboard). Verified with a real dev-server run — build, lint, and screenshots of home/farms/login/mobile-menu all clean. |
| 2026-08-23 | Signup redirects straight to `/dashboard` when Supabase returns a session immediately (i.e. once "Confirm email" is turned off in the Supabase dashboard — that toggle can't be set via the app's anon key, so it's a manual one-time step); falls back to the check-email flow otherwise so nothing breaks if confirmations get re-enabled later. Added a reusable `PasswordInput` (eye-icon show/hide toggle) used on both login and signup. Verified the toggle with a real dev-server run/screenshot. |
| 2026-08-23 | Added `supabase/migrations/0002_farm_media_categories_pricing.sql` — a `farm-media` Storage bucket (public read, farmer-owns-own-folder RLS), `category` enum (Company/Organization, School, Family/Personal), `intro_video_url`, and split `price_agro_visit`/`price_training` (replacing the unused `visit_price_type`/`visit_price_amount` pair). **Not yet applied to the live project — must be run in the Supabase SQL editor before featured/gallery photo upload, category, video link, or pricing will work.** Built featured-image + up to-5 gallery photo upload/delete (Supabase Storage via Server Actions), category select, video link input, and agro-visit/training price inputs in the farm edit form; surfaced all of it on the public `/farms` (photo, category) and `/farms/[id]` (gallery, video embed, pricing) pages, plus a category filter on `/farms`. Verified the app degrades safely (no crashes, just empty results) against the live DB before the migration is run. |
| 2026-08-24 | Added an interactive onboarding tour with a goat mascot ("Billy the Goat," using the user's supplied photo). Asks new visitors whether they're a Model Farmer, a learner/visitor, or both, then plays a short grade-5-reading-level walkthrough of the matching flow with a real CTA at the end (Sign Up or Browse Farms). Skippable any time; remembered via local storage so it only auto-shows once, with a floating "Take the tour" button to replay it. Mounted on the public `(marketing)` layout. Verified with a real dev-server run: all three paths, skip persistence across reload, and the reopen button all work; no console errors. |
| 2026-08-24 | Upgraded the tour to spotlight the real UI it's describing: steps now navigate to the actual page (e.g. `/farms`, `/signup`) and highlight the real button/link/form with a glowing ring, dimming the rest of the page — steps about dashboard-only actions (need login) stay text-only since there's no real element to point at. Had to move `<AppTour />` from the `(marketing)` layout up to the root layout, since `/signup` lives in a separate `(auth)` route group that would otherwise unmount the tour on navigation. Added "Home" to the nav, a new `/about` page, and a `/market` page — a multitenant storefront aggregating every farm's products with a WhatsApp order button — plus the farmer-side product management UI (add/edit/delete, photo upload, stock status) that the Market page needed to have any data. Verified with a real dev-server run against the live Supabase project (which already has real farms in it): spotlight correctly tracks the nav link, the `/farms` search bar, and the results grid across real navigation; About and Market pages render with no console errors. |
| 2026-08-24 | Added a crossfading photo background to the home hero — 5 user-supplied farm photos (cows, sheep, market veg, honeybees, chickens), swapping every 7s, with separate landscape/portrait asset sets chosen at runtime by viewport. Tuned the dark overlay (flat `black/50` + a subtle green gradient) by actually rendering it against both a dark and a light source photo and comparing screenshots, landing on a single flat scrim as the most readable/least distracting option. Switched the hero text to the existing dark-hero (light-on-dark) treatment. Respects `prefers-reduced-motion`. Verified with a real dev-server run on both a desktop and a mobile viewport, including waiting out a full crossfade cycle — no console errors. |
| 2026-08-31 | Renamed the app from "FarmVisit" to "Shamba Spot" everywhere: package name, page metadata/title, header/footer/mobile-menu/dashboard/auth-layout branding, onboarding tour copy + localStorage key (`shamba_spot_tour_seen`), About/Market page copy, and README. |
| 2026-09-01 | Milestone 6 start: admin dashboard at `/admin` (gated by a new `users.is_admin` flag, checked in `verifyAdmin()` in the DAL, with `/admin` added to the proxy's optimistic redirect alongside `/dashboard`). Added `supabase/migrations/0003_admin_and_analytics.sql` — the `is_admin` column, a first-party `page_views` table (path, session_id, nullable visitor_id, RLS: anyone can insert, only admins can read) for lightweight visitor analytics with no external tracker, plus admin read access to bookings/reports and admin write access to resolve reports / verify farmer profiles. Added a client-side `TrackPageView` component (mounted in the root layout next to `AppTour`) that logs a page view via a server action on every route change, using a `localStorage`-persisted anonymous visitor id (`shamba_spot_visitor_id`). The `/admin` overview page shows: unique-visitor/page-view stat cards (7-day), a 14-day unique-visitors bar chart, total users/farms/bookings/products, a merged recent-activity feed (signups, new farms, bookings, products), a raw recent-page-views table, a pending-farmer-verification list with an Approve action, and an open-reports list with Resolve/Dismiss actions. **Not yet applied to the live project** — run the migration, then manually flip `is_admin = true` for your own user row in the Supabase SQL editor (no promotion UI exists yet, by design — there's no second admin to promote the first one). Verified with `npm run build`/`lint`/`tsc --noEmit` (all clean) against a placeholder Supabase project — this sandbox has no `.env.local`/live project connected, so the actual auth-gating and live data queries are unverified against a real database; verify with a real dev-server run before relying on this. |
