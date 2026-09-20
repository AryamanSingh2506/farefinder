import { describe, it, expect } from 'vitest';
import { providerRegistry } from '@/lib/providers/registry';
import { FlightSearchRequest } from '@/types/flights';

describe('Provider Registry & Resilient Search Executor', () => {
  const request: FlightSearchRequest = {
    origin: 'BLR',
    destination: 'BOM',
    departureDate: '2026-11-06',
    adults: 1,
    cabinClass: 'economy',
  };

  it('queries all enabled providers concurrently and returns results + statuses', async () => {
    const { flights, statuses } = await providerRegistry.searchAllProviders(request);

    expect(flights.length).toBeGreaterThan(0);
    expect(statuses.length).toBe(10);

    const successStatuses = statuses.filter((s) => s.status === 'success');
    expect(successStatuses.length).toBe(10);
  });

  it('allows disabling a provider dynamically', async () => {
    // Disable MakeMyTrip
    const toggled = providerRegistry.setProviderEnabled('makemytrip', false);
    expect(toggled).toBe(true);

    const { flights, statuses } = await providerRegistry.searchAllProviders(request);

    // MakeMyTrip should not be in enabled search
    expect(statuses.some((s) => s.providerId === 'makemytrip')).toBe(false);
    expect(flights.some((f) => f.provider === 'makemytrip')).toBe(false);

    // Re-enable MakeMyTrip
    providerRegistry.setProviderEnabled('makemytrip', true);
    const reenabledStatuses = providerRegistry.getProviders();
    const mmt = reenabledStatuses.find((p) => p.id === 'makemytrip');
    expect(mmt?.enabled).toBe(true);
  });
});
