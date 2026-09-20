import { FlightProvider } from '@/types/providers';
import { FlightSearchRequest, FlightSearchResult, PriceVerificationResult, ProviderType } from '@/types/flights';

export abstract class BaseFlightProvider implements FlightProvider {
  public id: string;
  public name: string;
  public type: ProviderType;
  public airlineCode?: string;
  public enabled: boolean = true;
  public isDemo: boolean = true;

  constructor(id: string, name: string, type: ProviderType, airlineCode?: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.airlineCode = airlineCode;
  }

  abstract searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]>;

  abstract getBookingUrl(result: FlightSearchResult): Promise<string>;

  async verifyPrice(result: FlightSearchResult): Promise<PriceVerificationResult> {
    // Standard mock verification implementation
    // 90% chance price stays same, 10% chance price changes
    const priceChanged = Math.random() < 0.12;
    const priceDelta = priceChanged ? Math.round((Math.random() * 350 + 100) / 10) * 10 : 0;
    const currentPrice = result.totalPrice + priceDelta;

    return {
      verified: true,
      previousPrice: result.totalPrice,
      currentPrice,
      currency: result.currency,
      isAvailable: true,
      priceChanged,
      priceDifference: priceDelta,
      providerName: this.name,
      bookingUrl: await this.getBookingUrl({ ...result, totalPrice: currentPrice }),
      message: priceChanged
        ? `The fare on ${this.name} was updated due to real-time seat inventory adjustments.`
        : `Fare verified with ${this.name}. Seat available at the displayed price.`,
    };
  }
}
