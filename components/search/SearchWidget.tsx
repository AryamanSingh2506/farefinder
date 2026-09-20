'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AIRPORTS, Airport, searchAirports, getAirportByCode, getNearbyAirports } from '@/lib/data/airports';
import { CabinClass } from '@/types/flights';
import { logFirebaseEvent } from '@/lib/firebase/client';
import {
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  Calendar,
  Users,
  GraduationCap,
  Search,
  History,
  Check,
  ChevronDown,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';

function formatToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getDayName(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

interface RecentSearch {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: CabinClass;
  isStudent?: boolean;
}

export function SearchWidget({
  initialOrigin = 'BLR',
  initialDestination = 'BOM',
  initialDate,
  initialCabin = 'economy',
}: {
  initialOrigin?: string;
  initialDestination?: string;
  initialDate?: string;
  initialCabin?: CabinClass;
}) {
  const router = useRouter();

  // Next 14 days default departure date
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [origin, setOrigin] = useState<string>(initialOrigin);
  const [destination, setDestination] = useState<string>(initialDestination);
  const [departureDate, setDepartureDate] = useState<string>(initialDate || getDefaultDate());
  const [returnDate, setReturnDate] = useState<string>('');

  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>(initialCabin);
  const [isStudent, setIsStudent] = useState<boolean>(false);

  // Dropdown UI states
  const [originOpen, setOriginOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const originAirport = getAirportByCode(origin) || AIRPORTS[0];
  const destAirport = getAirportByCode(destination) || AIRPORTS[1];

  const nearbyOrigin = getNearbyAirports(origin);
  const nearbyDest = getNearbyAirports(destination);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('farefinder_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 4));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveRecentSearch = (searchItem: RecentSearch) => {
    try {
      const existing = localStorage.getItem('farefinder_recent_searches');
      let list: RecentSearch[] = existing ? JSON.parse(existing) : [];
      list = list.filter(
        (s) => !(s.origin === searchItem.origin && s.destination === searchItem.destination)
      );
      list.unshift(searchItem);
      localStorage.setItem('farefinder_recent_searches', JSON.stringify(list.slice(0, 6)));
      setRecentSearches(list.slice(0, 4));
    } catch {
      // Ignore
    }
  };

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;
    if (origin === destination) {
      alert('Origin and Destination airports cannot be identical.');
      return;
    }

    saveRecentSearch({
      origin,
      originCity: originAirport.city,
      destination,
      destinationCity: destAirport.city,
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      passengers: adults + children + infants,
      cabinClass,
      isStudent,
    });

    logFirebaseEvent('search_flights', {
      origin,
      destination,
      departure_date: departureDate,
      passengers: adults + children + infants,
      cabin_class: cabinClass,
      is_student: isStudent,
    });

    const params = new URLSearchParams({
      origin,
      destination,
      date: departureDate,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      cabin: cabinClass,
    });

    if (tripType === 'roundtrip' && returnDate) {
      params.set('returnDate', returnDate);
    }
    if (isStudent) {
      params.set('student', 'true');
    }

    router.push(`/search?${params.toString()}`);
  };

  const totalPassengers = adults + children + infants;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full bg-slate-900/95 rounded-3xl shadow-2xl shadow-black/60 border border-slate-800 p-6 lg:p-8 backdrop-blur-xl">
      {/* Search Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setTripType('oneway')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'oneway'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            One-Way
          </button>
          <button
            type="button"
            onClick={() => {
              setTripType('roundtrip');
              if (!returnDate) {
                const rd = new Date(departureDate);
                rd.setDate(rd.getDate() + 4);
                setReturnDate(rd.toISOString().split('T')[0]);
              }
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'roundtrip'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Round-Trip
          </button>
        </div>

        {/* Student Fare toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 px-3 py-1.5 rounded-xl transition-colors">
            <input
              type="checkbox"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 cursor-pointer accent-sky-500"
            />
            <div className="flex items-center gap-1 text-xs font-bold text-sky-300">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>Student Fare</span>
            </div>
            <span className="text-[10px] bg-sky-900/80 text-sky-200 px-1.5 py-0.2 rounded font-semibold hidden sm:inline border border-sky-700/50">
              Extra 10kg Baggage
            </span>
          </label>
        </div>
      </div>

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleSearch} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative">
          {/* Origin Airport */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              From
            </label>
            <button
              type="button"
              onClick={() => {
                setOriginOpen(!originOpen);
                setDestOpen(false);
              }}
              className="w-full text-left p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all flex items-center justify-between"
            >
              <div>
                <span className="block text-2xl font-black text-white leading-tight">
                  {originAirport.code}
                </span>
                <span className="block text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                  {originAirport.city}
                </span>
                <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">
                  {originAirport.name}
                </span>
              </div>
              <PlaneTakeoff className="w-5 h-5 text-sky-400 shrink-0" />
            </button>

            {/* Origin Dropdown */}
            {originOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Search city or IATA code..."
                  value={originQuery}
                  onChange={(e) => setOriginQuery(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {searchAirports(originQuery).map((a) => (
                    <button
                      key={a.code}
                      type="button"
                      onClick={() => {
                        setOrigin(a.code);
                        setOriginOpen(false);
                        setOriginQuery('');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white group-hover:text-sky-400">
                          {a.city} ({a.code})
                        </span>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{a.name}</p>
                      </div>
                      {origin === a.code && <Check className="w-4 h-4 text-sky-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button (Absolute on desktop, inline on mobile) */}
          <div className="flex md:hidden justify-center -my-2 z-10">
            <button
              type="button"
              onClick={handleSwapAirports}
              className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 shadow-sm hover:text-white"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop swap button positioned between origin and destination */}
          <div className="hidden md:flex absolute left-[24.5%] top-[45%] -translate-y-1/2 -translate-x-1/2 z-20">
            <button
              type="button"
              onClick={handleSwapAirports}
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 shadow-md hover:scale-110 hover:border-sky-500 hover:text-white flex items-center justify-center transition-all"
              title="Swap Origin and Destination"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Destination Airport */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              To
            </label>
            <button
              type="button"
              onClick={() => {
                setDestOpen(!destOpen);
                setOriginOpen(false);
              }}
              className="w-full text-left p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all flex items-center justify-between"
            >
              <div>
                <span className="block text-2xl font-black text-white leading-tight">
                  {destAirport.code}
                </span>
                <span className="block text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                  {destAirport.city}
                </span>
                <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">
                  {destAirport.name}
                </span>
              </div>
              <PlaneLanding className="w-5 h-5 text-indigo-400 shrink-0" />
            </button>

            {/* Destination Dropdown */}
            {destOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Search city or IATA code..."
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {searchAirports(destQuery).map((a) => (
                    <button
                      key={a.code}
                      type="button"
                      onClick={() => {
                        setDestination(a.code);
                        setDestOpen(false);
                        setDestQuery('');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-800 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white group-hover:text-sky-400">
                          {a.city} ({a.code})
                        </span>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{a.name}</p>
                      </div>
                      {destination === a.code && <Check className="w-4 h-4 text-sky-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Departure Date */}
          <div className={`${tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-3'} relative group`}>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Departure (DD/MM/YYYY)
            </label>
            <div className="relative">
              <div className="w-full p-3 bg-slate-800/70 group-hover:bg-slate-800 border border-slate-700/80 rounded-2xl flex items-center justify-between transition-colors pointer-events-none">
                <div>
                  <span className="block text-xl font-black text-white leading-tight">
                    {formatToDDMMYYYY(departureDate)}
                  </span>
                  <span className="block text-xs font-semibold text-slate-400">
                    {getDayName(departureDate)}
                  </span>
                </div>
                <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
              </div>
              <input
                type="date"
                value={departureDate}
                min={todayStr}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Select departure date (DD/MM/YYYY)"
              />
            </div>
          </div>

          {/* Return Date (if Round-trip) */}
          {tripType === 'roundtrip' && (
            <div className="md:col-span-2 relative group">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Return (DD/MM/YYYY)
              </label>
              <div className="relative">
                <div className="w-full p-3 bg-slate-800/70 group-hover:bg-slate-800 border border-slate-700/80 rounded-2xl flex items-center justify-between transition-colors pointer-events-none">
                  <div>
                    <span className="block text-xl font-black text-white leading-tight">
                      {returnDate ? formatToDDMMYYYY(returnDate) : 'Select date'}
                    </span>
                    <span className="block text-xs font-semibold text-slate-400">
                      {returnDate ? getDayName(returnDate) : 'Round-trip return'}
                    </span>
                  </div>
                  <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                </div>
                <input
                  type="date"
                  value={returnDate}
                  min={departureDate || todayStr}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Select return date (DD/MM/YYYY)"
                />
              </div>
            </div>
          )}

          {/* Passengers & Cabin Class */}
          <div className={`${tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-3'} relative`}>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Travelers & Class
            </label>
            <button
              type="button"
              onClick={() => setPassengersOpen(!passengersOpen)}
              className="w-full text-left p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all flex items-center justify-between"
            >
              <div>
                <span className="block text-sm font-bold text-white leading-tight">
                  {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
                </span>
                <span className="block text-xs text-slate-400 capitalize">
                  {cabinClass.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Travelers Popover */}
            {passengersOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 z-50 p-5 space-y-4 text-white">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Adults</span>
                    <span className="text-xs text-slate-400 font-medium">12+ years</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                      aria-label="Decrease adult passengers"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="w-6 text-center text-sm font-black text-white">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 9}
                      onClick={() => setAdults(Math.min(9, adults + 1))}
                      className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white flex items-center justify-center transition-all shadow-sm disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Increase adult passengers"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Children</span>
                    <span className="text-xs text-slate-400 font-medium">2 - 11 years</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                      aria-label="Decrease child passengers"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="w-6 text-center text-sm font-black text-white">{children}</span>
                    <button
                      type="button"
                      disabled={children >= 8}
                      onClick={() => setChildren(Math.min(8, children + 1))}
                      className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white flex items-center justify-center transition-all shadow-sm disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Increase child passengers"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Infants</span>
                    <span className="text-xs text-slate-400 font-medium">Below 2 years</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      disabled={infants <= 0}
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                      aria-label="Decrease infant passengers"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="w-6 text-center text-sm font-black text-white">{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= adults}
                      onClick={() => setInfants(Math.min(adults, infants + 1))}
                      className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white flex items-center justify-center transition-all shadow-sm disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Increase infant passengers"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Cabin Class Select */}
                <div className="pt-3 border-t border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Cabin Class
                  </label>
                  <select
                    aria-label="Cabin Class"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                    className="w-full text-xs font-bold p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-xs"
                  >
                    <option value="economy" className="bg-slate-900 text-white font-semibold">Economy</option>
                    <option value="premium_economy" className="bg-slate-900 text-white font-semibold">Premium Economy</option>
                    <option value="business" className="bg-slate-900 text-white font-semibold">Business</option>
                    <option value="first" className="bg-slate-900 text-white font-semibold">First Class</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setPassengersOpen(false)}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nearby Airport Hints */}
        {(nearbyOrigin.length > 0 || nearbyDest.length > 0) && (
          <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 pt-1">
            <span className="font-semibold text-slate-300">Nearby alternatives:</span>
            {nearbyOrigin.map((a) => (
              <button
                key={a.code}
                type="button"
                onClick={() => setOrigin(a.code)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 font-medium"
              >
                Depart from {a.city} ({a.code})
              </button>
            ))}
            {nearbyDest.map((a) => (
              <button
                key={a.code}
                type="button"
                onClick={() => setDestination(a.code)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 font-medium"
              >
                Arrive in {a.city} ({a.code})
              </button>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-auto min-w-[260px] px-8 py-4 bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/30 hover:shadow-sky-600/40 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>Search & Compare Flights</span>
          </button>
        </div>
      </form>

      {/* Recent Searches Bar */}
      {recentSearches.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
            <History className="w-3.5 h-3.5 text-slate-400" />
            Recent searches:
          </span>
          {recentSearches.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setOrigin(s.origin);
                setDestination(s.destination);
                setDepartureDate(s.departureDate);
                setCabinClass(s.cabinClass);
                setIsStudent(Boolean(s.isStudent));
              }}
              className="text-xs font-semibold px-3 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-full text-slate-300 transition-colors"
            >
              {s.origin} → {s.destination} ({s.departureDate})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
