'use client';

import React from 'react';
import { GroupedFlightResult } from '@/types/flights';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { Sparkles, ArrowRight, ShieldCheck, Info, ExternalLink, Plane } from 'lucide-react';

interface CheapestHeroCardProps {
  flight: GroupedFlightResult;
  onBookClick: (flight: GroupedFlightResult, offerIndex?: number) => void;
}

export function CheapestHeroCard({ flight, onBookClick }: CheapestHeroCardProps) {
  const { format } = useCurrency();
  const lowestOffer = flight.lowestOffer;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/30">
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Cheapest Available Fare</span>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Indicative price based on provider catalog</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Flight Info */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-base text-white border border-white/10">
              {flight.airlineCode}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {flight.airline}
                <span className="text-xs font-normal text-slate-300 px-2 py-0.5 rounded bg-white/10">
                  {flight.flightNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-400">{flight.baggage} • {flight.cabinBaggage}</p>
            </div>
          </div>

          {/* Timings row */}
          <div className="flex items-center gap-6 py-2">
            <div>
              <p className="text-2xl font-black text-white">
                {new Date(flight.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <p className="text-xs font-bold text-slate-300">{flight.originCode}</p>
              <p className="text-[10px] text-slate-400">{flight.origin}</p>
            </div>

            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-xs text-slate-300 font-medium">{flight.formattedDuration}</span>
              <div className="w-full flex items-center gap-2 my-1">
                <div className="h-[2px] flex-1 bg-white/20" />
                <Plane className="w-4 h-4 text-emerald-400 rotate-90" />
                <div className="h-[2px] flex-1 bg-white/20" />
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">
                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop (${flight.stopAirports.join(', ')})`}
              </span>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-white">
                {new Date(flight.arrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <p className="text-xs font-bold text-slate-300">{flight.destinationCode}</p>
              <p className="text-[10px] text-slate-400">{flight.destination}</p>
            </div>
          </div>
        </div>

        {/* Right Price & Booking Column */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div>
            <span className="text-xs text-slate-300 block font-medium">Sold by {lowestOffer.providerName}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {format(flight.minPrice)}
              </span>
              <span className="text-xs text-slate-400">total price</span>
            </div>
          </div>

          {/* Mandatory Transparent Comparable Fare Breakdown */}
          <div className="text-[11px] text-slate-300 border-t border-white/10 pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Base Fare:</span>
              <span>{format(lowestOffer.baseFare)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mandatory Taxes (GST/UDF):</span>
              <span>{format(lowestOffer.taxes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Provider Fees:</span>
              <span>{lowestOffer.fees === 0 ? '₹0 (Free)' : format(lowestOffer.fees)}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-300 pt-1 border-t border-white/10">
              <span>Comparable Final Fare:</span>
              <span>{format(flight.minPrice)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookClick(flight, 0)}
            className="w-full py-3.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Book on {lowestOffer.providerName}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
