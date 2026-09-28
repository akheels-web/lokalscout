# LokalScout — Complete Beginner's End-to-End Production Deployment Guide

> **Architecture Overview:**
> - **Frontend**: Next.js 15+ App Router deployed on **Vercel** (Hobby Tier: ₹0/mo).
> - **Backend Engine**: FastAPI + SQLite cache + Caddy (Auto SSL) deployed on any **Linux VPS** (Dockerized: ~₹400–₹800/mo).
> - **DNS & Domain**: **Cloudflare** managing `lokalscout.in` and `engine.lokalscout.in`.
> - **Authentication**: Google OAuth 2.0 (Google Identity Services).
> - **Payments**: Cashfree Payment Gateway (Drop-in JS SDK).
> - **APIs**: Google Places API (New) [$200 free monthly credit] & Google Gemini 2.5 Flash [free tier].

---

## Table of Contents
1. [Prerequisites Checklist](#1-prerequisites-checklist)
2. [Step 1: Obtain All External API Keys & Credentials](#step-1-obtain-all-external-api-keys--credentials)
   - [1.1 Google Cloud Platform (OAuth Client ID & Places API)](#11-google-cloud-platform-oauth--places-api)
   - [1.2 Google Gemini AI API Key](#12-google-gemini-ai-api-key)
   - [1.3 Cashfree Payment Gateway Credentials](#13-cashfree-payment-gateway-credentials)
3. [Step 2: Cloudflare DNS Setup](#step-2-cloudflare-dns-setup)
4. [Step 3: Backend Engine Deployment on VPS (Docker + Caddy)](#step-3-backend-engine-deployment-on-vps)
5. [Step 4: Frontend Deployment on Vercel](#step-4-frontend-deployment-on-vercel)
6. [Step 5: End-to-End Verification Checklist](#step-5-end-to-end-verification-checklist)
7. [Step 6: Day-2 Maintenance, Logs & Troubleshooting](#step-6-day-2-maintenance-logs--troubleshooting)

---

## 1. Prerequisites Checklist

Before starting, ensure you have:
1. A domain name purchased (e.g. `lokalscout.in` from GoDaddy, Namecheap, or Hostinger).
2. A free [Cloudflare](https://dash.cloudflare.com) account.
3. A free [GitHub](https://github.com) account with your LokalScout code pushed to a private or public repo.
4. A free [Vercel](https://vercel.com) account (sign in with GitHub).
5. A Linux VPS (Ubuntu 22.04 or 24.04 LTS). Recommended budget providers:
   - **Hetzner Cloud** (CX22 / CPX11 — ~€3.79/mo ≈ ₹350/mo) — *Best value & reliability*
   - **DigitalOcean** (Basic Droplet 1GB/2GB RAM — $4–$6/mo)
   - **Hostinger VPS** (KVM 1 / KVM 2 — ₹449/mo)
   - **AWS EC2** (t4g.small or t3.small)

---

## Step 1: Obtain All External API Keys & Credentials

### 1.1 Google Cloud Platform (OAuth & Places API)

Google Cloud provides **$200 (≈ ₹16,800) in recurring free credits every single month** for Google Maps/Places APIs.

#### A. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top left → **New Project**.
3. Project Name: `lokalscout-platform` → Click **Create**.
4. Make sure your newly created project is selected in the top bar.

#### B. Setup Google OAuth 2.0 (For Login)
1. Go to **APIs & Services** → **OAuth consent screen** (from left sidebar).
2. User Type: Select **External** → Click **Create**.
3. Fill in the App details:
   - **App name**: `LokalScout`
   - **User support email**: Your Gmail / founder email.
   - **Developer contact information**: Your Gmail.
   - Click **Save and Continue** (skip Scopes by clicking **Save and Continue**).
   - In "Test Users", you can add your own email while testing, or click **Publish App** to make it live for any Google user.
4. Go to **Credentials** (left sidebar) → Click **+ Create Credentials** → Select **OAuth client ID**.
5. Application type: Select **Web application**.
6. Name: `LokalScout Web Client`.
7. **Authorized JavaScript origins**:
   - `http://localhost:3000` *(for local testing)*
   - `https://lokalscout.in`
   - `https://www.lokalscout.in`
8. **Authorized redirect URIs**:
   - `http://localhost:3000`
   - `https://lokalscout.in`
   - `https://www.lokalscout.in`
9. Click **Create**.
10. Copy your **Client ID** (it looks like `123456789-abcdef.apps.googleusercontent.com`). Save this as `GOOGLE_CLIENT_ID`.

#### C. Enable Google Places API (New) & Generate API Key
1. In Google Cloud Console, click the top search bar, type **Places API (New)**, and click on it.
2. Click **Enable**.
3. Go back to **APIs & Services** → **Credentials**.
4. Click **+ Create Credentials** → **API key**.
5. Copy the generated key. Save this as `GOOGLE_PLACES_API_KEY`.
6. *(Recommended)* Click **Edit API Key**:
   - Under "API restrictions", select **Restrict key** → Check **Places API (New)**.
   - Click **Save**.

---

### 1.2 Google Gemini AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click the blue **Get API key** button in the left sidebar.
4. Click **Create API key** → Select your Google Cloud project (`lokalscout-platform`).
5. Copy the key. Save this as `GEMINI_API_KEY`.
   *(Gemini 2.5 Flash free tier allows 15 requests per minute and 1M tokens/day at ₹0 cost).*

---

### 1.3 Cashfree Payment Gateway Credentials

1. Register an account at [cashfree.com](https://www.cashfree.com).
2. Go to the **Merchant Dashboard**:
   - **Sandbox Mode** (For immediate testing without KYC):
     - Click **Developers** in the left sidebar → **API Keys**.
     - Under "Payment Gateway", copy:
       - **App ID** (e.g. `TEST10293847...`) → Save as `CASHFREE_APP_ID`
       - **Secret Key** (e.g. `cfsk_ma_test_...`) → Save as `CASHFREE_SECRET_KEY`
       - `CASHFREE_ENV=sandbox`
   - **Production Mode** (For accepting real Indian UPI/Cards):
     - Complete business KYC.
     - Switch the dashboard toggle from **Test** to **Live**.
     - Generate live API keys under Developers → API Keys.
     - `CASHFREE_ENV=production`
3. In Cashfree Dashboard → **Developers** → **Webhooks**:
   - Click **Add Webhook URL**.
   - URL: `https://engine.lokalscout.in/api/payments/cashfree/webhook`
   - Event: Select `PAYMENT_SUCCESS`, `ORDER_PAID`.

---

## Step 2: Cloudflare DNS Setup

Using Cloudflare provides free SSL, DDoS protection, edge caching, and DNS management.

### 2.1 Add Domain to Cloudflare
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Click **Add a Site** → Enter `lokalscout.in` → Choose the **Free** plan.
3. Cloudflare will give you two nameservers (e.g. `alice.ns.cloudflare.com` & `bob.ns.cloudflare.com`).
4. Go to your domain registrar (GoDaddy, Namecheap, or Hostinger) → **Manage DNS** → Change nameservers to Cloudflare's nameservers.
5. Wait 5–15 minutes for nameserver propagation.

### 2.2 Configure DNS Records in Cloudflare
Go to your Cloudflare dashboard for `lokalscout.in` → **DNS** → **Records** → Add the following 3 records:

| Type | Name | Content / Target | Proxy Status | Purpose |
|---|---|---|---|---|
| **CNAME** | `@` (or `lokalscout.in`) | `cname.vercel-dns.com` | **Proxied** (Orange Cloud) | Frontend Landing Page |
| **CNAME** | `www` | `cname.vercel-dns.com` | **Proxied** (Orange Cloud) | Frontend www alias |
| **A** | `engine` | `YOUR_VPS_IP` *(e.g. 159.65.12.34)* | **DNS Only** (Grey Cloud) ⚠️ | Backend API Engine |

> ⚠️ **CRITICAL NOTE ON `engine` RECORD**: 
> Set the `engine` record to **DNS Only** (Grey cloud), NOT Proxied (Orange cloud).
> This allows Caddy on your VPS to directly communicate with Let's Encrypt and automatically issue valid SSL certificates on port 80/443 without certificate conflicts.

### 2.3 Set SSL/TLS Encryption Mode
1. In Cloudflare, go to **SSL/TLS** (left menu).
2. Select **Full** (or **Full (Strict)**).

---

## Step 3: Backend Engine Deployment on VPS

We deploy the Python FastAPI engine inside Docker with Caddy acting as the reverse proxy and automatic SSL manager.

### 3.1 Connect to Your VPS
Open PowerShell or your terminal:
```bash
ssh root@YOUR_VPS_IP
```
*(Enter your VPS password or SSH key).*

### 3.2 Install Docker & Docker Compose on VPS
Run these commands on your Ubuntu VPS:
```bash
# 1. Update system packages
apt update && apt upgrade -y

# 2. Install essential tools
apt install -y git curl ufw

# 3. Configure firewall (allow SSH, HTTP, HTTPS)
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 4. Install Docker using official convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 5. Verify Docker is running
docker --version
docker compose version
```

### 3.3 Clone the Repository onto VPS
```bash
# Create project folder
mkdir -p /var/www/lokalscout
cd /var/www/lokalscout

# Clone your repository
git clone https://github.com/YOUR_GITHUB_USERNAME/lokalscout.git .

# Move into the engine directory
cd engine
```

### 3.4 Create Production `.env` File on VPS
In `/var/www/lokalscout/engine`, create the production environment file:
```bash
nano .env
```
Paste your actual credentials:
```env
# Server
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production

# Google Gemini API
GEMINI_API_KEY=AIzaSy...your_gemini_key_here
GEMINI_MODEL=gemini-2.5-flash

# Google Places API ($200 free credit)
GOOGLE_PLACES_API_KEY=AIzaSy...your_places_key_here

# Cashfree Payments Gateway
CASHFREE_APP_ID=TEST102938...your_app_id
CASHFREE_SECRET_KEY=cfsk_ma_...your_secret_key
CASHFREE_API_VERSION=2023-08-01
CASHFREE_ENV=sandbox

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com

# SQLite Persistent Cache Path
LOKALSCOUT_DB_PATH=/app/data/lokalscout_cache.db

# Security Secret (Generate any random 32-character string)
API_AUTH_SECRET=lokalscout_prod_sec_9938472910482910
```
*(Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit).*

### 3.5 Launch the Backend Containers
Run docker compose to build and launch both FastAPI and Caddy:
```bash
docker compose up -d --build
```

### 3.6 Verify Backend is Live & Healthy
Check the container logs:
```bash
docker compose logs -f
```
*(You will see Caddy successfully obtaining a Let's Encrypt certificate for `engine.lokalscout.in` and FastAPI starting up).*

Test the endpoints from your terminal or browser:
```bash
curl -I https://engine.lokalscout.in/health
# Response: HTTP/2 200 OK

curl https://engine.lokalscout.in/api/crawler/stats
# Response: JSON showing cached competitors, rent listings, and search trends
```

---

## Step 4: Frontend Deployment on Vercel

Vercel provides zero-configuration hosting for Next.js with automatic global CDN caching and SSL.

### 4.1 Push Your Code to GitHub
Ensure all latest changes are committed and pushed to GitHub:
```bash
git add .
git commit -m "feat: complete zero-cost data pipeline and deployment setup"
git push origin main
```

### 4.2 Import Project in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Select your `lokalscout` repository and click **Import**.
4. In the configuration screen:
   - **Framework Preset**: `Next.js` (detected automatically).
   - **Root Directory**: Click **Edit** → Select `frontend` → Click **Continue**.
5. Expand **Environment Variables** and add the following 2 variables:

| Key | Value | Explanation |
|---|---|---|
| `NEXT_PUBLIC_ENGINE_API_URL` | `https://engine.lokalscout.in/api` | Directs frontend to live VPS engine |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-id.apps.googleusercontent.com` | Google OAuth Client ID |

6. Click **Deploy**.
7. Vercel will build and deploy the Next.js frontend in ~45 seconds.

### 4.3 Attach Your Custom Domain (`lokalscout.in`)
1. In your Vercel project overview, go to **Settings** → **Domains**.
2. Enter `lokalscout.in` → Click **Add**.
3. Select **Add `lokalscout.in` and redirect `www.lokalscout.in` to it** (or vice versa).
4. Because you already created the CNAME records in Cloudflare in Step 2, Vercel will automatically verify the domain within 1–2 minutes with a green checkmark!

---

## Step 5: End-to-End Verification Checklist

Perform these tests on the live site:

| Test Item | Action | Expected Result |
|---|---|---|
| **1. Landing Page** | Visit `https://lokalscout.in` | Loads with modern SaaS styling, radar animation, and category pills. |
| **2. Google Sign-In** | Go to `https://lokalscout.in/login` → Click "Continue with Google" | Google popup appears; selecting your account signs you in and shows your avatar/email. |
| **3. Feasibility Search** | On homepage, search "Specialty Coffee Shop" in "Madhapur, Hyderabad" | Generates complete dossier with viability score, competitor count, demand anchors, and break-even math. |
| **4. Cashfree Payment** | Click "Unlock Full Dossier (₹799)" | Cashfree drop-in checkout modal opens with UPI, Cards, and NetBanking options. |
| **5. PDF Export** | Click "Download Executive PDF" | Printable PDF dossier is generated cleanly. |
| **6. Area Comparison** | Visit `https://lokalscout.in/compare` | Compares Madhapur vs Gachibowli side-by-side with trade-off score. |
| **7. Crawler Cache** | Visit `https://engine.lokalscout.in/api/crawler/stats` in browser | Returns JSON with cached records count and SQLite database health. |

---

## Step 6: Day-2 Maintenance, Logs & Troubleshooting

### How to Update Your VPS Backend When Code Changes
Whenever you push updates to GitHub, update your VPS in 2 commands:
```bash
ssh root@YOUR_VPS_IP
cd /var/www/lokalscout
git pull origin main
cd engine
docker compose up -d --build
```
*(There is zero downtime; Docker builds the new image and swaps containers seamlessly).*

### Useful VPS Docker Commands
- **View live FastAPI engine logs:**
  ```bash
  docker compose logs -f api
  ```
- **View Caddy access & SSL logs:**
  ```bash
  docker compose logs -f caddy
  ```
- **Check resource usage (RAM/CPU):**
  ```bash
  docker stats
  ```
- **Restart the entire stack:**
  ```bash
  docker compose restart
  ```

### Inspect the SQLite Cache Database on VPS
```bash
# Check database size and tables
sqlite3 /var/www/lokalscout/engine/data/lokalscout_cache.db ".tables"

# Check count of cached competitors
sqlite3 /var/www/lokalscout/engine/data/lokalscout_cache.db "SELECT count(*) FROM competitors;"

# Check count of cached rent listings
sqlite3 /var/www/lokalscout/engine/data/lokalscout_cache.db "SELECT count(*) FROM rent_listings;"
```

### Common Troubleshooting Gotchas

1. **Problem: Google Login shows "Origin not allowed" (`redirect_uri_mismatch`)**
   - **Fix**: In Google Cloud Console → APIs & Services → Credentials → Edit your OAuth Client ID → Add `https://lokalscout.in` and `https://www.lokalscout.in` under **Authorized JavaScript origins**.

2. **Problem: Caddy SSL fails or certificate cannot be obtained**
   - **Fix**: Check Cloudflare DNS for `engine.lokalscout.in`. Ensure it is set to **DNS Only (Grey cloud)**, not Proxied (Orange cloud). If proxied, Let's Encrypt HTTP-01 challenges are intercepted by Cloudflare.

3. **Problem: CORS errors on browser console when frontend calls backend**
   - **Fix**: Verify `CORS_ORIGINS` in [`engine/app/config.py`](file:///e:/Github/Lokalscout/lokalscout/engine/app/config.py) includes `https://lokalscout.in` and `https://www.lokalscout.in` (already included by default).

4. **Problem: Cashfree order creation fails with "Invalid credentials"**
   - **Fix**: Verify `CASHFREE_ENV` in `.env` matches your keys (`sandbox` for test keys, `production` for live keys). Test keys start with `TEST...`.

---

## Cost Summary

| Component | Platform | Monthly Cost |
|---|---|---|
| **Frontend Hosting** | Vercel (Hobby Tier) | **₹0** |
| **Backend Engine** | Hetzner / Hostinger / DigitalOcean VPS | **₹350 – ₹600** |
| **Database** | Embedded SQLite (WAL mode on VPS) | **₹0** |
| **DNS, CDN & SSL** | Cloudflare Free Tier | **₹0** |
| **Places API** | Google Cloud ($200 monthly free credit) | **₹0** |
| **AI Synthesis** | Google Gemini 2.5 Flash (Free Tier) | **₹0** |
| **Total Operating Cost** | | **~₹350 – ₹600 / month** |
