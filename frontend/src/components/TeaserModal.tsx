"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2, ShieldCheck, ArrowRight, Building, Sparkles } from "lucide-react";
import { FeasibilityPreview } from "@/types/feasibility";

export function TeaserModal({
  preview,
  onClose,
}: {
  preview: FeasibilityPreview;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleGoToReport = () => {
    router.push(
      `/report/${preview.report_id}?category=${encodeURIComponent(preview.business_vertical)}&locality=${encodeURIComponent(preview.locality)}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>Instant Location Audit Ready</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {preview.business_vertical}
          </h2>
          <div className="text-xs text-slate-500 font-medium">
            Scouted Area: <span className="text-slate-900 font-bold">{preview.locality}, {preview.city}</span>
          </div>
        </div>

        {/* Teaser Metrics Grid */}
        <div className="grid grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="text-[11px] uppercase text-emerald-900 font-bold tracking-wider">Feasibility Score</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              {preview.overall_score}
              <span className="text-xs text-emerald-600 font-normal"> / 100</span>
            </div>
            <div className="text-xs text-emerald-800 mt-1 font-semibold">{preview.viability_status}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Direct Competitors</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {preview.competitor_count_2km}
              <span className="text-xs text-slate-400 font-normal"> within 2km</span>
            </div>
            <div className="text-xs text-amber-700 mt-1 font-semibold">Risk: {preview.risk_rating}</div>
          </div>
        </div>

        {/* Top Demand Anchors */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Building className="h-4 w-4 text-emerald-600" />
            <span>Key Footfall Demand Drivers Detected:</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-700">
            {preview.top_3_anchors.map((anchor, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{anchor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teaser Snippet */}
        <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
          "{preview.executive_teaser_snippet}"
        </div>

        {/* Action CTAs */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleGoToReport}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Full 10-Section Dossier &amp; Break-Even Math</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="text-center text-xs text-slate-500 font-medium">
            Preliminary scan is free • Instant full report unlock at ₹799 (UPI / Cards / NetBanking)
          </div>
        </div>
      </div>
    </div>
  );
}
