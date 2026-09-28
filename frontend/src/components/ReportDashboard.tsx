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
  Radio,
  Layers,
  Store,
  Compass,
  Eye,
  Shield,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FeasibilityReport } from "@/types/feasibility";
import { formatINR, formatNumberINR } from "@/lib/utils";
import { CashfreeCheckout } from "@/components/CashfreeCheckout";
import { TerritoryWatchdogModal } from "@/components/TerritoryWatchdogModal";

export function ReportDashboard({
  initialReport,
  onUnlockSuccess,
}: {
  initialReport: FeasibilityReport;
  onUnlockSuccess?: () => void;
}) {
  const [report, setReport] = useState<FeasibilityReport>(initialReport);
  const [showCashfreeModal, setShowCashfreeModal] = useState(false);
  const [showWatchdogModal, setShowWatchdogModal] = useState(false);

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

  // Advanced modules state (Walkshed, Dayparting, Fitout, Google Sandbox)
  const [walkshedMode, setWalkshedMode] = useState<"5min" | "10min" | "radial">("5min");
  const [selectedHour, setSelectedHour] = useState<number>(17); // 5:00 PM peak
  const [customSqft, setCustomSqft] = useState(report.real_estate.typical_carpet_area_sqft);
  const [fitoutGrade, setFitoutGrade] = useState<"standard" | "premium">("standard");
  const [sandboxOptimized, setSandboxOptimized] = useState(true);

  // Fitout calculations
  const fitoutCostPerSqft = fitoutGrade === "premium" ? 2450 : 1850;
  const totalFitoutCapex = customSqft * fitoutCostPerSqft;
  const civilCost = Math.round(totalFitoutCapex * 0.26);
  const hvacCost = Math.round(totalFitoutCapex * 0.24);
  const furnitureCost = Math.round(totalFitoutCapex * 0.36);
  const brandingCost = Math.round(totalFitoutCapex * 0.14);

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

      {/* LIVE TERRITORY WATCHDOG BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-emerald-500/10 border border-amber-300/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Pin Code Watchdog™ Active: {report.location.pincode || "500081"}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                3 Active Threat Alerts
              </span>
            </div>
            <p className="text-slate-600 font-sans text-xs mt-0.5">
              Live automated surveillance detects competitor lease signings, Google Maps profile creation &amp; customer rating shocks within 2 km.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowWatchdogModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <span>Open Watchdog Feed</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
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
          {/* SECTION 4 & 5: True Pedestrian Walkshed & Dayparting Profile */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SECTION 4: Footfall & True Pedestrian Walkshed Isochrones */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
                <span>04. TRUE PEDESTRIAN WALKSHED &amp; DEMAND ANCHORS</span>
                <span className="text-emerald-700">OSM ISOCHRONES</span>
              </div>

              {/* Isochrone Catchment Mode Tabs */}
              <div className="flex items-center justify-between p-1.5 bg-slate-100 rounded-xl text-[11px] font-sans">
                <button
                  onClick={() => setWalkshedMode("5min")}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    walkshedMode === "5min"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  5-Min Walk (~380m)
                </button>
                <button
                  onClick={() => setWalkshedMode("10min")}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    walkshedMode === "10min"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  10-Min Walk (~780m)
                </button>
                <button
                  onClick={() => setWalkshedMode("radial")}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    walkshedMode === "radial"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Radial (2.5 km)
                </button>
              </div>

              {/* Catchment Metrics Box */}
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold">Pedestrian Permeability</span>
                  <div className="text-lg font-black text-emerald-900 mt-0.5">
                    {report.isochrone_walkshed?.pedestrian_permeability_score || 82} / 100
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">Walkable Commercial High Street</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    {walkshedMode === "5min" ? "5-Min Daytime Reach" : walkshedMode === "10min" ? "10-Min Daytime Reach" : "Total 2.5km Reach"}
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {walkshedMode === "5min"
                      ? `${formatNumberINR(report.isochrone_walkshed?.catchment_pop_5min || 5200)} people`
                      : walkshedMode === "10min"
                      ? `${formatNumberINR(report.isochrone_walkshed?.catchment_pop_10min || 16800)} people`
                      : "85,000+ daily transit"}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Offices + Transit Dwell</span>
                </div>
              </div>

              {/* Urban Barrier Warning */}
              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs font-sans space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Physical Walking Barrier Detected:</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {report.isochrone_walkshed?.barrier_warnings?.[0]?.description ||
                    `Divided multi-lane arterial on ${report.location.locality} main road limits mid-block crossing. 80% of pedestrian footfall pools near signalized zebra crossings.`}
                </p>
              </div>

              {/* Anchors List */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] text-slate-500 uppercase font-bold pt-1">Primary Footfall Anchors</div>
                {report.demand_anchors.anchors.slice(0, 4).map((anchor, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
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

            {/* SECTION 5: Dayparting & 24-Hour Footfall Distribution */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
                <span>05. DAYPARTING &amp; 24-HR FOOTFALL PROFILE</span>
                <span className="text-emerald-700">HOURLY DEMOGRAPHIC</span>
              </div>

              {/* Hourly Footfall Bar Visualizer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-sans">
                  <span className="text-slate-600 font-medium">Operating Dayparting Curve (07:00 – 23:00)</span>
                  <span className="text-emerald-700 font-bold">
                    Peak: {report.dayparting_profile?.peak_hours?.[1] || "04:30 PM - 07:00 PM"}
                  </span>
                </div>

                <div className="flex items-end gap-1 h-28 pt-4 pb-1 px-2 bg-slate-50 rounded-xl border border-slate-200">
                  {(report.dayparting_profile?.hourly_curve || [
                    { hour_label: "08 AM", hour_24: 8, footfall_index: 85, dominant_demographic: "Tech Commute", recommended_staff_count: 4 },
                    { hour_label: "10 AM", hour_24: 10, footfall_index: 90, dominant_demographic: "Meetings", recommended_staff_count: 4 },
                    { hour_label: "12 PM", hour_24: 12, footfall_index: 60, dominant_demographic: "Lunch", recommended_staff_count: 3 },
                    { hour_label: "02 PM", hour_24: 14, footfall_index: 50, dominant_demographic: "Dwell", recommended_staff_count: 2 },
                    { hour_label: "04 PM", hour_24: 16, footfall_index: 95, dominant_demographic: "Social", recommended_staff_count: 4 },
                    { hour_label: "05 PM", hour_24: 17, footfall_index: 100, dominant_demographic: "Peak Coffee", recommended_staff_count: 5 },
                    { hour_label: "06 PM", hour_24: 18, footfall_index: 98, dominant_demographic: "Evening Buzz", recommended_staff_count: 5 },
                    { hour_label: "08 PM", hour_24: 20, footfall_index: 80, dominant_demographic: "Desserts", recommended_staff_count: 4 },
                    { hour_label: "10 PM", hour_24: 22, footfall_index: 45, dominant_demographic: "Late Night", recommended_staff_count: 2 },
                  ]).map((point) => {
                    const isSelected = selectedHour === point.hour_24;
                    return (
                      <button
                        key={point.hour_label}
                        onClick={() => setSelectedHour(point.hour_24)}
                        className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer"
                        title={`${point.hour_label}: ${point.footfall_index}/100 Footfall • ${point.dominant_demographic}`}
                      >
                        <div
                          style={{ height: `${point.footfall_index}%` }}
                          className={`w-full rounded-t-md transition-all ${
                            isSelected
                              ? "bg-emerald-600 ring-2 ring-emerald-300"
                              : point.footfall_index >= 90
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : "bg-slate-300 hover:bg-slate-400"
                          }`}
                        />
                        <span className="text-[9px] text-slate-500 font-mono scale-90 truncate">{point.hour_label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Hour Telemetry */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 font-sans text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase font-bold">Selected Operational Hour</span>
                  <div className="text-slate-900 font-bold mt-0.5">
                    {selectedHour}:00 ({selectedHour >= 12 ? (selectedHour === 12 ? "12:00 PM" : `${selectedHour - 12}:00 PM`) : `${selectedHour}:00 AM`})
                  </div>
                  <span className="text-[11px] text-slate-600">
                    High engagement window • {selectedHour >= 16 && selectedHour <= 20 ? "Peak Revenue Focus" : "Standard Operations"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold">Recommended Staff</span>
                  <div className="text-base font-black text-emerald-900 mt-0.5">
                    {selectedHour >= 16 && selectedHour <= 19 ? "4–5 Active Staff" : selectedHour >= 8 && selectedHour <= 11 ? "4 Active Staff" : "2–3 Active Staff"}
                  </div>
                </div>
              </div>

              {/* Smart Shift Scheduling Box */}
              <div className="space-y-1.5 font-sans text-xs">
                <span className="text-[11px] text-slate-500 uppercase font-bold font-mono">Smart Shift Schedule Recommendation</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-emerald-800 font-bold block">Morning Shift (7AM – 3PM)</span>
                    <span className="text-slate-700 text-xs font-medium">2 Baristas + 1 Prep Chef + 1 Billing Cashier</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-emerald-800 font-bold block">Evening Peak (2:30PM – 10:30PM)</span>
                    <span className="text-slate-700 text-xs font-medium">2 Baristas + 2 Service + 1 Lead (64% Vol.)</span>
                  </div>
                </div>
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

            {/* Turnkey Commercial Fit-Out Cost Estimator (Sub-Module) */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Turnkey Commercial Fit-Out Cost Estimator
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Vetted Contractor Rates
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Itemized capital budget for flooring, MEP, HVAC, commercial counters &amp; exterior facade.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-sans">
                  <button
                    onClick={() => setFitoutGrade("standard")}
                    className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                      fitoutGrade === "standard"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Standard Fit-Out (₹1,850/sq.ft)
                  </button>
                  <button
                    onClick={() => setFitoutGrade("premium")}
                    className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                      fitoutGrade === "premium"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Premium Boutique (₹2,450/sq.ft)
                  </button>
                </div>
              </div>

              {/* Area Slider & Fitout Capex Totals */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-sans">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-semibold">Carpet Area</span>
                    <span className="font-bold text-slate-900">{customSqft} sq.ft</span>
                  </div>
                  <input
                    type="range"
                    min="350"
                    max="3500"
                    step="50"
                    value={customSqft}
                    onChange={(e) => setCustomSqft(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Civil &amp; Flooring (26%)</span>
                  <div className="text-base font-bold text-slate-900 mt-1">{formatINR(civilCost)}</div>
                  <span className="text-[11px] text-slate-500">Tiling, plumbing &amp; partition walls</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">HVAC &amp; MEP (24%)</span>
                  <div className="text-base font-bold text-slate-900 mt-1">{formatINR(hvacCost)}</div>
                  <span className="text-[11px] text-slate-500">Ducting, exhaust &amp; 3-phase load</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold">Total Estimated Fit-Out</span>
                  <div className="text-xl font-black text-emerald-900 mt-0.5">{formatINR(totalFitoutCapex)}</div>
                  <span className="text-[11px] text-emerald-700 font-medium">Turnaround: ~42 working days</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-sans">
                <span className="text-slate-500">
                  Fixtures &amp; Furniture: <strong className="text-slate-700">{formatINR(furnitureCost)}</strong> • Branding &amp; Facade: <strong className="text-slate-700">{formatINR(brandingCost)}</strong>
                </span>
                <button
                  onClick={() => alert(`Your request for 3 vetted contractor quotes for ${customSqft} sq.ft in ${report.location.locality} has been received. Our project desk will contact you via WhatsApp.`)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Request 3 Vetted Contractor Bids</span>
                </button>
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

          {/* SECTION 10: Launch with GrowLokal & Pre-Opening Sandbox */}
          <section className="space-y-4 font-mono">
            {/* Google 3-Pack Sandbox Preview */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      GROWLOKAL AUTOPILOT • PRE-OPENING GOOGLE 3-PACK SANDBOX
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                      Live Simulation
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Interactive preview of your local search presence on Google Maps when managed by GrowLokal Autopilot.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-sans">
                  <button
                    onClick={() => setSandboxOptimized(true)}
                    className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                      sandboxOptimized
                        ? "bg-white text-emerald-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ✓ With GrowLokal (Rank #1)
                  </button>
                  <button
                    onClick={() => setSandboxOptimized(false)}
                    className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                      !sandboxOptimized
                        ? "bg-white text-rose-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Unoptimized (Rank #14)
                  </button>
                </div>
              </div>

              {/* Google Search Mockup Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Google Search:</span>
                  <span className="font-semibold text-slate-900">"{report.business_vertical} near me in {report.location.locality}"</span>
                </div>

                <div className={`p-4 rounded-xl border transition-all ${
                  sandboxOptimized
                    ? "bg-white border-emerald-300 shadow-md ring-2 ring-emerald-500/10"
                    : "bg-slate-100/70 border-slate-200 opacity-60"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          The {report.location.locality} {report.business_vertical.split("&")[0].trim()}
                        </span>
                        {sandboxOptimized && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Google Verified
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-amber-500 font-bold">
                          {sandboxOptimized ? "★ 4.9" : "★ 0.0"}
                        </span>
                        <span className="text-slate-500">
                          {sandboxOptimized ? "(88 Google Reviews • Top 1% in Suburb)" : "(No reviews yet • Unranked)"}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                          {sandboxOptimized ? "Opening in 45 Days • Pre-Booking Live" : "Unverified Listing"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        {report.location.formatted_address} • 180m from Metro Station
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold block ${
                        sandboxOptimized ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : "bg-slate-200 text-slate-700"
                      }`}>
                        {sandboxOptimized ? "LOCAL 3-PACK RANK #1" : "LOCAL RANK #14 (BURIED)"}
                      </span>
                      {sandboxOptimized && (
                        <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                          +420% Higher Click-Through
                        </span>
                      )}
                    </div>
                  </div>

                  {sandboxOptimized && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-800 font-medium">
                        🎁 Active Pre-Launch Offer: <strong>"Claim 20% Off Opening Week Pass"</strong> (314 Claims)
                      </span>
                      <span className="text-slate-400 text-[11px]">Powered by GrowLokal Autopilot Funnel</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Curated Direct-from-Landlord Zero Brokerage Spaces */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      CURATED COMMERCIAL INVENTORY • ZERO BROKERAGE
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                      Direct Landlord Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Pre-screened commercial premises in {report.location.locality} matching your exact target carpet area and lease budget.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs">
                {(report.matched_properties || [
                  {
                    property_id: "PROP-01",
                    title: `Prime Main-Road Corner Commercial Frontage, ${report.location.locality}`,
                    carpet_area_sqft: report.real_estate.typical_carpet_area_sqft,
                    floor: "Ground Floor (Road Facing)",
                    rent_monthly_inr: report.real_estate.monthly_rental_estimate_main_road,
                    brokerage_fee: "Direct Landlord Verified • Zero Brokerage",
                    distance_from_anchor_m: 180,
                    verified: true,
                  },
                  {
                    property_id: "PROP-02",
                    title: `High-Street 1st Floor Retail Villa with Lift, ${report.location.locality}`,
                    carpet_area_sqft: Math.round(report.real_estate.typical_carpet_area_sqft * 1.15),
                    floor: "1st Floor (Wide Balcony & Signage)",
                    rent_monthly_inr: Math.round(report.real_estate.monthly_rental_estimate_main_road * 0.85),
                    brokerage_fee: "Direct Landlord Verified • Zero Brokerage",
                    distance_from_anchor_m: 320,
                    verified: true,
                  },
                  {
                    property_id: "PROP-03",
                    title: `Quiet Leafy Inner-Lane Commercial Bungalow, ${report.location.locality}`,
                    carpet_area_sqft: Math.round(report.real_estate.typical_carpet_area_sqft * 0.9),
                    floor: "Independent Ground + Garden Patio",
                    rent_monthly_inr: Math.round(report.real_estate.monthly_rental_estimate_main_road * 0.72),
                    brokerage_fee: "Direct Landlord Verified • Zero Brokerage",
                    distance_from_anchor_m: 450,
                    verified: true,
                  },
                ]).map((prop) => (
                  <div key={prop.property_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-2.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">
                        {prop.floor}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">{prop.title}</h4>
                      <div className="flex items-center gap-2 text-slate-600 mt-2">
                        <span className="font-bold text-slate-900">{formatINR(prop.rent_monthly_inr)}/mo</span>
                        <span>•</span>
                        <span>{prop.carpet_area_sqft} sq.ft</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="text-emerald-700 font-semibold font-mono">Zero Brokerage</span>
                      <button
                        onClick={() => alert(`Commercial space details for "${prop.title}" requested. Connecting you directly with the verified property manager.`)}
                        className="text-slate-900 font-bold hover:text-emerald-600 cursor-pointer"
                      >
                        Schedule Tour →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Opening 60-Day Commercial Roadmap */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
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

      {/* Territory Watchdog Surveillance Modal */}
      <TerritoryWatchdogModal
        isOpen={showWatchdogModal}
        onClose={() => setShowWatchdogModal(false)}
        defaultPincode={report.location.pincode || "500081"}
        defaultLocality={report.location.locality}
        defaultCategory={report.business_vertical}
      />
    </div>
  );
}
