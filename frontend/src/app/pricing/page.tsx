"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles, GitCompare, HelpCircle } from "lucide-react";
import { CashfreeCheckout } from "@/components/CashfreeCheckout";

export default function PricingPage() {
  const [selectedReportForCheckout, setSelectedReportForCheckout] = useState<{ id: string; amount: number } | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-14 px-4 md:px-8 max-w-7xl mx-auto space-y-16 text-slate-900">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          Transparent Location Intelligence Pricing
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Invest Once. Protect Your Commercial Capital.
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Prevent signing a 3-year commercial lease on intuition. Instant one-time purchase with instant UPI/Card settlements and downloadable PDF dossiers.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Tier 1: Free */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Free Teaser Scan
            </div>
            <div className="text-4xl font-black text-slate-900">₹0</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant high-level micro-market viability snapshot before diving into full unit economics.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Overall Feasibility Score (0–100)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Competitor count within 2 km radius</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Top 3 footfall demand anchors</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span>Sections 3–10 blur-locked</span>
              </li>
            </ul>
          </div>

          <Link
            href="/#search-section"
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-all"
          >
            Scan Free Teaser
          </Link>
        </div>

        {/* Tier 2: Single Dossier (Featured) */}
        <div className="bg-white p-8 rounded-3xl border-2 border-emerald-600 shadow-xl shadow-emerald-600/10 space-y-6 flex flex-col justify-between relative">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
            Most Popular
          </div>
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
              Full 10-Section Dossier
            </div>
            <div className="text-4xl font-black text-slate-900">
              ₹799 <span className="text-xs font-normal text-slate-500">/ report</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete commercial feasibility intelligence package required before signing any commercial lease.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-800 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>All 10 sections completely unlocked</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Commercial rent / sq.ft benchmarks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Dynamic break-even financial simulator</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Competitor review sentiment &amp; strategic gaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Downloadable executive PDF Dossier</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-800 font-bold">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>₹1,000 GrowLokal Autopilot Voucher</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setSelectedReportForCheckout({ id: "SAMPLE-MADHAPUR-COFFEE", amount: 799 })}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Unlock Full Dossier (₹799)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Tier 3: Multi-Area Comparison */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Multi-Area Comparison
            </div>
            <div className="text-4xl font-black text-slate-900">
              ₹1,499 <span className="text-xs font-normal text-slate-500">/ 3 areas</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Side-by-side comparative analysis of 2 or 3 shortlisted commercial precincts.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Side-by-side trade-off matrix</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Rent vs. Footfall trade-off scoring</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Winner locality recommendation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Includes 2 Full PDF Dossiers</span>
              </li>
            </ul>
          </div>

          <Link
            href="/compare"
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5"
          >
            <GitCompare className="h-4 w-4 text-emerald-600" />
            <span>Launch Area Comparison</span>
          </Link>
        </div>
      </div>

      {/* Cashfree Payment Modal if triggered directly from pricing */}
      {selectedReportForCheckout && (
        <CashfreeCheckout
          reportId={selectedReportForCheckout.id}
          amount={selectedReportForCheckout.amount}
          onSuccess={() => {
            setSelectedReportForCheckout(null);
            alert("Payment successful! Redirecting to your unlocked dossier.");
            window.location.href = `/sample`;
          }}
          onCancel={() => setSelectedReportForCheckout(null)}
        />
      )}

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto pt-8 border-t border-slate-200 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about LokalScout commercial intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">How fresh is the competitor and footfall data?</h4>
            <p className="text-slate-600 leading-relaxed">
              Our intelligence engine synthesizes verified commercial registries, real-time pedestrian footfall telemetry, and live customer sentiment streams at the exact second you run a search. If you query Madhapur right now, you get real-time active competitor counts and latest rating velocities.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">What payment methods are supported?</h4>
            <p className="text-slate-600 leading-relaxed">
              We support instant UPI (Google Pay, PhonePe, Paytm, BHIM, Cred), all major Indian Credit/Debit cards (Visa, Mastercard, RuPay), and NetBanking via a secure PCI-DSS Level-1 certified payment gateway. Once payment is confirmed, your dossier unlocks instantaneously.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">Can I download the report as a PDF to show landlords?</h4>
            <p className="text-slate-600 leading-relaxed">
              Yes. Every full dossier includes a dedicated "Download PDF" button that generates a high-resolution, print-formatted executive document complete with competitor tables and break-even calculations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">Are commercial rental rates exact?</h4>
            <p className="text-slate-600 leading-relaxed">
              Rental rates per sq.ft shown in our reports are indicative neighbourhood market averages. Because commercial rent in India depends heavily on road frontage, floor level (ground floor vs upper floors), building age, and direct owner negotiations, we give you the fair benchmark range to negotiate effectively and avoid overpaying.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">What is the GrowLokal Autopilot ₹1,000 credit?</h4>
            <p className="text-slate-600 leading-relaxed">
              If you proceed to open your business in the audited location within 60 days, you can apply your voucher code toward GrowLokal Autopilot to set up your Google Maps 3-Pack, VIP launch page, and automated WhatsApp reviews.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
