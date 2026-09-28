"use client";

import React, { useState } from "react";
import { MapPin, Building2, Train, ShoppingBag, Users, Layers, Activity, Navigation, Footprints } from "lucide-react";

interface Hotspot {
  id: string;
  name: string;
  category: string;
  distance: string;
  footfallImpact: string;
  x: number; // percentage
  y: number; // percentage
  icon: any;
}

const SAMPLE_HOTSPOTS: Record<string, { city: string; coords: string; rent: string; footfall: string; sat: string; spots: Hotspot[] }> = {
  madhapur: {
    city: "Madhapur Tech Corridor, Hyderabad",
    coords: "Near Mindspace & Blue Line Metro",
    rent: "₹110 – ₹135 / sq.ft",
    footfall: "92,400+ daily footfall",
    sat: "High Demand (24 competitors)",
    spots: [
      { id: "1", name: "Mindspace IT Park", category: "Corporate Campus", distance: "0.4 km", footfallImpact: "120,000+ daytime workforce", x: 45, y: 35, icon: Building2 },
      { id: "2", name: "Madhapur Metro Hub", category: "Transit Station", distance: "0.3 km", footfallImpact: "38,000 commuters / day", x: 55, y: 52, icon: Train },
      { id: "3", name: "Inorbit Galleria", category: "Regional Retail", distance: "1.1 km", footfallImpact: "High weekend social footfall", x: 72, y: 40, icon: ShoppingBag },
      { id: "4", name: "My Home Bhooja", category: "Luxury Residential", distance: "0.8 km", footfallImpact: "4,200+ HNI households", x: 30, y: 65, icon: Users },
    ],
  },
  indiranagar: {
    city: "100ft Road, Indiranagar, Bengaluru",
    coords: "Near Metro & CMH Hospital",
    rent: "₹185 – ₹230 / sq.ft",
    footfall: "76,800+ daily footfall",
    sat: "Underserved Niche (11 competitors)",
    spots: [
      { id: "1", name: "CMH Hospital Corridor", category: "Healthcare Hub", distance: "0.5 km", footfallImpact: "Steady all-day patients & visitors", x: 40, y: 42, icon: Building2 },
      { id: "2", name: "Indiranagar Metro", category: "Transit Hub", distance: "0.6 km", footfallImpact: "Purple Line commuter transit", x: 60, y: 30, icon: Train },
      { id: "3", name: "100ft High Street", category: "Premium Retail", distance: "0.1 km", footfallImpact: "High disposable income shoppers", x: 50, y: 55, icon: ShoppingBag },
    ],
  },
  bandra: {
    city: "Hill Road, Bandra West, Mumbai",
    coords: "Near Bandra Station & Pali Hill",
    rent: "₹340 – ₹420 / sq.ft",
    footfall: "115,000+ daily footfall",
    sat: "High Competition (29 competitors)",
    spots: [
      { id: "1", name: "Hill Road Promenade", category: "Fashion High Street", distance: "0.1 km", footfallImpact: "Intense evening pedestrian footfall", x: 52, y: 48, icon: ShoppingBag },
      { id: "2", name: "Bandra Suburban Station", category: "Transit Gateway", distance: "1.2 km", footfallImpact: "Western Railway commuter artery", x: 75, y: 60, icon: Train },
      { id: "3", name: "Pali Hill Enclaves", category: "Affluent Residential", distance: "0.7 km", footfallImpact: "HNIs & luxury consumers", x: 32, y: 38, icon: Users },
    ],
  },
};

