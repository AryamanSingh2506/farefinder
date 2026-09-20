import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class EaseMyTripProvider extends BaseFlightProvider {
  constructor() {
    super('easemytrip', 'EaseMyTrip', 'ota');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // EaseMyTrip: Renowned for Zero Convenience Fee structure
    // In production: Connect to EaseMyTrip Partner API
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      baseDiscountPercentage: -1.0,
      convenienceFeeINR: 0, // Signature zero convenience fee
      instantCouponDiscountINR: 0,
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
