import { FlightSearchRequest, FlightSearchResult, FlightSegment } from '@/types/flights';
import { getAirportByCode } from '@/lib/data/airports';

export interface PhysicalFlightTemplate {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureTime: string; // HH:mm format
  durationMinutes: number;
  stops: number;
  stopAirport?: string;
  baseFareMultiplier: number; // e.g. 1.0, 0.95, 1.15
  isRefundable: boolean;
  cabinClasses: ('economy' | 'premium_economy' | 'business')[];
}

// Scheduled physical flights operating on Indian routes
export const PHYSICAL_FLIGHT_SCHEDULES: PhysicalFlightTemplate[] = [
  // IndiGo flights
  {
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-2134',
    departureTime: '06:00',
    durationMinutes: 105,
    stops: 0,
    baseFareMultiplier: 0.95,
    isRefundable: false,
    cabinClasses: ['economy'],
  },
  {
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-451',
    departureTime: '10:30',
    durationMinutes: 110,
    stops: 0,
    baseFareMultiplier: 1.05,
    isRefundable: true,
    cabinClasses: ['economy'],
  },
  {
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-678',
    departureTime: '16:45',
    durationMinutes: 115,
    stops: 0,
    baseFareMultiplier: 1.0,
    isRefundable: false,
    cabinClasses: ['economy'],
  },
  {
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-902',
    departureTime: '20:15',
    durationMinutes: 110,
    stops: 0,
    baseFareMultiplier: 0.92,
    isRefundable: false,
    cabinClasses: ['economy'],
  },
  {
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-532',
    departureTime: '13:10',
    durationMinutes: 245,
    stops: 1,
    stopAirport: 'HYD',
    baseFareMultiplier: 0.88,
    isRefundable: true,
    cabinClasses: ['economy'],
  },

  // Air India flights
  {
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-504',
    departureTime: '07:15',
    durationMinutes: 110,
    stops: 0,
    baseFareMultiplier: 1.08,
    isRefundable: true,
    cabinClasses: ['economy', 'premium_economy', 'business'],
  },
  {
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-608',
    departureTime: '12:00',
    durationMinutes: 115,
    stops: 0,
    baseFareMultiplier: 1.12,
    isRefundable: true,
    cabinClasses: ['economy', 'business'],
  },
  {
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-802',
    departureTime: '18:30',
    durationMinutes: 110,
    stops: 0,
    baseFareMultiplier: 1.15,
    isRefundable: true,
    cabinClasses: ['economy', 'premium_economy', 'business'],
  },
  {
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-653',
    departureTime: '14:20',
    durationMinutes: 270,
    stops: 1,
    stopAirport: 'BOM',
    baseFareMultiplier: 0.95,
    isRefundable: true,
    cabinClasses: ['economy', 'business'],
  },

  // Akasa Air flights
  {
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNumber: 'QP-1102',
    departureTime: '08:45',
    durationMinutes: 110,
    stops: 0,
    baseFareMultiplier: 0.91,
    isRefundable: false,
    cabinClasses: ['economy'],
  },
  {
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNumber: 'QP-1348',
    departureTime: '15:10',
    durationMinutes: 115,
    stops: 0,
    baseFareMultiplier: 0.94,
    isRefundable: true,
    cabinClasses: ['economy'],
  },
  {
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNumber: 'QP-1590',
    departureTime: '21:00',
    durationMinutes: 105,
    stops: 0,
    baseFareMultiplier: 0.89,
    isRefundable: false,
    cabinClasses: ['economy'],
  },

  // Air India Express flights
  {
    airline: 'Air India Express',
    airlineCode: 'IX',
    flightNumber: 'IX-782',
    departureTime: '09:30',
    durationMinutes: 115,
    stops: 0,
    baseFareMultiplier: 0.92,
    isRefundable: false,
    cabinClasses: ['economy'],
  },
  {
    airline: 'Air India Express',
    airlineCode: 'IX',
    flightNumber: 'IX-945',
    departureTime: '17:40',
    durationMinutes: 110,
    stops: 0,
    baseFareMultiplier: 0.96,
    isRefundable: true,
    cabinClasses: ['economy'],
  },
];

