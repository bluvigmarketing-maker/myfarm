# Design — Farm Training & Agro-Tourism Platform

## 1. Tech Stack (recommended)
Chosen for low/zero cost to start, fast solo-dev velocity, and mobile-first delivery.

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (React) + Tailwind CSS | SSR for SEO (farms need to be Google-searchable), single codebase for web + easy PWA. |
| Backend/API | Next.js API routes (or separate Node/Express if it grows) | Keep one repo for MVP simplicity. |
| Database | PostgreSQL via Supabase | Free tier, built-in Auth, Storage (for photos), and Row Level Security. |
| Auth | Supabase Auth (email + phone OTP) | Farmers may prefer phone-number login over email. |
| File/Image storage | Supabase Storage | Free tier covers MVP photo galleries. |
| Hosting | Vercel (frontend) + Supabase (backend/db) | Free tiers, minimal ops. |
| Maps | No API — store raw Google Maps **share link** per farm; render as a link/button and, when possible, extract lat/lng from the URL to show a static/basic embedded `<iframe>` (Google Maps embed via link needs no API key). |
| Messaging/Booking | `wa.me` deep links (WhatsApp Click to Chat) | Zero cost, zero infra, works instantly on mobile. |
| Notifications | In-app table + optional free email (Resend/Supabase) | No SMS cost in MVP. |

> This is a recommendation, not a lock-in — swap pieces (e.g. Firebase instead of Supabase) if you have existing familiarity, but the *shape* below stays the same.

---

## 2. Data Model (core entities)

```
User
 - id, name, email/phone, password_hash (or Supabase auth id)
 - role: visitor | farmer | admin  (a user can hold farmer capability + still act as visitor)
 - avatar_url, bio, created_at

FarmerProfile
 - id, user_id (FK), verified (bool), years_experience, specialties[]

Farm
 - id, farmer_id (FK -> FarmerProfile)
 - name, description, cover_photo_url (featured image, shown on /farms cards)
 - intro_video_url (Facebook, YouTube, or TikTok link)
 - category: company_organization | school | family_personal
 - gmaps_link (raw URL), lat, lng (parsed, nullable)
 - status: open | closed (manual override)
 - schedule: [{day_of_week, open_time, close_time}]
 - blackout_dates: [date]
 - price_agro_visit (nullable — null = free/unset)
 - price_training (nullable — null = free/unset)
 - tags[] (crop/livestock/training topics)
 - created_at, updated_at

FarmPhoto (gallery — capped at 5 per farm in the app layer)
 - id, farm_id, url, caption, sort_order

FarmPost
 - id, farm_id, text, photo_urls[], created_at

BookingRequest
 - id, farm_id, visitor_id
 - requested_date, num_people, purpose (training/tour/both), message
 - status: requested | confirmed | declined | completed
 - whatsapp_sent_at
 - created_at

Product (Farm Shop item)
 - id, farm_id, name, description, photo_url
 - price, unit, stock_status: in_stock | out_of_stock | seasonal

ShopOrderRequest  (Phase 2 "reserve mode")
 - id, farm_id, visitor_id, items[{product_id, qty}], status, created_at

Review
 - id, farm_id, visitor_id, booking_id (FK, must be completed)
 - rating (1-5), text, farmer_response, created_at

Favorite
 - user_id, farm_id

Report (moderation)
 - id, reporter_id, target_type, target_id, reason, status
```

---

## 3. Key Flows

### 3.1 Farmer Onboarding
1. Sign up / log in.
2. Create Farmer Profile (bio, experience, WhatsApp number).
3. Create Farm Profile: name, description, photos, paste Google Maps link, set tags, set schedule & open/closed default.
4. (Optional) Add first Farm Post and first Shop products.
5. Submit for Admin verification badge (non-blocking — farm can go live unverified, badge appears once approved).

### 3.2 Visitor Booking Flow
1. Search/browse farms (filters: location, tags, open-now, price).
2. Open Farm Profile → see gallery, posts, schedule, reviews.
3. Click **"Book a Visit"** → mini form (date, people count, purpose, note).
4. System builds a pre-filled WhatsApp message and opens `wa.me/<number>?text=...`.
5. System logs a `BookingRequest` (status = requested) for both parties' history.
6. Farmer confirms the real arrangement over WhatsApp, then updates status in-app (optional but encouraged, unlocks review eligibility).

### 3.3 Farm Shop Flow (MVP: inquiry mode)
1. Farmer adds products (name, description, photo, price, unit) from the Farm Shop section of their farm's dashboard edit page.
2. Visitor browses the public **Market** (`/market`) — every farm's products aggregated into one searchable, multitenant storefront — or a single farm's shop items.
3. Click **"Order via WhatsApp"** on a product.
4. Pre-filled WhatsApp message with the product name/unit sent to the farmer.
5. Farmer fulfills and settles payment in person/via WhatsApp (cash, e-wallet link farmer already uses, etc.) — no payment gateway in MVP.

