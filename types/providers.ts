import { FlightSearchRequest, FlightSearchResult, PriceVerificationResult, ProviderType } from './flights';

export interface ProviderMetadata {
  id: string;
  name: string;
  type: ProviderType;
  airlineCode?: string; // If airline provider, e.g. "AI"
  websiteUrl: string;
  enabled: boolean;
  isDemo: boolean;
  hasVerificationApi: boolean;
  supportsStudentFare: boolean;
  avgLatencyMs: number;
}

export interface FlightProvider {
  id: string;
  name: string;
  type: ProviderType;
  airlineCode?: string;
  enabled: boolean;
  isDemo: boolean;

  searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]>;

  getBookingUrl(result: FlightSearchResult): Promise<string>;

  verifyPrice?(result: FlightSearchResult): Promise<PriceVerificationResult>;
}
