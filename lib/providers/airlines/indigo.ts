import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class IndiGoProvider extends BaseFlightProvider {
  constructor() {
    super('indigo', 'IndiGo', 'airline', '6E');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // IndiGo Direct: Largest domestic carrier, high on-time reliability
    // In production: Connect to IndiGo Navitaire / NDC API
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      specificAirlineCode: '6E',
      baseDiscountPercentage: -1, // Direct web special
      convenienceFeeINR: 150,
      instantCouponDiscountINR: 0,
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
