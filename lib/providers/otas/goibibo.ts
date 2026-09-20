import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class GoibiboProvider extends BaseFlightProvider {
  constructor() {
    super('goibibo', 'Goibibo', 'ota');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // Goibibo: Popular budget OTA, goCash rewards and youth discounts
    // In production: Connect to Goibibo Partner API
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      baseDiscountPercentage: -2.8,
      convenienceFeeINR: 279,
      instantCouponDiscountINR: 120, // "GOBIG" discount
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
