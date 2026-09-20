import { describe, it, expect } from 'vitest';
import { deduplicateAndGroupFlights } from '@/lib/flights/deduplicator';
import { FlightSearchResult } from '@/types/flights';

describe('Flight Deduplication and Comparison Aggregator', () => {
  const mockOffer = (
    provider: string,
    providerName: string,
    flightNumber: string,
    price: number,
    baseFare: number,
    taxes: number,
    fees: number
  ): FlightSearchResult => ({
    id: `${provider}_${flightNumber}`,
    provider,
    providerName,
    providerType: 'ota',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber,
    origin: 'Bengaluru',
    originCode: 'BLR',
    destination: 'Mumbai',
    destinationCode: 'BOM',
    departureDateTime: '2026-11-06T09:15:00.000Z',
    arrivalDateTime: '2026-11-06T11:05:00.000Z',
    duration: 110,
    formattedDuration: '1h 50m',
    stops: 0,
    stopAirports: [],
    segments: [],
    cabinClass: 'economy',
    fareType: 'Saver',
    baseFare,
    taxes,
    fees,
    totalPrice: price,
    currency: 'INR',
    baggage: '15 kg',
    cabinBaggage: '7 kg',
    refundable: true,
    changeable: true,
    bookingUrl: '/booking-simulator',
    lastUpdated: new Date().toISOString(),
    priceVerified: false,
    isDemo: true,
  });

  it('groups multiple provider offers for the exact same flight', () => {
    const rawOffers: FlightSearchResult[] = [
      mockOffer('air-india', 'Air India', 'AI-504', 5100, 4200, 900, 0),
      mockOffer('makemytrip', 'MakeMyTrip', 'AI-504', 4850, 4000, 700, 150),
      mockOffer('cleartrip', 'Cleartrip', 'AI-504', 4920, 4100, 720, 100),
      mockOffer('goibibo', 'Goibibo', 'AI-504', 4970, 4150, 720, 100),
      // A different flight
      mockOffer('indigo', 'IndiGo', '6E-2134', 4620, 3900, 620, 100),
    ];

    const grouped = deduplicateAndGroupFlights(rawOffers);

    expect(grouped.length).toBe(2);

    // AI-504 group
    const aiGroup = grouped.find((g) => g.flightNumber === 'AI-504');
    expect(aiGroup).toBeDefined();
    expect(aiGroup?.offers.length).toBe(4);
    expect(aiGroup?.minPrice).toBe(4850);
    expect(aiGroup?.maxPrice).toBe(5100);
    expect(aiGroup?.savingsAmount).toBe(250);
    expect(aiGroup?.lowestOffer.provider).toBe('makemytrip');

    // 6E-2134 group
    const indigoGroup = grouped.find((g) => g.flightNumber === '6E-2134');
    expect(indigoGroup).toBeDefined();
    expect(indigoGroup?.offers.length).toBe(1);
    expect(indigoGroup?.minPrice).toBe(4620);
    expect(indigoGroup?.savingsAmount).toBe(0);
  });
});
