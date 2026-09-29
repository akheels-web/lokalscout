import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import {
  Compass,
  Sparkles,
  Building2,
  GitCompare,
  MessageSquare,
  PhoneCall,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Store,
} from "lucide-react";
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
  metadataBase: new URL("https://lokalscout.in"),
  title: {
    default: "LokalScout — Commercial Location Feasibility & Shop Scouting in India",
    template: "%s | LokalScout",
  },
  description:
    "Check shop and showroom feasibility before signing commercial leases across 120+ Indian micro-markets in Hyderabad, Bengaluru, Mumbai, Pune & Delhi-NCR. Check pedestrian footfall, competitor crowd, approximate per-sqft rent, and daily break-even sales.",
  keywords: [
    "commercial location feasibility india",
    "shop scouting tool india",
    "retail location feasibility report",
    "commercial rent per sqft madhapur",
    "commercial rent indiranagar",
    "cafe location feasibility hyderabad",
    "dental clinic location feasibility",
    "salon break even calculator",
    "commercial lease check india",
    "franchise location evaluation india",
    "retail footfall analysis",
    "lokalscout",
    "growlokal",
  ],
  authors: [{ name: "LokalScout", url: "https://lokalscout.in" }],
  creator: "GrowLokal",
  publisher: "GrowLokal",
  alternates: {
    canonical: "https://lokalscout.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lokalscout.in",
    siteName: "LokalScout by GrowLokal",
    title: "LokalScout — Know If Your Next Store Will Make Money Before Signing The Lease",
    description:
      "Hyperlocal location feasibility for Indian retail founders, clinics, salons, gyms & cafes. Footfall crowd, competitor complaints & break-even math.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LokalScout Commercial Location Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LokalScout — Commercial Location Feasibility & Shop Scouting in India",
    description:
      "Check footfall crowd, competitor ratings, and break-even math before signing commercial leases in India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "LokalScout",
      "operatingSystem": "All modern web browsers",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "799",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "184",
      },
      "description":
        "Hyperlocal location feasibility intelligence platform helping Indian entrepreneurs, doctors, salon founders, and franchisees validate footfall, competition, and rent economics before signing commercial leases.",
      "url": "https://lokalscout.in",
    },
    {
      "@type": "Organization",
      "name": "LokalScout",
      "url": "https://lokalscout.in",
      "logo": "https://lokalscout.in/logo.png",
      "sameAs": ["https://growlokal.in"],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-98765-43210",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Telugu"],
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-emerald-500 selection:text-white font-sans">
        <AuthProvider>
          {/* Top Announcement Bar */}
          <div className="bg-emerald-950 text-white py-2 px-4 text-xs font-medium flex items-center justify-between border-b border-emerald-900/60">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">
                  Live across 120+ micro-markets in Hyderabad, Bengaluru, Mumbai, Pune &amp; Delhi-NCR
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-emerald-200 text-[11px]">
                <span>Instant UPI &amp; Card Settlements</span>
                <span>•</span>
                <Link href="/sample" className="underline hover:text-white font-bold text-white">
                  Inspect Free Sample Dossier →
                </Link>
              </div>
            </div>
          </div>

          {/* Clean Global Navbar */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 md:px-12 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-slate-900">
                    Lokal<span className="text-emerald-600">Scout</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold -mt-1 tracking-wide">
                    by GrowLokal
                  </div>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Location Scanner
                </Link>
                <Link
                  href="/sample"
                  className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-emerald-700"
                >
                  <Sparkles className="h-3 w-3" /> Live Showcase
                </Link>
                <Link
                  href="/compare"
                  className="hover:text-emerald-600 transition-colors flex items-center gap-1"
                >
                  <GitCompare className="h-3 w-3 text-slate-400" /> Compare Areas
                </Link>
                <Link href="/pricing" className="hover:text-emerald-600 transition-colors">
                  Pricing (₹799)
                </Link>
                <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                  Support
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <NavbarAuthSection />
              <Link
                href="/#search-section"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Audit A Location
              </Link>
            </div>
          </header>

          {/* Main Layout Area */}
          <main className="flex-1">{children}</main>

          {/* Google Auth Modal */}
          <GoogleAuthModal />

          {/* SEO-CENTRIC COMPREHENSIVE FOOTER */}
          <footer className="border-t border-slate-200 bg-white pt-16 pb-12 px-6 md:px-12 text-slate-600 text-xs font-sans">
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Top Footer 5-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Col 1: Brand & Trust */}
                <div className="space-y-4 lg:col-span-1">
                  <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-emerald-600" />
                    Lokal<span className="text-emerald-600">Scout</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hyperlocal commercial location feasibility engine helping retail founders, clinic owners, and franchisees in India validate customer footfall, competition, and rent economics before signing commercial leases.
                  </p>
                  <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Instant UPI &amp; Card Checkout</span>
                    </div>
                    <div>Certified 256-Bit SSL • Instant GST Invoices</div>
                    <div className="pt-1">
                      <a
                        href="https://api.whatsapp.com/send?phone=919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp Advisory: +91 98765 43210</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Col 2: Top Indian Micro-Markets (SEO Keywords) */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Scouted Indian Hubs</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <li>
                      <strong className="text-slate-800 font-semibold">Hyderabad:</strong>{" "}
                      <Link href="/sample" className="hover:text-emerald-700">Madhapur</Link>,{" "}
                      <Link href="/sample?city=hyderabad" className="hover:text-emerald-700">Gachibowli</Link>,{" "}
                      <span>Jubilee Hills</span>,{" "}
                      <span>Kondapur</span>,{" "}
                      <span>Ayyappa Society</span>,{" "}
                      <span>Financial District</span>
                    </li>
                    <li>
                      <strong className="text-slate-800 font-semibold">Bengaluru:</strong>{" "}
                      <Link href="/sample?city=bengaluru" className="hover:text-emerald-700">Indiranagar (100ft Rd)</Link>,{" "}
                      <span>Koramangala 4th Block</span>,{" "}
                      <span>HSR Layout</span>,{" "}
                      <span>Whitefield</span>
                    </li>
                    <li>
                      <strong className="text-slate-800 font-semibold">Mumbai:</strong>{" "}
                      <Link href="/sample?city=mumbai" className="hover:text-emerald-700">Bandra West (Pali Hill)</Link>,{" "}
                      <span>Andheri West (Lokhandwala)</span>,{" "}
                      <span>Powai Hiranandani</span>
                    </li>
                    <li>
                      <strong className="text-slate-800 font-semibold">Pune &amp; NCR:</strong>{" "}
                      <span>Baner High Street</span>,{" "}
                      <span>Koregaon Park</span>,{" "}
                      <span>DLF Cyber City Gurgaon</span>,{" "}
                      <span>Connaught Place</span>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Popular Business Verticals */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Business Verticals</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>Specialty Coffee Shops &amp; Cafes</li>
                    <li>Dental Clinics &amp; Diagnostic Centers</li>
                    <li>Unisex Salons &amp; Luxury Spas</li>
                    <li>Cloud Kitchens &amp; QSR Hubs</li>
                    <li>Gyms &amp; Functional Fitness Studios</li>
                    <li>Retail Pharmacies &amp; Chemists</li>
                    <li>Artisanal Bakeries &amp; Patisseries</li>
                    <li>Pet Clinics &amp; Grooming Lounges</li>
                    <li>Fine Casual Restaurants &amp; Bars</li>
                    <li>Boutique Fashion &amp; Ethnic Wear</li>
                    <li>Preschools &amp; Early Daycares</li>
                    <li>Automobile Detailing Studios</li>
                  </ul>
                </div>

                {/* Col 4: Feasibility Tools & Features */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Calculator className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Feasibility Tools</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li><Link href="/" className="hover:text-emerald-600">Location Feasibility Scanner</Link></li>
                    <li><Link href="/sample" className="hover:text-emerald-600">Madhapur Coffee Showcase (100% Free)</Link></li>
                    <li><Link href="/compare" className="hover:text-emerald-600">Multi-Area Side-by-Side Comparison</Link></li>
                    <li><Link href="/pricing" className="hover:text-emerald-600">Pricing &amp; Instant Single Dossier (₹799)</Link></li>
                    <li><span className="text-slate-500">Commercial Rent Benchmark Checker</span></li>
                    <li><span className="text-slate-500">Daily Customer Break-Even Simulator</span></li>
                    <li><span className="text-slate-500">Turnkey Fit-Out Capex Calculator</span></li>
                    <li><span className="text-slate-500">Downloadable Bank Loan &amp; Franchise PDF</span></li>
                  </ul>
                </div>

                {/* Col 5: Company, Support & Ecosystem */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-900">
                    Company &amp; Support
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li><Link href="/contact" className="hover:text-emerald-600">Contact Team</Link></li>
                    <li><Link href="/login" className="hover:text-emerald-600">Founder Login</Link></li>
                    <li><a href="https://growlokal.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 font-semibold">GrowLokal Ecosystem ↗</a></li>
                    <li><Link href="/pricing" className="hover:text-emerald-600">Pricing Plans (₹0, ₹799, ₹1,499)</Link></li>
                    <li><Link href="/contact" className="hover:text-emerald-600">Custom Multi-City Franchise Scouting</Link></li>
                  </ul>
                </div>
              </div>

              {/* CRUCIAL RENTAL PRICING DISCLAIMER NOTE */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>Important Market Note Regarding Commercial Real Estate Rents:</span>
                </div>
                <p className="leading-relaxed text-amber-900/90 font-normal">
                  All commercial rental rates per sq.ft (e.g. ₹125/sq.ft) and monthly lease figures shown across LokalScout reports are approximate indicative neighbourhood benchmarks based on recent commercial listings and broker indices. We do not guarantee exact rental figures for specific shopfronts. Actual commercial rent depends heavily on exact main-road visibility, ground floor vs upper floors, carpet-to-super-builtup area ratio, road width, power load, and direct negotiations with property owners. Always physically inspect the premises and verify lease terms directly before signing any rental agreements or paying advance deposits.
                </p>
              </div>

              {/* Bottom Copyright & Legal Links */}
              <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <div>
                  © 2026 LokalScout (`lokalscout.in`) • A GrowLokal Company. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                  <Link href="/contact" className="hover:text-slate-800 transition-colors">Support</Link>
                  <Link href="/contact" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
                  <Link href="/contact" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
                  <Link href="/pricing" className="hover:text-slate-800 transition-colors">Refund Policy</Link>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
