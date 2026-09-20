export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export type ProviderType = 'airline' | 'ota' | 'aggregator';

export interface FlightSegment {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureDateTime: string; // ISO string
  arrivalDateTime: string; // ISO string
  duration: number; // minutes
}

export interface FlightSearchResult {
  id: string;
  provider: string; // provider ID e.g. "air-india", "makemytrip"
  providerName: string; // display name e.g. "Air India", "MakeMyTrip"
  providerType: ProviderType;
  airline: string;
  airlineCode: string;
  flightNumber: string;

  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;

  departureDateTime: string; // ISO string
  arrivalDateTime: string; // ISO string

  duration: number; // minutes
  formattedDuration: string; // e.g. "1h 50m"
  stops: number;
  stopAirports: string[];

  segments: FlightSegment[];

  cabinClass: CabinClass;
  fareType: string; // "Saver", "Regular", "Flexi", "Student"

  baseFare: number;
  taxes: number; // GST + Aviation Security + UDF
  fees: number; // Convenience / Passenger Service
  totalPrice: number;
  currency: string; // "INR", "USD", etc.

  baggage: string; // e.g. "15 kg check-in baggage"
  cabinBaggage: string; // e.g. "7 kg cabin baggage"

  refundable: boolean;
  changeable: boolean;

  bookingUrl: string;
  lastUpdated: string;
  priceVerified: boolean;
  isDemo: boolean;

  // Student fare specifics
  studentEligible?: boolean;
  studentPerks?: string; // e.g. "+10 kg additional baggage & free change"
}

export interface GroupedFlightResult {
  id: string; // composite key e.g. "AI-504_BLR_BOM_2026-11-06T09:15:00"
  airline: string;
  airlineCode: string;
  flightNumber: string;

  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;

  departureDateTime: string;
  arrivalDateTime: string;

  duration: number;
  formattedDuration: string;
  stops: number;
  stopAirports: string[];
  segments: FlightSegment[];

  cabinClass: CabinClass;
  fareType: string;

  baggage: string;
  cabinBaggage: string;
  refundable: boolean;
  changeable: boolean;

  // Multi-provider pricing aggregation
  minPrice: number;
  currency: string;
  lowestOffer: FlightSearchResult;
  offers: FlightSearchResult[];
  maxPrice: number;
  savingsAmount: number;
  providerCount: number;

  isDemo: boolean;
  studentEligible?: boolean;
}

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string | null; // YYYY-MM-DD
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: CabinClass;
  isStudent?: boolean;
}

export interface PriceVerificationResult {
  verified: boolean;
  previousPrice: number;
  currentPrice: number;
  currency: string;
  isAvailable: boolean;
  priceChanged: boolean;
  priceDifference: number;
  message?: string;
  providerName: string;
  bookingUrl: string;
}

export interface ProviderStatus {
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  status: 'success' | 'timeout' | 'error';
  flightsCount: number;
  latencyMs: number;
  errorMessage?: string;
  isDemo: boolean;
}

export interface SearchApiResponse {
  searchId: string;
  request: FlightSearchRequest;
  totalFlightsFound: number;
  cheapestPrice: number;
  currency: string;
  results: GroupedFlightResult[];
  rawFlightCount: number;
  providerStatuses: ProviderStatus[];
  timestamp: string;
}
