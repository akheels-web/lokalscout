"use client";

import React, { useState } from "react";
import { MapPin, Building2, Train, ShoppingBag, GraduationCap, Users, Layers, Activity } from "lucide-react";

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
    city: "Madhapur, Hitec Corridor, Hyderabad",
    coords: "17.4483° N, 78.3915° E",
    rent: "₹110 – ₹135 / sq.ft",
    footfall: "92,400+ daily transit",
    sat: "High Demand (24 competitors)",
    spots: [
      { id: "1", name: "Mindspace IT Park", category: "Corporate Campus", distance: "0.4 km", footfallImpact: "120,000+ workforce", x: 45, y: 35, icon: Building2 },
      { id: "2", name: "Madhapur Metro Hub", category: "Transit Interchange", distance: "0.3 km", footfallImpact: "38,000 commuters/day", x: 55, y: 52, icon: Train },
      { id: "3", name: "Inorbit Galleria", category: "Regional Retail", distance: "1.1 km", footfallImpact: "Weekend social peak", x: 72, y: 40, icon: ShoppingBag },
      { id: "4", name: "My Home Bhooja", category: "Luxury Residential", distance: "0.8 km", footfallImpact: "4,200+ HNI households", x: 30, y: 65, icon: Users },
    ],
  },
  indiranagar: {
    city: "100ft Road, Indiranagar, Bengaluru",
    coords: "12.9784° N, 77.6408° E",
    rent: "₹185 – ₹230 / sq.ft",
    footfall: "76,800+ daily transit",
    sat: "Underserved Niche (11 competitors)",
    spots: [
      { id: "1", name: "CMH Hospital Corridor", category: "Healthcare Hub", distance: "0.5 km", footfallImpact: "Medical footfall", x: 40, y: 42, icon: Building2 },
      { id: "2", name: "Indiranagar Metro", category: "Transit Hub", distance: "0.6 km", footfallImpact: "Purple Line transit", x: 60, y: 30, icon: Train },
      { id: "3", name: "100ft High Street", category: "Premium Retail", distance: "0.1 km", footfallImpact: "High disposable income", x: 50, y: 55, icon: ShoppingBag },
    ],
  },
  bandra: {
    city: "Hill Road, Bandra West, Mumbai",
    coords: "19.0596° N, 72.8295° E",
    rent: "₹340 – ₹420 / sq.ft",
    footfall: "115,000+ daily transit",
    sat: "High Competition (29 competitors)",
    spots: [
      { id: "1", name: "Hill Road Promenade", category: "Fashion High Street", distance: "0.1 km", footfallImpact: "Intense pedestrian flux", x: 52, y: 48, icon: ShoppingBag },
      { id: "2", name: "Bandra Suburban Station", category: "Transit Gateway", distance: "1.2 km", footfallImpact: "Western Railway artery", x: 75, y: 60, icon: Train },
      { id: "3", name: "Pali Hill Enclaves", category: "Ultra-HNI Catchment", distance: "0.7 km", footfallImpact: "Celebrity & CXO demographic", x: 32, y: 38, icon: Users },
    ],
  },
};

export function InteractiveGisCreative() {
  const [activeKey, setActiveKey] = useState("madhapur");
  const [selectedSpot, setSelectedSpot] = useState<Hotspot | null>(SAMPLE_HOTSPOTS["madhapur"].spots[0]);

  const activeData = SAMPLE_HOTSPOTS[activeKey];

  return (
    <div className="w-full enterprise-card rounded-2xl p-4 md:p-6 space-y-4 bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
      {/* Top Header & Precinct Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wide">
              LIVE MICRO-MARKET GIS CATCHMENT
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {activeData.coords} • EPSG:4326 Projection
            </div>
          </div>
        </div>

        {/* Precinct Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg font-mono text-xs">
          <button
            onClick={() => {
              setActiveKey("madhapur");
              setSelectedSpot(SAMPLE_HOTSPOTS["madhapur"].spots[0]);
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeKey === "madhapur"
                ? "bg-white text-slate-900 font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Madhapur
          </button>
          <button
            onClick={() => {
              setActiveKey("indiranagar");
              setSelectedSpot(SAMPLE_HOTSPOTS["indiranagar"].spots[0]);
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeKey === "indiranagar"
                ? "bg-white text-slate-900 font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Indiranagar
          </button>
          <button
            onClick={() => {
              setActiveKey("bandra");
              setSelectedSpot(SAMPLE_HOTSPOTS["bandra"].spots[0]);
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeKey === "bandra"
                ? "bg-white text-slate-900 font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bandra West
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative h-[280px] md:h-[320px] rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
        {/* Subtle Map Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-70 pointer-events-none" />

        {/* Concentric Footfall Buffer Rings */}
        <div className="absolute h-[240px] w-[240px] rounded-full border border-emerald-300/40 bg-emerald-500/5 animate-pulse" />
        <div className="absolute h-[160px] w-[160px] rounded-full border border-emerald-400/50 bg-emerald-500/5" />
        <div className="absolute h-[80px] w-[80px] rounded-full border border-emerald-500/60 bg-emerald-500/10 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-emerald-200" />
        </div>

        {/* Center Target Marker */}
        <div className="absolute z-10 text-center pointer-events-none -mt-10">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold shadow-md">
            TARGET COMMERCIAL PARCEL
          </span>
        </div>

        {/* Radius Labels */}
        <span className="absolute left-6 top-4 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          GIS CATCHMENT BUFFER: 2,500m RADIUS
        </span>
        <span className="absolute right-4 bottom-3 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
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
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer shadow-md ${
                isSelected
                  ? "bg-emerald-600 text-white font-bold ring-4 ring-emerald-200 scale-105"
                  : "bg-white text-slate-800 border border-slate-300 hover:border-emerald-500 hover:scale-105"
              }`}
            >
              <IconComponent className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[130px]">{spot.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Anchor Telemetry Card */}
      {selectedSpot && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <div className="text-[10px] text-emerald-700 uppercase font-bold">
              SPOTLIGHT DEMAND ANCHOR: {selectedSpot.category}
            </div>
            <div className="text-sm font-bold text-slate-900 font-sans mt-0.5">
              {selectedSpot.name} • {selectedSpot.distance} from site
            </div>
            <div className="text-xs text-slate-600 font-sans mt-0.5">
              Impact Profile: {selectedSpot.footfallImpact}
            </div>
          </div>

          <div className="flex items-center gap-4 text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">PREVAILING LEASE</div>
              <div className="font-bold text-slate-900">{activeData.rent}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">SATURATION LEVEL</div>
              <div className="font-bold text-emerald-700">{activeData.sat}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
