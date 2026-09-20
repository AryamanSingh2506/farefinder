'use client';

import React, { useState } from 'react';
import { SortOption } from '@/types/filters';
import { BEST_VALUE_METRIC } from '@/lib/flights/sorter';
import { HelpCircle, ArrowUpDown, Sparkles } from 'lucide-react';

interface SortBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

export function SortBar({ currentSort, onSortChange, resultsCount }: SortBarProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  const sortOptions: { id: SortOption; label: string; sub?: string }[] = [
    { id: 'cheapest', label: 'Cheapest', sub: 'Lowest price first' },
    { id: 'fastest', label: 'Fastest', sub: 'Shortest duration' },
    { id: 'best_value', label: 'Best Value', sub: 'Price & speed balanced' },
    { id: 'earliest', label: 'Earliest', sub: 'Departure time' },
    { id: 'latest', label: 'Latest', sub: 'Departure time' },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Sort {resultsCount} Flights:
          </span>
        </div>

        {/* Best value methodology info button */}
        <button
          type="button"
          onClick={() => setShowMethodology(!showMethodology)}
          className="text-xs font-semibold text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How Best Value is calculated</span>
        </button>
      </div>

      {/* Sort Buttons Group */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {sortOptions.map((opt) => {
          const isActive = currentSort === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSortChange(opt.id)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold block">{opt.label}</span>
                {opt.id === 'best_value' && (
                  <Sparkles className={`w-3 h-3 ${isActive ? 'text-amber-300' : 'text-amber-400'}`} />
                )}
              </div>
              <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Transparent Best Value Formula Modal/Box */}
      {showMethodology && (
        <div className="p-4 bg-slate-850 border border-slate-700 rounded-xl text-xs text-slate-200 space-y-2 mt-2">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-white">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Transparent "Best Value" Ranking Methodology
            </span>
            <button
              type="button"
              onClick={() => setShowMethodology(false)}
              className="text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {BEST_VALUE_METRIC.methodology}
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-slate-800 p-2 rounded-lg text-center border border-slate-700">
              <span className="font-bold text-sky-400 block text-xs">55%</span>
              <span className="text-[10px] text-slate-400">Price Index</span>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg text-center border border-slate-700">
              <span className="font-bold text-sky-400 block text-xs">35%</span>
              <span className="text-[10px] text-slate-400">Duration Index</span>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg text-center border border-slate-700">
              <span className="font-bold text-sky-400 block text-xs">10%</span>
              <span className="text-[10px] text-slate-400">Stops Penalty</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
