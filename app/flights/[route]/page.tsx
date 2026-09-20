import React from 'react';
import { notFound } from 'next/navigation';
import { SearchWidget } from '@/components/search/SearchWidget';
import { Plane, Clock, ShieldCheck, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RouteSEOData {
  slug: string;
  origin: string;
  originCity: string;
  destination: string;
  destCity: string;
  distanceKm: number;
  duration: string;
  airlines: string[];
  lowestIndicativePriceINR: number;
  frequencyDaily: number;
  description: string;
}

const SEO_ROUTES: Record<string, RouteSEOData> = {
  'bengaluru-to-mumbai': {
    slug: 'bengaluru-to-mumbai',
    origin: 'BLR',
    originCity: 'Bengaluru',
    destination: 'BOM',
    destCity: 'Mumbai',
    distanceKm: 840,
    duration: '1h 50m',
    airlines: ['IndiGo', 'Akasa Air', 'Air India', 'Air India Express'],
    lowestIndicativePriceINR: 3850,
    frequencyDaily: 34,
    description: 'Compare non-stop and connecting flights from Bengaluru Kempegowda (BLR) to Mumbai Chhatrapati Shivaji Maharaj (BOM) across airlines and OTAs.',
  },
  'bengaluru-to-delhi': {
    slug: 'bengaluru-to-delhi',
    origin: 'BLR',
    originCity: 'Bengaluru',
    destination: 'DEL',
    destCity: 'New Delhi',
    distanceKm: 1740,
    duration: '2h 45m',
    airlines: ['Air India', 'IndiGo', 'Akasa Air'],
    lowestIndicativePriceINR: 5240,
    frequencyDaily: 28,
    description: 'Find lowest airfares for Bengaluru to Delhi flights. Compare direct morning and evening flights with transparent baggage rules.',
  },
  'mumbai-to-delhi': {
    slug: 'mumbai-to-delhi',
    origin: 'BOM',
    originCity: 'Mumbai',
    destination: 'DEL',
    destCity: 'New Delhi',
    distanceKm: 1150,
    duration: '2h 10m',
    airlines: ['Air India', 'IndiGo', 'Akasa Air', 'Air India Express'],
    lowestIndicativePriceINR: 4620,
    frequencyDaily: 42,
    description: 'One of the busiest domestic corridors in India. Compare hourly shuttle flights between Mumbai (BOM) and New Delhi (DEL).',
  },
  'delhi-to-bengaluru': {
    slug: 'delhi-to-bengaluru',
    origin: 'DEL',
    originCity: 'New Delhi',
    destination: 'BLR',
    destCity: 'Bengaluru',
    distanceKm: 1740,
    duration: '2h 45m',
    airlines: ['Air India', 'IndiGo', 'Akasa Air'],
    lowestIndicativePriceINR: 5240,
    frequencyDaily: 28,
    description: 'Book the cheapest flights from Indira Gandhi International (DEL) to Kempegowda (BLR) without hidden booking fees.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  const routeData = SEO_ROUTES[route];
  if (!routeData) {
    return { title: 'Route Flights — FareFinder India' };
  }

  return {
    title: `${routeData.originCity} to ${routeData.destCity} Flights — Compare Fares from ₹${routeData.lowestIndicativePriceINR.toLocaleString('en-IN')}`,
    description: routeData.description,
    openGraph: {
      title: `${routeData.originCity} to ${routeData.destCity} Flight Prices | FareFinder India`,
      description: routeData.description,
    },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  const routeData = SEO_ROUTES[route];

  if (!routeData) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-20 bg-slate-950 text-slate-100">
      {/* Route Hero Header */}
      <section className="bg-gradient-to-b from-slate-900/90 to-slate-950 border-b border-slate-800 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-950/70 border border-sky-800/60 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              <span>Domestic Corridor Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {routeData.originCity} ({routeData.origin}) → {routeData.destCity} ({routeData.destination}) Flights
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">{routeData.description}</p>
          </div>

          {/* Search Box Pre-filled with this route */}
          <div className="pt-2 max-w-5xl">
            <SearchWidget
              initialOrigin={routeData.origin}
              initialDestination={routeData.destination}
            />
          </div>
        </div>
      </section>

      {/* Route Stats & Airline Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Typical Flight Time
            </span>
            <span className="text-2xl font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              {routeData.duration}
            </span>
            <p className="text-[11px] text-slate-400">Non-stop aerial distance: {routeData.distanceKm} km</p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Daily Departures
            </span>
            <span className="text-2xl font-black text-indigo-400 flex items-center gap-2">
              <Plane className="w-5 h-5" />
              ~{routeData.frequencyDaily} Flights Daily
            </span>
            <p className="text-[11px] text-slate-400">Across full-service & budget carriers</p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Indicative Starting Fare
            </span>
            <span className="text-2xl font-black text-emerald-400">
              ₹{routeData.lowestIndicativePriceINR.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-400">Includes mandatory airport taxes & GST</p>
          </div>
        </div>

        {/* Operating Airlines on this Route */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-lg">Airlines Operating {routeData.origin} → {routeData.destination}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {routeData.airlines.map((airline, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-200 block">{airline}</span>
                  <span className="text-[10px] text-slate-400">Regular daily schedules</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
