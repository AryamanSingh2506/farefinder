import { NextRequest, NextResponse } from 'next/server';
import { priceAlertSchema } from '@/lib/validation/search';
import { getPriceAlerts, savePriceAlert } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = priceAlertSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const alert = await savePriceAlert(validation.data);
    return NextResponse.json({
      success: true,
      message: `Price alert activated! We'll track ${alert.origin} → ${alert.destination} for ${alert.departureDate}.`,
      alert,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to create price alert' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const alerts = await getPriceAlerts();
    return NextResponse.json({ alerts });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch price alerts' },
      { status: 500 }
    );
  }
}
