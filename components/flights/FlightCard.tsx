'use client';

import React, { useState } from 'react';
import { GroupedFlightResult, FlightSearchResult } from '@/types/flights';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { logFirebaseEvent } from '@/lib/firebase/client';
import {
  Plane,
  ChevronDown,
  ChevronUp,
  Luggage,
  ShieldCheck,
  TrendingDown,
  LineChart,
  Bell,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface FlightCardProps {
  flight: GroupedFlightResult;
  onBookClick: (flight: GroupedFlightResult, offerIndex?: number) => void;
  onOpenPriceHistory: (flight: GroupedFlightResult) => void;
  onOpenPriceAlert: (flight: GroupedFlightResult) => void;
}

export function FlightCard({
  flight,
  onBookClick,
  onOpenPriceHistory,
  onOpenPriceAlert,
}: FlightCardProps) {
  const { format } = useCurrency();
  const [expanded, setExpanded] = useState(false);
  const [showSegments, setShowSegments] = useState(false);

  const lowestOffer = flight.lowestOffer;
  const departureTime = new Date(flight.departureDateTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const arrivalTime = new Date(flight.arrivalDateTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Calculate potential savings across providers
  const hasMultipleProviders = flight.offers.length > 1;
  const maxSavings = flight.savingsAmount;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white shadow-md hover:border-slate-700 transition-all overflow-hidden">
      {/* Flight Card Main Body */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left section: Airline & Timings */}
          <div className="flex-1 space-y-4">
            {/* Airline Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                  {flight.airlineCode}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base">{flight.airline}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {flight.flightNumber}
                    </span>
                    {flight.studentEligible && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60">
                        Student Perk Available
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="capitalize">{flight.cabinClass.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Luggage className="w-3.5 h-3.5 text-slate-500" />
                      {flight.baggage}
                    </span>
                    {flight.refundable && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">Refundable</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons: Price trend & alerts */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPriceHistory(flight)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  title="View 30-day price trend"
                >
                  <LineChart className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline">Price History</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPriceAlert(flight)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Track this flight"
                >
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span className="hidden sm:inline">Track</span>
                </button>
              </div>
            </div>

            {/* Timings and Route Grid */}
            <div className="flex items-center justify-between gap-4 pt-1">
              {/* Departure */}
              <div>
                <span className="text-2xl font-black text-white block">{departureTime}</span>
                <span className="text-xs font-bold text-slate-200">{flight.originCode}</span>
                <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">{flight.origin}</span>
              </div>

              {/* Flight Duration Bar */}
              <div className="flex-1 flex flex-col items-center px-4 max-w-xs">
                <span className="text-xs text-slate-400 font-medium">{flight.formattedDuration}</span>
                <div className="w-full flex items-center gap-2 my-1">
                  <div className="h-[2px] flex-1 bg-slate-700" />
                  <Plane className="w-3.5 h-3.5 text-slate-500 rotate-90" />
                  <div className="h-[2px] flex-1 bg-slate-700" />
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[11px] font-semibold ${
                      flight.stops === 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop (${flight.stopAirports.join(', ')})`}
                  </span>
                  {flight.stops > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSegments(!showSegments)}
                      className="text-[10px] text-sky-400 underline ml-1"
                    >
                      {showSegments ? 'Hide stop' : 'View stop'}
                    </button>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <span className="text-2xl font-black text-white block">{arrivalTime}</span>
                <span className="text-xs font-bold text-slate-200">{flight.destinationCode}</span>
                <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">{flight.destination}</span>
              </div>
            </div>

            {/* Connecting flight segments info */}
            {showSegments && flight.segments.length > 1 && (
              <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700 text-xs space-y-2 mt-2">
                <p className="font-bold text-slate-200">Flight Itinerary & Layover Details:</p>
                {flight.segments.map((seg, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <span>
                      Leg {idx + 1}: {seg.flightNumber} ({seg.originCode} → {seg.destinationCode})
                    </span>
                    <span>{seg.duration} mins</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right section: Price & Primary Booking CTA */}
          <div className="lg:w-72 lg:pl-6 lg:border-l border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between lg:justify-end gap-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Lowest on {lowestOffer.providerName}
                </span>
                {maxSavings > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                    Save {format(maxSavings)}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between lg:justify-end gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {format(flight.minPrice)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-left lg:text-right">
                Includes base fare + taxes + fees
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onBookClick(flight, 0)}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Book on {lowestOffer.providerName}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Provider Comparison Trigger */}
              <button
                type="button"
                onClick={() => {
                  if (!expanded) {
                    logFirebaseEvent('view_provider_comparison', {
                      flight_number: flight.flightNumber,
                      airline: flight.airline,
                      provider_count: flight.providerCount,
                      min_price: flight.minPrice,
                    });
                  }
                  setExpanded(!expanded);
                }}
                className="w-full py-1.5 px-2 text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1 transition-colors"
              >
                <span>
                  Compare {flight.providerCount} provider{flight.providerCount > 1 ? 's' : ''}
                </span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Multi-Provider Comparison Matrix (Section 9 Requirement) */}
      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Available from {flight.offers.length} Providers for this Flight:
            </h5>
            <span className="text-[11px] text-slate-400 font-medium">
              Lowest currently displayed: <strong className="text-emerald-400">{format(flight.minPrice)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {flight.offers.map((offer, idx) => {
              const isLowest = offer.totalPrice === flight.minPrice;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isLowest
                      ? 'bg-emerald-950/40 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-200 border border-slate-700">
                      {offer.providerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{offer.providerName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 capitalize border border-slate-700">
                          {offer.providerType}
                        </span>
                        {isLowest && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                            Lowest Price
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Base: {format(offer.baseFare)} + Taxes: {format(offer.taxes)} + Fee: {offer.fees === 0 ? '₹0' : format(offer.fees)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-lg font-black text-white">{format(offer.totalPrice)}</span>
                      <p className="text-[10px] text-slate-400">Total Price</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onBookClick(flight, idx)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        isLowest
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-between">
            <span>* Prices are indicative and verified prior to external handoff.</span>
            <span>Zero booking fees charged by FareFinder.</span>
          </div>
        </div>
      )}
    </div>
  );
}
