'use client';

import React from 'react';
import { FilterState, TimeSlot } from '@/types/filters';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { RotateCcw, SlidersHorizontal, Sun, Sunrise, Sunset, Moon, GraduationCap } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
  minDurationHours: number;
  maxDurationHours: number;
  airlineOptions: { code: string; name: string; count: number; minPrice: number }[];
  providerOptions: { id: string; name: string; count: number }[];
  onReset: () => void;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  minPrice,
  maxPrice,
  minDurationHours,
  maxDurationHours,
  airlineOptions,
  providerOptions,
  onReset,
}: FilterSidebarProps) {
  const { format } = useCurrency();

  const handleStopToggle = (stop: number) => {
    const stops = [...filters.stops];
    const idx = stops.indexOf(stop);
    if (idx >= 0) {
      stops.splice(idx, 1);
    } else {
      stops.push(stop);
    }
    onFilterChange({ ...filters, stops });
  };

  const handleAirlineToggle = (code: string) => {
    const airlines = [...filters.airlines];
    const idx = airlines.indexOf(code);
    if (idx >= 0) {
      airlines.splice(idx, 1);
    } else {
      airlines.push(code);
    }
    onFilterChange({ ...filters, airlines });
  };

  const handleProviderToggle = (id: string) => {
    const providers = [...filters.providers];
    const idx = providers.indexOf(id);
    if (idx >= 0) {
      providers.splice(idx, 1);
    } else {
      providers.push(id);
    }
    onFilterChange({ ...filters, providers });
  };

  const handleDepartureSlotToggle = (slot: TimeSlot) => {
    const slots = [...filters.departureTimeSlots];
    const idx = slots.indexOf(slot);
    if (idx >= 0) {
      slots.splice(idx, 1);
    } else {
      slots.push(slot);
    }
    onFilterChange({ ...filters, departureTimeSlots: slots });
  };

  const timeSlots: { id: TimeSlot; label: string; range: string; icon: React.ReactNode }[] = [
    { id: 'early_morning', label: 'Before 6 AM', range: 'Early', icon: <Moon className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'morning', label: '6 AM - 12 PM', range: 'Morning', icon: <Sunrise className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'afternoon', label: '12 PM - 6 PM', range: 'Afternoon', icon: <Sun className="w-3.5 h-3.5 text-orange-500" /> },
    { id: 'evening', label: 'After 6 PM', range: 'Evening', icon: <Sunset className="w-3.5 h-3.5 text-purple-500" /> },
  ];

  return (
    <aside className="w-full bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-6 shadow-sm text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-400" />
          <h3 className="font-bold text-white text-sm">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">Maximum Price</span>
          <span className="font-extrabold text-sky-400">{format(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>{format(minPrice)}</span>
          <span>{format(maxPrice)}</span>
        </div>
      </div>

      {/* Flight Stops */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-200 block">Stops</span>
        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.stops.includes(0)}
                onChange={() => handleStopToggle(0)}
                className="w-4 h-4 text-sky-600 rounded accent-sky-500"
              />
              <span>Non-stop only</span>
            </div>
          </label>
          <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.stops.includes(1)}
                onChange={() => handleStopToggle(1)}
                className="w-4 h-4 text-sky-600 rounded accent-sky-500"
              />
              <span>1 Stop</span>
            </div>
          </label>
        </div>
      </div>

      {/* Departure Time Slots */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-200 block">Departure Time</span>
        <div className="grid grid-cols-2 gap-1.5">
          {timeSlots.map((slot) => {
            const isSelected = filters.departureTimeSlots.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleDepartureSlotToggle(slot.id)}
                className={`p-2 rounded-xl text-left border text-[11px] font-semibold transition-all flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-sky-950 border-sky-600 text-sky-200 shadow-sm'
                    : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  {slot.icon}
                  <span className="text-[9px] text-slate-400">{slot.range}</span>
                </div>
                <span className="truncate">{slot.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Airlines Multi-Select */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-200 block">Airlines</span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {airlineOptions.map((airline) => (
            <label
              key={airline.code}
              className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1 rounded-lg hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-2 truncate">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline.code)}
                  onChange={() => handleAirlineToggle(airline.code)}
                  className="w-4 h-4 text-sky-600 rounded accent-sky-500"
                />
                <span className="truncate">{airline.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{format(airline.minPrice)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Travel Providers (Airlines & OTAs) */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-200 block">Providers (Airlines & OTAs)</span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {providerOptions.map((provider) => (
            <label
              key={provider.id}
              className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1 rounded-lg hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-2 truncate">
                <input
                  type="checkbox"
                  checked={filters.providers.includes(provider.id)}
                  onChange={() => handleProviderToggle(provider.id)}
                  className="w-4 h-4 text-sky-600 rounded accent-sky-500"
                />
                <span className="truncate">{provider.name}</span>
              </div>
              <span className="text-[10px] text-slate-400">({provider.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fare Special Rules & Options */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-200 block">Fare Preferences</span>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={filters.refundableOnly}
              onChange={(e) => onFilterChange({ ...filters, refundableOnly: e.target.checked })}
              className="w-4 h-4 text-sky-600 rounded accent-sky-500"
            />
            <span>Refundable flights only</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={filters.studentFaresOnly}
              onChange={(e) => onFilterChange({ ...filters, studentFaresOnly: e.target.checked })}
              className="w-4 h-4 text-sky-600 rounded accent-sky-500"
            />
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
              <span>Student fares only</span>
            </div>
          </label>
        </div>
      </div>
    </aside>
  );
}
