import { NextRequest, NextResponse } from 'next/server';
import { clickTrackSchema } from '@/lib/validation/search';
import { logClick } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = clickTrackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid click tracking data', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const clickId = await logClick(validation.data);
    return NextResponse.json({ success: true, clickId });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to record click' },
      { status: 500 }
    );
  }
}
