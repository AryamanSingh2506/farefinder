import { NextResponse } from 'next/server';
import { getAdminMetrics } from '@/lib/db/repository';
import { providerRegistry } from '@/lib/providers/registry';

export async function GET() {
  try {
    const metrics = await getAdminMetrics();
    const providers = providerRegistry.getProvidersMetadata();

    return NextResponse.json({
      ...metrics,
      providers,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch admin metrics' },
      { status: 500 }
    );
  }
}
