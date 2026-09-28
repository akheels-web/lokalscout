"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight, ShieldCheck, Sparkles, Store } from "lucide-react";
import { fetchLocations } from "@/lib/api";

const CATEGORIES = [
  { id: "Specialty Coffee Shop & Cafe", label: "Specialty Coffee & Cafe", icon: "☕", capex: "₹15L–₹35L Capex" },
  { id: "Dental Clinic & Diagnostics", label: "Dental Clinic & Diagnostics", icon: "🦷", capex: "₹20L–₹50L Capex" },
  { id: "Unisex Salon & Luxury Spa", label: "Unisex Salon & Spa", icon: "✂️", capex: "₹18L–₹40L Capex" },
  { id: "Cloud Kitchen / QSR Hub", label: "Cloud Kitchen / QSR Hub", icon: "🍲", capex: "₹10L–₹25L Capex" },
  { id: "Functional Gym & Fitness Studio", label: "Gym & Fitness Studio", icon: "🏋️", capex: "₹25L–₹60L Capex" },
  { id: "Retail Pharmacy & Chemist", label: "Pharmacy & Chemist", icon: "💊", capex: "₹12L–₹30L Capex" },
  { id: "Artisanal Bakery & Patisserie", label: "Bakery & Patisserie", icon: "🥐", capex: "₹15L–₹30L Capex" },
];

export function SearchHero({ onSearch }: { onSearch?: (category: string, locality: string) => void }) {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [localityQuery, setLocalityQuery] = useState("Madhapur, Hyderabad");
  const [suggestions, setSuggestions] = useState<Array<{ locality: string; city: string; label: string; pincode: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localityQuery.length >= 2) {
      fetchLocations(localityQuery).then((res) => setSuggestions(res.slice(0, 5)));
    } else {
      setSuggestions([]);
    }
  }, [localityQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localityQuery.trim()) return;
    setIsLoading(true);

    if (onSearch) {
      onSearch(category, localityQuery);
      setIsLoading(false);
    } else {
      const encodedCategory = encodeURIComponent(category);
      const encodedLocality = encodeURIComponent(localityQuery);
      router.push(`/report/new?category=${encodedCategory}&locality=${encodedLocality}`);
    }
  };

  const handleSelectQuick = (cat: string, loc: string) => {
    setCategory(cat);
    setLocalityQuery(loc);
    if (onSearch) {
      onSearch(cat, loc);
    } else {
      router.push(`/report/new?category=${encodeURIComponent(cat)}&locality=${encodeURIComponent(loc)}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-2xl shadow-slate-200/70 space-y-4 transition-all"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          {/* Category Dropdown */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-emerald-600" />
              <span>What business are you opening?</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 text-slate-900 font-semibold text-sm rounded-2xl px-4 py-3.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white text-slate-900 font-normal">
                    {cat.icon} {cat.label} ({cat.capex})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Locality Input */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Where are you scouting?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={localityQuery}
                onChange={(e) => {
                  setLocalityQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g. Madhapur, Indiranagar, 500081"
                className="w-full bg-slate-50 hover:bg-slate-100/70 text-slate-900 font-semibold text-sm rounded-2xl px-4 py-3.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white placeholder:text-slate-400 placeholder:font-normal transition-all"
              />
              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLocalityQuery(`${s.locality}, ${s.city}`);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 border-b border-slate-100 last:border-0 flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold">{s.label}</span>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">PIN {s.pincode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="md:col-span-3 pt-2 md:pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <span className="animate-pulse">Scouting Area...</span>
              ) : (
                <>
                  <span>Audit Location</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Popular Quick Select Chips */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-medium">Quick Examples:</span>
            <button
              type="button"
              onClick={() => handleSelectQuick("Specialty Coffee Shop & Cafe", "Madhapur, Hyderabad")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              ☕ Madhapur, Hyd
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuick("Dental Clinic & Diagnostics", "Indiranagar, Bengaluru")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              🦷 Indiranagar, Blr
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuick("Unisex Salon & Luxury Spa", "Bandra West, Mumbai")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              ✂️ Bandra, Mum
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-600 text-xs font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Instant 30-Sec Analysis</span>
          </div>
        </div>
      </form>
    </div>
  );
}
