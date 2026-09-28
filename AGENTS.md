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

---

## 4. Monetization & Funnel Mechanics

- **Free Tier (₹0)**: Overall score (e.g. 78/100), competitor count within 2 km, top 3 demand anchors.
- **Single Dossier (₹799)**: Full 10-section intelligence report + break-even calculator + downloadable PDF.
- **Area Comparison (₹1,499)**: Side-by-side comparison of 2 or 3 micro-markets with trade-off score.
- **GrowLokal Autopilot Upsell**: ₹1,000 credit toward ₹2,999/mo plan (Google 3-Pack setup, launch landing page, WhatsApp automation).
