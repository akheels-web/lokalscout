"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Users,
  Store,
  Building2,
  Radio,
  FileText,
  AlertCircle,
  Sparkles,
  Footprints,
  Compass,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SearchHero } from "@/components/SearchHero";
import { TeaserModal } from "@/components/TeaserModal";
import { InteractiveGisCreative } from "@/components/InteractiveGisCreative";
import { TerritoryWatchdogModal } from "@/components/TerritoryWatchdogModal";
import { generatePreview } from "@/lib/api";
import { FeasibilityPreview } from "@/types/feasibility";

export default function HomePage() {
  const [activeTeaser, setActiveTeaser] = useState<FeasibilityPreview | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showWatchdogModal, setShowWatchdogModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleHeroSearch = async (category: string, locality: string) => {
    setIsScanning(true);
    try {
      const preview = await generatePreview(category, locality);
      setActiveTeaser(preview);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What exact service does LokalScout provide?",
      a: "LokalScout is a commercial location feasibility intelligence engine. Before you sign a 3-year commercial lease and spend ₹20L–₹50L on interior fit-outs, we audit your exact street address. We calculate pedestrian foot-traffic from tech parks and residential clusters, analyze direct competitor ratings and customer complaints, benchmark fair market rents so you don't overpay, and calculate the exact daily sales you need to break even.",
    },
    {
      q: "Why shouldn't I just rely on a commercial real estate broker?",
      a: "Brokers earn a 1–2 month commission on signed leases, meaning their financial incentive is to close you on the highest possible rent as quickly as possible. They cannot provide empirical pedestrian footfall counts, competitor review sentiment, or mathematical break-even models. LokalScout provides 100% unbiased, objective location data so you can negotiate lower rent and avoid low-traffic dead zones.",
    },
    {
      q: "Where does your footfall and competitor data come from?",
      a: "We aggregate over 25 spatial signals including high-resolution pedestrian walking isochrones (5-min & 10-min catchments), verified micro-market competitor density, customer sentiment mined from public reviews, transit hubs, and actual commercial lease transactions across 120+ Indian micro-markets.",
    },
    {
      q: "Can I use this feasibility report for bank loans or franchise approval?",
      a: "Yes. Every ₹799 report includes an executive-ready, printable PDF dossier containing capex estimates, unit-economics break-even math, competitor mapping, and catchment demographics. Hundreds of founders use it to secure MSME business loans and franchise approvals.",
    },
    {
      q: "Which cities and areas in India do you cover?",
      a: "We cover over 120 prime commercial micro-markets across Hyderabad (Madhapur, Gachibowli, Jubilee Hills), Bengaluru (Indiranagar, Koramangala, Whitefield), Mumbai (Bandra, Andheri, Lower Parel), Pune (Koregaon Park, Baner), Delhi-NCR (Gurgaon Cyber City, Connaught Place), Chennai, Kolkata, and Ahmedabad.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-16 pb-12 px-4 md:px-8 max-w-6xl mx-auto space-y-8 text-center">
        {/* Value Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Hyperlocal Location Intelligence for Retail Founders &amp; Franchisees</span>
        </div>

        {/* Punchy Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Know If Your Next Store Will Make Money{" "}
            <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
              Before You Sign The Lease.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Opening a cafe, clinic, salon, or gym? We audit pedestrian footfall, competitor complaints, fair market rents, and daily break-even math in 30 seconds.
          </p>
        </div>

        {/* Clean, Modern Search Console (No Excel/Mono) */}
        <div id="search-section" className="pt-2 text-left">
          <SearchHero onSearch={handleHeroSearch} />
        </div>

        {/* 4 Trust & Benefit Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Protect ₹20L–₹50L Upfront Capex</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Instant 30-Second Location Audit</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>120+ Indian Micro-Markets</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Instant UPI &amp; Card Checkout</span>
          </div>
        </div>
      </section>

      {/* 2. WHAT SERVICE DO WE PROVIDE? (The 4 Core Service Deliverables) */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            WHAT WE DO
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            The 4 Crucial Location Audits Every Founder Needs
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            Never guess whether a location is good or take a broker's word for it. We give you clear, actionable answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Pillar 1 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Footprints className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold">
                5 &amp; 10 Min Walking Reach
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                1. Pedestrian Footfall &amp; Catchment Audit
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Car traffic does not buy coffee or get haircuts. We measure true 5-minute (~380m) and 10-minute (~780m) walking reach around tech parks, metro exits, and gated communities, detecting footfall barriers like divided expressways.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Know exactly how many potential customers walk past your door daily</span>
            </div>
          </div>

          {/* Service Pillar 2 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Store className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-xs font-bold">
                Google Review Mining
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                2. Competitor Weakness &amp; Gap Intelligence
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We map all direct competitors within 2 km and extract common complaints from their 1–3 star Google reviews (parking shortages, slow billing, lack of workspace tables) so you can exploit their flaws from Day 1.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Discover unmet customer needs before opening your doors</span>
            </div>
          </div>

          {/* Service Pillar 3 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold">
                Save ₹40k–₹80k/Month
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                3. Fair Market Rent &amp; Lease Negotiation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Commercial landlords and brokers routinely inflate asking rents for new founders. We benchmark prevailing commercial rental rates for main-road frontages vs secondary inner lanes, typical deposits, and standard escalation clauses.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Negotiate with real ground-truth rent data instead of broker claims</span>
            </div>
          </div>

          {/* Service Pillar 4 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <Calculator className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100/70 text-purple-800 text-xs font-bold">
                Daily Sales Target
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                4. Daily Break-Even Financial Blueprint
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We model your rent, staffing payroll, COGS (Cost of Goods Sold), and average order value to calculate the exact number of daily customers or orders you need to break even and reach profitability.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-purple-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Interactive sliders to model different rent and price scenarios</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Visual 3-Step Flow) */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            HOW IT WORKS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            3 Simple Steps to Location Clarity
          </h2>
          <p className="text-sm text-slate-600">
            No expensive real estate consultants or weeks spent standing on sidewalks counting people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-lg group-hover:scale-105 transition-transform">
              01
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Select Business &amp; Location</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose your business type (Cafe, Clinic, Salon, Gym, etc.) and enter your target street address, locality, or pin code.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-lg group-hover:scale-105 transition-transform">
              02
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">We Audit 25+ Signals</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our engine scans pedestrian footfall anchors, nearby competitors, customer reviews, and actual commercial lease transactions in seconds.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-lg group-hover:scale-105 transition-transform">
              03
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Get Your Feasibility Dossier</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive an instant 10-section intelligence report with break-even financial sliders and a downloadable, bank-ready PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEFORE VS AFTER (The Real Cost of Blind Decisions) */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-8">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              The Real Cost of Location Mistakes
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Why 60% of Retail Stores Shut Down in Month 12
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Most store failures are NOT caused by bad food or poor service. They fail because founders signed the wrong lease with zero data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Blind Way */}
            <div className="p-7 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>The Broker / Guesswork Way</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Walked the street on a Saturday night and assumed it is always busy.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Signed a ₹2,40,000/month commercial lease without knowing weekday daytime traffic is near zero.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Needed 85 orders every single day just to pay rent and staff payroll.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Result:</strong> Burnt ₹35 Lakhs in savings and shut down in Month 10.</span>
                </li>
              </ul>
            </div>

            {/* The LokalScout Way */}
            <div className="p-7 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>The LokalScout Method (Data-Backed)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-200 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Ran an instant 30-second audit; found 24 direct competitors fighting on the main road.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Discovered an inner-lane spot 350m away near an IT tech park for ₹1,10,000/month.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Break-even requirement dropped from 85 orders/day to just 38 orders/day.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Result:</strong> Profitable by Month 3. Saved ₹15.6 Lakhs in first-year rent.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PRODUCT SHOWCASE (Live Radar Simulation) */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-1">
              LIVE PRODUCT PREVIEW
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Interactive Micro-Market Footfall Radar
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore 5-minute walking distance, 10-minute transit reach, and surrounding demand anchors.
            </p>
          </div>
          <Link
            href="/sample"
            className="text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>View Full Unlocked Sample Dossier</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <InteractiveGisCreative />
      </section>

      {/* 6. SAMPLE DOSSIERS (Visual Preview Cards) */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-1">
              VERIFIED AUDITS
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Explore Sample Location Dossiers
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              See the exact depth and format of data our intelligence reports deliver.
            </p>
          </div>
          <Link
            href="/sample"
            className="text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors"
          >
            <span>Open 100% Unlocked Reference Dossier</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample 1: Madhapur */}
          <Link
            href="/sample"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md block group transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                Feasibility: 82/100
              </span>
              <span className="text-xs font-semibold text-slate-400">Hyderabad</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-emerald-700 transition-colors">
              Specialty Coffee Shop &amp; Cafe
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Madhapur Hitec Corridor (500081)</span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Competitors:</span>
                <span className="font-bold text-slate-900">24 in 2 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fair Lease Rate:</span>
                <span className="font-bold text-emerald-700">₹125 / sq.ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Break-Even:</span>
                <span className="font-bold text-slate-900">41 orders / day</span>
              </div>
            </div>

            <div className="mt-5 text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Full Unlocked Dossier</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Sample 2: Indiranagar */}
          <Link
            href="/report/SAMPLE-INDIRANAGAR-DENTAL?category=Dental%20Clinic%20%26%20Diagnostics&locality=Indiranagar"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md block group transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                Feasibility: 88/100
              </span>
              <span className="text-xs font-semibold text-slate-400">Bengaluru</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-emerald-700 transition-colors">
              Dental Clinic &amp; Diagnostics
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>100ft Road, Indiranagar (560038)</span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Competitors:</span>
                <span className="font-bold text-slate-900">11 in 2 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fair Lease Rate:</span>
                <span className="font-bold text-emerald-700">₹210 / sq.ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Break-Even:</span>
                <span className="font-bold text-slate-900">7 patients / day</span>
              </div>
            </div>

            <div className="mt-5 text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Full Unlocked Dossier</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Sample 3: Bandra */}
          <Link
            href="/report/SAMPLE-BANDRA-SALON?category=Unisex%20Salon%20%26%20Luxury%20Spa&locality=Bandra%20West"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md block group transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
                Feasibility: 74/100
              </span>
              <span className="text-xs font-semibold text-slate-400">Mumbai</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-emerald-700 transition-colors">
              Unisex Salon &amp; Luxury Spa
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Hill Road, Bandra West (400050)</span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Competitors:</span>
                <span className="font-bold text-slate-900">29 in 2 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fair Lease Rate:</span>
                <span className="font-bold text-amber-800">₹380 / sq.ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Break-Even:</span>
                <span className="font-bold text-slate-900">22 clients / day</span>
              </div>
            </div>

            <div className="mt-5 text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Full Unlocked Dossier</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 7. PIN CODE TERRITORY WATCHDOG BANNER */}
      <section className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50 border border-emerald-200/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Pin Code Territory Watchdog™
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Already have an operating outlet? Monitor your pin code 24/7.
            </h3>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl leading-relaxed">
              Get notified via WhatsApp the moment a new competitor registers a trade license, begins interior fit-out, or suffers customer rating drops in your neighborhood.
            </p>
          </div>
          <button
            onClick={() => setShowWatchdogModal(true)}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
          >
            <span>Activate Surveillance (₹499/mo)</span>
            <ArrowRight className="h-4 w-4 text-emerald-400" />
          </button>
        </div>
      </section>

      {/* 8. SIMPLE, TRANSPARENT PRICING */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            TRANSPARENT PRICING
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Pay Only When You Scout. Zero Subscription Traps.
          </h2>
          <p className="text-sm text-slate-600">
            Instant UPI, Card &amp; NetBanking settlements. Tax invoices included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Preliminary Scan</span>
                <div className="text-3xl font-black text-slate-900 mt-1">₹0</div>
                <p className="text-xs text-slate-500 mt-1">High-level preliminary scan of any candidate location.</p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Overall Feasibility Score (0–100)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Direct competitor count within 2 km</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Top 3 Footfall Demand Anchors</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span>Detailed sections locked</span>
                </li>
              </ul>
            </div>
            <Link
              href="#search-section"
              className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center transition-colors block"
            >
              Run Free Scan
            </Link>
          </div>

          {/* Full Dossier */}
          <div className="p-7 rounded-3xl bg-white border-2 border-emerald-600 shadow-xl shadow-emerald-600/10 space-y-6 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
              MOST POPULAR
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Complete Dossier</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  ₹799 <span className="text-xs font-normal text-slate-500">/ report</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Everything you need before negotiating with a commercial landlord.</p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">All 10 Sections completely unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Main road vs inner-lane rent benchmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Interactive break-even financial simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Turnkey fit-out cost estimator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Downloadable bank-ready PDF dossier</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>₹1,000 GrowLokal Autopilot Voucher</span>
                </li>
              </ul>
            </div>
            <Link
              href="#search-section"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors block shadow-md shadow-emerald-600/20"
            >
              Get Complete Dossier (₹799)
            </Link>
          </div>

          {/* Area Comparison */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Multi-Area Comparison</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  ₹1,499 <span className="text-xs font-normal text-slate-500">/ 3 areas</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Compare 2 to 3 candidate neighborhoods side-by-side.</p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Side-by-side comparative matrix</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Rent vs. Footfall trade-off calculation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Automated Winner Locality recommendation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Includes 2 complete PDF dossiers</span>
                </li>
              </ul>
            </div>
            <Link
              href="/compare"
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors block"
            >
              Launch Area Comparison
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-14 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            COMMON QUESTIONS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about our data, reports, and methodology.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Free Teaser Modal */}
      {activeTeaser && (
        <TeaserModal preview={activeTeaser} onClose={() => setActiveTeaser(null)} />
      )}

      {/* Territory Watchdog Modal */}
      <TerritoryWatchdogModal
        isOpen={showWatchdogModal}
        onClose={() => setShowWatchdogModal(false)}
        defaultPincode="500081"
        defaultLocality="Madhapur"
        defaultCategory="Specialty Coffee Shop & Cafe"
      />
    </div>
  );
}
