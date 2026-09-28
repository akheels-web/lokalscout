# Project Memory & Decisions

## Key Decisions:
- **Topology**: Split-cloud architecture. Next.js on Vercel, Python FastAPI Scouting Engine on VPS with Docker & Caddy.
- **Data Pipelines**: Zero-cost foundation using OpenStreetMap/Overpass API + Google Maps POI scraper + micro-market real estate heuristics + Gemini 2.5 Flash for high-level executive synthesis.
- **Resilience**: Every live pipeline has built-in offline/fallback micro-market data across all Tier-1 and major Tier-2 Indian hubs so API timeouts or rate limits never break customer generation.
- **Payments**: Cashfree Payment Gateway (`cashfree.com`) integration via Cashfree Drop-in / JS SDK (replacing Razorpay). Supports UPI (GPay, PhonePe, Paytm), Cards, and NetBanking with instant webhook status synchronization.
- **Authentication**: Strict Google Identity Services (GIS) / OAuth 2.0 integration (`https://accounts.google.com/gsi/client`). Exclusively Google Auth (no email/password inputs on `/login` or auth modal). If credentials are missing, an explicit warning banner is rendered instead of simulated mock auto-login.
- **Design System & Landing Page UX**: Modern Commercial SaaS (Stripe/Linear/Ramp benchmark). Pure white cards, porcelain slate-50 background (`#f8fafc`), elegant sans-serif typography (`Plus Jakarta Sans`), deep charcoal headings (`#0f172a`), vivid emerald accents (`#059669`).
  - **Zero Excel / Spreadsheet / Monospace Aesthetics**: Completely replaced developer jargon (`NIC 56101`, `GIS ENGINE v2.6`, `EPSG:4326 Projection`, monospace rows) with intuitive consumer language, clean category icons, and high-impact visual cards.
  - **Service-First Value Proposition**: Immediately communicates what service LokalScout provides:
    1. *Pedestrian Footfall & Catchment Audit* (5-min & 10-min walking reach, barrier warnings).
    2. *Competitor Weakness & Gap Intelligence* (1–3 star Google review complaint extraction).
    3. *Fair Market Rent & Lease Negotiation Shield* (Main road vs inner-lane benchmarks).
    4. *Daily Break-Even Financial Blueprint* (Required daily order volume to cover rent and payroll).
  - **Interactive Features**: 3-step visual workflow, Before/After data contrast, interactive walking catchment radar, visual sample dossiers, Territory Watchdog surveillance banner, and transparent Cashfree pricing tiers.
- **Dedicated Pages**:
  - `/` (Service-first, high-converting commercial SaaS landing page)
  - `/login` (Clean Google Workspace OAuth sign-in)
  - `/contact` (Enterprise consultation inquiry form, Hyderabad/Bangalore office address, WhatsApp link)
  - `/pricing` (Dedicated clear pricing page with Cashfree payment triggers)
  - `/sample` (Full reference report for Madhapur coffee)
  - `/compare` (Multi-area side-by-side comparison)
  - `/report/[id]` (10-section dossier with free teaser and Cashfree unlock)
- **Corporate Documentation**: Comprehensive corporate `README.md` created with institutional positioning, macro market dynamics, split-cloud Mermaid diagrams, Cashfree drop-in payment workflow, 8 commercial retail verticals, REST API reference, and enterprise governance.
