import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class AirIndiaProvider extends BaseFlightProvider {
  constructor() {
    super('air-india', 'Air India', 'airline', 'AI');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // Air India Direct: Full-service carrier, includes warm meal & baggage, standard fare
    // In production: Connect to Air India NDC API or Amadeus/Sabre GDS
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      specificAirlineCode: 'AI',
      baseDiscountPercentage: 0,
      convenienceFeeINR: 0, // Direct airline booking promotion
      instantCouponDiscountINR: 0,
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
