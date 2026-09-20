import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class MakeMyTripProvider extends BaseFlightProvider {
  constructor() {
    super('makemytrip', 'MakeMyTrip', 'ota');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // MakeMyTrip: Largest OTA in India, offers bank discounts & loyalty coupons
    // In production: Connect to MakeMyTrip Partner / Affiliate API
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      baseDiscountPercentage: -3.5, // High volume OTA base discount
      convenienceFeeINR: 299, // Standard MMT convenience charge
      instantCouponDiscountINR: 150, // "MMTFLY" promo discount
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