### 3.4 Open/Closed Control
- Farmer has a single toggle (Open Now / Closed) shown prominently on their dashboard, overriding the weekly schedule for same-day changes (e.g. rain, harvest emergency).
- Weekly schedule + blackout dates drive the default "Open" badge shown to visitors when no manual override is active.
- Booking form disables date selection outside schedule/blackout, and shows a warning if the farm is currently Closed.

### 3.5 Google Maps Without a Paid API
- Farmer copies a share link from the Google Maps app/site (`https://maps.app.goo.gl/...` or `https://www.google.com/maps/@lat,lng,zoom` or `/place/...`).
- On save, attempt to parse lat/lng out of the URL pattern (works for most standard/expanded link formats) for use in simple distance sorting.
- Display: a "Open in Google Maps" button (always works, zero cost) plus a best-effort `<iframe src="https://www.google.com/maps?q=<link-or-coords>&output=embed">` preview (Google's embed-via-URL doesn't require an API key for basic embeds).
- If parsing fails, still store and show the raw link — never block farm creation on this.

---

## 4. UI / Visual Direction
- **Mobile-first**, large tap targets, minimal typing (most actions are tap → WhatsApp handoff).
- **Tone**: warm, earthy, trustworthy — greens/browns/earth tones, real farm photography over stock/illustration.
- **Farm Profile page** is the centerpiece: hero photo, quick facts bar (open status, price, distance), tabs for About / Posts / Shop / Reviews.
- **Search/Home page**: card grid of farms (photo, name, tags, open badge, rating), sticky filter bar.
- **Farmer Dashboard**: single screen with Open/Closed switch front-and-center, booking requests list, quick-add post/product buttons.
- Use skeleton loaders and compressed images (WebP, responsive `srcset`) for low-bandwidth users.
- Consider a installable **PWA** (add-to-homescreen) so farmers/visitors in rural areas get an app-like experience without app-store distribution.

### 4.1 Design system (implemented)
Two hue families, following the same structure as the reference
`DESIGN-SYSTEM.md` (River Church Eldoret style) with navy→green and gold→brown:

| Layer | Choice |
|---|---|
| Component primitives | shadcn/ui (`style: "base-nova"`, built on `@base-ui/react`) — Button, Card, Badge, Sheet, Dialog, DropdownMenu, NavigationMenu, Separator |
| Motion | Framer Motion — `AnimatedSection` (scroll-triggered fade+rise, `viewport={{ once: true }}`) |
| Icons | lucide-react |
| Fonts | Geist Sans (body), Geist Mono, Playfair Display (`font-heading`, used on `h1`–`h4`) |

**Color scale** (`src/app/globals.css`): `--green-50`…`--green-950` (structural —
header/footer/hero surfaces, body text) and `--brown-50`…`--brown-900` (soil
accent — CTAs, focus rings, eyebrow labels). `--green-800` (#166534) is the
primary brand color; `--green-950` is the dark surface for `PageHero` and
`SiteFooter`; brown becomes `--primary` when `.dark` is active (not currently
toggled anywhere in the app, but defined for parity with the reference system).

**Shared primitives** (`src/components/`): `Container` (`max-w-6xl` content
width), `SectionHeading` (eyebrow pill → serif title → brown underline →
description), `PageHero` (dark green banner for non-home pages), `AnimatedSection`.

**Utilities**: `.btn-earthy` (brown gradient shimmer, the primary CTA
treatment — replaces the reference's `.btn-metallic`/gold) and `.soil-line`
(thin brown border accent — replaces `.gold-line`).

**Base UI gotcha**: `Button`/`Badge` support a `render` prop for polymorphic
rendering (e.g. `<Button render={<Link href="/farms" />}>`), but pass
`nativeButton={false}` whenever the render target isn't a real `<button>` —
otherwise Base UI logs an accessibility warning in dev.

**Home hero background** (`src/components/hero-background.tsx`): five
crossfading photos behind the hero text, swapped every 7s (`AnimatePresence`
opacity fade, ~1.6s), picking a landscape or portrait image set at runtime
based on `window.innerWidth < 768 || innerHeight > innerWidth` — landscape
photos are wide farm-field shots, portrait photos are the same theme
pre-cropped to 1080×1920 (assets in `public/hero/`). Overlay is a flat
`bg-black/50` plus a subtle green top/bottom gradient (`from-green-950/60
via-transparent to-green-950/25`) — deliberately a single flat scrim rather
than a text-following vignette, since a uniform overlay held up as the most
comfortable/least distracting option when tested against both a dark
(cows) and a light (sheep) source photo. Respects
`prefers-reduced-motion` (skips the crossfade). Text on this hero switches
to the dark-hero treatment (white heading, `text-green-50` body, translucent
white outline button) since the reference `PageHero` pattern's light-on-dark
combo already existed elsewhere in the app.

---

## 5. Security & Trust Considerations
- Rate-limit booking/order WhatsApp-link generation to prevent spam.
- Only allow reviews tied to a `completed` BookingRequest.
- Sanitize/validate the pasted Google Maps link (must match known Google domains) before storing/rendering to avoid link injection.
- Admin verification flag is manual, not automatic — protects against fake farm listings.
- Store WhatsApp numbers but never expose other visitors' personal contact info publicly.
