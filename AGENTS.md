# LokalScout — Agent Instructions & Architectural Memory

> **LokalScout (`lokalscout.in`)** is a Hyperlocal Business Feasibility & Commercial Location Intelligence Platform powered by GrowLokal.
> It equips entrepreneurs, doctors, salon founders, and franchisees across India with enterprise-grade location viability dossiers (₹799–₹1,499) while acting as the top-of-funnel customer acquisition engine for GrowLokal's core subscription (₹2,999/mo).

---

## 1. System Architecture & Split Topology

The platform operates on a split-cloud, cost-optimized, low-latency architecture:

1. **Frontend (`frontend/`)**:
   - Next.js 15+ (App Router) with Turbopack.
   - **Modern Consumer & Commercial SaaS Aesthetic** (Stripe, Ramp, Linear, Placer.ai). Warm porcelain slate background (`#f8fafc`), pure white elevated cards with soft multi-layered shadows (`shadow-sm`, `shadow-xl shadow-slate-200/50`), elegant sans-serif typography (Plus Jakarta Sans / Inter). NO internal tool / terminal monospace aesthetics.
   - Rich visual presentation: Visual micro-market preview cards, interactive GIS radar with visual badges, real review cards with avatars, interactive break-even financial sliders, and visual metric gauges.
   - Dedicated pages:
     - `/`: High-converting, visually rich landing page with category pills, live sample dossiers, interactive radar, and trust badges.
     - `/login`: Clean enterprise Google OAuth & email authentication page with client testimonial side-panel.
     - `/contact`: Enterprise inquiries, custom multi-city franchise scouting requests, and WhatsApp connect.
     - `/pricing`: Transparent pricing tiers (₹0, ₹799, ₹1,499, ₹3,999/mo) with Cashfree instant checkout.
     - `/sample`: 100% unlocked reference dossier for Specialty Coffee in Madhapur.
     - `/compare`: Multi-area side-by-side comparative analysis.
     - `/report/[id]`: Interactive 10-section dossier with free teaser and Cashfree PG unlock.
   - Cashfree Payment Gateway (`cashfree.com`) integration via Cashfree Drop-in / JS SDK for instant UPI, Cards, and NetBanking processing.
   - Google Authentication for enterprise founders and franchisees.
   - Deployed to Vercel (Hobby Tier: ₹0/mo).

