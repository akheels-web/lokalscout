"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function GoogleAuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, isLoading, authError, isGoogleConnected, clearAuthError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async () => {
    setLocalError(null);
    clearAuthError();
    try {
      await loginWithGoogle();
      closeAuthModal();
    } catch (err: any) {
      setLocalError(err?.message || "Google authentication failed.");
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-900">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <Lock className="h-3.5 w-3.5" />
            <span>LokalScout Enterprise Access</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Sign In with Google Workspace
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Connect your corporate Google account to review saved feasibility dossiers, custom unit-economics models, and pin code watchdogs.
          </p>
        </div>

        {/* Google OAuth Status Badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
          <span className="text-slate-600 font-medium">Google OAuth Link</span>
          {isGoogleConnected ? (
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Not Connected
            </span>
          )}
        </div>

        {/* Error Alert Banner */}
        {displayedError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Authentication Error</span>
            </div>
            <p className="leading-relaxed">{displayedError}</p>
            {!isGoogleConnected && (
              <div className="pt-2 border-t border-rose-200/60 text-[10px] text-rose-700 font-mono">
                Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in <code>frontend/.env.local</code> to enable Google OAuth.
              </div>
            )}
          </div>
        )}

        {/* Exclusive Google Sign-in Button */}
        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-900 font-bold text-xs rounded-2xl border-2 border-slate-300 hover:border-slate-400 shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
            <span>{isLoading ? "Connecting to Google..." : "Continue with Google Workspace"}</span>
          </button>

          <p className="text-[11px] text-center text-slate-500 font-sans">
            Strict Zero-Password Policy • Passwords &amp; custom email logins are disabled.
          </p>
        </div>

        {/* Enterprise Compliance Footnote */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> PKCE Protected
          </span>
          <span>Google Identity Services</span>
        </div>
      </div>
    </div>
  );
}
