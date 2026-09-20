import { describe, it, expect } from 'vitest';
import { flightSearchSchema, priceAlertSchema, clickTrackSchema } from '@/lib/validation/search';

describe('Search Validation Schema', () => {
  const getFutureDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  it('validates a correct one-way search request', () => {
    const valid = {
      origin: 'BLR',
      destination: 'BOM',
      departureDate: getFutureDate(10),
      adults: 1,
      cabinClass: 'economy',
    };

    const result = flightSearchSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.origin).toBe('BLR');
      expect(result.data.destination).toBe('BOM');
      expect(result.data.children).toBe(0);
      expect(result.data.infants).toBe(0);
    }
  });

  it('rejects origin and destination being identical', () => {
    const invalid = {
      origin: 'BLR',
      destination: 'BLR',
      departureDate: getFutureDate(10),
      adults: 1,
    };

    const result = flightSearchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects past departure dates', () => {
    const invalid = {
      origin: 'BLR',
      destination: 'BOM',
      departureDate: '2020-01-01',
      adults: 1,
    };

    const result = flightSearchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects return date before departure date', () => {
    const invalid = {
      origin: 'BLR',
      destination: 'BOM',
      departureDate: getFutureDate(10),
      returnDate: getFutureDate(5),
      adults: 1,
    };

    const result = flightSearchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects infants count greater than adult passengers', () => {
    const invalid = {
      origin: 'BLR',
      destination: 'BOM',
      departureDate: getFutureDate(10),
      adults: 1,
      infants: 2,
    };

    const result = flightSearchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects unknown airport IATA codes', () => {
    const invalid = {
      origin: 'ZZZ',
      destination: 'BOM',
      departureDate: getFutureDate(10),
      adults: 1,
    };

    const result = flightSearchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('Price Alert and Click Validation', () => {
  it('validates a price alert registration', () => {
    const valid = {
      email: 'traveler@example.com',
      origin: 'BLR',
      destination: 'BOM',
      departureDate: '2026-11-06',
      targetPrice: 4500,
      currency: 'INR',
    };

    const result = priceAlertSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email for price alert', () => {
    const invalid = {
      email: 'not-an-email',
      origin: 'BLR',
      destination: 'BOM',
      departureDate: '2026-11-06',
      targetPrice: 4500,
    };

    const result = priceAlertSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates click tracking payload', () => {
    const valid = {
      providerCode: 'makemytrip',
      flightNumber: '6E-2134',
      displayedPrice: 4620,
      currency: 'INR',
      bookingUrl: '/booking-simulator',
    };

    const result = clickTrackSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});
