"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store,
  Crosshair,
  CheckCircle2,
} from "lucide-react";
import { fetchLocations, reverseGeocodeLocation } from "@/lib/api";

export const CATEGORIES = [
  { id: "Specialty Coffee Shop & Cafe", label: "Specialty Coffee & Cafe", icon: "☕", capex: "₹15L–₹35L Capex" },
  { id: "Dental Clinic & Diagnostics", label: "Dental Clinic & Diagnostics", icon: "🦷", capex: "₹20L–₹50L Capex" },
  { id: "Unisex Salon & Luxury Spa", label: "Unisex Salon & Spa", icon: "✂️", capex: "₹18L–₹40L Capex" },
  { id: "Cloud Kitchen / QSR Hub", label: "Cloud Kitchen / QSR Hub", icon: "🍲", capex: "₹10L–₹25L Capex" },
  { id: "Functional Gym & Fitness Studio", label: "Gym & Fitness Studio", icon: "🏋️", capex: "₹25L–₹60L Capex" },
  { id: "Retail Pharmacy & Chemist", label: "Pharmacy & Chemist", icon: "💊", capex: "₹12L–₹30L Capex" },
  { id: "Artisanal Bakery & Patisserie", label: "Bakery & Patisserie", icon: "🥐", capex: "₹15L–₹30L Capex" },
  { id: "Pet Clinic & Grooming Lounge", label: "Pet Clinic & Grooming Lounge", icon: "🐾", capex: "₹15L–₹35L Capex" },
  { id: "Boutique Coworking Space", label: "Boutique Coworking Space", icon: "💼", capex: "₹35L–₹70L Capex" },
  { id: "Fine Casual Dine-In Restaurant", label: "Fine Casual Restaurant & Bar", icon: "🍽️", capex: "₹35L–₹80L Capex" },
  { id: "Boutique Fashion & Designer Wear", label: "Boutique Fashion & Ethnic Wear", icon: "👗", capex: "₹20L–₹45L Capex" },
  { id: "Eyewear Store & Optometry", label: "Eyewear Store & Optometry", icon: "👓", capex: "₹15L–₹35L Capex" },
  { id: "Pathology & Diagnostic Lab", label: "Pathology & Diagnostic Lab", icon: "🔬", capex: "₹25L–₹55L Capex" },
  { id: "Preschool & Early Daycare", label: "Preschool & Early Daycare", icon: "🧸", capex: "₹20L–₹45L Capex" },
  { id: "Automobile Detailing & Ceramic Studio", label: "Automobile Detailing Studio", icon: "🚗", capex: "₹18L–₹40L Capex" },
  { id: "Organic Grocery & Gourmet Mart", label: "Organic Grocery & Gourmet Mart", icon: "🥑", capex: "₹20L–₹50L Capex" },
  { id: "Microbrewery & Craft Beer Taproom", label: "Microbrewery & Taproom", icon: "🍺", capex: "₹60L–₹1.5Cr Capex" },
  { id: "Artisanal Ice Cream & Dessert Parlor", label: "Ice Cream & Dessert Parlor", icon: "🍦", capex: "₹12L–₹25L Capex" },
  { id: "custom", label: "✨ Other / Custom Venture...", icon: "✨", capex: "Custom Capex" },
];

