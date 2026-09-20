'use client';

import React, { useState } from 'react';
import { ProviderStatus } from '@/types/flights';
import { CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface ProviderStatusTrackerProps {
  statuses: ProviderStatus[];
  isLoading?: boolean;
}

export function ProviderStatusTracker({ statuses, isLoading }: ProviderStatusTrackerProps) {
  const [showDetails, setShowDetails] = useState(false);

  const successfulCount = statuses.filter((s) => s.status === 'success').length;
  const failedProviders = statuses.filter((s) => s.status !== 'success');
  const totalProviders = statuses.length;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          ) : failedProviders.length > 0 ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}

          <div>
            <p className="text-xs font-bold text-white">
              {isLoading
                ? 'Searching airlines & travel providers concurrently...'
                : `Compared ${successfulCount} of ${totalProviders} providers`}
            </p>
            <p className="text-[11px] text-slate-400">
              {failedProviders.length > 0
                ? `${failedProviders.length} provider(s) were unavailable. Results from ${successfulCount} providers are shown.`
                : 'All participating airlines and OTAs responded with zero timeouts.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
        >
          <span>{showDetails ? 'Hide Provider Feeds' : 'View Provider Feeds'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Provider Pill Strip */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {statuses.map((p) => (
          <span
            key={p.providerId}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
              p.status === 'success'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                : p.status === 'timeout'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
            }`}
          >
            {p.status === 'success' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
            <span>{p.providerName}</span>
            {p.status === 'success' && <span className="text-[9px] text-slate-400">({p.latencyMs}ms)</span>}
          </span>
        ))}
      </div>

      {/* Detailed breakdown drawer */}
      {showDetails && (
        <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {statuses.map((s) => (
              <div
                key={s.providerId}
                className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">{s.providerName}</span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {s.providerType} • {s.flightsCount} flights
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      s.status === 'success'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    }`}
                  >
                    {s.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.latencyMs}ms</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
