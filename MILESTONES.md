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
- 🔄 Sign up / log in — email + password done (`/signup`, `/login`, Supabase auth); phone login not yet built
- ☐ User profile page (avatar, bio) — not started; users get a row via the `handle_new_user` trigger but there's no edit UI yet
- ✅ "Become a Model Farmer" flow → create FarmerProfile
- 🔄 Create/edit Farm Profile (name, description, photos, tags) — text fields done; photo upload (Supabase Storage) not yet built
- ✅ Google Maps link input + validation + lat/lng parse (best-effort) + embed preview
- 🔄 Open/Closed toggle + weekly schedule + blackout dates — toggle and weekly schedule done; blackout dates not yet built

**Goal:** a farmer can register and publish a complete farm profile.

---

## Milestone 2 — Discovery
- 🔄 Public Farm Profile page (About / Posts / Shop / Reviews tabs) — About tab done (`/farms/[id]`: description, tags, weekly hours, Google Maps embed, WhatsApp booking form); Posts/Shop/Reviews tabs not yet built
- 🔄 Search page with filters (location text, tags, open-now, price) — `/farms` has name search + open-now filter; tag/location/price filters not yet built
- ☐ Sort (newest, rating — distance sort if lat/lng available)
- ☐ Farm Posts feed (farmer can post text + photos; visitors can view)

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
- ☐ Farmer: add/edit/delete products (name, photo, price, unit, stock status)
- ☐ Public Shop tab on Farm Profile
- ☐ "Order via WhatsApp" (single item + multi-select cart-to-message)
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
- ☐ Admin login/role
- ☐ Approve/verify farmer + farm listings
- ☐ Moderate reported posts/reviews/profiles
- ☐ Manage tags/categories taxonomy
- ☐ Basic analytics dashboard (farms count, bookings requested, active users)

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
