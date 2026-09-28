# Project Memory & Decisions

## Key Decisions:
- **Topology**: Split-cloud architecture. Next.js on Vercel, Python FastAPI Scouting Engine on VPS with Docker & Caddy.
- **Data Pipelines**: Zero-cost foundation using OpenStreetMap/Overpass API + Google Maps POI scraper + micro-market real estate heuristics + Gemini 2.5 Flash for high-level executive synthesis.
- **Resilience**: Every live pipeline has built-in offline/fallback micro-market data across all Tier-1 and major Tier-2 Indian hubs so API timeouts or rate limits never break customer generation.
- **Payments**: Cashfree Payment Gateway (`cashfree.com`) integration via Cashfree Drop-in / JS SDK (replacing Razorpay). Supports UPI (GPay, PhonePe, Paytm), Cards, and NetBanking with instant webhook status synchronization.
- **Authentication**: Google OAuth / Google One Tap integration for verified enterprise user access and saved feasibility dossiers.
- **Design System**: Modern Commercial SaaS (Stripe/Ramp/Linear benchmark). Pure white cards, porcelain slate-50 background (`#f8fafc`), elegant sans-serif typography (`Plus Jakarta Sans`), deep charcoal headings (`#0f172a`), vivid emerald accents (`#059669`). Strictly NO monospace terminal / command-center aesthetics.
- **Dedicated Pages**:
  - `/` (Rich landing page with category picker, interactive radar, metrics, and testimonials)
  - `/login` (Clean Google Workspace & email sign-in with customer testimonial)
  - `/contact` (Enterprise consultation inquiry form, Hyderabad/Bangalore office address, WhatsApp link)
  - `/pricing` (Dedicated clear pricing page with Cashfree payment triggers)
  - `/sample` (Full reference report for Madhapur coffee)
  - `/compare` (Multi-area side-by-side comparison)
  - `/report/[id]` (10-section dossier with free teaser and Cashfree unlock)
