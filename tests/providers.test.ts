import { describe, it, expect } from 'vitest';
import { AirIndiaProvider } from '@/lib/providers/airlines/air-india';
import { IndiGoProvider } from '@/lib/providers/airlines/indigo';
import { AkasaAirProvider } from '@/lib/providers/airlines/akasa-air';
import { AirIndiaExpressProvider } from '@/lib/providers/airlines/air-india-express';
import { MakeMyTripProvider } from '@/lib/providers/otas/makemytrip';
import { GoibiboProvider } from '@/lib/providers/otas/goibibo';
import { CleartripProvider } from '@/lib/providers/otas/cleartrip';
import { EaseMyTripProvider } from '@/lib/providers/otas/easemytrip';
import { YatraProvider } from '@/lib/providers/otas/yatra';
import { IxigoProvider } from '@/lib/providers/otas/ixigo';
import { FlightSearchRequest } from '@/types/flights';

describe('All 10 Provider Adapters Test Suite', () => {
  const standardRequest: FlightSearchRequest = {
    origin: 'BLR',
    destination: 'BOM',
    departureDate: '2026-11-06',
    adults: 1,
    cabinClass: 'economy',
  };

  const providers = [
    new AirIndiaProvider(),
    new IndiGoProvider(),
    new AkasaAirProvider(),
    new AirIndiaExpressProvider(),
    new MakeMyTripProvider(),
    new GoibiboProvider(),
    new CleartripProvider(),
    new EaseMyTripProvider(),
    new YatraProvider(),
    new IxigoProvider(),
  ];

  it.each(providers)('adapter $name returns valid normalized flights', async (provider) => {
    const flights = await provider.searchFlights(standardRequest);
    expect(flights.length).toBeGreaterThan(0);

    for (const flight of flights) {
      // Identity & Provider metadata
      expect(flight.provider).toBe(provider.id);
      expect(flight.providerName).toBe(provider.name);
      expect(flight.airline).toBeTruthy();
      expect(flight.airlineCode).toBeTruthy();
      expect(flight.flightNumber).toBeTruthy();

      // Route & Dates
      expect(flight.originCode).toBe('BLR');
      expect(flight.destinationCode).toBe('BOM');
      expect(flight.departureDateTime).toBeTruthy();
      expect(flight.arrivalDateTime).toBeTruthy();
      expect(flight.duration).toBeGreaterThan(0);

      // Price Normalization
      expect(flight.baseFare).toBeGreaterThan(0);
      expect(flight.taxes).toBeGreaterThan(0);
      expect(flight.fees).toBeGreaterThanOrEqual(0);
      expect(flight.totalPrice).toBe(flight.baseFare + flight.taxes + flight.fees);
      expect(flight.currency).toBe('INR');

      // Booking handoff
      expect(flight.bookingUrl).toContain('booking-simulator');

      // Baggage
      expect(flight.baggage).toBeTruthy();
      expect(flight.cabinBaggage).toBeTruthy();

      // Marked as demo
      expect(flight.isDemo).toBe(true);
    }
  });

  it('handles student fares with extra baggage allowance', async () => {
    const studentRequest: FlightSearchRequest = {
      ...standardRequest,
      isStudent: true,
    };

    const indigo = new IndiGoProvider();
    const flights = await indigo.searchFlights(studentRequest);
    expect(flights.length).toBeGreaterThan(0);

    const first = flights[0];
    expect(first.studentEligible).toBe(true);
    expect(first.baggage).toContain('25 kg');
    expect(first.studentPerks).toBeTruthy();
  });
});