// Base standard route prices (INR)
export const ROUTE_BASE_PRICES: Record<string, number> = {
  'BLR-BOM': 3800,
  'BOM-BLR': 3800,
  'BLR-DEL': 5200,
  'DEL-BLR': 5200,
  'BOM-DEL': 4600,
  'DEL-BOM': 4600,
  'BLR-HYD': 2800,
  'HYD-BLR': 2800,
  'BLR-MAA': 2500,
  'MAA-BLR': 2500,
  'DEL-CCU': 4800,
  'CCU-DEL': 4800,
  'BOM-GOI': 2900,
  'GOI-BOM': 2900,
  'BLR-GOI': 2700,
  'GOI-BLR': 2700,
  'BOM-AMD': 2600,
  'AMD-BOM': 2600,
  'DEL-AMD': 3200,
  'AMD-DEL': 3200,
  'BLR-COK': 2600,
  'COK-BLR': 2600,
};

export function getRouteBasePrice(origin: string, destination: string): number {
  const key = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  return ROUTE_BASE_PRICES[key] || 4200;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function calculateFlightTimings(dateStr: string, timeStr: string, durationMinutes: number) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const departure = new Date(`${dateStr}T00:00:00.000Z`);
  departure.setUTCHours(hours - 5, minutes - 30); // Convert IST (UTC+5:30) to UTC ISO

  const arrival = new Date(departure.getTime() + durationMinutes * 60 * 1000);

  return {
    departureISO: departure.toISOString(),
    arrivalISO: arrival.toISOString(),
  };
}

export interface ProviderPricingProfile {
  providerId: string;
  providerName: string;
  providerType: 'airline' | 'ota' | 'aggregator';
  specificAirlineCode?: string; // If this is an airline provider
  baseDiscountPercentage: number; // e.g. -2% or +1%
  convenienceFeeINR: number; // e.g. 0 for EMT, 299 for MMT
  instantCouponDiscountINR: number; // e.g. 150 for Cleartrip
}

