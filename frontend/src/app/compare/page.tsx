"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GitCompare,
  Trophy,
  ArrowRight,
  MapPin,
  CheckCircle2,
  DollarSign,
  Users,
  Building,
  Sparkles,
  Download,
} from "lucide-react";
import { compareAreas } from "@/lib/api";
import { AreaComparisonReport } from "@/types/feasibility";
import { formatINR } from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "Specialty Coffee Shop & Cafe"
  );
  const [area1, setArea1] = useState(searchParams.get("loc1") || "Madhapur, Hyderabad");
  const [area2, setArea2] = useState("Gachibowli, Hyderabad");
  const [area3, setArea3] = useState("Jubilee Hills, Hyderabad");
  const [report, setReport] = useState<AreaComparisonReport | null>(null);
  const [loading, setLoading] = useState(false);

  const runComparison = async () => {
    setLoading(true);
    try {
      const activeAreas = [area1, area2, area3].filter(Boolean);
      const res = await compareAreas(category, activeAreas);
      setReport(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComparison();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8 font-sans text-slate-900">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
          <GitCompare className="h-3.5 w-3.5 text-emerald-600" />
          <span>MULTI-AREA COMPARATIVE MATRIX</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Compare 2 or 3 Commercial Precincts Side-by-Side
        </h1>
        <p className="text-xs md:text-sm text-slate-600">
          Decide between competing locations with an objective matrix comparing commercial rent, competitor saturation, and footfall ROI.
        </p>
      </div>

      {/* Input Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-4xl mx-auto font-mono">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Business Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Area 1 (Primary)
            </label>
            <input
              type="text"
              value={area1}
              onChange={(e) => setArea1(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Area 2 (Competing)
            </label>
            <input
              type="text"
              value={area2}
              onChange={(e) => setArea2(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Area 3 (Optional)
            </label>
            <input
              type="text"
              value={area3}
              onChange={(e) => setArea3(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={runComparison}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer font-mono"
          >
            {loading ? <span>Analyzing Trade-Offs...</span> : <span>Run Side-by-Side Comparison</span>}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {report && (
        <div className="space-y-6 animate-fade-in font-mono">
          {/* Winner Banner */}
          <div className="p-6 md:p-8 rounded-2xl bg-white border-2 border-emerald-600 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] uppercase font-bold text-emerald-800">
                  OPTIMAL RISK-ADJUSTED WINNER
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-sans">{report.winner_locality}</h3>
                <p className="text-xs text-slate-600 max-w-2xl font-sans">{report.winner_rationale}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Download className="h-4 w-4" /> Export Comparison PDF
              </button>
            </div>
          </div>

          {/* Head-to-Head Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.items.map((item, idx) => {
              const isWinner = item.locality.toLowerCase().includes(report.winner_locality.toLowerCase());
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-white border flex flex-col justify-between space-y-6 ${
                    isWinner
                      ? "border-emerald-600 shadow-md ring-2 ring-emerald-100"
                      : "border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          PRECINCT 0{idx + 1}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 font-sans mt-0.5">{item.locality}</h4>
                      </div>
                      {isWinner && (
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase">
                          Winner
                        </span>
                      )}
                    </div>

                    {/* Score */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">
                        FEASIBILITY INDEX
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-1">
                        {item.overall_score}{" "}
                        <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </div>
                      <div className="text-xs text-emerald-700 mt-1 font-semibold font-sans">
                        {item.viability_status}
                      </div>
                    </div>

                    {/* Metrics Table */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Main Road Commercial Rent:</span>
                        <span className="font-bold text-slate-900">₹{item.avg_rent_sqft} / sq.ft</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Competitors (2km):</span>
                        <span className="font-bold text-slate-900">{item.competitor_count} units</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Daily Footfall Score:</span>
                        <span className="font-bold text-emerald-700">{item.daily_footfall_score}/100</span>
                      </div>
                    </div>

                    {/* Recommended Positioning */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500">
                        RECOMMENDED FORMAT
                      </div>
                      <div className="text-xs font-bold text-slate-900 font-sans">{item.recommended_positioning}</div>
                    </div>

                    <div className="text-xs text-slate-600 italic font-sans">
                      "{item.verdict}"
                    </div>
                  </div>

                  <a
                    href={`/report/new?category=${encodeURIComponent(category)}&locality=${encodeURIComponent(item.locality)}`}
                    className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Single Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
