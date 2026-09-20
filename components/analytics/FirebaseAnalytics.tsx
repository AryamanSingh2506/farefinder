'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getFirebaseAnalytics, logFirebaseEvent } from '@/lib/firebase/client';

export function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics instance once mounted in browser
    getFirebaseAnalytics().then((analytics) => {
      if (analytics) {
        logFirebaseEvent('page_view', {
          page_path: pathname,
          page_search: searchParams?.toString() || '',
        });
      }
    });
  }, [pathname, searchParams]);

  return null;
}
