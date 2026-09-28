"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Building,
  Users,
  Clock,
  Search,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Download,
  Share2,
  Lock,
  ArrowRight,
  Calculator,
  GitCompare,
  Zap,
  Terminal,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FeasibilityReport } from "@/types/feasibility";
import { formatINR, formatNumberINR } from "@/lib/utils";
import { CashfreeCheckout } from "@/components/CashfreeCheckout";

export function ReportDashboard({
  initialReport,
  onUnlockSuccess,
}: {
  initialReport: FeasibilityReport;
  onUnlockSuccess?: () => void;
}) {
  const [report, setReport] = useState<FeasibilityReport>(initialReport);
  const [showCashfreeModal, setShowCashfreeModal] = useState(false);

  // Dynamic Interactive Break-Even Simulator state
  const [customRent, setCustomRent] = useState(
    report.real_estate.monthly_rental_estimate_main_road
  );
  const [customAOV, setCustomAOV] = useState(
    report.break_even.average_order_value_inr
  );
  const [customPayroll, setCustomPayroll] = useState(
    report.break_even.monthly_staff_payroll
  );

  // Derived simulator calculations
  const totalFixedCost = customRent + customPayroll + report.break_even.monthly_utilities_and_misc;
  const contributionMargin = Math.max(0.1, 1 - report.break_even.cogs_percentage);
  const simulatedMonthlyRevenueNeeded = Math.round(totalFixedCost / contributionMargin);
  const simulatedDailyCustomers = Math.max(
    1,
    Math.round(simulatedMonthlyRevenueNeeded / 30 / customAOV)
  );

  const handleCashfreeSuccess = () => {
    setShowCashfreeModal(false);
    setReport((prev) => ({ ...prev, is_unlocked: true }));

    // Confetti celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#059669", "#10b981", "#34d399"],
    });

    if (onUnlockSuccess) {
      onUnlockSuccess();
    }
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 font-sans text-slate-900">
      {/* Top Dossier Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              DOSSIER #{report.report_id}
            </span>
            <span className="text-slate-500">• Verified: {report.generated_at}</span>
            {report.is_unlocked ? (
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> FULLY UNLOCKED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                PROVISIONAL TEASER
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {report.business_vertical}
          </h1>
          <div className="flex items-center gap-2 text-slate-600 text-xs mt-1 font-mono">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>{report.location.formatted_address}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">
              COORD: {report.location.coordinates.lat.toFixed(4)}° N, {report.location.coordinates.lng.toFixed(4)}° E
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print font-mono text-xs">
          <Link
            href={`/compare?category=${encodeURIComponent(report.business_vertical)}&loc1=${encodeURIComponent(report.location.locality)}`}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <GitCompare className="h-3.5 w-3.5 text-emerald-600" />
            <span>Compare Area</span>
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${report.business_vertical} Feasibility - LokalScout`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Report link copied to clipboard!");
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="h-3.5 w-3.5" /> <span>Share</span>
          </button>
          <button
            onClick={handlePrintOrDownload}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Executive Feasibility Scorecard */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
          {/* Main Score Card */}
          <div className="p-5 rounded-xl bg-white border border-emerald-300 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase text-emerald-800 font-bold tracking-wider">
                COMMERCIAL FEASIBILITY SCORE
              </div>
              <div className="text-4xl font-black text-slate-900 mt-1">
                {report.overall_score}
                <span className="text-lg text-slate-400 font-normal"> / 100</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Confidence: {report.confidence_index}%</span>
              <span className="text-emerald-700 font-bold">Grade A</span>
            </div>
          </div>

          {/* Viability Classification */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                MARKET REGIME
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                {report.viability_status}
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
              Saturation x Footfall Analysis
            </div>
          </div>

          {/* Risk Level */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                CAPITAL RISK PROFILE
              </div>
              <div className="text-xl font-black text-amber-600 mt-1">
                {report.risk_rating}
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
              Payback Period Assessment
            </div>
          </div>

          {/* Direct Competitor Density */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                COMPETITOR DENSITY
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {report.competitor_analysis.total_competitors_2km}{" "}
                <span className="text-xs font-normal text-slate-500">
                  (2km buffer)
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
              Avg Star Rating: ★ {report.competitor_analysis.avg_rating}
            </div>
          </div>
        </div>

        {/* Executive Verdict Box */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-800 font-bold">
            <Terminal className="h-3.5 w-3.5 text-emerald-600" />
            <span>Executive Feasibility Intelligence Brief</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {report.executive_verdict}
          </p>
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
              Actionable Strategic Moats:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {report.unfair_advantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 flex items-start gap-2"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-sans">{adv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Competitor Landscape (Free Unlocked) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              02. Competitor Saturation Audit (2 km Buffer)
            </h2>
            <p className="text-slate-500 font-sans text-xs mt-0.5">
              Identified direct competing units harvested from Google Maps &amp; OSM spatial tags.
            </p>
          </div>
          <span className="text-slate-500">
            {report.competitor_analysis.top_competitors.length} Spotlight Entities
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-bold">Entity Name / Address</th>
                <th className="py-2.5 px-4 font-bold">Rating &amp; Reviews</th>
                <th className="py-2.5 px-4 font-bold">Distance</th>
                <th className="py-2.5 px-4 font-bold">Price Tier</th>
                <th className="py-2.5 px-4 font-bold">Primary Review Complaint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.competitor_analysis.top_competitors.map((comp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-900 font-semibold font-sans">
                    {comp.name}
                    <div className="text-[11px] text-slate-500 font-normal font-mono">{comp.address}</div>
                  </td>
                  <td className="py-3 px-4 text-amber-700 font-bold">
                    ★ {comp.rating}{" "}
                    <span className="text-slate-500 font-normal">({comp.reviews_count} reviews)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{comp.distance_km} km</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                      {comp.price_tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-rose-600 font-sans text-xs">
                    {comp.common_complaints[0] || "Parking congestion during peak rush"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTIONS 3 - 10: BLUR-LOCKED CONTAINER */}
      <div className="relative">
        {/* Cashfree Paywall Overlay when locked */}
        {!report.is_unlocked && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-16 px-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-300">
            <div className="max-w-lg w-full bg-white border border-emerald-400 p-6 md:p-8 rounded-2xl text-center space-y-5 shadow-2xl">
              <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-emerald-700 uppercase tracking-wider font-bold">
                  SECTIONS 03 THROUGH 10 LOCKED
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Unlock Full Commercial Viability Dossier
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Gain immediate access to commercial real estate rent benchmarks, dynamic break-even simulator, footfall demand anchors, and AI strategic gap recommendations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-1.5 text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Main road vs inner-lane rent/sq.ft benchmark</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Dynamic break-even financial simulator</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>5 Top footfall anchor hotspots (IT parks, metro)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Downloadable PDF Dossier for lease negotiations</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>₹1,000 GrowLokal launch voucher included</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 font-mono">
                <button
                  onClick={() => setShowCashfreeModal(true)}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Unlock for ₹799 via Cashfree PG</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="text-[11px] text-slate-500 flex items-center justify-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Instant UPI, Cards &amp; NetBanking via Cashfree</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content of Sections 3-10 */}
        <div className={`space-y-8 ${!report.is_unlocked ? "blur-locked-layer pointer-events-none select-none" : ""}`}>
          {/* SECTION 4 & 5: Demand Anchors & Commute Windows */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SECTION 4: Footfall Anchors */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
                <span>04. FOOTFALL &amp; DEMAND ANCHORS (2.5 KM)</span>
                <span className="text-emerald-700">OSM NODES</span>
              </div>
              <div className="space-y-2 text-xs">
                {report.demand_anchors.anchors.map((anchor, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 font-sans">{anchor.name}</div>
                      <div className="text-[10px] text-emerald-700">{anchor.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{anchor.distance_km} km</div>
                      <span className="text-[10px] text-slate-500">{anchor.impact_level} Impact</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Peak Commute Windows */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
                <span>05. PEAK COMMUTE &amp; ACTIVITY WINDOWS</span>
                <span className="text-emerald-700">HOURLY DENSITY</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {report.peak_windows.map((window, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 font-sans">{window.label}</span>
                      <span className="text-emerald-700 font-bold">{window.time_window}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${window.intensity_score}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      Cohort: {window.dominant_demographic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7 & 6: Real Estate Benchmarks & Search Demand */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SECTION 7: Real Estate Benchmarks */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
                <span>07. COMMERCIAL REAL ESTATE BENCHMARKS</span>
                <span className="text-emerald-700">RERA &amp; BROKER DATA</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-bold">MAIN ROAD (FRONTAGE)</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ₹{report.real_estate.main_road_rent_sqft_monthly}
                    <span className="text-xs text-slate-500 font-normal"> / sq.ft</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                    Est. {formatINR(report.real_estate.monthly_rental_estimate_main_road)} /mo
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-bold">INNER LANE / 1ST FLOOR</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ₹{report.real_estate.inner_lane_rent_sqft_monthly}
                    <span className="text-xs text-slate-500 font-normal"> / sq.ft</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                    Est. {formatINR(report.real_estate.monthly_rental_estimate_inner_lane)} /mo
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Security Deposit Norm:</span>
                <span className="font-bold text-slate-900">
                  {report.real_estate.security_deposit_months} Months Rent Advance
                </span>
              </div>
            </div>

            {/* SECTION 6: Local Search Intent */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
                <span>06. HIGH-INTENT LOCAL SEARCH SIGNALS</span>
                <span className="text-emerald-700">GOOGLE MAPS VELOCITY</span>
              </div>
              <div className="space-y-2 text-xs">
                {report.search_intent.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 font-sans">"{s.keyword}"</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{s.growth_yoy} YoY Growth</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">
                        {formatNumberINR(s.monthly_searches)}/mo
                      </div>
                      <span className="text-[10px] text-slate-500">{s.commercial_intent} Intent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: Interactive Financial Break-Even Simulator */}
          <section className="p-6 rounded-2xl bg-white border-2 border-emerald-600 shadow-sm space-y-6 font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  SECTION 08 • SENSITIVITY ANALYSIS
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Dynamic Break-Even Simulator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">
                  Adjust lease rent, staff payroll, or ticket size to model daily break-even thresholds.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <div className="text-[10px] uppercase text-emerald-800 font-bold">BREAK-EVEN LOAD</div>
                  <div className="text-2xl font-black text-emerald-800">
                    {simulatedDailyCustomers}{" "}
                    <span className="text-xs text-emerald-700 font-normal">Orders / day</span>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-emerald-200" />
                <div>
                  <div className="text-[10px] uppercase text-emerald-800 font-bold">MONTHLY REVENUE</div>
                  <div className="text-base font-bold text-slate-900">
                    {formatINR(simulatedMonthlyRevenueNeeded)}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">Monthly Lease Rent</span>
                  <span className="font-bold text-emerald-700">{formatINR(customRent)}</span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="350000"
                  step="5000"
                  value={customRent}
                  onChange={(e) => setCustomRent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">Average Order Value (AOV)</span>
                  <span className="font-bold text-emerald-700">{formatINR(customAOV)}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="2500"
                  step="25"
                  value={customAOV}
                  onChange={(e) => setCustomAOV(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">Monthly Staff Payroll</span>
                  <span className="font-bold text-emerald-700">{formatINR(customPayroll)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="400000"
                  step="5000"
                  value={customPayroll}
                  onChange={(e) => setCustomPayroll(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* SECTION 9: Competitor Weaknesses & Strategic Gaps */}
          <section className="space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
              <span>09. STRATEGIC MARKET GAPS &amp; UNFAIR ADVANTAGES</span>
              <span className="text-emerald-700">GAP IDENTIFIER</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {report.strategic_gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                      STRATEGIC GAP 0{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 font-sans">{gap.opportunity_title}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-sans leading-relaxed">{gap.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-sans font-medium">
                    ✓ Why it works: {gap.why_it_works}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 10: Launch with GrowLokal */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase text-emerald-700 font-bold">
                  SECTION 10 • GROWLOKAL AUTOPILOT BRIDGE
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Pre-Opening 60-Day Commercial Roadmap
                </h3>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-right">
                <div className="text-[10px] text-emerald-800 uppercase font-bold">PROMO VOUCHER</div>
                <div className="text-base font-black text-emerald-900">
                  {report.launch_action_plan.growlokal_offer_code}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-mono text-emerald-800 font-bold text-[11px]">WEEKS 1–2: LEASE</div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {report.launch_action_plan.week_1_to_2}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-mono text-emerald-800 font-bold text-[11px]">WEEKS 3–4: LICENSES</div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {report.launch_action_plan.week_3_to_4}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-mono text-emerald-800 font-bold text-[11px]">WEEKS 5–8: LAUNCH</div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {report.launch_action_plan.week_5_to_8}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href="https://growlokal.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Claim ₹1,000 Credit on GrowLokal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Cashfree Payment Modal */}
      {showCashfreeModal && (
        <CashfreeCheckout
          reportId={report.report_id}
          amount={799}
          onSuccess={handleCashfreeSuccess}
          onCancel={() => setShowCashfreeModal(false)}
        />
      )}
    </div>
  );
}
