export type SortOption = 'cheapest' | 'fastest' | 'best_value' | 'earliest' | 'latest';

export type TimeSlot = 'early_morning' | 'morning' | 'afternoon' | 'evening';

export interface FilterState {
  maxPrice: number;
  stops: number[]; // e.g. [0] for non-stop, [1] for 1 stop
  airlines: string[]; // airline codes e.g. ["6E", "AI"]
  providers: string[]; // provider IDs e.g. ["makemytrip", "air-india"]
  departureTimeSlots: TimeSlot[]; // 'early_morning' (before 6), 'morning' (6-12), etc.
  arrivalTimeSlots: TimeSlot[];
  maxDurationHours: number;
  baggageIncludedOnly: boolean;
  refundableOnly: boolean;
  studentFaresOnly: boolean;
}

export interface RouteInfo {
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  distanceKm: number;
  typicalDurationMinutes: number;
  typicalAirlines: string[];
  averagePriceINR: number;
}
