import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Plane } from 'lucide-react';

export default async function BookingSimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const provider = (params.provider as string) || 'Provider Partner';
  const providerName = (params.providerName as string) || (params.provider as string) || 'Authorized Travel Provider';
  const flight = (params.flight as string) || 'AI-504';
  const origin = (params.origin as string) || 'BLR';
  const destination = (params.destination as string) || 'BOM';
  const price = (params.price as string) || '4,620';
  const date = (params.date as string) || '2026-11-06';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top handoff banner */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/50 text-emerald-300 px-4 py-2.5 text-xs font-medium text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>You were securely handed off from <strong className="text-emerald-200">FareFinder India</strong> to {providerName}</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to FareFinder India
          </Link>

          <span className="text-xs px-2.5 py-1 bg-amber-950/60 text-amber-300 rounded-full font-semibold border border-amber-800/60">
            Demo Provider Simulator
          </span>
        </div>

        {/* Provider Checkout Card Simulation */}
        <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden">
          <div className="bg-slate-850 border-b border-slate-800 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-lg shadow">
                {providerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{providerName} Checkout</h1>
                <p className="text-xs text-slate-400">Official Partner Deep Link Simulator</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Fare</p>
              <p className="text-2xl font-black text-emerald-400">₹{Number(price).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Flight Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-950/60 border border-sky-800/50 text-sky-400 rounded-xl">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{flight}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-200 font-medium">Non-stop</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {origin} → {destination} • Date: {date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Price Locked by FareFinder</span>
              </div>
            </div>

            {/* Notice / Transparency */}
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-800/50 text-sm text-sky-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sky-300 mb-1">Production Handoff Notice</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In a production environment with live affiliate/NDC integrations enabled, this button seamlessly redirects you directly to the airline or OTA checkout page with your selected flight and passenger parameters pre-filled. FareFinder India does not process bookings, collect payments, or store passenger credit card details.
                </p>
              </div>
            </div>

            {/* Passenger Placeholder Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">Passenger Details (Simulated)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">First & Middle Name</label>
                  <input
                    type="text"
                    disabled
                    value="Rohan"
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-slate-300 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    disabled
                    value="Sharma"
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                href="/"
                className="px-5 py-2.5 border border-slate-700 bg-slate-800/80 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-center"
              >
                Return to Search
              </Link>
              <button
                type="button"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Simulate Complete Booking on {providerName}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