export function generateFlightsForProvider(
  request: FlightSearchRequest,
  profile: ProviderPricingProfile
): FlightSearchResult[] {
  const { origin, destination, departureDate, cabinClass, isStudent } = request;
  const originAirport = getAirportByCode(origin);
  const destAirport = getAirportByCode(destination);

  const originName = originAirport?.city || origin;
  const destName = destAirport?.city || destination;
  const basePrice = getRouteBasePrice(origin, destination);

  // Filter schedules that match this provider
  let availableSchedules = PHYSICAL_FLIGHT_SCHEDULES;
  if (profile.specificAirlineCode) {
    availableSchedules = availableSchedules.filter(
      (s) => s.airlineCode === profile.specificAirlineCode
    );
  }

  // Filter cabin classes
  availableSchedules = availableSchedules.filter((s) =>
    s.cabinClasses.includes(cabinClass as 'economy' | 'premium_economy' | 'business')
  );

  const results: FlightSearchResult[] = [];

  for (const schedule of availableSchedules) {
    // Determine class multiplier
    let classMultiplier = 1.0;
    if (cabinClass === 'premium_economy') classMultiplier = 1.6;
    if (cabinClass === 'business') classMultiplier = 2.8;
    if (cabinClass === 'first') classMultiplier = 4.2;

    // Calculate base fare with schedule multiplier
    let calculatedBase = basePrice * schedule.baseFareMultiplier * classMultiplier;

    // Apply student discount if requested (10% off base fare)
    let studentEligible = false;
    let studentPerks: string | undefined;

    if (isStudent) {
      studentEligible = true;
      calculatedBase = calculatedBase * 0.9;
      studentPerks = '10% student discount applied + 25 kg check-in baggage (Valid student ID required)';
    }

    // Apply provider pricing adjustments
    const providerAdjustment = calculatedBase * (profile.baseDiscountPercentage / 100);
    const finalBaseFare = Math.round(calculatedBase + providerAdjustment);

    // Mandatory Indian aviation taxes: GST (5% economy, 12% business) + UDF + PSF
    const gstRate = cabinClass === 'economy' ? 0.05 : 0.12;
    const gstAmount = Math.round(finalBaseFare * gstRate);
    const udfAmount = 390; // User Development Fee
    const psfAmount = 91; // Passenger Service Fee
    const mandatoryTaxes = gstAmount + udfAmount + psfAmount;

    // Convenience & OTA booking fees
    let bookingFee = profile.convenienceFeeINR;
    if (profile.instantCouponDiscountINR > 0) {
      bookingFee = Math.max(0, bookingFee - profile.instantCouponDiscountINR);
    }

    const totalPrice = finalBaseFare + mandatoryTaxes + bookingFee;

    const timings = calculateFlightTimings(
      departureDate,
      schedule.departureTime,
      schedule.durationMinutes
    );

    // Build segments
    const segments: FlightSegment[] = [];
    if (schedule.stops === 0) {
      segments.push({
        flightNumber: schedule.flightNumber,
        airline: schedule.airline,
        airlineCode: schedule.airlineCode,
        origin: originName,
        originCode: origin.toUpperCase(),
        destination: destName,
        destinationCode: destination.toUpperCase(),
        departureDateTime: timings.departureISO,
        arrivalDateTime: timings.arrivalISO,
        duration: schedule.durationMinutes,
      });
    } else {
      // 1-stop connecting flight
      const stopCode = schedule.stopAirport || 'HYD';
      const stopAirportObj = getAirportByCode(stopCode);
      const stopCity = stopAirportObj?.city || stopCode;
      const firstLegDuration = Math.round(schedule.durationMinutes * 0.4);
      const layoverDuration = Math.round(schedule.durationMinutes * 0.2);
      const secondLegDuration = schedule.durationMinutes - firstLegDuration - layoverDuration;

      const leg1Arrival = new Date(new Date(timings.departureISO).getTime() + firstLegDuration * 60000);
      const leg2Departure = new Date(leg1Arrival.getTime() + layoverDuration * 60000);

      segments.push(
        {
          flightNumber: schedule.flightNumber,
          airline: schedule.airline,
          airlineCode: schedule.airlineCode,
          origin: originName,
          originCode: origin.toUpperCase(),
          destination: stopCity,
          destinationCode: stopCode,
          departureDateTime: timings.departureISO,
          arrivalDateTime: leg1Arrival.toISOString(),
          duration: firstLegDuration,
        },
        {
          flightNumber: `${schedule.airlineCode}-${Number(schedule.flightNumber.split('-')[1]) + 1}`,
          airline: schedule.airline,
          airlineCode: schedule.airlineCode,
          origin: stopCity,
          originCode: stopCode,
          destination: destName,
          destinationCode: destination.toUpperCase(),
          departureDateTime: leg2Departure.toISOString(),
          arrivalDateTime: timings.arrivalISO,
          duration: secondLegDuration,
        }
      );
    }

    // Determine baggage allowance
    let baggage = '15 kg check-in baggage';
    if (studentEligible) {
      baggage = '25 kg student check-in baggage';
    } else if (cabinClass === 'business') {
      baggage = '35 kg check-in baggage';
    } else if (cabinClass === 'premium_economy') {
      baggage = '20 kg check-in baggage';
    }

    const cabinBaggage = '7 kg cabin baggage';

    const flightId = `${profile.providerId}_${schedule.flightNumber}_${origin.toUpperCase()}_${destination.toUpperCase()}_${departureDate}_${schedule.departureTime.replace(':', '')}`;

    results.push({
      id: flightId,
      provider: profile.providerId,
      providerName: profile.providerName,
      providerType: profile.providerType,
      airline: schedule.airline,
      airlineCode: schedule.airlineCode,
      flightNumber: schedule.flightNumber,

      origin: originName,
      originCode: origin.toUpperCase(),
      destination: destName,
      destinationCode: destination.toUpperCase(),

      departureDateTime: timings.departureISO,
      arrivalDateTime: timings.arrivalISO,
      duration: schedule.durationMinutes,
      formattedDuration: formatDuration(schedule.durationMinutes),
      stops: schedule.stops,
      stopAirports: schedule.stopAirport ? [schedule.stopAirport] : [],
      segments,

      cabinClass,
      fareType: isStudent ? 'Student Special' : schedule.isRefundable ? 'Flexi' : 'Saver',

      baseFare: finalBaseFare,
      taxes: mandatoryTaxes,
      fees: bookingFee,
      totalPrice,
      currency: 'INR',

      baggage,
      cabinBaggage,

      refundable: schedule.isRefundable,
      changeable: true,

      bookingUrl: `/booking-simulator?provider=${encodeURIComponent(profile.providerId)}&providerName=${encodeURIComponent(profile.providerName)}&flight=${encodeURIComponent(schedule.flightNumber)}&airline=${encodeURIComponent(schedule.airline)}&origin=${origin.toUpperCase()}&destination=${destination.toUpperCase()}&date=${departureDate}&price=${totalPrice}`,

      lastUpdated: new Date().toISOString(),
      priceVerified: false,
      isDemo: true,

      studentEligible,
      studentPerks,
    });
  }

  return results;
}
