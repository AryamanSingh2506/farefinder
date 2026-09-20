import { NextRequest, NextResponse } from 'next/server';
import { providerRegistry } from '@/lib/providers/registry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, enabled }: { providerId: string; enabled: boolean } = body;

    if (!providerId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid parameters: providerId and enabled boolean are required' },
        { status: 400 }
      );
    }

    const success = providerRegistry.setProviderEnabled(providerId, enabled);
    if (!success) {
      return NextResponse.json(
        { error: `Provider "${providerId}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      providerId,
      enabled,
      message: `Provider ${providerId} is now ${enabled ? 'enabled' : 'disabled'}.`,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to update provider status' },
      { status: 500 }
    );
  }
}
