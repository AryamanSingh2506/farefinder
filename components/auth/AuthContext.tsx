'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, logFirebaseEvent } from '@/lib/firebase/client';
import { UserProfile, AuthModalMode, UserProfileFormData } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isProfileComplete: boolean;
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  saveProfile: (formData: UserProfileFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to guarantee a promise never hangs indefinitely in offline or unprovisioned cloud environments
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2000): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

const LOCAL_STORAGE_PROFILE_KEY = 'farefinder_user_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signin');

  const openAuthModal = (mode: AuthModalMode = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Helper to load profile from Firestore or localStorage fallback
  const fetchUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    try {
      if (typeof window !== 'undefined') {
        // First check localStorage for instant response
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PROFILE_KEY}_${firebaseUser.uid}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as UserProfile;
            if (parsed && parsed.isProfileComplete) {
              return parsed;
            }
          } catch {
            // ignore JSON parse error
          }
        }
      }

      // Query Firestore with strict timeout protection
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await withTimeout(getDoc(userRef), 1500);

      if (snap && snap.exists()) {
        const data = snap.data() as UserProfile;
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${LOCAL_STORAGE_PROFILE_KEY}_${firebaseUser.uid}`, JSON.stringify(data));
        }
        return data;
      }
    } catch (err) {
      console.warn('Could not fetch user profile from Firestore:', err);
    }

    // Fallback to cached local profile
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`${LOCAL_STORAGE_PROFILE_KEY}_${firebaseUser.uid}`);
      if (cached) {
        try {
          return JSON.parse(cached) as UserProfile;
        } catch {
          // ignore
        }
      }
    }

    return null;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchUserProfile(currentUser);
        if (userProfile && userProfile.isProfileComplete) {
          setProfile(userProfile);
        } else {
          // Incomplete profile or newly created user - trigger onboarding questionnaire
          setProfile(userProfile);
          setAuthModalMode('onboarding');
          setAuthModalOpen(true);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Authentication
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);
    const googleUser = userCredential.user;

    logFirebaseEvent('login', { method: 'google' });

    // Check if user has complete profile
    const existingProfile = await fetchUserProfile(googleUser);
    if (!existingProfile || !existingProfile.isProfileComplete) {
      const nameParts = (googleUser.displayName || '').trim().split(' ');
      const prefilled: Partial<UserProfile> = {
        uid: googleUser.uid,
        email: googleUser.email || '',
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        photoURL: googleUser.photoURL || undefined,
        isProfileComplete: false,
      };
      setProfile(prefilled as UserProfile);
      setAuthModalMode('onboarding');
      setAuthModalOpen(true);
    } else {
      setProfile(existingProfile);
      setAuthModalOpen(false);
    }
  };

  // Email / Password Sign In
  const signInWithEmail = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const signedInUser = userCredential.user;

    logFirebaseEvent('login', { method: 'email' });

    const existingProfile = await fetchUserProfile(signedInUser);
    if (!existingProfile || !existingProfile.isProfileComplete) {
      setAuthModalMode('onboarding');
      setAuthModalOpen(true);
    } else {
      setProfile(existingProfile);
      setAuthModalOpen(false);
    }
  };

  // Email / Password Sign Up
  const signUpWithEmail = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;

    logFirebaseEvent('sign_up', { method: 'email' });

    // Immediately trigger onboarding questionnaire
    setAuthModalMode('onboarding');
    setAuthModalOpen(true);
  };

  // Password Reset
  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    logFirebaseEvent('password_reset_request');
  };

  // Save / Update User Profile (Immediate Local Cache + Non-blocking Cloud Sync)
  const saveProfile = async (formData: UserProfileFormData) => {
    const userId = user ? user.uid : 'current_user';
    const userEmail = user?.email || profile?.email || '';
    const displayName = `${formData.firstName} ${formData.lastName}`.trim();
    const now = new Date().toISOString();

    const completeProfile: UserProfile = {
      uid: userId,
      email: userEmail,
      firstName: formData.firstName,
      middleName: formData.middleName || '',
      lastName: formData.lastName,
      mobileNumber: formData.mobileNumber,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      photoURL: user?.photoURL || undefined,
      isProfileComplete: true,
      createdAt: profile?.createdAt || now,
      updatedAt: now,
    };

    // 1. Instantly save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `${LOCAL_STORAGE_PROFILE_KEY}_${userId}`,
        JSON.stringify(completeProfile)
      );
    }

    // 2. Instantly update React context and dismiss modal
    setProfile(completeProfile);
    setAuthModalOpen(false);

    // 3. Concurrently sync with Firebase Auth and Firestore in the background
    (async () => {
      if (user) {
        try {
          await withTimeout(updateProfile(user, { displayName }), 2000);
        } catch (e) {
          console.warn('Non-blocking Auth updateProfile error:', e);
        }

        try {
          const userRef = doc(db, 'users', user.uid);
          await withTimeout(setDoc(userRef, completeProfile, { merge: true }), 2500);
        } catch (err) {
          console.warn('Non-blocking Firestore setDoc error:', err);
        }
      }
      logFirebaseEvent('complete_profile', { gender: formData.gender });
    })();
  };

  // Sign Out
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setAuthModalOpen(false);
    logFirebaseEvent('logout');
  };

  const isProfileComplete = Boolean(
    profile &&
    profile.isProfileComplete &&
    profile.firstName &&
    profile.lastName &&
    profile.mobileNumber &&
    profile.dateOfBirth &&
    profile.gender
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isProfileComplete,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        saveProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
