'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GroupedFlightResult, FlightSearchResult, ProviderStatus } from '@/types/flights';
import { FilterState, SortOption } from '@/types/filters';
import { sortFlights } from '@/lib/flights/sorter';
import { filterFlights, getFilterBounds } from '@/lib/flights/filter';
import { CheapestHeroCard } from '@/components/flights/CheapestHeroCard';
import { FlightCard } from '@/components/flights/FlightCard';
import { ProviderStatusTracker } from '@/components/flights/ProviderStatusTracker';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { SortBar } from '@/components/filters/SortBar';
import { PriceVerificationModal } from '@/components/modals/PriceVerificationModal';
import { PriceHistoryModal } from '@/components/modals/PriceHistoryModal';
import { PriceAlertModal } from '@/components/modals/PriceAlertModal';
import { useCurrency } from '@/components/currency/CurrencyContext';
import {
  ArrowLeft,
  Plane,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Info,
} from 'lucide-react';

function formatToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { format } = useCurrency();

  const origin = searchParams.get('origin') || 'BLR';
  const destination = searchParams.get('destination') || 'BOM';
  const departureDate = searchParams.get('date') || '2026-11-06';
  const returnDate = searchParams.get('returnDate') || undefined;
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const infants = parseInt(searchParams.get('infants') || '0', 10);
  const cabinClass = (searchParams.get('cabin') || 'economy') as any;
  const isStudent = searchParams.get('student') === 'true';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawGroupedFlights, setRawGroupedFlights] = useState<GroupedFlightResult[]>([]);
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [searchId, setSearchId] = useState<string>('');

  // Sorting and Filtering states
  const [currentSort, setCurrentSort] = useState<SortOption>('cheapest');
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 20000,
    stops: [],
    airlines: [],
    providers: [],
    departureTimeSlots: [],
    arrivalTimeSlots: [],
    maxDurationHours: 12,
    baggageIncludedOnly: false,
    refundableOnly: false,
    studentFaresOnly: false,
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals state
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [selectedOfferForVerification, setSelectedOfferForVerification] = useState<FlightSearchResult | null>(null);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedFlightForHistory, setSelectedFlightForHistory] = useState<GroupedFlightResult | null>(null);

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedFlightForAlert, setSelectedFlightForAlert] = useState<GroupedFlightResult | null>(null);

  // Fetch flights on load or parameter change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const runSearch = async () => {
      try {
        const res = await fetch('/api/flights/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin,
            destination,
            departureDate,
            returnDate,
            adults,
            children,
            infants,
            cabinClass,
            isStudent,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch flight results');
        }

        if (isMounted) {
          setRawGroupedFlights(data.results);
          setProviderStatuses(data.providerStatuses);
          setSearchId(data.searchId);

          // Update maxPrice filter default to the maximum price from results
          if (data.results.length > 0) {
            const maxP = Math.max(...data.results.map((r: GroupedFlightResult) => r.minPrice));
            setFilters((prev) => ({ ...prev, maxPrice: maxP }));
          }

          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Search failed');
          setLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      isMounted = false;
    };
  }, [origin, destination, departureDate, returnDate, adults, children, infants, cabinClass, isStudent]);

  // Compute filter bounds based on results
  const filterBounds = useMemo(() => {
    return getFilterBounds(rawGroupedFlights);
  }, [rawGroupedFlights]);

  // Filtered and Sorted flight list
  const processedFlights = useMemo(() => {
    const filtered = filterFlights(rawGroupedFlights, filters);
    return sortFlights(filtered, currentSort);
  }, [rawGroupedFlights, filters, currentSort]);

  // Cheapest overall flight for hero card
  const cheapestFlight = useMemo(() => {
    if (rawGroupedFlights.length === 0) return null;
    return [...rawGroupedFlights].sort((a, b) => a.minPrice - b.minPrice)[0];
  }, [rawGroupedFlights]);

  // Handlers for modal interactions
  const handleBookClick = (flight: GroupedFlightResult, offerIndex: number = 0) => {
    const offer = flight.offers[offerIndex] || flight.lowestOffer;
    setSelectedOfferForVerification(offer);
    setVerificationModalOpen(true);
  };

  const handleOpenPriceHistory = (flight: GroupedFlightResult) => {
    setSelectedFlightForHistory(flight);
    setHistoryModalOpen(true);
  };

  const handleOpenPriceAlert = (flight: GroupedFlightResult) => {
    setSelectedFlightForAlert(flight);
    setAlertModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      maxPrice: filterBounds.maxPrice,
      stops: [],
      airlines: [],
      providers: [],
      departureTimeSlots: [],
      arrivalTimeSlots: [],
      maxDurationHours: filterBounds.maxDurationHours,
      baggageIncludedOnly: false,
      refundableOnly: false,
      studentFaresOnly: false,
    });
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Route Header Banner (Section 6 Requirement) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Search</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {origin} → {destination}
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
              {formatToDDMMYYYY(departureDate)}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''} • {cabinClass.replace('_', ' ')}
            {isStudent && ' • Student Concession Applied'}
          </p>
        </div>

        {/* Total found & lowest price summary */}
        {!loading && !error && rawGroupedFlights.length > 0 && (
          <div className="text-left md:text-right bg-slate-800/60 md:bg-transparent p-3 md:p-0 rounded-2xl border md:border-0 border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium block">
              {rawGroupedFlights.length} flights found across {providerStatuses.length} providers
            </span>
            <div className="flex items-baseline md:justify-end gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-slate-400">Prices from</span>
              <span className="text-2xl font-black text-emerald-400">
                {format(cheapestFlight?.minPrice || 0)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">* Indicative prices verified upon booking</span>
          </div>
        )}
      </div>

      {/* Provider Status Tracker Bar (Section 18 Requirement) */}
      <ProviderStatusTracker statuses={providerStatuses} isLoading={loading} />

      {/* Cheapest Flight Hero Highlight (Section 7 Requirement) */}
      {!loading && cheapestFlight && (
        <CheapestHeroCard flight={cheapestFlight} onBookClick={handleBookClick} />
      )}

      {/* Main Results Content: Filter Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="w-full py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-sky-400" />
            <span>Filter Flights ({processedFlights.length} matching)</span>
          </button>
        </div>

        {/* Desktop Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            minPrice={filterBounds.minPrice}
            maxPrice={filterBounds.maxPrice}
            minDurationHours={filterBounds.minDurationHours}
            maxDurationHours={filterBounds.maxDurationHours}
            airlineOptions={filterBounds.airlineOptions}
            providerOptions={filterBounds.providerOptions}
            onReset={handleResetFilters}
          />
        </div>

        {/* Results Main Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sorting Bar */}
          <SortBar
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            resultsCount={processedFlights.length}
          />

          {/* Loading State Skeleton */}
          {loading && (
            <div className="space-y-4 py-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="w-32 h-6 bg-slate-800 rounded-lg" />
                    <div className="w-24 h-6 bg-slate-800 rounded-lg" />
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <div className="w-20 h-10 bg-slate-800 rounded-lg" />
                    <div className="w-32 h-4 bg-slate-800/60 rounded-lg" />
                    <div className="w-20 h-10 bg-slate-800 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-rose-950/60 border border-rose-800/80 rounded-3xl p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <h3 className="font-bold text-rose-200 text-lg">Search Failed</h3>
              <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Zero Results State */}
          {!loading && !error && processedFlights.length === 0 && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-sky-400 flex items-center justify-center mx-auto border border-slate-700">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg">No Flights Match Your Filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range or clearing airline/stop filters to see available options on this route.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Flights Cards List (Section 9 Provider Comparison Grouping) */}
          {!loading &&
            !error &&
            processedFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onBookClick={handleBookClick}
                onOpenPriceHistory={handleOpenPriceHistory}
                onOpenPriceAlert={handleOpenPriceAlert}
              />
            ))}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 w-full max-w-md h-full overflow-y-auto p-6 space-y-4 border-l border-slate-800 text-white">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              minPrice={filterBounds.minPrice}
              maxPrice={filterBounds.maxPrice}
              minDurationHours={filterBounds.minDurationHours}
              maxDurationHours={filterBounds.maxDurationHours}
              airlineOptions={filterBounds.airlineOptions}
              providerOptions={filterBounds.providerOptions}
              onReset={handleResetFilters}
            />
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl"
            >
              Apply Filters ({processedFlights.length} flights)
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <PriceVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        offer={selectedOfferForVerification}
        searchId={searchId}
      />

      <PriceHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        flight={selectedFlightForHistory}
      />

      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        flight={selectedFlightForAlert}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-400">Initializing flight comparison engine...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