export function InteractiveGisCreative() {
  const [activeKey, setActiveKey] = useState("madhapur");
  const [selectedSpot, setSelectedSpot] = useState<Hotspot | null>(SAMPLE_HOTSPOTS["madhapur"].spots[0]);
  const [catchmentMode, setCatchmentMode] = useState<"5min" | "10min" | "radial">("5min");

  const activeData = SAMPLE_HOTSPOTS[activeKey];

  return (
    <div className="w-full rounded-3xl p-5 md:p-6 space-y-4 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 font-sans">
      {/* Top Header & Precinct Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Footprints className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              Live Footfall &amp; Catchment Radar
            </div>
            <div className="text-xs text-slate-500">
              {activeData.coords}
            </div>
          </div>
        </div>

        {/* Precinct Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveKey("madhapur");
              setSelectedSpot(SAMPLE_HOTSPOTS["madhapur"].spots[0]);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeKey === "madhapur"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Madhapur (Hyd)
          </button>
          <button
            onClick={() => {
              setActiveKey("indiranagar");
              setSelectedSpot(SAMPLE_HOTSPOTS["indiranagar"].spots[0]);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeKey === "indiranagar"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Indiranagar (Blr)
          </button>
          <button
            onClick={() => {
              setActiveKey("bandra");
              setSelectedSpot(SAMPLE_HOTSPOTS["bandra"].spots[0]);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeKey === "bandra"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bandra West (Mum)
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative h-[290px] md:h-[330px] rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
        {/* Subtle Map Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-60 pointer-events-none" />

        {/* Catchment Mode Toggle Overlay */}
        <div className="absolute left-3 top-3 z-30 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl shadow-sm text-xs font-semibold">
          <button
            onClick={() => setCatchmentMode("5min")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              catchmentMode === "5min"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            5-Min Walk
          </button>
          <button
            onClick={() => setCatchmentMode("10min")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              catchmentMode === "10min"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            10-Min Walk
          </button>
          <button
            onClick={() => setCatchmentMode("radial")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              catchmentMode === "radial"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            2.5 km Area
          </button>
        </div>

        {/* Catchment Geometries based on mode */}
        {catchmentMode === "radial" ? (
          <>
            {/* Concentric Footfall Buffer Rings */}
            <div className="absolute h-[240px] w-[240px] rounded-full border border-emerald-300/40 bg-emerald-500/5 animate-pulse" />
            <div className="absolute h-[160px] w-[160px] rounded-full border border-emerald-400/50 bg-emerald-500/5" />
            <div className="absolute h-[80px] w-[80px] rounded-full border border-emerald-500/60 bg-emerald-500/10 flex items-center justify-center">
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-200" />
            </div>
          </>
        ) : catchmentMode === "5min" ? (
          <>
            {/* 5-Min Pedestrian Walkshed Polygon (Asymmetric True Walking Boundary) */}
            <div className="absolute h-[120px] w-[150px] rounded-[45%_55%_60%_40%/50%_60%_40%_50%] border-2 border-dashed border-emerald-500 bg-emerald-500/15 flex items-center justify-center animate-pulse">
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-200" />
            </div>
            {/* Urban barrier line representation */}
            <div className="absolute left-1/4 right-1/4 h-[2px] bg-amber-400/80 -translate-y-8 pointer-events-none" />
            <span className="absolute -translate-y-11 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Divided Road Barrier
            </span>
          </>
        ) : (
          <>
            {/* 10-Min Pedestrian Walkshed Polygon */}
            <div className="absolute h-[210px] w-[230px] rounded-[55%_45%_50%_50%/45%_55%_45%_55%] border-2 border-emerald-500/70 bg-emerald-500/10 flex items-center justify-center">
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-200" />
            </div>
          </>
        )}

        {/* Center Target Marker */}
        <div className="absolute z-10 text-center pointer-events-none -mt-10">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-md">
            Candidate Shop Location
          </span>
        </div>

        {/* Mode & Radius Labels */}
        <span className="absolute right-3 top-3 text-[11px] font-semibold text-slate-600 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
          {catchmentMode === "5min" ? "5-Min Walk (~380m reach)" : catchmentMode === "10min" ? "10-Min Walk (~780m reach)" : "2.5 km Area Catchment"}
        </span>
        <span className="absolute right-4 bottom-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          {activeData.city}
        </span>

        {/* Interactive Hotspot Pins */}
        {activeData.spots.map((spot) => {
          const isSelected = selectedSpot?.id === spot.id;
          const IconComponent = spot.icon;
          return (
            <button
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-md ${
                isSelected
                  ? "bg-emerald-600 text-white ring-4 ring-emerald-200 scale-105"
                  : "bg-white text-slate-800 border border-slate-200 hover:border-emerald-500 hover:scale-105"
              }`}
            >
              <IconComponent className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[130px]">{spot.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Anchor Details */}
      {selectedSpot && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
              Selected Demand Driver: {selectedSpot.category}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {selectedSpot.name} • {selectedSpot.distance} from shop
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {selectedSpot.footfallImpact}
            </div>
          </div>

          <div className="flex items-center gap-6 text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Fair Market Rent</div>
              <div className="font-bold text-slate-900 text-sm">{activeData.rent}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Competition Level</div>
              <div className="font-bold text-emerald-700 text-sm">{activeData.sat}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
