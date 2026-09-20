'use client';

import React, { useMemo } from 'react';
import { GroupedFlightResult } from '@/types/flights';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { LineChart, Calendar, X, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: GroupedFlightResult | null;
}

export function PriceHistoryModal({ isOpen, onClose, flight }: PriceHistoryModalProps) {
  const { format } = useCurrency();

  // Generate 30 days of realistic historical trend data around the current base price
  const historicalData = useMemo(() => {
    if (!flight) return [];
    const currentPrice = flight.minPrice;
    const points: { day: string; price: number }[] = [];

    // Deterministic pseudo-random variation based on route
    const seed = flight.originCode.charCodeAt(0) + flight.destinationCode.charCodeAt(0);

    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      // Simulate booking window curve (prices rise closer to departure, dips on midweek)
      const dayFactor = Math.sin((i + seed) / 3.5) * 450;
      const weeklyFactor = (i % 7 === 2 || i % 7 === 3) ? -250 : 150;
      const trendPrice = Math.round((currentPrice - 200 + dayFactor + weeklyFactor) / 50) * 50;

      points.push({
        day: dayStr,
        price: Math.max(2500, trendPrice),
      });
    }

    return points;
  }, [flight]);

  if (!isOpen || !flight) return null;

  const prices = historicalData.map((p) => p.price);
  const minHistorical = Math.min(...prices);
  const maxHistorical = Math.max(...prices);
  const avgHistorical = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  // SVG dimensions
  const svgWidth = 540;
  const svgHeight = 220;
  const padding = 40;

  const priceRange = maxHistorical - minHistorical || 1;

  // Build SVG path
  const pointsString = historicalData
    .map((pt, idx) => {
      const x = padding + (idx / (historicalData.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((pt.price - minHistorical) / priceRange) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-750 max-w-xl w-full p-6 sm:p-7 space-y-6 relative text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              30-Day Fare History: {flight.originCode} → {flight.destinationCode}
            </h3>
            <p className="text-xs text-slate-400">
              {flight.airline} {flight.flightNumber} • Demo historical observations
            </p>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lowest Recorded</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" />
              {format(minHistorical)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">30-Day Average</span>
            <span className="text-base sm:text-lg font-black text-white">
              {format(avgHistorical)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Highest Observed</span>
            <span className="text-base sm:text-lg font-black text-rose-400 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              {format(maxHistorical)}
            </span>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="bg-slate-850 rounded-2xl p-4 border border-slate-750">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-2">
            <span>Historical 30-day trend</span>
            <span className="text-sky-400 font-bold">Today: {format(flight.minPrice)}</span>
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#334155" strokeDasharray="3 3" />
            <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#334155" strokeDasharray="3 3" />
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#334155" />

            {/* Y axis labels */}
            <text x={padding - 5} y={padding + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="bold">
              {format(maxHistorical)}
            </text>
            <text x={padding - 5} y={svgHeight / 2 + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {format(avgHistorical)}
            </text>
            <text x={padding - 5} y={svgHeight - padding + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {format(minHistorical)}
            </text>

            {/* Area under curve */}
            <polygon
              points={`${padding},${svgHeight - padding} ${pointsString} ${svgWidth - padding},${svgHeight - padding}`}
              fill="rgba(56, 189, 248, 0.15)"
            />

            {/* Trend line */}
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />

            {/* Current point highlight */}
            <circle
              cx={svgWidth - padding}
              cy={svgHeight - padding - ((flight.minPrice - minHistorical) / priceRange) * (svgHeight - padding * 2)}
              r="5"
              fill="#38bdf8"
              stroke="#0f172a"
              strokeWidth="2"
            />
          </svg>

          <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span>30 days ago</span>
            <span>15 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Historical values reflect observed demo prices for this route.</span>
        </div>
      </div>
    </div>
  );
}
