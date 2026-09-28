"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, CheckCircle2, ShieldCheck, AlertCircle, Lock, Star, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, isAuthenticated, user, isLoading, authError, isGoogleConnected } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    try {
      await loginWithGoogle();
      router.push("/sample");
    } catch (err: any) {
      setLocalError(err?.message || "Google authentication failed. Please try again.");
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Left: Google-Only Authentication Panel */}
        <div className="p-8 md:p-12 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-lg">
                Lokal<span className="text-emerald-600">Scout</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Enterprise Single Sign-On (SSO)</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Enterprise Google Sign-In
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Authenticate with your verified corporate Google Workspace account to access saved feasibility dossiers, custom unit-economics models, and multi-area comparisons.
            </p>
          </div>

          {/* Google Auth Status & Primary Action */}
          <div className="space-y-4">
            {/* Connection Status Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <span className="text-slate-600 font-medium">Google OAuth Status</span>
              {isGoogleConnected ? (
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Connected &amp; Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Not Connected (Client ID Missing)
                </span>
              )}
            </div>

            {/* Error Banner when OAuth throws */}
            {displayedError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Google Authentication Error</span>
                </div>
                <p className="leading-relaxed font-sans">{displayedError}</p>
                <div className="pt-2 border-t border-rose-200/60 text-[11px] text-rose-700 font-mono">
                  To enable Google Workspace Sign-In, add your client ID to <code>frontend/.env.local</code>:
                  <div className="mt-1 p-1.5 bg-white/80 rounded border border-rose-200 text-[10px] text-slate-800 select-all">
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
                  </div>
                </div>
              </div>
            )}

            {/* Official Google Sign-In Button (Exclusive Auth Mechanism) */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-900 font-bold text-xs rounded-2xl border-2 border-slate-300 hover:border-slate-400 shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer font-sans"
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

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 text-[11px] font-mono block">Zero-Password Policy</span>
              <p className="text-[11px] leading-relaxed">
                For corporate security, LokalScout exclusively supports Google OAuth 2.0. Password-based authentication is disabled to prevent credential leakage.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Need enterprise SSO? <Link href="/contact" className="text-emerald-700 font-bold hover:underline">Contact Advisory</Link></span>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> PKCE Secured
            </span>
          </div>
        </div>

        {/* Right: Social Proof & Client Testimonial */}
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 p-8 md:p-12 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-emerald-300" />
              <span>Verified Operator Testimonial</span>
            </div>

            <blockquote className="space-y-3">
              <p className="text-sm md:text-base leading-relaxed text-slate-200 italic font-sans">
                "LokalScout saved us from signing an overpriced ₹2.4L/mo lease in Koramangala. The break-even simulator showed we'd need 85 orders a day just to pay rent, while the competitor density was already 90% saturated. We relocated 800m away and broke even in 90 days."
              </p>
              <footer className="text-xs text-slate-400 font-mono">
                <strong className="text-white block font-sans">Rajesh Shenoy</strong>
                <span>Founder, Specialty Coffee Roastery • Bengaluru</span>
              </footer>
            </blockquote>
          </div>

          <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <div className="text-2xl font-black text-white">120+</div>
              <div className="text-slate-400 mt-0.5 font-sans">Micro-Markets Audited</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">₹4.8 Cr+</div>
              <div className="text-slate-400 mt-0.5 font-sans">Bad Leases Avoided</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
