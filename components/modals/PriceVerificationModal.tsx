'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FlightSearchResult, PriceVerificationResult } from '@/types/flights';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { logFirebaseEvent } from '@/lib/firebase/client';
import { ShieldCheck, AlertTriangle, ArrowRight, RefreshCw, ExternalLink, X } from 'lucide-react';

interface PriceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: FlightSearchResult | null;
  searchId?: string;
}

export function PriceVerificationModal({
  isOpen,
  onClose,
  offer,
  searchId,
}: PriceVerificationModalProps) {
  const router = useRouter();
  const { format } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<PriceVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen || !offer) return;

    setLoading(true);
    setError(null);
    setVerificationResult(null);
    setCountdown(3);

    // Call server-side price verification API
    const verify = async () => {
      try {
        const res = await fetch(`/api/flights/${offer.id}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offer }),
        });

        if (!res.ok) {
          throw new Error('Failed to verify fare with provider');
        }

        const data: PriceVerificationResult = await res.json();
        setVerificationResult(data);
        setLoading(false);

        logFirebaseEvent('verify_price', {
          provider: offer.provider,
          flight_number: offer.flightNumber,
          previous_price: data.previousPrice,
          current_price: data.currentPrice,
          price_changed: data.priceChanged,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Verification network error');
        setLoading(false);
      }
    };

    verify();
  }, [isOpen, offer]);

  // Handle countdown for unchanged price
  useEffect(() => {
    if (!verificationResult || verificationResult.priceChanged || loading) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleProceedToProvider();
    }
  }, [verificationResult, countdown, loading]);

  if (!isOpen || !offer) return null;

  const handleProceedToProvider = () => {
    const finalPrice = verificationResult ? verificationResult.currentPrice : offer.totalPrice;
    const targetUrl = verificationResult?.bookingUrl || offer.bookingUrl;

    logFirebaseEvent('click_book_redirect', {
      provider: offer.provider,
      flight_number: offer.flightNumber,
      price: finalPrice,
      currency: offer.currency,
    });

    const redirectParams = new URLSearchParams({
      provider: offer.provider,
      price: finalPrice.toString(),
      currency: offer.currency,
      url: targetUrl,
    });
    if (searchId) {
      redirectParams.set('searchId', searchId);
    }

    router.push(`/go/provider/${offer.flightNumber}?${redirectParams.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full p-6 space-y-5 relative text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/60 border border-sky-800/50 text-sky-400 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Verifying Real-Time Fare</h3>
              <p className="text-xs text-slate-400 mt-1">
                Checking seat availability and live fare with {offer.providerName}...
              </p>
            </div>
          </div>
        )}

        {/* Unchanged Price - Verified */}
        {!loading && verificationResult && !verificationResult.priceChanged && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-lg">Price Verified & Available</h3>
              <p className="text-xs text-slate-400">
                {verificationResult.message || `Fare confirmed on ${offer.providerName}.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm">{offer.airline} {offer.flightNumber}</span>
                <p className="text-xs text-slate-400">{offer.originCode} → {offer.destinationCode}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400">
                  {format(verificationResult.currentPrice)}
                </span>
                <p className="text-[10px] text-slate-400">Total Price</p>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400">
              Redirecting to {offer.providerName} in <strong className="text-emerald-400">{countdown}s</strong>...
            </p>

            <button
              type="button"
              onClick={handleProceedToProvider}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to {offer.providerName} Now</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Price Changed Notice (Section 10 Requirement) */}
        {!loading && verificationResult && verificationResult.priceChanged && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/50 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-lg">Price Changed</h3>
              <p className="text-xs text-slate-400">
                Seat inventory updated on {offer.providerName} while you were searching.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Previous Displayed Price:</span>
                <span className="line-through text-slate-500">{format(verificationResult.previousPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-amber-300 pt-1 border-t border-amber-800/40">
                <span>Current Real-Time Price:</span>
                <span className="text-lg font-black text-amber-300">{format(verificationResult.currentPrice)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Fares fluctuate based on dynamic seat tiers. You may continue at the updated price or compare other providers for this route.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 border border-slate-700 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-colors"
              >
                View Other Prices
              </button>
              <button
                type="button"
                onClick={handleProceedToProvider}
                className="py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {!loading && error && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-rose-400 font-semibold">{error}</p>
            <button
              type="button"
              onClick={handleProceedToProvider}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Proceed to Provider Site Anyway
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
