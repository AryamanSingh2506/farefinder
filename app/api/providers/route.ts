import { NextResponse } from 'next/server';
import { providerRegistry } from '@/lib/providers/registry';

export async function GET() {
  try {
    const metadata = providerRegistry.getProvidersMetadata();
    return NextResponse.json({ providers: metadata });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
