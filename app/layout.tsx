import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { CurrencyProvider } from '@/components/currency/CurrencyContext';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { FirebaseAnalytics } from '@/components/analytics/FirebaseAnalytics';

export const metadata: Metadata = {
  title: 'FareFinder India — Compare Flights & Find Lowest Fares',
  description:
    'Compare domestic flight fares across Air India, IndiGo, Akasa Air, AI Express, MakeMyTrip, Cleartrip, EaseMyTrip, Goibibo, Yatra and ixigo with transparent taxes and zero booking fees.',
  keywords: [
    'flights India',
    'flight comparison India',
    'cheap flights Bengaluru Mumbai',
    'IndiGo flight fares',
    'Air India flight tickets',
    'student flight discounts',
    'MakeMyTrip flight comparison',
  ],
  authors: [{ name: 'FareFinder India' }],
  openGraph: {
    title: 'FareFinder India — Find the cheapest flight, wherever it is sold',
    description:
      'Meta-search engine for Indian domestic flights. Compare airlines and travel agencies with zero bias and zero booking fees.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'FareFinder India',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100 dark antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-100 bg-slate-950">
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>
        <AuthProvider>
          <CurrencyProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AuthModal />
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
