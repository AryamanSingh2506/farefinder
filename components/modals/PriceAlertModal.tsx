'use client';

import React, { useState } from 'react';
import { GroupedFlightResult } from '@/types/flights';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { logFirebaseEvent } from '@/lib/firebase/client';
import { Bell, CheckCircle2, AlertCircle, X, Shield, ArrowRight } from 'lucide-react';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: GroupedFlightResult | null;
}

export function PriceAlertModal({ isOpen, onClose, flight }: PriceAlertModalProps) {
  const { format, currency } = useCurrency();
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState<number>(
    flight ? Math.round((flight.minPrice * 0.9) / 100) * 100 : 4500
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !flight) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !targetPrice) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          origin: flight.originCode,
          destination: flight.destinationCode,
          departureDate: flight.departureDateTime.split('T')[0],
          targetPrice,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register alert');
      }

      setSuccess(true);
      setLoading(false);

      logFirebaseEvent('create_price_alert', {
        origin: flight.originCode,
        destination: flight.destinationCode,
        target_price: targetPrice,
        currency,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register price alert');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-750 max-w-md w-full p-6 sm:p-7 space-y-5 relative text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Price Alert Activated!</h3>
              <p className="text-xs text-slate-300 mt-1">
                We'll monitor {flight.originCode} → {flight.destinationCode} and notify <strong>{email}</strong> when the fare drops below {format(targetPrice)}.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-950 text-sky-400 border border-sky-800/50 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Track This Route Fare</h3>
                <p className="text-xs text-slate-400">
                  {flight.originCode} → {flight.destinationCode} • Current lowest: {format(flight.minPrice)}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/70 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Notify me when fare drops below:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  required
                  min={1000}
                  step={100}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-800 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-400 font-semibold">{currency}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Current lowest fare is {format(flight.minPrice)}. Target price set at ~10% discount.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Activating Alert...' : 'Set Free Price Alert'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              We respect your privacy. Zero spam. Unsubscribe anytime with one click.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
