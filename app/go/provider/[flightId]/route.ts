import { NextRequest, NextResponse } from 'next/server';
import { logClick } from '@/lib/db/repository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ flightId: string }> }
) {
  try {
    const { flightId } = await params;
    const searchParams = request.nextUrl.searchParams;

    const providerCode = searchParams.get('provider') || 'external-provider';
    const displayedPrice = parseFloat(searchParams.get('price') || '0');
    const currency = searchParams.get('currency') || 'INR';
    const searchId = searchParams.get('searchId') || undefined;
    const targetUrl = searchParams.get('url') || '/booking-simulator';

    // Record outbound click for affiliate analytics
    await logClick({
      providerCode,
      flightNumber: flightId,
      displayedPrice: displayedPrice > 0 ? displayedPrice : 4500,
      currency,
      bookingUrl: targetUrl,
      searchId,
    });

    // In production: Redirect to official affiliate / deep link
    // For development: Redirect to internal booking simulator
    const destinationUrl = new URL(targetUrl, request.url);
    if (!destinationUrl.searchParams.has('flight')) {
      destinationUrl.searchParams.set('flight', flightId);
    }
    if (!destinationUrl.searchParams.has('provider')) {
      destinationUrl.searchParams.set('provider', providerCode);
    }

    return NextResponse.redirect(destinationUrl);
  } catch (error: unknown) {
    console.error('Error in external redirect handler:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
