# LokalScout — Product & Engineering Roadmap

*Target Release: Sep 2026 Production Build*

---

## 🎯 High-Level Status Dashboard

| Module | Status | Priority | Target Completion |
| :--- | :--- | :--- | :--- |
| **Backend Engine (`engine/`)** | 🟢 Complete | P0 | Milestone 1 |
| **Data Pipelines (Overpass, Heuristics, Gemini)** | 🟢 Complete | P0 | Milestone 1 |
| **Frontend Next.js App (`frontend/`)** | 🟢 Complete | P0 | Milestone 2 |
| **Interactive 10-Section Dossier & Free Teaser** | 🟢 Complete | P0 | Milestone 2 |
| **Area Comparison Engine (`/compare`)** | 🟢 Complete | P1 | Milestone 3 |
| **Cashfree PG Checkout & Webhook Unlock** | 🟢 Complete | P1 | Milestone 3 |
| **Pin Code Territory Watchdog (`/api/watchdog`)** | 🟢 Complete | P1 | Milestone 4 |
| **True Pedestrian Walkshed & Dayparting Curves** | 🟢 Complete | P1 | Milestone 4 |
| **Turnkey Fit-Out Estimator & Google 3-Pack Sandbox** | 🟢 Complete | P1 | Milestone 4 |
| **GrowLokal Conversion Bridge & Lead Capture** | 🟢 Complete | P1 | Milestone 4 |
| **VPS Deployment Packaging (Docker + Caddy)** | 🟢 Complete | P1 | Milestone 4 |

---

## 🚀 Milestone Breakdown

### Milestone 1: Scouting & Feasibility Engine Backend
- [x] Architecture design & schema specification (`engine/app/models/schemas.py`)
- [x] Geocoding service with Indian locality & pin code resolution (`engine/app/services/geocoding.py`)
- [x] Overpass API POI pipeline with 2.5 km radius footfall anchors (`engine/app/services/overpass.py`)
- [x] True pedestrian walkshed isochrones (5-min & 10-min catchment calculation with urban friction barriers)
- [x] Competitor scraper & review sentiment extraction (`engine/app/services/scraper.py`)
- [x] Indian micro-market rental & unit economics break-even engine (`engine/app/services/financial_model.py`)
- [x] 24-hour dayparting curve & smart shift scheduler modeling
- [x] Turnkey commercial interior fit-out cost estimator & zero-brokerage property matching
- [x] Google 3-Pack pre-opening simulation sandbox generator
- [x] Gemini 2.5 Flash synthesis returning structured Pydantic JSON (`engine/app/services/ai_synthesis.py`)
- [x] PDF generation engine with high-fidelity executive print stylesheet (`engine/app/services/pdf_generator.py`)
- [x] Pin Code Territory Watchdog router (`engine/app/routers/watchdog.py`)
- [x] FastAPI endpoints: `/api/search/locations`, `/api/feasibility/preview`, `/api/feasibility/generate`, `/api/feasibility/pdf/{id}`
- [x] Multi-area comparison endpoint (`/api/compare`) and Cashfree payments integration (`/api/payments`)
- [x] VPS deployment packaging (Dockerfile, docker-compose.yml, Caddyfile with auto SSL)

### Milestone 2: Next.js Frontend with Turbopack & Clean Commercial SaaS
- [x] Initialize Next.js 15+ App Router application with Turbopack, Tailwind CSS, TypeScript
- [x] Configure modern Plus Jakarta Sans typography, porcelain slate surfaces, emerald accents
- [x] Install & configure UI primitives (Cards, Badges, Tabs, Sliders, Tables)
- [x] Redesigned Landing Page (`/`):
  - Service-first value proposition: *"Know If Your Store Will Make Money Before You Sign The Lease"*
  - Completely eliminated Excel-like tabular grids, monospace developer jargon (`NIC 56101`, `GIS ENGINE v2.6`)
  - Clear visual presentation of the 4 core service deliverables (Footfall, Competitor Reviews, Fair Rent, Daily Break-Even)
  - 3 Simple Steps to Location Clarity
  - Intuition vs. LokalScout Before/After contrast
  - Interactive Micro-Market Footfall Radar with 5-min walk, 10-min walk, and 2.5 km views
  - Visual verified sample dossiers (Madhapur, Indiranagar, Bandra West)
  - Territory Watchdog surveillance banner (₹499/mo)
  - Transparent pricing (₹0, ₹799, ₹1,499) with Cashfree instant checkout
  - Expandable FAQ answering core customer questions
- [x] Dedicated Pages:
  - `/login`: Clean Google Workspace authentication only (no email/password inputs; explicit error if client ID missing)
  - `/contact`: Enterprise consultation inquiry form, WhatsApp advisory, and operating hubs
  - `/pricing`: Transparent pricing tiers with Cashfree instant checkout triggers and FAQ
- [x] Interactive Report Page (`/report/[id]`):
  - Executive scorecard (Feasibility Score, Viability badge, Risk score)
  - 5-Min and 10-Min Pedestrian Walkshed catchment module with barrier alerts
  - 24-Hour Dayparting Footfall Curve & Shift Scheduler
  - Turnkey Interior Fit-Out Capex Estimator with interactive budget sliders
  - Google 3-Pack Sandbox Preview
  - Direct Landlord Commercial Properties (Zero Brokerage)
  - Dynamic Break-Even Calculator with sliders
  - Territory Watchdog real-time surveillance feed
- [x] Showcase Sample Page (`/sample`):
  - Fully unlocked reference dossier for *Specialty Coffee Shop in Madhapur, Hyderabad*

### Milestone 3: Comparative Analysis & Monetization Engine
- [x] Build Area Comparison Page (`/compare`):
  - Side-by-side comparison of 2 or 3 micro-markets (e.g., Madhapur vs. Gachibowli vs. Jubilee Hills)
  - Trade-off matrix (Rental vs. Saturation vs. Affluence)
- [x] Google Identity Services (GIS) / OAuth 2.0 integration
- [x] Cashfree Payment Gateway (`cashfree.com`) integration:
  - Backend Cashfree Order creation (`POST /api/payments/cashfree/create-order`)
  - Frontend Cashfree Drop-in / JS SDK checkout (`@cashfreepayments/cashfree-js`)
  - Webhook verification for automated report unlocking and PDF generation

### Milestone 4: Retention, Surveillance & GrowLokal Bridge
- [x] Territory Watchdog subscription & real-time surveillance (`/api/watchdog/*`, `TerritoryWatchdogModal.tsx`)
- [x] "Opening in 60 Days" GrowLokal Autopilot CTA card with ₹1,000 credit promo code (`LOKALSCOUT1000`)
- [x] Docker, docker-compose, and Caddyfile configuration for seamless VPS deployment
- [x] Institutional corporate README with system architecture, data pipelines, and Cashfree integration

---

## 📈 Key Metrics & Target KPIs
- **Dossier Generation Latency**: < 4.5s for live query; < 200ms for cached reports
- **Free-to-Paid Conversion**: > 4.2% of teaser viewers
- **GrowLokal Autopilot Upsell**: > 8% of paid dossier buyers claiming the ₹1,000 onboarding credit
