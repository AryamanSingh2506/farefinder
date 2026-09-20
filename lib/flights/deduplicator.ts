import { FlightSearchResult, GroupedFlightResult } from '@/types/flights';

/**
 * Deduplicates and groups flight results from multiple providers for the same physical flight.
 * Grouping key combines: airlineCode, flightNumber, originCode, destinationCode, and departureDateTime.
 */
export function deduplicateAndGroupFlights(flights: FlightSearchResult[]): GroupedFlightResult[] {
  const groupsMap = new Map<string, FlightSearchResult[]>();

  for (const flight of flights) {
    // Generate deterministic key for the physical flight
    // Normalize departure date-time down to minute precision (first 16 chars of ISO string: YYYY-MM-DDTHH:mm)
    const depTimeSlice = flight.departureDateTime ? flight.departureDateTime.slice(0, 16) : '';
    const key = `${flight.airlineCode}_${flight.flightNumber}_${flight.originCode}_${flight.destinationCode}_${depTimeSlice}`.toUpperCase();

    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(flight);
  }

  const groupedResults: GroupedFlightResult[] = [];

  for (const [key, providerOffers] of groupsMap.entries()) {
    if (providerOffers.length === 0) continue;

    // Sort provider offers by totalPrice ascending (cheapest first)
    const sortedOffers = [...providerOffers].sort((a, b) => a.totalPrice - b.totalPrice);
    const lowestOffer = sortedOffers[0];
    const highestOffer = sortedOffers[sortedOffers.length - 1];
    const savingsAmount = Math.max(0, highestOffer.totalPrice - lowestOffer.totalPrice);

    const baseFlight = lowestOffer;

    groupedResults.push({
      id: key,
      airline: baseFlight.airline,
      airlineCode: baseFlight.airlineCode,
      flightNumber: baseFlight.flightNumber,

      origin: baseFlight.origin,
      originCode: baseFlight.originCode,
      destination: baseFlight.destination,
      destinationCode: baseFlight.destinationCode,

      departureDateTime: baseFlight.departureDateTime,
      arrivalDateTime: baseFlight.arrivalDateTime,

      duration: baseFlight.duration,
      formattedDuration: baseFlight.formattedDuration,
      stops: baseFlight.stops,
      stopAirports: baseFlight.stopAirports,
      segments: baseFlight.segments,

      cabinClass: baseFlight.cabinClass,
      fareType: baseFlight.fareType,

      baggage: baseFlight.baggage,
      cabinBaggage: baseFlight.cabinBaggage,
      refundable: sortedOffers.some((o) => o.refundable),
      changeable: sortedOffers.some((o) => o.changeable),

      minPrice: lowestOffer.totalPrice,
      currency: lowestOffer.currency,
      lowestOffer,
      offers: sortedOffers,
      maxPrice: highestOffer.totalPrice,
      savingsAmount,
      providerCount: sortedOffers.length,

      isDemo: true,
      studentEligible: sortedOffers.some((o) => o.studentEligible),
    });
  }

  // Sort grouped flights by minimum price ascending by default
  return groupedResults.sort((a, b) => a.minPrice - b.minPrice);
}
