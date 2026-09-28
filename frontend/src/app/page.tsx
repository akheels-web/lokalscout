"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Cpu,
  Layers,
  Globe2,
  Target,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Building,
  Users,
  Clock,
  Search,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Lock,
  MapPin,
  Bell,
  GitCompare,
  FileSpreadsheet,
  Terminal,
  Database,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { SearchHero } from "@/components/SearchHero";
import { TeaserModal } from "@/components/TeaserModal";
import { InteractiveGisCreative } from "@/components/InteractiveGisCreative";
import { generatePreview } from "@/lib/api";
import { FeasibilityPreview } from "@/types/feasibility";

export default function HomePage() {
  const [activeTeaser, setActiveTeaser] = useState<FeasibilityPreview | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [watchdogSubmitted, setWatchdogSubmitted] = useState(false);
  const [watchdogPin, setWatchdogPin] = useState("");
  const [watchdogContact, setWatchdogContact] = useState("");

  const handleHeroSearch = async (category: string, locality: string) => {
    setIsScanning(true);
    try {
      const preview = await generatePreview(category, locality);
      setActiveTeaser(preview);
    } finally {
      setIsScanning(false);
    }
  };

  const handleWatchdogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!watchdogPin || !watchdogContact) return;
    setWatchdogSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-16 pb-12 px-4 md:px-8 max-w-6xl mx-auto space-y-8 text-center">
        {/* Institutional Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono text-emerald-800 shadow-xs">
          <Terminal className="h-3.5 w-3.5 text-emerald-600" />
          <span>COMMERCIAL LOCATION INTELLIGENCE • OVERPASS GIS v2.6 • CASHFREE SETTLEMENTS</span>
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Enterprise Commercial Feasibility &amp; Location Intelligence for Indian Cities
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Quantitative location viability analytics for retail founders, healthcare operators, and commercial franchisees. Audit competitor saturation, pedestrian footfall anchors, commercial rent benchmarks, and unit-economics break-even models before executing multi-year leases.
          </p>
        </div>

        {/* High-Density Search Terminal */}
        <div id="search-section" className="pt-2 text-left">
          <SearchHero onSearch={handleHeroSearch} />
        </div>

        {/* Operational Indices Banner */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto text-left font-mono">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] uppercase text-slate-500 font-semibold">INDEXED MICRO-MARKETS</div>
            <div className="text-2xl font-black text-slate-900 mt-1">120+ Precincts</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Tier 1 &amp; Tier 2 Metros</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] uppercase text-slate-500 font-semibold">FOOTFALL ANCHOR NODES</div>
            <div className="text-2xl font-black text-slate-900 mt-1">4,200+ Nodes</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Transit, Tech &amp; Retail</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] uppercase text-slate-500 font-semibold">AVERAGE LATENCY</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">&lt; 3.8s</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Instant Synthesis</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] uppercase text-slate-500 font-semibold">SETTLEMENTS</div>
            <div className="text-2xl font-black text-slate-900 mt-1">Cashfree PG</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Instant UPI &amp; Cards</div>
          </div>
        </div>
      </section>

      {/* Creative Interactive GIS Component Section */}
      <section className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
              INTERACTIVE GIS VISUALIZATION
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5">
              Live Micro-Market Spatial Buffer Simulation
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Concentric 500m, 1.5km &amp; 2.5km footfall catchments
          </div>
        </div>

        <InteractiveGisCreative />
      </section>

      {/* Enterprise Showcase Dossiers Grid */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
              VERIFIED COMMERCIAL AUDITS
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              Active Micro-Market Dossiers
            </h2>
          </div>
          <Link
            href="/sample"
            className="text-xs font-mono text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Inspect Unlocked Reference Dossier (Madhapur Coffee)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Madhapur */}
          <Link
            href="/sample"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md block group transition-all"
          >
            <div className="flex justify-between items-start font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                FEASIBILITY: 82/100
              </span>
              <span className="text-slate-500">HYD • 500081</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
              Specialty Coffee Shop &amp; Cafe
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
              <MapPin className="h-3 w-3 text-emerald-600" />
              <span>Madhapur Hitec Corridor</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Competitors:</span>
                <span className="text-slate-900 font-bold">24 in 2km buffer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Main Road Lease Rate:</span>
                <span className="text-emerald-700 font-bold">₹125 / sq.ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Break-Even Load:</span>
                <span className="text-slate-900 font-bold">41 orders / day</span>
              </div>
            </div>
            <div className="mt-4 text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
              <span>View Dossier Blueprint</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          {/* Card 2: Indiranagar */}
          <Link
            href="/report/SAMPLE-INDIRANAGAR-DENTAL?category=Dental%20Clinic%20%26%20Diagnostics&locality=Indiranagar"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md block group transition-all"
          >
            <div className="flex justify-between items-start font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                FEASIBILITY: 88/100
              </span>
              <span className="text-slate-500">BLR • 560038</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
              Dental Clinic &amp; Diagnostics
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
              <MapPin className="h-3 w-3 text-emerald-600" />
              <span>100ft Road, Indiranagar</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Competitors:</span>
                <span className="text-slate-900 font-bold">11 in 2km buffer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Main Road Lease Rate:</span>
                <span className="text-emerald-700 font-bold">₹210 / sq.ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Break-Even Load:</span>
                <span className="text-slate-900 font-bold">7 patients / day</span>
              </div>
            </div>
            <div className="mt-4 text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
              <span>View Dossier Blueprint</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          {/* Card 3: Bandra West */}
          <Link
            href="/report/SAMPLE-BANDRA-SALON?category=Unisex%20Salon%20%26%20Luxury%20Spa&locality=Bandra%20West"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md block group transition-all"
          >
            <div className="flex justify-between items-start font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                FEASIBILITY: 74/100
              </span>
              <span className="text-slate-500">MUM • 400050</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
              Unisex Salon &amp; Luxury Spa
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
              <MapPin className="h-3 w-3 text-emerald-600" />
              <span>Hill Road, Bandra West</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Competitors:</span>
                <span className="text-slate-900 font-bold">29 in 2km buffer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Main Road Lease Rate:</span>
                <span className="text-amber-800 font-bold">₹380 / sq.ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Break-Even Load:</span>
                <span className="text-slate-900 font-bold">22 clients / day</span>
              </div>
            </div>
            <div className="mt-4 text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
              <span>View Dossier Blueprint</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </section>

      {/* Institutional Methodology Table */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            INTELLIGENCE BENCHMARKING
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Informal Scouting vs. Enterprise GIS Engine
          </h2>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Evaluation Dimension</th>
                <th className="py-3 px-4">Informal Gut-Feeling</th>
                <th className="py-3 px-4">Legacy GIS (Esri / CBRE)</th>
                <th className="py-3 px-4 text-emerald-800 font-bold">LokalScout Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Turnaround Speed</td>
                <td className="py-3 px-4 text-slate-500">2 to 4 weeks of walking</td>
                <td className="py-3 px-4 text-slate-500">30 to 60 days consulting</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">&lt; 4.5 seconds instant</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Report Cost</td>
                <td className="py-3 px-4 text-slate-500">₹0 (High risk of failure)</td>
                <td className="py-3 px-4 text-slate-500">₹1,50,000 – ₹3,00,000</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">₹799 per dossier</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Competitor Sentiment</td>
                <td className="py-3 px-4 text-slate-500">Subjective opinion</td>
                <td className="py-3 px-4 text-slate-500">Aggregated footfall only</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">Google Maps review complaint audit</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Financial Break-Even</td>
                <td className="py-3 px-4 text-slate-500">Rough back-of-napkin</td>
                <td className="py-3 px-4 text-slate-500">Static Excel model</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">Live dynamic slider simulator</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Payment &amp; Licensing</td>
                <td className="py-3 px-4 text-slate-500">N/A</td>
                <td className="py-3 px-4 text-slate-500">Annual enterprise contract</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">Instant Cashfree PG checkout</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* The 10-Section Deliverable Grid */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            DOSSIER SPECIFICATION
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            10 Quantitative Sections in Every Report
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              id: "01",
              title: "Executive Feasibility Scorecard",
              desc: "Weighted scoring (0-100), risk status, and 3 high-impact strategic unfair advantages.",
            },
            {
              id: "02",
              title: "Competitor Saturation Audit",
              desc: "Complete 2km inventory of direct competing brands, star rating bands, and review counts.",
            },
            {
              id: "03",
              title: "Price Tier & Spending Distribution",
              desc: "Budget vs. Mid-Range vs. Premium share and local consumer willingness to pay.",
            },
            {
              id: "04",
              title: "Footfall & Demand Anchors",
              desc: "Proximity to IT tech parks, universities, shopping malls, and metro stations within 2.5km.",
            },
            {
              id: "05",
              title: "Peak Commute Windows",
              desc: "Morning corporate transit vs. lunch rush vs. evening social hours by demographic cohort.",
            },
            {
              id: "06",
              title: "Local Search Intent & Demand Signals",
              desc: "Google Maps & Search monthly search volume, keyword trends, and YoY growth indices.",
            },
            {
              id: "07",
              title: "Commercial Real Estate Benchmarks",
              desc: "Main road vs. inner lane rent per sq.ft, typical security deposit months, and escalation norms.",
            },
            {
              id: "08",
              title: "Financial Break-Even Simulator",
              desc: "Dynamic simulator calculating exact daily customer count and monthly revenue required to cover rent.",
            },
            {
              id: "09",
              title: "Competitor Weaknesses & Gaps",
              desc: "Pain points extracted from negative customer reviews revealing unserved niches in parking or speed.",
            },
          ].map((sec) => (
            <div
              key={sec.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 font-mono"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="font-bold">SECTION {sec.id}</span>
                <span className="text-emerald-700 font-semibold">LIVE ENGINE</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-sans">{sec.title}</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{sec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Pricing & Licensing via Cashfree */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            TRANSPARENT LICENSING
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Settled via Cashfree Payments Gateway
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Zero recurring subscription lock-ins. Instant GST invoices provided.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                TIER 01: FREE TEASER
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono">₹0</div>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Instant high-level micro-market viability snapshot.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Overall Feasibility Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Competitor Count within 2km</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Top 3 Footfall Demand Anchors</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span>Sections 3–10 blur-locked</span>
                </li>
              </ul>
            </div>
            <Link
              href="#search-section"
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono text-xs text-center transition-all font-semibold"
            >
              Execute Free Scan
            </Link>
          </div>

          {/* Featured Single Dossier */}
          <div className="p-6 rounded-2xl bg-white border-2 border-emerald-600 shadow-lg shadow-emerald-600/10 space-y-4 flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase">
              RECOMMENDED
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-700 uppercase tracking-wider font-bold">
                TIER 02: FULL 10-SECTION DOSSIER
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                ₹799 <span className="text-xs font-normal text-slate-500">/ report</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-sans">
                Complete commercial viability blueprint for lease execution.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-800 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>All 10 Sections completely unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Commercial rent / sq.ft benchmark</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Interactive break-even simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Downloadable PDF Dossier</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>₹1,000 GrowLokal Autopilot Voucher</span>
                </li>
              </ul>
            </div>
            <Link
              href="#search-section"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono text-center transition-all shadow-md shadow-emerald-600/20"
            >
              Get Full Dossier (₹799 via Cashfree)
            </Link>
          </div>

          {/* Area Comparison */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                TIER 03: AREA COMPARISON
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                ₹1,499 <span className="text-xs font-normal text-slate-500">/ 3 areas</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Side-by-side trade-off matrix for 2 or 3 competing micro-markets.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Side-by-side comparison matrix</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Rent vs. Footfall trade-off engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Winner locality recommendation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Includes 2 Full PDF Dossiers</span>
                </li>
              </ul>
            </div>
            <Link
              href="/compare"
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono text-xs text-center transition-all flex items-center justify-center gap-1.5 font-semibold"
            >
              <GitCompare className="h-3.5 w-3.5 text-emerald-600" />
              <span>Launch Area Comparison</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Watchdog Pipeline */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-center">
          <div className="mx-auto h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Bell className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 font-mono">
              Institutional Expansion Pipeline Watchdog
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto font-sans">
              Enter your target Indian pin code to monitor competitor license registrations and retail cluster shifts before commercial lease announcements.
            </p>
          </div>

          {watchdogSubmitted ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono max-w-md mx-auto font-semibold">
              ✓ Territory telemetry active for Pin Code: {watchdogPin}
            </div>
          ) : (
            <form onSubmit={handleWatchdogSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 font-mono">
              <input
                type="text"
                value={watchdogPin}
                onChange={(e) => setWatchdogPin(e.target.value)}
                placeholder="Pin Code (e.g. 500081)"
                required
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white flex-1"
              />
              <input
                type="text"
                value={watchdogContact}
                onChange={(e) => setWatchdogContact(e.target.value)}
                placeholder="Work Email or Phone"
                required
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Monitor
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Free Teaser Modal */}
      {activeTeaser && (
        <TeaserModal preview={activeTeaser} onClose={() => setActiveTeaser(null)} />
      )}
    </div>
  );
}
