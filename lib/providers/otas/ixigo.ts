import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class IxigoProvider extends BaseFlightProvider {
  constructor() {
    super('ixigo', 'ixigo', 'ota');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // ixigo: Fast growing OTA with AI fare predictions & multi-modal transport options
    // In production: Connect to ixigo Flights Partner API
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      baseDiscountPercentage: -2.5,
      convenienceFeeINR: 239,
      instantCouponDiscountINR: 130, // "IXIFLY" coupon
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
