"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, PhoneCall, Mail, MapPin, CheckCircle2, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Hyderabad",
    inquiryType: "Commercial Location Feasibility",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          Enterprise Commercial Advisory
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Let's Discuss Your Commercial Expansion
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Need custom micro-market GIS boundaries, multi-city franchise expansion mapping, or have a question about a generated report? Our analysts respond within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Inquiry Received</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. A dedicated commercial scouting advisor has received your request and will reach out via WhatsApp / phone ({formData.phone}) within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Send an Inquiry
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Ananya Rao"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ananya@dentalgroup.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City of Expansion
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi-NCR">Delhi-NCR</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Other">Other Indian City</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Inquiry Nature
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Commercial Location Feasibility">Single Location Feasibility Dossier (₹799)</option>
                  <option value="Multi-Area Comparison">Multi-Area Comparative Matrix (₹1,499)</option>
                  <option value="Franchise Expansion Mapping">Enterprise Multi-Unit Franchise Territory Mapping</option>
                  <option value="GrowLokal Autopilot">GrowLokal Pre-Launch Autopilot (₹2,999/mo)</option>
                  <option value="Custom Enterprise API">Custom GIS Overpass API &amp; Data Pipeline License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Requirements or Questions
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your brand capex, required square footage, and target commercial corridors..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Submit Commercial Inquiry</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Connect & Office Locations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick WhatsApp Connect */}
          <div className="bg-emerald-900 text-white p-6 md:p-8 rounded-3xl space-y-4 shadow-lg">
            <div className="h-10 w-10 bg-emerald-800 rounded-xl flex items-center justify-center text-emerald-300">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Fast-Track WhatsApp Connect</h3>
              <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                Need immediate feedback on a commercial property deal you are inspecting right now? Speak directly with our commercial analyst on WhatsApp.
              </p>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20LokalScout%20team,%20I%20am%20evaluating%20a%20commercial%20location"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
            >
              <span>Chat on WhatsApp Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Physical Presence Hubs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Operating Hubs &amp; Coverage
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-sans">Hyderabad Commercial Hub:</strong>
                  <span>Hitec City Main Road, Madhapur, Hyderabad, Telangana 500081</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-sans">Bengaluru Retail Lab:</strong>
                  <span>100ft Road, Indiranagar, Bengaluru, Karnataka 560038</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-sans">Direct Email:</strong>
                  <span>advisory@lokalscout.in / payments@lokalscout.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-sans">Hours:</strong>
                  <span>Monday – Saturday: 9:00 AM – 7:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