export function SearchHero({ onSearch }: { onSearch?: (category: string, locality: string) => void }) {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [customCategoryText, setCustomCategoryText] = useState("");
  const [localityQuery, setLocalityQuery] = useState("Madhapur, Hyderabad");
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ locality: string; city: string; label: string; pincode: string; lat?: string; lng?: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localityQuery.length >= 2) {
      fetchLocations(localityQuery).then((res) => setSuggestions(res.slice(0, 6)));
    } else {
      setSuggestions([]);
    }
  }, [localityQuery]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    setGpsStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setDetectedCoords({ lat: latitude, lng: longitude });

        try {
          const loc = await reverseGeocodeLocation(latitude, longitude);
          if (loc && loc.locality) {
            setLocalityQuery(`${loc.locality}, ${loc.city}`);
            setGpsStatus(`📍 GPS Locked: ${loc.locality}`);
          } else {
            setLocalityQuery(`Current Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
            setGpsStatus("📍 GPS Locked: Current Coordinates");
          }
        } catch (err) {
          console.warn("Reverse geocode failed:", err);
          setLocalityQuery(`Physical Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
          setGpsStatus("📍 GPS Locked");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsDetectingLocation(false);
        alert("Could not detect location. Please type your locality or allow location permissions.");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localityQuery.trim()) return;

    const finalCategory =
      category === "custom"
        ? customCategoryText.trim() || "Commercial Retail Store"
        : category;

    setIsLoading(true);

    if (onSearch) {
      onSearch(finalCategory, localityQuery);
      setIsLoading(false);
    } else {
      const encodedCategory = encodeURIComponent(finalCategory);
      const encodedLocality = encodeURIComponent(localityQuery);
      let targetUrl = `/report/new?category=${encodedCategory}&locality=${encodedLocality}`;
      if (detectedCoords) {
        targetUrl += `&lat=${detectedCoords.lat}&lng=${detectedCoords.lng}`;
      }
      router.push(targetUrl);
    }
  };

  const handleSelectQuick = (cat: string, loc: string) => {
    setCategory(cat);
    setLocalityQuery(loc);
    setDetectedCoords(null);
    setGpsStatus(null);
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
          {/* Category Dropdown & Custom Input */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-emerald-600" />
                <span>What business are you opening?</span>
              </span>
              {category === "custom" && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Custom Venture</span>
              )}
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

            {/* Custom Business Input Field */}
            {category === "custom" && (
              <div className="mt-2">
                <input
                  type="text"
                  autoFocus
                  value={customCategoryText}
                  onChange={(e) => setCustomCategoryText(e.target.value)}
                  placeholder="e.g. Artisanal Gelato, Pilates Studio, Board Game Cafe..."
                  className="w-full bg-emerald-50/60 hover:bg-emerald-50 text-slate-900 font-semibold text-xs rounded-xl px-3.5 py-2.5 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 focus:bg-white placeholder:text-slate-400 transition-all"
                />
              </div>
            )}
          </div>

          {/* Locality Input & GPS Auto-Detection */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>Where are you scouting?</span>
              </span>
              {gpsStatus && (
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>GPS Synced</span>
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={localityQuery}
                onChange={(e) => {
                  setLocalityQuery(e.target.value);
                  setShowSuggestions(true);
                  if (detectedCoords) {
                    setDetectedCoords(null);
                    setGpsStatus(null);
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g. Ayyappa Society, Madhapur, 100ft Road"
                className="w-full bg-slate-50 hover:bg-slate-100/70 text-slate-900 font-semibold text-sm rounded-2xl pl-4 pr-16 py-3.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white placeholder:text-slate-400 placeholder:font-normal transition-all"
              />

              {/* 1-Click GPS Detect Button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                title="Detect exact physical property coordinates via GPS"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                {isDetectingLocation ? (
                  <>
                    <div className="h-3 w-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Locating...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="h-3.5 w-3.5 text-emerald-600" />
                    <span>GPS</span>
                  </>
                )}
              </button>

              {/* Autocomplete Dropdown with Sub-Localities */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="px-3.5 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span>Suggested Sub-Markets & Micro-Clusters</span>
                    <span>1-Click Select</span>
                  </div>
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLocalityQuery(s.label);
                        setShowSuggestions(false);
                        if (s.lat && s.lng) {
                          setDetectedCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lng) });
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-xs text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 border-b border-slate-100 last:border-0 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold">{s.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        PIN {s.pincode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="md:col-span-3 pt-0 md:pt-6">
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

        {/* Popular Quick Select Chips & Sub-Locality Shortcuts */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-medium">Quick Clusters:</span>
            <button
              type="button"
              onClick={() => handleSelectQuick("Specialty Coffee Shop & Cafe", "Ayyappa Society, Madhapur, Hyderabad")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              ☕ Ayyappa Society, Madhapur
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuick("Fine Casual Dine-In Restaurant", "Kavuri Hills, Madhapur, Hyderabad")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              🍽️ Kavuri Hills, Hyd
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuick("Dental Clinic & Diagnostics", "100ft Road, Indiranagar, Bengaluru")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              🦷 100ft Rd, Indiranagar
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuick("Unisex Salon & Luxury Spa", "Pali Hill, Bandra West, Mumbai")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              ✂️ Pali Hill, Bandra
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
