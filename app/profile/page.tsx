'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { useCurrency } from '@/components/currency/CurrencyContext';
import { UserProfileFormData, userProfileSchema } from '@/types/auth';
import { SupportedCurrency } from '@/lib/currency';
import {
  User,
  Phone,
  Calendar,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Bell,
  SlidersHorizontal,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Sparkles,
  Plane,
  Save,
} from 'lucide-react';

type ProfileTab = 'details' | 'alerts' | 'preferences';

export default function ProfilePage() {
  const { user, profile, loading, isProfileComplete, saveProfile, openAuthModal, logout } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();

  const [activeTab, setActiveTab] = useState<ProfileTab>('details');

  // Form State
  const [formData, setFormData] = useState<UserProfileFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: 'male',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Travel preferences state
  const [preferredCabin, setPreferredCabin] = useState<'economy' | 'business'>('economy');
  const [isStudentConcession, setIsStudentConcession] = useState<boolean>(false);
  const [autoFillBookings, setAutoFillBookings] = useState<boolean>(true);

  // Sync profile data when loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        middleName: profile.middleName || '',
        lastName: profile.lastName || '',
        mobileNumber: profile.mobileNumber || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || 'male',
      });
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);
    setFieldErrors({});

    const result = userProfileSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (key && !errors[key]) {
          errors[key] = issue.message;
        }
      });
      setFieldErrors(errors);
      setErrorMessage('Please fill in all mandatory fields correctly.');
      return;
    }

    setSaving(true);
    try {
      await saveProfile(result.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading profile details...</p>
        </div>
      </div>
    );
  }

  // Not logged in view
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center mx-auto shadow-xl shadow-sky-950/20">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Passenger Profile & Settings</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Sign in or create a FareFinder account to manage your verified passenger information, track route price drops, and configure student concessions.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-4">
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-950/50 transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Create Free Account
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Flight Search</span>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = profile?.firstName
    ? `${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}`.trim()
    : user.displayName || 'FareFinder Traveler';

  const userInitial = fullName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Breadcrumb & Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Flight Search</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <User className="w-8 h-8 text-sky-400" />
              <span>Passenger Profile & Account</span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage your personal identity records, flight preferences, and price alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 rounded-xl text-xs font-bold text-slate-300 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* User Summary Card */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              {userInitial}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{fullName}</h2>
                {isProfileComplete ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Profile</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Profile Incomplete</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col sm:items-end gap-2 text-xs">
            <span className="text-slate-400">Account ID:</span>
            <code className="text-[11px] text-slate-300 bg-slate-850 px-2 py-1 rounded-md border border-slate-800 font-mono">
              {user.uid.slice(0, 12)}...
            </code>
          </div>
        </div>

        {/* PROFILE TABS */}
        <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'details'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Information</span>
            {!isProfileComplete && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>My Price Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Travel Preferences</span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: PERSONAL INFORMATION                                          */}
        {/* ==================================================================== */}
        {activeTab === 'details' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Passenger Identity & Contact Details</h3>
              <p className="text-xs text-slate-400">
                These details are used for airline e-tickets, boarding passes, and DGCA security manifests.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl flex items-start gap-2.5 text-emerald-300 text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-relaxed">Profile saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Name Row: First Name (*), Middle Name, Last Name (*) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* First Name (*) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Rahul"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        fieldErrors.firstName ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.firstName}</span>
                  )}
                </div>

                {/* Middle Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Middle Name <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.middleName || ''}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    placeholder="e.g. Kumar"
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Last Name (*) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Sharma"
                    className={`w-full px-3 py-2.5 bg-slate-800/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      fieldErrors.lastName ? 'border-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {fieldErrors.lastName && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Mobile Number (*) with +91 Country Badge */}
              <div className="space-y-1.5 max-w-md">
                <label className="block text-xs font-semibold text-slate-300">
                  Mobile Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 text-xs font-bold text-slate-400 border-r border-slate-700 pr-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobileNumber.replace(/^\+?91/, '')}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, mobileNumber: clean });
                    }}
                    placeholder="9876543210"
                    className={`w-full pl-20 pr-3 py-2.5 bg-slate-800/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      fieldErrors.mobileNumber ? 'border-rose-500' : 'border-slate-700'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Mandatory for SMS flight cancellation/delay notifications.
                </span>
                {fieldErrors.mobileNumber && (
                  <span className="text-[10px] text-rose-400 block">{fieldErrors.mobileNumber}</span>
                )}
              </div>

              {/* Date of Birth (*) & Gender Dropdown (*) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                {/* Date of Birth (*) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Date of Birth <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 [color-scheme:dark] ${
                        fieldErrors.dateOfBirth ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Format: DD/MM/YYYY (Used to verify adult/child status)</span>
                  {fieldErrors.dateOfBirth && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.dateOfBirth}</span>
                  )}
                </div>

                {/* Gender Dropdown (*) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Gender <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })
                    }
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="male" className="bg-slate-900 text-white">
                      Male
                    </option>
                    <option value="female" className="bg-slate-900 text-white">
                      Female
                    </option>
                    <option value="other" className="bg-slate-900 text-white">
                      Other
                    </option>
                  </select>
                  <span className="text-[10px] text-slate-400 block">Required for airline passenger manifests</span>
                  {fieldErrors.gender && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.gender}</span>
                  )}
                </div>
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1.5 max-w-md">
                <label className="block text-xs font-semibold text-slate-300">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Primary communication email linked to this account</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-950/50 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: MY PRICE ALERTS                                               */}
        {/* ==================================================================== */}
        {activeTab === 'alerts' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Active Flight Price Alerts</h3>
                <p className="text-xs text-slate-400">
                  FareFinder continuously scans provider feeds for your tracked domestic corridors.
                </p>
              </div>
              <Link
                href="/#popular-routes"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start"
              >
                + Track New Route
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">BLR → BOM</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Target: below ₹4,200 (Any airline)</p>
                  <p className="text-[10px] text-slate-500">Last checked 12 mins ago</p>
                </div>
                <Link
                  href="/search?origin=BLR&destination=BOM&departureDate=2026-11-06"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-sky-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                >
                  View Fares
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">DEL → BLR</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Target: below ₹5,000 (Non-stop)</p>
                  <p className="text-[10px] text-slate-500">Last checked 4 mins ago</p>
                </div>
                <Link
                  href="/search?origin=DEL&destination=BLR&departureDate=2026-11-10"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-sky-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                >
                  View Fares
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: TRAVEL PREFERENCES                                            */}
        {/* ==================================================================== */}
        {activeTab === 'preferences' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Default Search & Booking Preferences</h3>
              <p className="text-xs text-slate-400">
                Customize your default travel settings across FareFinder search queries.
              </p>
            </div>

            <div className="space-y-6 max-w-xl">
              {/* Default Currency */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Display Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  {Object.values(currencies).map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                      {c.code} ({c.symbol.trim()}) — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Cabin Class */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Preferred Cabin Class</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferredCabin('economy')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      preferredCabin === 'economy'
                        ? 'bg-sky-950/60 border-sky-500 text-sky-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block font-bold">Economy</span>
                    <span className="text-[10px] text-slate-400 font-normal">Standard 15kg checked + 7kg cabin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredCabin('business')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      preferredCabin === 'business'
                        ? 'bg-sky-950/60 border-sky-500 text-sky-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block font-bold">Business</span>
                    <span className="text-[10px] text-slate-400 font-normal">Priority boarding + extra baggage</span>
                  </button>
                </div>
              </div>

              {/* Student Concession Option */}
              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">Eligible Student Concession</span>
                  <span className="text-[10px] text-slate-400">
                    Always apply valid student discounts and +10kg extra baggage allowance when available.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isStudentConcession}
                  onChange={(e) => setIsStudentConcession(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
              </div>

              {/* Auto-fill Details on Checkout */}
              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">Auto-Fill Passenger Data</span>
                  <span className="text-[10px] text-slate-400">
                    Pass verified identity details when redirecting to airline and OTA checkout simulators.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoFillBookings}
                  onChange={(e) => setAutoFillBookings(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
