"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ReportDashboard } from "@/components/ReportDashboard";
import { generateFullReport, fetchReportById } from "@/lib/api";
import { FeasibilityReport } from "@/types/feasibility";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function ReportContent({ id }: { id: string }) {
  const searchParams = useSearchParams();

  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reportId = id;
    const category = searchParams.get("category") || "Specialty Coffee Shop & Cafe";
    const locality = searchParams.get("locality") || "Madhapur, Hyderabad";

    if (reportId === "new" || !reportId.startsWith("LS-")) {
      generateFullReport(category, locality).then((data) => {
        // By default on new report, it starts locked so user sees teaser + blur
        setReport({ ...data, is_unlocked: false });
        setLoading(false);
      });
    } else {
      fetchReportById(reportId).then((data) => {
        setReport(data);
        setLoading(false);
      });
    }
  }, [id, searchParams]);

  if (loading || !report) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <div className="text-sm font-bold text-white">Synthesizing Location Intelligence...</div>
          <div className="text-xs text-slate-400">
            Querying OpenStreetMap footfall anchors, rental benchmarks, and competitor density.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Scanner</span>
        </Link>
      </div>

      <ReportDashboard initialReport={report} />
    </div>
  );
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs text-slate-400">Loading Feasibility Dashboard...</div>
        </div>
      }
    >
      <ReportContent id={resolvedParams.id} />
    </Suspense>
  );
}
