"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, CheckCircle2, ShieldCheck, ArrowRight, Lock, Mail, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, isAuthenticated, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await loginWithGoogle(email);
    router.push("/sample");
  };

  const handleGoogleClick = async () => {
    await loginWithGoogle();
    router.push("/sample");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Left: Login Form */}
        <div className="p-8 md:p-12 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-lg">
                Lokal<span className="text-emerald-600">Scout</span>
              </span>
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500">
              Access your saved dossiers, area comparisons, and break-even models.
            </p>
          </div>

          {/* Google Sign-in Official Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 hover:border-slate-400 shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer"
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
              <span>Continue with Google Workspace</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Or sign in with work email
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@yourbrand.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <Mail className="absolute right-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-[11px] text-emerald-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <Lock className="absolute right-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
                  Keep me signed in on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Don't have an account? <Link href="/#search-section" className="text-emerald-700 font-bold hover:underline">Scan first report</Link></span>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 256-Bit SSL
            </span>
          </div>
        </div>

        {/* Right: Visual Social Proof & Credibility Panel */}
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 p-8 md:p-12 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-emerald-300" />
              <span>Trusted by 450+ Indian Operators</span>
            </div>

            <blockquote className="space-y-3">
              <p className="text-sm md:text-base leading-relaxed text-slate-200 italic">
                "LokalScout saved us from signing an overpriced ₹2.4L/mo lease in Koramangala. The break-even simulator showed we'd need 85 orders a day just to pay rent, while the competitor density was already 90% saturated. We relocated 800m away and broke even in 90 days."
              </p>
              <footer className="text-xs text-slate-400">
                <strong className="text-white block font-sans">Rajesh Shenoy</strong>
                <span>Founder, Specialty Coffee Roastery • Bengaluru</span>
              </footer>
            </blockquote>
          </div>

          <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-2xl font-black text-white">120+</div>
              <div className="text-slate-400 mt-0.5">Micro-Markets Audited</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">₹4.8 Cr+</div>
              <div className="text-slate-400 mt-0.5">Bad Leases Avoided</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
