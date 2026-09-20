import React from 'react';
import Link from 'next/link';
import { Plane, Shield, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      {/* Disclaimer Strip */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-400">
            <strong className="text-slate-200">Legal & Consumer Transparency Notice: </strong>
            Fare information is aggregated from participating travel providers and published schedule feeds. Prices and seat availability can change in real time. FareFinder India does not issue airline tickets or collect passenger payments. Always confirm the final fare, baggage allowance, fare rules, and booking conditions on the provider’s authorized website before completing payment.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-lg font-bold text-white">FareFinder India</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India’s open flight meta-search engine. Compare real fares across airlines and top travel agencies with transparent taxes, fees, and zero markup.
            </p>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Popular Domestic Routes</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/flights/bengaluru-to-mumbai" className="hover:text-white transition-colors">
                  Bengaluru to Mumbai Flights
                </Link>
              </li>
              <li>
                <Link href="/flights/delhi-to-bengaluru" className="hover:text-white transition-colors">
                  Delhi to Bengaluru Flights
                </Link>
              </li>
              <li>
                <Link href="/flights/mumbai-to-delhi" className="hover:text-white transition-colors">
                  Mumbai to Delhi Flights
                </Link>
              </li>
              <li>
                <Link href="/search?origin=BLR&destination=HYD&date=2026-11-06" className="hover:text-white transition-colors">
                  Bengaluru to Hyderabad Flights
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Providers */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Covered Providers</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
              <span className="text-slate-400">Air India</span>
              <span className="text-slate-400">IndiGo</span>
              <span className="text-slate-400">Akasa Air</span>
              <span className="text-slate-400">AI Express</span>
              <span className="text-slate-400">MakeMyTrip</span>
              <span className="text-slate-400">Goibibo</span>
              <span className="text-slate-400">Cleartrip</span>
              <span className="text-slate-400">EaseMyTrip</span>
              <span className="text-slate-400">Yatra</span>
              <span className="text-slate-400">ixigo</span>
            </div>
          </div>

          {/* Architecture & Admin */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Platform & Admin</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
                  Admin Performance Dashboard
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span>API Integration Architecture</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </li>
              <li>
                <span className="text-slate-400">Student Fare Support Enabled</span>
              </li>
              <li>
                <span className="text-slate-400">Multi-Currency Engine (INR, USD, EUR)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FareFinder India. Built for the Indian aviation ecosystem.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
