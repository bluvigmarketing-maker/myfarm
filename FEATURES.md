# Features — Farm Training & Agro-Tourism Platform

## Problem Statement
Farmers learn best from other farmers, in person. There is no easy way for
experienced farmers to advertise their farms as places to visit, and no easy
way for learners/tourists to discover and book those visits. This platform
connects the two sides: **Host Farmers** who open their farms for visits, and
**Visitors** (fellow farmers, students, agro-tourists) who want to learn or
tour.

## User Roles
1. **Guest / Visitor** — browses without an account.
2. **Registered Visitor** — can save favorites, book visits, buy from farm shops.
3. **Farmer (Host)** — owns one or more Farm Profiles, manages bookings, posts, and shop items.
4. **Admin (Platform Owner)** — moderates content, verifies farmers, resolves disputes.

Registration uses one account type ("User") that can additionally create a
Farmer Profile — a farmer is also a visitor to other farms.

---

## 1. Farmer Profile
- Name, photo, short bio, years of experience, specialties (e.g. rice, poultry, organic, agroforestry).
- Contact info: WhatsApp number (required), optional phone/email.
- Verification badge (manually approved by Admin — e.g. ID check, farm visit, or community vouching).
- Can own/manage multiple Farm Profiles.

## 2. Farm Profile
- Farm name, **featured/cover image** (shown on the `/farms` archive cards), a **gallery of up to 5 photos**, description.
- **Intro video**: farmer pastes a Facebook, YouTube, or TikTok video link. YouTube links get an inline embed (no API key needed); Facebook/TikTok show as an "open to watch" link.
- **Category**: every farm is one of — Company/Organization Farm, School Farm, Family/Personal Farm. Visitors can filter search by category.
- **Location**: farmer pastes a Google Maps share link (no paid Maps API). System parses/embeds it as a clickable link and, where possible, an embedded preview iframe.
- Category tags: crop types, livestock, farming methods (organic, hydroponics, permaculture...), training topics offered.
- **What's on the farm** — a feed/list of posts (text + photos) about current activities, crops in season, upcoming events. Chronological, like a mini blog/timeline per farm.
- **Open/Closed control**: farmer toggles farm availability (Open/Closed) in real time, plus a weekly schedule (e.g. open Tue–Sun, 8am–4pm) and blackout dates (holidays, harvest lockdown, etc.). Visitors only see booking options when a farm is marked Open for the requested date.
- **Pricing**: farmer sets two separate prices — one for a pure agro-tourism visit, one for a training visit — shown on the farm's public page. Either can be left blank (free / not offered).

## 3. Booking via WhatsApp
- Visitor selects a farm + a proposed date/time + number of people + purpose (training / tour / both).
- "Book via WhatsApp" button generates a **pre-filled WhatsApp deep link** (`wa.me/<farmer-number>?text=...`) containing the visit request details, sent directly to the farmer's WhatsApp — no in-app messaging system to build/maintain.
- Optional: log the booking request in-app (status: Requested) so both sides can track history, even though confirmation happens in WhatsApp.
- Farmer can mark a logged request as Confirmed / Declined / Completed for their own records.

## 4. Farm Shop / Market
- Farmer lists products for sale at **farm-gate price** (produce, seedlings, livestock, processed goods, farm-made crafts) from their dashboard.
- Each product: name, description, photo, price, unit, stock/availability status (In stock / Out of stock / Seasonal).
- **The Market** (`/market`) is the public, multitenant storefront — every farm's products aggregated into one browsable, searchable page. Each listing links back to its farm.
- **Ordering**: "Order via WhatsApp" — same deep-link pattern as booking, sends a pre-filled order message straight to the farmer. No cart, no payment gateway, no middleman (Reserve-mode in-app order tracking remains a later-phase option).

## 5. Search & Discovery
- Search by location (region/province/city, or map area if using a free geocoding fallback), crop/livestock type, training topic, open-now status, price range.
- Filter: Open today, Free entry, Offers training, Has shop, Verified farmer.
- Sort: nearest (if location shared), newest, most visited/rated.
- Map view listing farms as pins linking out to each farm's Google Maps link.
- Featured/curated farms section (Admin-curated) for agro-tourism highlights.

## 6. Visitor Features
- Save/favorite farms.
- View booking history and shop order history.
- Leave a review + star rating after a completed visit.
- Follow a farm to get updates when they post new content.

## 7. Reviews & Trust
- Star rating + text review, tied to a completed booking (prevents fake reviews).
- Farmer can publicly respond to reviews.
- Report/flag inappropriate content (posts, reviews, profiles) to Admin.

## 8. Notifications
- In-app notification center (and optional email) for: booking request logged, farm confirmed/declined, new post from followed farm, new review received.
- WhatsApp remains the primary real-time channel; in-app notifications are secondary/asynchronous.

## 9. Admin Panel
- Approve/verify farmer accounts and farm listings.
- Moderate posts, reviews, and reported content.
- Manage category/tag taxonomy.
- View basic platform analytics (farms listed, bookings requested, active users).

## 10. Non-Functional Requirements
- Mobile-first (most farmers and visitors will use phones).
- Works on low bandwidth (optimize images, avoid heavy JS where possible).
- No paid third-party APIs required for MVP (Google Maps used only via free share-link embedding, WhatsApp via free `wa.me` deep links).
- Multi-language ready (structure for future localization, e.g. English + local language).

## 11. Interactive Onboarding Tour
- A friendly goat mascot ("Billy") greets every new visitor and asks what they're here for: **become a Model Farmer**, **learn & visit farms**, or **both**.
- Each choice leads to a short, plain-English (grade 5 reading level) walkthrough of the relevant flow, ending in a call-to-action (sign up, or browse farms).
- **Spotlights real UI**: whenever a step talks about a specific button or link (e.g. "Find a Farm," the search bar), it actually navigates there and highlights that real element with a glowing ring, dimming the rest of the page. Steps describing dashboard-only actions (which require login) stay text-only since there's no real element to point at for an anonymous visitor.
- Skippable at any point; a small floating "Take the tour" button lets anyone replay it later.
- Shown once automatically per browser (remembered via local storage), never blocks the app itself.

---

## Feature Priority (MVP vs Later)
**MVP (must-have):**
- Farmer + Visitor accounts
- Farm profile CRUD with Google Maps link, gallery, open/closed toggle + schedule
- Farm posts/timeline
- Search & filter farms
- WhatsApp booking deep link (+ logged request status)
- Farm shop (inquiry mode via WhatsApp)
- Basic Admin moderation

**Phase 2:**
- Reviews & ratings
- Favorites/follow
- In-app notifications
- Shop reserve mode with order tracking

**Phase 3 (growth):**
- Multi-language
- Analytics dashboard for farmers (visits, shop interest)
- Curated agro-tourism collections / featured farms
- Optional paid promotion for farms (monetization)
