"use client";

import React, { useEffect, useState } from "react";
import { ReportDashboard } from "@/components/ReportDashboard";
import { getSampleReport } from "@/lib/api";
import { FeasibilityReport } from "@/types/feasibility";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SamplePage() {
  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSampleReport().then((data) => {
      setReport(data);
      setLoading(false);
    });
  }, []);

  if (loading || !report) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-slate-500 font-mono font-medium">Loading Live Showcase Dossier...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      {/* Sample Showcase Ribbon */}
      <div className="bg-emerald-50 border-b border-emerald-200 py-2.5 px-4 text-center text-xs text-emerald-900 flex items-center justify-center gap-3 font-mono">
        <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Scanner
        </Link>
        <span>•</span>
        <span className="flex items-center gap-1.5 font-bold text-emerald-800">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          Live Unlocked Showcase: Specialty Coffee Shop in Madhapur, Hyderabad
        </span>
      </div>

      <ReportDashboard initialReport={report} />
    </div>
  );
}
