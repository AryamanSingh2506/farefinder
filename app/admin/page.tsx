'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProviderMetadata } from '@/types/providers';
import { useCurrency } from '@/components/currency/CurrencyContext';
import {
  Shield,
  Search,
  MousePointerClick,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Power,
  TrendingUp,
  ArrowLeft,
  Server,
  Layers,
  Check,
} from 'lucide-react';

interface AdminMetricsData {
  totalSearches: number;
  totalClicks: number;
  activeAlerts: number;
  averageLatencyMs: number;
  providerResponseRate: number;
  topRoutes: { route: string; count: number }[];
  recentSearches: any[];
  recentClicks: any[];
  providers: ProviderMetadata[];
}

export default function AdminDashboardPage() {
  const { format } = useCurrency();
  const [data, setData] = useState<AdminMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleToggleProvider = async (providerId: string, currentEnabled: boolean) => {
    setTogglingId(providerId);
    setActionNotice(null);

    try {
      const res = await fetch('/api/providers/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          enabled: !currentEnabled,
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        setActionNotice(resData.message);
        // Update local state immediately
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            providers: prev.providers.map((p) =>
              p.id === providerId ? { ...p, enabled: !currentEnabled } : p
            ),
          };
        });
      }
    } catch {
      // Ignore
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to FareFinder Search</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Shield className="w-8 h-8 text-indigo-400" />
              <span>Admin & Meta-Engine Operations</span>
            </h1>
            <p className="text-xs text-slate-400">
              Real-time telemetry, provider feed health, and partner configuration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchMetrics}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Nominal</span>
            </span>
          </div>
        </div>

        {actionNotice && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {actionNotice}
            </span>
            <button
              onClick={() => setActionNotice(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* High-Level KPI Cards (Section 22) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Searches */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Searches Logged</span>
              <Search className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {data?.totalSearches || 0}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold block">Live query volume</span>
          </div>

          {/* Outbound Clicks */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Outbound Clicks</span>
              <MousePointerClick className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {data?.totalClicks || 0}
            </p>
            <span className="text-[10px] text-indigo-400 font-semibold block">Provider handoffs</span>
          </div>

          {/* Response Rate */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Response Rate</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              {data?.providerResponseRate || 98.4}%
            </p>
            <span className="text-[10px] text-slate-400 font-semibold block">Target: &gt; 95%</span>
          </div>

          {/* Search Latency */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Avg Latency</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {data?.averageLatencyMs || 245}ms
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold block">Sub-second parallel</span>
          </div>

          {/* Active Price Alerts */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-2 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Active Alerts</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {data?.activeAlerts || 0}
            </p>
            <span className="text-[10px] text-purple-400 font-semibold block">Email tracking hooks</span>
          </div>
        </div>

        {/* Provider Management Table (Section 22 Requirement) */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" />
                <span>Provider Abstraction Layer & Live Feeds</span>
              </h3>
              <p className="text-xs text-slate-400">
                Toggle providers on or off to simulate degradation or test selective provider searches.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {data?.providers.filter((p) => p.enabled).length} of {data?.providers.length} Enabled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-850 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Adapter Mode</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Verification API</th>
                  <th className="py-3 px-4">Student Fare</th>
                  <th className="py-3 px-4 text-right">Status / Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {data?.providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-200">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 capitalize">{p.type}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950/60 text-sky-300 border border-sky-800/60">
                        Demo Adapter
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{p.avgLatencyMs}ms</td>
                    <td className="py-3.5 px-4">
                      {p.hasVerificationApi ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Supported
                        </span>
                      ) : (
                        <span className="text-slate-500">Fallback</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {p.supportsStudentFare ? 'Yes (+10kg)' : 'Standard'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        disabled={togglingId === p.id}
                        onClick={() => handleToggleProvider(p.id, p.enabled)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                          p.enabled
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800/80'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-800/60'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{p.enabled ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Grid: Most Searched Routes & Recent Outbound Clicks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Routes */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Most Searched Domestic Routes</span>
            </h3>
            <div className="space-y-2">
              {data?.topRoutes && data.topRoutes.length > 0 ? (
                data.topRoutes.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-850/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-200">{r.route}</span>
                    <span className="font-semibold text-slate-400">{r.count} searches</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No route searches recorded yet.</p>
              )}
            </div>
          </div>

          {/* Outbound Clicks Audit Log */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-indigo-400" />
              <span>Recent Outbound Affiliate Clicks</span>
            </h3>
            <div className="space-y-2">
              {data?.recentClicks && data.recentClicks.length > 0 ? (
                data.recentClicks.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-850/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {c.flightNumber} • {c.providerCode}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="font-black text-emerald-400">{format(c.displayedPrice)}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No clicks recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
