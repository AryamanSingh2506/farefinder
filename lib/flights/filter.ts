import { GroupedFlightResult } from '@/types/flights';
import { FilterState, TimeSlot } from '@/types/filters';

export function getTimeSlot(isoString: string): TimeSlot {
  const date = new Date(isoString);
  // Get Indian Standard Time hours (UTC + 5.5)
  const istHours = (date.getUTCHours() + 5 + Math.floor((date.getUTCMinutes() + 30) / 60)) % 24;

  if (istHours < 6) return 'early_morning'; // Before 06:00
  if (istHours < 12) return 'morning'; // 06:00 - 12:00
  if (istHours < 18) return 'afternoon'; // 12:00 - 18:00
  return 'evening'; // After 18:00
}

export function filterFlights(
  flights: GroupedFlightResult[],
  filters: Partial<FilterState>
): GroupedFlightResult[] {
  if (!flights || flights.length === 0) return [];

  return flights.filter((flight) => {
    // 1. Max Price filter
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      if (flight.minPrice > filters.maxPrice) {
        return false;
      }
    }

    // 2. Stops filter
    if (filters.stops && filters.stops.length > 0) {
      if (!filters.stops.includes(flight.stops)) {
        // If 2+ stops filter is requested
        if (filters.stops.includes(2) && flight.stops >= 2) {
          // allowed
        } else {
          return false;
        }
      }
    }

    // 3. Airlines filter (airlineCode)
    if (filters.airlines && filters.airlines.length > 0) {
      if (!filters.airlines.includes(flight.airlineCode)) {
        return false;
      }
    }

    // 4. Providers filter (any provider offering this flight)
    if (filters.providers && filters.providers.length > 0) {
      const hasProvider = flight.offers.some((offer) =>
        filters.providers!.includes(offer.provider)
      );
      if (!hasProvider) {
        return false;
      }
    }

    // 5. Departure Time Slot filter
    if (filters.departureTimeSlots && filters.departureTimeSlots.length > 0) {
      const depSlot = getTimeSlot(flight.departureDateTime);
      if (!filters.departureTimeSlots.includes(depSlot)) {
        return false;
      }
    }

    // 6. Arrival Time Slot filter
    if (filters.arrivalTimeSlots && filters.arrivalTimeSlots.length > 0) {
      const arrSlot = getTimeSlot(flight.arrivalDateTime);
      if (!filters.arrivalTimeSlots.includes(arrSlot)) {
        return false;
      }
    }

    // 7. Max Duration filter (in hours)
    if (filters.maxDurationHours !== undefined && filters.maxDurationHours > 0) {
      const durationHours = flight.duration / 60;
      if (durationHours > filters.maxDurationHours) {
        return false;
      }
    }

    // 8. Refundable filter
    if (filters.refundableOnly) {
      if (!flight.refundable) {
        return false;
      }
    }

    // 9. Student Fares filter
    if (filters.studentFaresOnly) {
      if (!flight.studentEligible) {
        return false;
      }
    }

    return true;
  });
}

export function getFilterBounds(flights: GroupedFlightResult[]) {
  if (!flights || flights.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 20000,
      minDurationHours: 1,
      maxDurationHours: 8,
      airlineOptions: [],
      providerOptions: [],
    };
  }

  const prices = flights.map((f) => f.minPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const durations = flights.map((f) => f.duration / 60);
  const minDurationHours = Math.floor(Math.min(...durations));
  const maxDurationHours = Math.ceil(Math.max(...durations));

  // Extract unique airlines with counts
  const airlineCounts: Record<string, { code: string; name: string; count: number; minPrice: number }> = {};
  for (const f of flights) {
    if (!airlineCounts[f.airlineCode]) {
      airlineCounts[f.airlineCode] = {
        code: f.airlineCode,
        name: f.airline,
        count: 0,
        minPrice: f.minPrice,
      };
    }
    airlineCounts[f.airlineCode].count += 1;
    airlineCounts[f.airlineCode].minPrice = Math.min(airlineCounts[f.airlineCode].minPrice, f.minPrice);
  }

  // Extract unique providers with counts
  const providerCounts: Record<string, { id: string; name: string; count: number }> = {};
  for (const f of flights) {
    for (const offer of f.offers) {
      if (!providerCounts[offer.provider]) {
        providerCounts[offer.provider] = {
          id: offer.provider,
          name: offer.providerName,
          count: 0,
        };
      }
      providerCounts[offer.provider].count += 1;
    }
  }

  return {
    minPrice,
    maxPrice,
    minDurationHours,
    maxDurationHours,
    airlineOptions: Object.values(airlineCounts),
    providerOptions: Object.values(providerCounts),
  };
}
