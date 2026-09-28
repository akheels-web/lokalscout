# LokalScout — Product & Engineering Roadmap

*Target Release: Sep 2026 Production Build*

---

## 🎯 High-Level Status Dashboard

| Module | Status | Priority | Target Completion |
| :--- | :--- | :--- | :--- |
| **Backend Engine (`engine/`)** | 🟡 In Development | P0 | Milestone 1 |
| **Data Pipelines (Overpass, Heuristics, Gemini)** | 🟡 In Development | P0 | Milestone 1 |
| **Frontend Next.js App (`frontend/`)** | 🟡 In Development | P0 | Milestone 2 |
| **Interactive 10-Section Dossier & Free Teaser** | 🟡 In Development | P0 | Milestone 2 |
| **Area Comparison Engine (`/compare`)** | ⚪ Planned | P1 | Milestone 3 |
| **Razorpay Checkout & Webhook Unlock** | ⚪ Planned | P1 | Milestone 3 |
| **GrowLokal Conversion Bridge & Lead Capture** | ⚪ Planned | P1 | Milestone 4 |
| **VPS Deployment Packaging (Docker + Caddy)** | ⚪ Planned | P1 | Milestone 4 |

---

## 🚀 Milestone Breakdown

### Milestone 1: Scouting & Feasibility Engine Backend
- [x] Architecture design & schema specification (`engine/app/models/schemas.py`)
- [x] Geocoding service with Indian locality & pin code resolution (`engine/app/services/geocoding.py`)
- [x] Overpass API POI pipeline with 2.5 km radius footfall anchors (`engine/app/services/overpass.py`)
- [x] Competitor scraper & review sentiment extraction (`engine/app/services/scraper.py`)
- [x] Indian micro-market rental & unit economics break-even engine (`engine/app/services/financial_model.py`)
- [x] Gemini 2.5 Flash synthesis returning structured Pydantic JSON (`engine/app/services/ai_synthesis.py`)
- [x] PDF generation engine with high-fidelity executive print stylesheet (`engine/app/services/pdf_generator.py`)
- [x] FastAPI endpoints: `/api/search/locations`, `/api/feasibility/preview`, `/api/feasibility/generate`, `/api/feasibility/pdf/{id}`
- [x] Multi-area comparison endpoint (`/api/compare`) and Razorpay payments integration (`/api/payments`)
- [x] VPS deployment packaging (Dockerfile, docker-compose.yml, Caddyfile with auto SSL)

### Milestone 2: Next.js Frontend with Turbopack & Light Enterprise SaaS
- [x] Initialize Next.js 15+ App Router application with Turbopack, Tailwind CSS, TypeScript
- [x] Configure modern Plus Jakarta Sans typography, porcelain slate surfaces, emerald accents
- [x] Install & configure UI primitives (Cards, Badges, Tabs, Sliders, Tables)
- [x] Build Landing Page (`/`):
  - Clean consumer/commercial SaaS layout with category picker + locality search
  - Live interactive GIS Radar & Footfall Buffer simulation (`InteractiveGisCreative.tsx`)
  - Live metric counters & social proof
  - Showcase cards for Madhapur, Indiranagar, and Bandra West
  - Pricing & feature tiers (₹0, ₹799, ₹1,499)
- [x] Build Dedicated Pages:
  - `/login`: Clean Google Workspace authentication and email sign-in with customer testimonial
  - `/contact`: Enterprise consultation inquiry form, WhatsApp advisory, and operating hubs
  - `/pricing`: Transparent pricing tiers with Cashfree instant checkout triggers and FAQ
- [x] Build Interactive Report Page (`/report/[id]`):
  - Executive scorecard (Feasibility Score, Viability badge, Risk score)
  - Section 1–2 unlocked free view
  - Sections 3–10 blur-lock with Cashfree PG instant unlock modal
  - Interactive Break-Even Calculator with dynamic sliders (Rent, Average Order Value, Staff)
  - Demand anchor breakdown (Colleges, Tech parks, Transit)
- [x] Showcase Sample Page (`/sample`):
  - Fully unlocked reference dossier for *Specialty Coffee Shop in Madhapur, Hyderabad*

### Milestone 3: Comparative Analysis & Monetization Engine
- [x] Build Area Comparison Page (`/compare`):
  - Side-by-side comparison of 2 or 3 micro-markets (e.g., Madhapur vs. Gachibowli vs. Jubilee Hills)
  - Trade-off matrix (Rental vs. Saturation vs. Affluence)
- [x] Google OAuth Authentication integration (Sign in with Google, session persistence, saved reports)
- [x] Cashfree Payment Gateway (`cashfree.com`) integration:
  - Backend Cashfree Order creation (`POST /api/payments/cashfree/create-order`)
  - Frontend Cashfree Drop-in / JS SDK checkout (`@cashfreepayments/cashfree-js`)
  - Webhook verification for automated report unlocking and PDF generation

### Milestone 4: Retention, Viral Sharing & GrowLokal Upsell Bridge
- [ ] "Opening in 60 Days" GrowLokal Autopilot CTA card with ₹1,000 credit promo code
- [ ] Lead capture modal for WhatsApp/Email alert when competitor opens in tracked pin code
- [ ] Docker, docker-compose, and Caddyfile configuration for seamless VPS deployment

---

## 📈 Key Metrics & Target KPIs
- **Dossier Generation Latency**: < 4.5s for live query; < 200ms for cached reports
- **Free-to-Paid Conversion**: > 4.2% of teaser viewers
- **GrowLokal Autopilot Upsell**: > 8% of paid dossier buyers claiming the ₹1,000 onboarding credit
