import { NextRequest, NextResponse } from 'next/server';
import { providerRegistry } from '@/lib/providers/registry';
import { FlightSearchResult } from '@/types/flights';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { offer }: { offer: FlightSearchResult } = body;

    if (!offer || !offer.provider) {
      return NextResponse.json(
        { error: 'Missing offer details or provider ID' },
        { status: 400 }
      );
    }

    const provider = providerRegistry.getProviderById(offer.provider);
    if (!provider) {
      return NextResponse.json(
        { error: `Provider "${offer.provider}" not found` },
        { status: 404 }
      );
    }

    // Call provider's price verification logic if implemented
    if (typeof provider.verifyPrice === 'function') {
      const verification = await provider.verifyPrice(offer);
      return NextResponse.json(verification);
    }

    // Default fallback if provider does not have an automated verification endpoint
    const bookingUrl = await provider.getBookingUrl(offer);
    return NextResponse.json({
      verified: false,
      previousPrice: offer.totalPrice,
      currentPrice: offer.totalPrice,
      currency: offer.currency,
      isAvailable: true,
      priceChanged: false,
      priceDifference: 0,
      providerName: provider.name,
      bookingUrl,
      message: 'Price will be verified directly on provider website.',
    });
  } catch (error: unknown) {
    console.error('Error verifying flight price:', error);
    return NextResponse.json(
      {
        error: 'Price verification failed',
        message: error instanceof Error ? error.message : 'Internal error',
      },
      { status: 500 }
    );
  }
}
