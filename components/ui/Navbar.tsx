'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { useAuth } from '@/components/auth/AuthContext';
import { SupportedCurrency } from '@/lib/currency';
import { Plane, Bell, Shield, Menu, X, Info, User as UserIcon, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export function Navbar() {
  const { currency, setCurrency, currencies } = useCurrency();
  const { user, profile, isProfileComplete, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : user?.displayName || user?.email?.split('@')[0] || 'Member';

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Demo Notification Ribbon */}
      <div className="bg-amber-950/50 border-b border-amber-900/40 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong>Demo Version:</strong> Flight prices and provider feeds are simulated for development. No live bookings are processed.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">FareFinder</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-sky-950 text-sky-300 border border-sky-800/60 uppercase tracking-wider">
                  India
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none">Find lowest fares everywhere</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#popular-routes"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Popular Routes
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            {/* Profile Tab in Main Nav */}
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
              {user && !isProfileComplete && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Profile incomplete" />
              )}
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </nav>

          {/* Controls: Currency selector + Auth CTA / User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <select
                aria-label="Select Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="text-xs font-semibold bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {Object.values(currencies).map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                    {c.code} ({c.symbol.trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Track Fares CTA */}
            <Link
              href="/#popular-routes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 shadow-sm transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-sky-400" />
              <span>Track Fares</span>
            </Link>

            {/* Auth State: User Menu or Sign In / Sign Up */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-slate-700 rounded-xl transition-all text-xs font-bold text-slate-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow">
                    {userInitial}
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      {!isProfileComplete && (
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            openAuthModal('onboarding');
                          }}
                          className="mt-2 text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-800/70 px-2 py-0.5 rounded-md flex items-center gap-1 hover:bg-amber-900/50"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Complete Profile (Required)</span>
                        </button>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-sky-400" />
                        <span>Profile & Saved Details</span>
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Shield className="w-4 h-4 text-indigo-400" />
                        <span>Admin Operations</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-950/40 transition-all cursor-pointer"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <select
              aria-label="Select Currency Mobile"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="text-xs font-semibold bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200"
            >
              {Object.values(currencies).map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                  {c.code} ({c.symbol.trim()})
                </option>
              ))}
            </select>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#popular-routes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
          >
            Popular Routes
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
          >
            How It Works
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
          >
            Profile & Passenger Details
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
          >
            Admin Dashboard
          </Link>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1">
                  <p className="text-xs font-bold text-white">{displayName}</p>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-3 bg-slate-900 text-rose-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="py-2.5 px-3 bg-slate-900 text-slate-200 font-bold rounded-xl text-xs border border-slate-800 text-center"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="py-2.5 px-3 bg-sky-600 text-white font-bold rounded-xl text-xs text-center shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
