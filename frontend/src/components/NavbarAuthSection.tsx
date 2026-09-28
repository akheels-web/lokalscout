"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogIn, User, LogOut, CheckCircle2, ChevronDown, FileText } from "lucide-react";
import Link from "next/link";

export function NavbarAuthSection() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={openAuthModal}
        className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-xs"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
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
        <span className="font-semibold text-slate-800">Sign In with Google</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-800 transition-colors shadow-xs"
      >
        <div className="h-5 w-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[10px] font-bold text-emerald-800">
          {user.name.charAt(0)}
        </div>
        <span className="font-semibold max-w-[120px] truncate">{user.name}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs font-mono space-y-2">
          <div className="pb-2 border-b border-slate-100">
            <div className="font-bold text-slate-900 truncate">{user.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
            <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1 font-sans font-medium">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Enterprise Workspace Verified
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/sample"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-600" />
              <span>Saved Dossiers (2)</span>
            </Link>
          </div>

          <div className="pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 text-rose-600 text-left transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