2. **Backend Engine (`engine/`)**:
   - Python FastAPI asynchronous server with Pydantic v2 validation.
   - Cashfree PG order generation & webhook verification (`engine/app/routers/payments.py`).
   - Modular data pipeline:
     - **Stream A**: OpenStreetMap / Overpass API (₹0) for footfall anchors (colleges, tech parks, malls, transit).
     - **Stream B**: Micro-market competitor density & review sentiment extraction (Google Maps crawler & Overpass tags).
     - **Stream C**: Micro-market real estate rental benchmarks & unit-economics break-even mathematical modeling.
     - **Stream D**: Google Gemini 2.5 Flash synthesis returning strictly structured, typed JSON intelligence.
     - **Stream E**: On-demand printable HTML-to-PDF engine with custom print stylesheets.
   - Engineered for VPS deployment (`engine.lokalscout.in`) inside Docker with Caddy (Auto Let's Encrypt SSL).

---

## 2. Coding Guidelines & Inviolable Rules

- **Sep 2026 Standards**: Use modern async Python (Python 3.12+), Pydantic v2, Next.js 15+, React 19, TypeScript strict mode.
- **Fail-Safe Data Pipeline**: If external POI or geocoding services experience rate limits or timeouts, fallback gracefully to curated Indian micro-market heuristics (covering Hyderabad, Bengaluru, Mumbai, Delhi-NCR, Pune, Chennai, Kolkata, Ahmedabad) so dossiers never fail to render.
- **No Backdated Design**: Every UI view must look like a high-end SaaS product (Linear / Stripe / Vercel design aesthetic: high-contrast typography, refined borders, dark slate accents, glowing badges, clean financial data cards).
- **Code Reuse**: Share common types and schemas between the financial modeling heuristics, Gemini synthesis, and frontend display components.
- **Maintain Memory**: Keep `AGENTS.md` and `roadmap.md` updated as features evolve. Never remove architectural decisions without noting the rationale.

---

## 3. High-Value Indian Business Verticals Handled

1. **Specialty Coffee Shop / Café** (₹15L–₹35L Capex)
2. **Dental Clinic / Diagnostic Center** (₹20L–₹50L Capex)
3. **Unisex Salon & Luxury Spa** (₹18L–₹40L Capex)
4. **Cloud Kitchen / QSR Delivery Hub** (₹10L–₹25L Capex)
5. **Gym / Functional Fitness Studio** (₹25L–₹60L Capex)
6. **Pharmacy & Chemist Store** (₹12L–₹30L Capex)
7. **Boutique Bakery & Patisserie** (₹15L–₹30L Capex)
8. **Pet Clinic & Grooming Lounge** (₹15L–₹35L Capex)
9. **Boutique Coworking Space** (₹35L–₹70L Capex)
10. **Fine Casual Dine-In Restaurant & Bar** (₹35L–₹80L Capex)
11. **Boutique Fashion & Ethnic Wear** (₹20L–₹45L Capex)
12. **Eyewear Store & Optometry** (₹15L–₹35L Capex)
13. **Pathology & Diagnostic Lab** (₹25L–₹55L Capex)
14. **Preschool & Early Daycare** (₹20L–₹45L Capex)
15. **Automobile Detailing Studio** (₹18L–₹40L Capex)
16. **Organic Grocery & Gourmet Mart** (₹20L–₹50L Capex)
17. **Microbrewery & Craft Beer Taproom** (₹60L–₹1.5Cr Capex)
18. **Artisanal Ice Cream & Dessert Parlor** (₹12L–₹25L Capex)
19. **Custom Venture Support**: Founders can enter ANY concept (e.g. Pilates Studio, Board Game Cafe); the engine dynamically models unit economics, fit-out ratios, and searches commercial registries without breaking.

---

## 4. Monetization & Funnel Mechanics

- **Free Tier (₹0)**: Overall score (e.g. 78/100), competitor count within 2 km, top 3 demand anchors.
- **Single Dossier (₹799)**: Full 10-section intelligence report + break-even calculator + downloadable PDF.
- **Area Comparison (₹1,499)**: Side-by-side comparison of 2 or 3 micro-markets with trade-off score.
- **GrowLokal Autopilot Upsell**: ₹1,000 credit toward ₹2,999/mo plan (Google 3-Pack setup, launch landing page, WhatsApp automation).

---

## 5. Frontend Sanitization & Micro-Market Intelligence Rules

- **Zero Internal Provider/Vendor Exposure**: Never display internal vendor/tool names (`Cashfree`, `Overpass`, `OSM`, `Nominatim`, `FastAPI`, `SQLite`) to end users in UI copy, buttons, modals, or FAQ. Refer to payments as "Instant UPI & Card Checkout" / "Secure Payment Gateway" and data streams as "verified commercial registries", "spatial walking isochrones", and "real-time pedestrian footfall telemetry".
- **Sub-Locality & Centroid Precision**: Scouting is not limited to macro-localities. Sub-markets (e.g. Ayyappa Society, Kavuri Hills, 100ft Road in Madhapur; Pali Hill in Bandra West; 12th Main in Indiranagar) are indexed.
- **Physical GPS 1-Click Detection**: Browser GPS (`navigator.geolocation`) calls `GET /api/search/reverse?lat=...&lng=...` to reverse geocode physical coordinates into sub-localities on the fly, allowing founders physically auditing properties to audit the exact shopfront coordinates.

---

## 6. Indian English Copy, SEO & Commercial Rent Disclaimers

- **Indian English Business Phrasing**: Copy must be simple and directly relatable for Indian entrepreneurs, doctors, salon founders, and franchisees. Avoid western/consulting jargon (replace "telemetry", "spatial catchment", "isochrone walkshed" with "walking customer footfall", "tech parks, colleges & apartment societies", "daily sales needed to break even", "3-year commercial rental agreement", and "advance pagdi/deposit").
- **Commercial Rent Pricing Is Always Approximate**: Never commit to commercial rent per sq.ft as 100% exact. Always mark rental rates as indicative benchmarks (`~₹125 / sq.ft (Approx)*`) with a clear disclaimer notice explaining that rent varies by road frontage, floor level (ground vs upper floor), building age, carpet efficiency, and direct landlord negotiations.
- **Complete SEO Suite**:
  - Dynamic `sitemap.ts` (`/sitemap.xml`) indexing core pages and top Indian micro-markets.
  - `robots.ts` (`/robots.txt`) with rules for search engines and LLM crawlers (`GPTBot`, `PerplexityBot`, `ClaudeBot`).
  - `llms.txt` and `llms-full.txt` standards served under `/public/`.
  - Schema.org JSON-LD structured data (`SoftwareApplication`, `Organization`, `ContactPoint`) embedded globally in `layout.tsx`.
  - SEO-centric 5-column directory footer indexing Indian metros (Hyderabad, Bengaluru, Mumbai, Pune, Delhi-NCR), business verticals, feasibility tools, and WhatsApp advisory.


