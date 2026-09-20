import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class AirIndiaExpressProvider extends BaseFlightProvider {
  constructor() {
    super('air-india-express', 'Air India Express', 'airline', 'IX');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // Air India Express Direct: Value carrier with extensive regional routes
    // In production: Connect to Air India Express direct API
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      specificAirlineCode: 'IX',
      baseDiscountPercentage: -1.5,
      convenienceFeeINR: 120,
      instantCouponDiscountINR: 0,
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
