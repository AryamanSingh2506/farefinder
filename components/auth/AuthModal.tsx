'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfileFormData, userProfileSchema, emailPasswordAuthSchema } from '@/types/auth';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    saveProfile,
    user,
    profile,
  } = useAuth();

  // Sign In / Sign Up Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Onboarding Form State
  const [formData, setFormData] = useState<UserProfileFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: 'male',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Sync initial user details when entering onboarding
  useEffect(() => {
    if (authModalMode === 'onboarding' && user) {
      const nameParts = (user.displayName || '').trim().split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || profile?.firstName || nameParts[0] || '',
        middleName: prev.middleName || profile?.middleName || '',
        lastName: prev.lastName || profile?.lastName || nameParts.slice(1).join(' ') || '',
        mobileNumber: prev.mobileNumber || profile?.mobileNumber || '',
        dateOfBirth: prev.dateOfBirth || profile?.dateOfBirth || '',
        gender: prev.gender || profile?.gender || 'male',
      }));
    }
  }, [authModalMode, user, profile]);

  // Clear errors when mode changes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setFieldErrors({});
  }, [authModalMode]);

  if (!authModalOpen) return null;

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      if (msg.includes('auth/popup-closed-by-user')) {
        setError('Sign-in cancelled. Please try again.');
      } else if (msg.includes('auth/unauthorized-domain')) {
        setError('Domain not authorized in Firebase Console. You can also sign in with email/password.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validation = emailPasswordAuthSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid email or password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const validation = emailPasswordAuthSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid credentials');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      if (msg.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists. Please sign in.');
      } else if (msg.includes('auth/weak-password')) {
        setError('Password should be at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError('Please enter your account email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSuccessMessage('Password reset link sent! Check your inbox.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Onboarding Profile Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      setError('Please fill in all mandatory fields correctly.');
      return;
    }

    setLoading(true);
    try {
      await saveProfile(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-lg w-full p-6 sm:p-8 space-y-6 relative text-white max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl flex items-start gap-2.5 text-emerald-300 text-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 1: SIGN IN                                                      */}
        {/* ==================================================================== */}
        {authModalMode === 'signin' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-950/60 border border-sky-800/60 px-2.5 py-1 rounded-full inline-block">
                Member Access
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">Sign In to FareFinder</h2>
              <p className="text-xs text-slate-400">
                Track real-time flight price drops and manage your passenger details.
              </p>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:border-slate-600 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-slate-800" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">or sign in with email</span>
              <div className="h-[1px] flex-1 bg-slate-800" />
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot_password')}
                    className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: SIGN UP                                                      */}
        {/* ==================================================================== */}
        {authModalMode === 'signup' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full inline-block">
                Free Registration
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">Join FareFinder India</h2>
              <p className="text-xs text-slate-400">
                Create an account to compare domestic flights across 10+ airlines and OTAs.
              </p>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:border-slate-600 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Register with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-slate-800" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">or sign up with email</span>
              <div className="h-[1px] flex-1 bg-slate-800" />
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 3: FORGOT PASSWORD                                              */}
        {/* ==================================================================== */}
        {authModalMode === 'forgot_password' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">Reset Password</h2>
              <p className="text-xs text-slate-400">
                Enter your registered email address to receive password reset instructions.
              </p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send Reset Instructions</span>}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 4: POST-SIGNUP PROFILE ONBOARDING QUESTIONNAIRE                 */}
        {/* ==================================================================== */}
        {authModalMode === 'onboarding' && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Step 2 of 2: Profile Setup</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Complete Your Passenger Profile</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your official identity details to auto-fill airline reservations and unlock concession fares.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Name Row: First Name (*), Middle Name, Last Name (*) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* First Name (*) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Rahul"
                      className={`w-full pl-9 pr-3 py-2 bg-slate-800/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        fieldErrors.firstName ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.firstName}</span>
                  )}
                </div>

                {/* Middle Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Middle Name <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.middleName || ''}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    placeholder="e.g. Kumar"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Last Name (*) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Sharma"
                    className={`w-full px-3 py-2 bg-slate-800/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      fieldErrors.lastName ? 'border-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {fieldErrors.lastName && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Mobile Number (*) with +91 country badge */}
              <div className="space-y-1">
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
                <span className="text-[10px] text-slate-500 block">
                  Used for airline flight delay alerts & live booking status.
                </span>
                {fieldErrors.mobileNumber && (
                  <span className="text-[10px] text-rose-400 block">{fieldErrors.mobileNumber}</span>
                )}
              </div>

              {/* Date of Birth (*) & Gender Dropdown (*) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date of Birth (*) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Date of Birth <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 bg-slate-800/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 [color-scheme:dark] ${
                        fieldErrors.dateOfBirth ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">Format: DD/MM/YYYY</span>
                  {fieldErrors.dateOfBirth && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.dateOfBirth}</span>
                  )}
                </div>

                {/* Gender Dropdown (*) */}
                <div className="space-y-1">
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
                  <span className="text-[10px] text-slate-500 block">As stated on official travel ID</span>
                  {fieldErrors.gender && (
                    <span className="text-[10px] text-rose-400 block">{fieldErrors.gender}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Save & Complete Profile</span>}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
                >
                  Skip for now, I&apos;ll complete it later
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
