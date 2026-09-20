import { NextRequest, NextResponse } from 'next/server';
import { flightSearchSchema } from '@/lib/validation/search';
import { providerRegistry } from '@/lib/providers/registry';
import { deduplicateAndGroupFlights } from '@/lib/flights/deduplicator';
import { logSearch } from '@/lib/db/repository';
import { SearchApiResponse } from '@/types/flights';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request using Zod
    const validation = flightSearchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const searchRequest = validation.data;

    // Concurrently search all registered and enabled providers
    const { flights, statuses } = await providerRegistry.searchAllProviders(searchRequest);

    // Group and deduplicate flights for multi-provider comparison
    const groupedResults = deduplicateAndGroupFlights(flights);

    const cheapestPrice =
      groupedResults.length > 0
        ? Math.min(...groupedResults.map((r) => r.minPrice))
        : 0;

    // Log search asynchronously
    const searchId = await logSearch(searchRequest, groupedResults);

    const response: SearchApiResponse = {
      searchId,
      request: searchRequest,
      totalFlightsFound: groupedResults.length,
      cheapestPrice,
      currency: 'INR',
      results: groupedResults,
      rawFlightCount: flights.length,
      providerStatuses: statuses,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('Error in flight search API:', error);
    return NextResponse.json(
      {
        error: 'Failed to process flight search',
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
