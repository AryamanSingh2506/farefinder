'use client';

import React from 'react';
import Link from 'next/link';
import { SearchWidget } from '@/components/search/SearchWidget';
import { useCurrency } from '@/components/currency/CurrencyContext';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingDown,
  Clock,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Plane,
  Building2,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';

const POPULAR_ROUTES = [
  {
    origin: 'BLR',
    originCity: 'Bengaluru',
    destination: 'BOM',
    destCity: 'Mumbai',
    duration: '1h 50m',
    indicativePriceINR: 3850,
    airlines: ['IndiGo', 'Akasa Air', 'Air India'],
    stops: 'Non-stop',
  },
  {
    origin: 'BOM',
    originCity: 'Mumbai',
    destination: 'DEL',
    destCity: 'New Delhi',
    duration: '2h 10m',
    indicativePriceINR: 4620,
    airlines: ['Air India', 'IndiGo', 'Akasa Air'],
    stops: 'Non-stop',
  },
  {
    origin: 'BLR',
    originCity: 'Bengaluru',
    destination: 'DEL',
    destCity: 'New Delhi',
    duration: '2h 45m',
    indicativePriceINR: 5240,
    airlines: ['Air India', 'IndiGo', 'AI Express'],
    stops: 'Non-stop',
  },
  {
    origin: 'BLR',
    originCity: 'Bengaluru',
    destination: 'HYD',
    destCity: 'Hyderabad',
    duration: '1h 15m',
    indicativePriceINR: 2850,
    airlines: ['IndiGo', 'Air India'],
    stops: 'Non-stop',
  },
  {
    origin: 'BLR',
    originCity: 'Bengaluru',
    destination: 'MAA',
    destCity: 'Chennai',
    duration: '1h 00m',
    indicativePriceINR: 2580,
    airlines: ['IndiGo', 'AI Express'],
    stops: 'Non-stop',
  },
  {
    origin: 'DEL',
    originCity: 'New Delhi',
    destination: 'CCU',
    destCity: 'Kolkata',
    duration: '2h 15m',
    indicativePriceINR: 4890,
    airlines: ['IndiGo', 'Air India'],
    stops: 'Non-stop',
  },
];

export default function HomePage() {
  const { format } = useCurrency();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border-b border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-900/20 to-indigo-900/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950 text-sky-300 text-xs font-bold border border-sky-800/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>India's Open Flight Meta-Search</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Find the cheapest flight,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                wherever it's sold.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Compare fares across leading Indian airlines and verified travel providers in one place.
              Transparent taxes, verified baggage rules, and zero booking markups.
            </p>
          </div>

          {/* Search Card Widget */}
          <div className="max-w-5xl mx-auto">
            <SearchWidget />
          </div>

          {/* Provider Trust Badges */}
          <div className="mt-12 text-center space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Comparing 10+ Airlines & Authorized Travel Providers
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-80">
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                Air India
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                IndiGo
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                Akasa Air
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                Air India Express
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                MakeMyTrip
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                Goibibo
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                Cleartrip
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                EaseMyTrip
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                Yatra
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                ixigo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why FareFinder Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Why FareFinder India?</h2>
          <p className="text-sm text-slate-400">
            Airlines and OTAs often price the exact same seat differently. We show you the full picture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-950 text-sky-400 border border-sky-800/40 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Airline & OTA Comparison</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't switch between 6 browser tabs. Compare direct airline fares and travel agency discounts side-by-side on one screen.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Transparent Comparable Price</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We calculate base fares, aviation security fees, UDF, and GST upfront. No hidden fees discovered at the payment page.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800/40 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Booking Fees</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FareFinder India is an independent meta-search engine. We never charge booking fees or commissions to travelers.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Domestic Routes (Section 24) */}
      <section id="popular-routes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <TrendingDown className="w-4 h-4" />
              <span>Trending Indian Routes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Popular Routes & Starting Fares</h2>
            <p className="text-xs text-slate-400">Indicative demo fares observed for upcoming dates.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_ROUTES.map((route, idx) => (
            <Link
              key={idx}
              href={`/search?origin=${route.origin}&destination=${route.destination}&date=2026-11-06`}
              className="group bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm hover:shadow-md hover:border-sky-500/50 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-lg text-white group-hover:text-sky-400 transition-colors">
                  <span>{route.origin}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  <span>{route.destination}</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-750">
                  {route.stops}
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span>{route.originCity} to {route.destCity}</span>
                <span>{route.duration}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Fares starting from</span>
                  <span className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                    {format(route.indicativePriceINR)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-sky-400 group-hover:underline flex items-center gap-1">
                    Compare <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works (Section 24) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">How FareFinder Works</h2>
            <p className="text-xs text-slate-400">
              Simple 4-step transparent flight search designed for Indian aviation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm border border-sky-400/20">
                1
              </div>
              <h4 className="font-bold text-sm text-white">Search Your Route</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your origin, destination, and dates. Filter by student fares, non-stops, or cabin classes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm border border-sky-400/20">
                2
              </div>
              <h4 className="font-bold text-sm text-white">Parallel Comparison</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our engine queries all configured airlines and OTAs simultaneously and deduplicates identical flights.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm border border-sky-400/20">
                3
              </div>
              <h4 className="font-bold text-sm text-white">Choose Lowest Price</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect baggage allowances, convenience fees, and historical price trends before deciding.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm border border-sky-400/20">
                4
              </div>
              <h4 className="font-bold text-sm text-white">Book with Provider</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We re-verify the real-time seat price and seamlessly transfer you to the provider to complete booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Fares Spotlight Section (Section 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-950/70 to-indigo-950/70 rounded-3xl p-6 sm:p-8 border border-sky-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Student Concession Fares & Extra Baggage</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Heading back to college or university? Indian domestic airlines offer up to 10% discount on base fares and +10 kg additional check-in baggage allowance (total 25kg) for bona fide students with valid student ID.
              </p>
            </div>
          </div>

          <Link
            href="/search?origin=BLR&destination=DEL&date=2026-11-06&student=true"
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Search Student Fares</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
