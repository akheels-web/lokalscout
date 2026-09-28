"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Terminal, ArrowRight, ShieldCheck } from "lucide-react";
import { fetchLocations } from "@/lib/api";

const CATEGORIES = [
  { id: "Specialty Coffee Shop & Cafe", label: "Specialty Coffee Shop & Cafe", nic: "NIC 56101", capex: "₹25L–₹35L" },
  { id: "Dental Clinic & Diagnostics", label: "Dental Clinic & Diagnostics", nic: "NIC 86201", capex: "₹28L–₹50L" },
  { id: "Unisex Salon & Luxury Spa", label: "Unisex Salon & Luxury Spa", nic: "NIC 96020", capex: "₹22L–₹40L" },
  { id: "Cloud Kitchen / QSR Hub", label: "Cloud Kitchen / QSR Delivery Hub", nic: "NIC 56210", capex: "₹12L–₹22L" },
  { id: "Functional Gym & Fitness Studio", label: "Functional Gym & Fitness Studio", nic: "NIC 93110", capex: "₹35L–₹65L" },
  { id: "Retail Pharmacy & Chemist", label: "Retail Pharmacy & Chemist", nic: "NIC 47721", capex: "₹15L–₹28L" },
  { id: "Artisanal Bakery & Patisserie", label: "Artisanal Bakery & Patisserie", nic: "NIC 10712", capex: "₹18L–₹32L" },
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
    <div className="w-full max-w-4xl mx-auto font-mono">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-xl shadow-slate-200/50 space-y-4"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2.5 border-b border-slate-100">
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Terminal className="h-3.5 w-3.5" />
            ENTERPRISE QUERY CONSOLE
          </span>
          <span className="text-slate-500 font-mono">GIS ENGINE: NOMINATIM / OVERPASS v2.6</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Category Dropdown */}
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-bold mb-1">
              Industry Classification
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 font-medium text-xs rounded-xl px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white text-slate-900">
                    [{cat.nic}] {cat.label} ({cat.capex})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Locality Input */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-bold mb-1">
              Target Precinct or Pin Code
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
                placeholder="e.g. Madhapur or 500081"
                className="w-full bg-slate-50 text-slate-900 font-medium text-xs rounded-xl px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-emerald-600 focus:bg-white placeholder:text-slate-400"
              />
              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLocalityQuery(`${s.locality}, ${s.city}`);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 border-b border-slate-100 last:border-0 flex items-center justify-between"
                    >
                      <span className="font-semibold">{s.label}</span>
                      <span className="text-[10px] text-slate-500">PIN: {s.pincode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="md:col-span-3 pt-4 md:pt-0">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <span className="animate-pulse">Scouting Area...</span>
              ) : (
                <>
                  <span>Execute Feasibility Audit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold">Sample Precincts:</span>
            <button
              type="button"
              onClick={() => handleSelectQuick("Specialty Coffee Shop & Cafe", "Madhapur, Hyderabad")}
              className="text-emerald-700 hover:text-emerald-900 underline underline-offset-2 font-medium"
            >
              Madhapur Coffee
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleSelectQuick("Dental Clinic & Diagnostics", "Indiranagar, Bengaluru")}
              className="text-emerald-700 hover:text-emerald-900 underline underline-offset-2 font-medium"
            >
              Indiranagar Dental
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleSelectQuick("Unisex Salon & Luxury Spa", "Bandra West, Mumbai")}
              className="text-emerald-700 hover:text-emerald-900 underline underline-offset-2 font-medium"
            >
              Bandra Salon
            </button>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Cashfree PG Verified</span>
          </div>
        </div>
      </form>
    </div>
  );
}
