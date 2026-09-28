"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function GoogleAuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, isLoading } = useAuth();
  const [customEmail, setCustomEmail] = useState("");

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-900">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <Lock className="h-3 w-3" />
            <span>LokalScout Enterprise Access</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Sign In with Google Workspace
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Access your saved commercial viability dossiers, custom financial models, and multi-area comparisons.
          </p>
        </div>

        {/* Google Sign-in Official Button */}
        <button
          onClick={() => loginWithGoogle()}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 hover:border-slate-400 shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer font-sans"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="font-bold">Continue with Google Workspace</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold">
            Or corporate SSO email
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Corporate Email Direct Entry */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customEmail) loginWithGoogle(customEmail);
          }}
          className="space-y-3 font-mono"
        >
          <div>
            <label className="block text-[11px] text-slate-600 mb-1 font-semibold">
              Work Email Address
            </label>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="e.g. founder@franchisegroup.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={!customEmail || isLoading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Authenticate Work Account</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Enterprise Compliance Footnote */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> SOC-2 Ready
          </span>
          <span>Google OAuth 2.0 PKCE</span>
        </div>
      </div>
    </div>
  );
}
