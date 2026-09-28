import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Compass, Sparkles, Building2, GitCompare, MessageSquare, PhoneCall } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleAuthModal } from "@/components/GoogleAuthModal";
import { NavbarAuthSection } from "@/components/NavbarAuthSection";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LokalScout — Hyperlocal Commercial Feasibility & Location Intelligence",
  description:
    "Data-backed commercial location feasibility reports for cafes, clinics, salons, and retail across Indian cities before signing commercial leases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <head>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-emerald-500 selection:text-white font-sans">
        <AuthProvider>
          {/* Top Announcement Bar */}
          <div className="bg-emerald-900 text-white py-2 px-4 text-xs font-medium flex items-center justify-between">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Now live across 120+ micro-markets in Hyderabad, Bengaluru, Mumbai, Pune &amp; Delhi-NCR</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-emerald-200">
                <span>Instant UPI &amp; Card Settlements</span>
                <span>•</span>
                <Link href="/sample" className="underline hover:text-white font-semibold">
                  Inspect Free Sample Dossier →
                </Link>
              </div>
            </div>
          </div>

          {/* Clean Global Navbar */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 md:px-12 py-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-slate-900">
                    Lokal<span className="text-emerald-600">Scout</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium -mt-1">by GrowLokal</div>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Location Scouting
                </Link>
                <Link href="/sample" className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-emerald-700 font-bold">
                  <Sparkles className="h-3.5 w-3.5" /> Live Sample
                </Link>
                <Link href="/compare" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <GitCompare className="h-3.5 w-3.5 text-slate-400" /> Area Comparison
                </Link>
                <Link href="/pricing" className="hover:text-emerald-600 transition-colors">
                  Pricing
                </Link>
                <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <NavbarAuthSection />
              <Link
                href="/#search-section"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                Scan A Location
              </Link>
            </div>
          </header>

          {/* Main Layout Area */}
          <main className="flex-1">{children}</main>

          {/* Google Auth Modal */}
          <GoogleAuthModal />

          {/* Clean Commercial SaaS Footer */}
          <footer className="border-t border-slate-200 bg-white py-16 px-6 md:px-12 text-slate-600 text-xs">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
              <div className="md:col-span-2 space-y-4">
                <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-emerald-600" />
                  Lokal<span className="text-emerald-600">Scout</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                  The hyperlocal location feasibility engine helping retail founders, clinic owners, and franchisees validate footfall, competition, and rent economics before signing commercial leases.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <div>100% Secure Payments via <strong className="text-slate-800">Encrypted Banking Gateway</strong></div>
                  <div>Certified 256-Bit SSL • Instant GST Invoices</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-4">
                  Product
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li><Link href="/" className="hover:text-emerald-600">Location Feasibility Scanner</Link></li>
                  <li><Link href="/sample" className="hover:text-emerald-600">Madhapur Coffee Showcase</Link></li>
                  <li><Link href="/compare" className="hover:text-emerald-600">Multi-Area Comparison</Link></li>
                  <li><Link href="/pricing" className="hover:text-emerald-600">Pricing &amp; Licenses</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-4">
                  Popular Verticals
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li>Specialty Coffee Shops &amp; Cafes</li>
                  <li>Dental &amp; Diagnostic Clinics</li>
                  <li>Unisex Luxury Salons &amp; Spas</li>
                  <li>Cloud Kitchens &amp; QSR Hubs</li>
                  <li>Fitness Gyms &amp; Studios</li>
                  <li>Retail Pharmacies &amp; Chemists</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-4">
                  Company &amp; Support
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li><Link href="/contact" className="hover:text-emerald-600">Contact Team</Link></li>
                  <li><Link href="/login" className="hover:text-emerald-600">Founder Login</Link></li>
                  <li><a href="https://growlokal.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">GrowLokal Ecosystem</a></li>
                  <li><a href="https://api.whatsapp.com/send?phone=919876543210" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1"><MessageSquare className="h-3 w-3" /> WhatsApp Advisory</a></li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <div>© 2026 LokalScout (`lokalscout.in`) • A GrowLokal Company. All rights reserved.</div>
              <div className="flex items-center gap-6">
                <Link href="/contact" className="hover:text-slate-800">Support</Link>
                <span>Terms of Service</span>
                <span>Privacy Policy</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
