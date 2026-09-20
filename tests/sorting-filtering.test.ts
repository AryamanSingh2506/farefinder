import { describe, it, expect } from 'vitest';
import { sortFlights } from '@/lib/flights/sorter';
import { filterFlights, getTimeSlot } from '@/lib/flights/filter';
import { GroupedFlightResult } from '@/types/flights';

describe('Sorting and Filtering Engine', () => {
  const createMockGrouped = (
    flightNumber: string,
    airlineCode: string,
    price: number,
    duration: number,
    stops: number,
    departureISO: string,
    refundable: boolean = true
  ): GroupedFlightResult => ({
    id: `${airlineCode}_${flightNumber}`,
    airline: 'Airline',
    airlineCode,
    flightNumber,
    origin: 'Bengaluru',
    originCode: 'BLR',
    destination: 'Mumbai',
    destinationCode: 'BOM',
    departureDateTime: departureISO,
    arrivalDateTime: new Date(new Date(departureISO).getTime() + duration * 60000).toISOString(),
    duration,
    formattedDuration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
    stops,
    stopAirports: stops > 0 ? ['HYD'] : [],
    segments: [],
    cabinClass: 'economy',
    fareType: 'Saver',
    baggage: '15 kg',
    cabinBaggage: '7 kg',
    refundable,
    changeable: true,
    minPrice: price,
    currency: 'INR',
    lowestOffer: {} as any,
    offers: [{ provider: 'makemytrip', totalPrice: price } as any],
    maxPrice: price,
    savingsAmount: 0,
    providerCount: 1,
    isDemo: true,
  });

  const sampleFlights: GroupedFlightResult[] = [
    createMockGrouped('6E-101', '6E', 4800, 110, 0, '2026-11-06T06:30:00.000Z', false),
    createMockGrouped('AI-202', 'AI', 5400, 105, 0, '2026-11-06T14:15:00.000Z', true),
    createMockGrouped('QP-303', 'QP', 4200, 120, 0, '2026-11-06T20:00:00.000Z', false),
    createMockGrouped('IX-404', 'IX', 3900, 240, 1, '2026-11-06T10:00:00.000Z', true),
  ];

  it('sorts by cheapest fare first', () => {
    const sorted = sortFlights(sampleFlights, 'cheapest');
    expect(sorted[0].flightNumber).toBe('IX-404'); // 3900
    expect(sorted[1].flightNumber).toBe('QP-303'); // 4200
    expect(sorted[3].flightNumber).toBe('AI-202'); // 5400
  });

  it('sorts by fastest flight duration first', () => {
    const sorted = sortFlights(sampleFlights, 'fastest');
    expect(sorted[0].flightNumber).toBe('AI-202'); // 105 mins
    expect(sorted[1].flightNumber).toBe('6E-101'); // 110 mins
    expect(sorted[3].flightNumber).toBe('IX-404'); // 240 mins
  });

  it('sorts by best value balancing fare and duration', () => {
    const sorted = sortFlights(sampleFlights, 'best_value');
    expect(sorted.length).toBe(4);
    // Best value balances reasonable price without 4-hour layover
    expect(sorted[0].stops).toBe(0);
  });

  it('filters by maximum price', () => {
    const filtered = filterFlights(sampleFlights, { maxPrice: 4500 });
    expect(filtered.length).toBe(2);
    expect(filtered.every((f) => f.minPrice <= 4500)).toBe(true);
  });

  it('filters by non-stop flights only', () => {
    const filtered = filterFlights(sampleFlights, { stops: [0] });
    expect(filtered.length).toBe(3);
    expect(filtered.every((f) => f.stops === 0)).toBe(true);
  });

  it('filters by airline code', () => {
    const filtered = filterFlights(sampleFlights, { airlines: ['6E', 'AI'] });
    expect(filtered.length).toBe(2);
    expect(filtered.some((f) => f.airlineCode === '6E')).toBe(true);
    expect(filtered.some((f) => f.airlineCode === 'AI')).toBe(true);
  });

  it('filters by refundable flights only', () => {
    const filtered = filterFlights(sampleFlights, { refundableOnly: true });
    expect(filtered.length).toBe(2);
    expect(filtered.every((f) => f.refundable)).toBe(true);
  });
});
