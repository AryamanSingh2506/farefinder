import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class CleartripProvider extends BaseFlightProvider {
  constructor() {
    super('cleartrip', 'Cleartrip', 'ota');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // Cleartrip: Flipkart-owned OTA, offers Flipkart SuperCoin redemption & flat discounts
    // In production: Connect to Cleartrip Affiliate API (CLEARTRIP_API_KEY)
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      baseDiscountPercentage: -3.2,
      convenienceFeeINR: 249,
      instantCouponDiscountINR: 140, // "CTAIR" promo
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
