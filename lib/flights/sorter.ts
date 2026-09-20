import { GroupedFlightResult } from '@/types/flights';
import { SortOption } from '@/types/filters';

export interface BestValueExplanation {
  methodology: string;
  weights: {
    priceWeightPercent: number;
    durationWeightPercent: number;
    stopsWeightPercent: number;
  };
}

export const BEST_VALUE_METRIC: BestValueExplanation = {
  methodology:
    'Best Value ranking uses an objective mathematical composite score balancing fare, total duration, and number of stops. Normalized Price Index (55%), Normalized Duration Index (35%), and Stops Penalty (10%). Lower composite score represents superior convenience per Rupee.',
  weights: {
    priceWeightPercent: 55,
    durationWeightPercent: 35,
    stopsWeightPercent: 10,
  },
};

export function sortFlights(flights: GroupedFlightResult[], sortBy: SortOption): GroupedFlightResult[] {
  if (!flights || flights.length === 0) return [];
  const copy = [...flights];

  switch (sortBy) {
    case 'cheapest':
      return copy.sort((a, b) => a.minPrice - b.minPrice);

    case 'fastest':
      return copy.sort((a, b) => {
        if (a.duration !== b.duration) return a.duration - b.duration;
        return a.minPrice - b.minPrice;
      });

    case 'earliest':
      return copy.sort((a, b) => {
        const timeA = new Date(a.departureDateTime).getTime();
        const timeB = new Date(b.departureDateTime).getTime();
        return timeA - timeB;
      });

    case 'latest':
      return copy.sort((a, b) => {
        const timeA = new Date(a.departureDateTime).getTime();
        const timeB = new Date(b.departureDateTime).getTime();
        return timeB - timeA;
      });

    case 'best_value': {
      // Find baselines across results
      const minPriceOverall = Math.min(...copy.map((f) => f.minPrice));
      const minDurationOverall = Math.min(...copy.map((f) => f.duration));

      return copy.sort((a, b) => {
        const priceIndexA = a.minPrice / (minPriceOverall || 1);
        const priceIndexB = b.minPrice / (minPriceOverall || 1);

        const durationIndexA = a.duration / (minDurationOverall || 1);
        const durationIndexB = b.duration / (minDurationOverall || 1);

        const stopsPenaltyA = 1.0 + a.stops * 0.2;
        const stopsPenaltyB = 1.0 + b.stops * 0.2;

        const scoreA = 0.55 * priceIndexA + 0.35 * durationIndexA + 0.1 * stopsPenaltyA;
        const scoreB = 0.55 * priceIndexB + 0.35 * durationIndexB + 0.1 * stopsPenaltyB;

        return scoreA - scoreB;
      });
    }

    default:
      return copy.sort((a, b) => a.minPrice - b.minPrice);
  }
}
