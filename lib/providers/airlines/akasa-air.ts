import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';
import { generateFlightsForProvider } from '../mock/generator';

export class AkasaAirProvider extends BaseFlightProvider {
  constructor() {
    super('akasa-air', 'Akasa Air', 'airline', 'QP');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // Akasa Air Direct: Fast growing carrier, competitive brand new 737 MAX fleet
    // In production: Connect to Akasa Air API
    return generateFlightsForProvider(request, {
      providerId: this.id,
      providerName: this.name,
      providerType: this.type,
      specificAirlineCode: 'QP',
      baseDiscountPercentage: -2, // Akasa website direct discount
      convenienceFeeINR: 100,
      instantCouponDiscountINR: 0,
    });
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `/booking-simulator?provider=${this.id}&providerName=${encodeURIComponent(this.name)}&flight=${result.flightNumber}&origin=${result.originCode}&destination=${result.destinationCode}&price=${result.totalPrice}`;
  }
}
