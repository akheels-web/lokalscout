"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2, ShieldCheck, ArrowRight, Building } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-900 font-mono">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            PRELIMINARY FEASIBILITY SCAN
          </span>
          <h2 className="text-xl font-bold text-slate-900 font-sans tracking-tight mt-1">
            {preview.business_vertical}
          </h2>
          <div className="text-xs text-slate-500 font-mono">
            Target Precinct: <span className="text-slate-900 font-semibold">{preview.locality}, {preview.city}</span>
          </div>
        </div>

        {/* Teaser Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase text-slate-500 font-bold">FEASIBILITY INDEX</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              {preview.overall_score}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
            <div className="text-[11px] text-slate-700 mt-1 font-sans font-medium">{preview.viability_status}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase text-slate-500 font-bold">COMPETITOR UNITS</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {preview.competitor_count_2km}
              <span className="text-xs text-slate-400 font-normal"> (2km buffer)</span>
            </div>
            <div className="text-[11px] text-amber-700 mt-1 font-sans font-semibold">Risk: {preview.risk_rating}</div>
          </div>
        </div>

        {/* Top Demand Anchors */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
            <Building className="h-4 w-4 text-emerald-600" />
            Top Footfall Demand Anchors Detected:
          </div>
          <div className="space-y-1.5 text-xs text-slate-700 font-sans">
            {preview.top_3_anchors.map((anchor, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{anchor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teaser Snippet */}
        <div className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
          "{preview.executive_teaser_snippet}"
        </div>

        {/* Action CTAs */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleGoToReport}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
          >
            <span>Open Dossier &amp; View Break-Even Simulator</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="text-center text-[11px] text-slate-500 font-sans">
            Sections 1 &amp; 2 free to view • Full 10-section unlock at ₹799 via Cashfree PG
          </div>
        </div>
      </div>
    </div>
  );
}
