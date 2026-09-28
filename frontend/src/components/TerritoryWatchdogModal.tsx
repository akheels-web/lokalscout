"use client";

import React, { useState, useEffect } from "react";
import { subscribeWatchdog, fetchWatchdogAlerts } from "@/lib/api";
import { WatchdogSubscriptionResponse } from "@/types/feasibility";

interface TerritoryWatchdogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPincode?: string;
  defaultLocality?: string;
  defaultCategory?: string;
}

export function TerritoryWatchdogModal({
  isOpen,
  onClose,
  defaultPincode = "500081",
  defaultLocality = "Madhapur",
  defaultCategory = "Specialty Coffee Shop & Cafe",
}: TerritoryWatchdogModalProps) {
  const [pincode, setPincode] = useState(defaultPincode);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeData, setActiveData] = useState<WatchdogSubscriptionResponse | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadInitialAlerts(defaultPincode);
    }
  }, [isOpen, defaultPincode]);

  async function loadInitialAlerts(code: string) {
    setLoading(true);
    try {
      const data = await fetchWatchdogAlerts(code);
      setActiveData(data);
    } catch (err) {
      console.error("Failed to load watchdog alerts", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const resp = await subscribeWatchdog({
        email,
        phone,
        locality: defaultLocality,
        pincode,
        category: defaultCategory,
      });
      setActiveData(resp);
      setSubscribed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Pin Code Territory Watchdog™</h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">Live Surveillance</span>
              </div>
              <p className="text-xs text-slate-500">Autonomous 24/7 competitor detection, trade filings & review shock tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Territory Badge & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Monitored Pin Code</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">{pincode} • {defaultLocality}</div>
              <span className="text-xs text-emerald-600 font-medium">Concentric 2.0 km radius</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Monitored Category</span>
              <div className="text-base font-bold text-slate-900 mt-0.5 truncate">{defaultCategory}</div>
              <span className="text-xs text-slate-500">Real-time commercial registries &amp; footfall radar</span>
            </div>
            <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Active Threat Signals</span>
              <div className="text-base font-bold text-amber-900 mt-0.5">
                {activeData ? `${activeData.active_alerts_count} Unresolved Events` : "Scanning..."}
              </div>
              <span className="text-xs text-amber-700 font-medium">Updated 4 hours ago</span>
            </div>
          </div>

          {/* Alert Stream */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Catchment Radar Feed
              </h4>
              <span className="text-xs text-slate-500">
                Next automated scan: <strong className="text-slate-700">{activeData?.next_audit_date || "Next Monday, 9:00 AM"}</strong>
              </span>
            </div>

            <div className="space-y-3">
              {activeData?.latest_alerts.map((alert) => (
                <div
                  key={alert.alert_id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-bold rounded-lg border ${
                          alert.severity === "High Attention"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : alert.severity === "Moderate Impact"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {alert.event_type}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{alert.competitor_name}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{alert.summary}</p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <span className="text-xs text-emerald-600 font-bold shrink-0">Counter-Move:</span>
                    <span className="text-xs text-slate-700 font-medium">{alert.recommended_counter_move}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Panel */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                  Monthly Watchdog Plan • ₹499/mo
                </div>
                <h4 className="text-base font-bold text-white">Protect Your Pin Code from Surprises</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Get instant WhatsApp & email dispatch the minute a competitor applies for trade licensing, signs commercial lease, or triggers a rating drop within 2 km.
                </p>
              </div>
            </div>

            {subscribed ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                <span className="text-sm font-bold text-emerald-400">✓ Watchdog Protection Active for {pincode}</span>
                <p className="text-xs text-slate-300 mt-1">
                  Weekly intelligence digests and instant breaking alerts will be dispatched to <strong>{email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <input
                  type="email"
                  required
                  placeholder="Founder / Manager Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Mobile (+91)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Activating..." : "Activate Watchdog (₹499/mo)"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Cancel anytime. Powered by GrowLokal Surveillance Node.</span>
          <button onClick={onClose} className="font-semibold text-slate-700 hover:text-slate-900">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
