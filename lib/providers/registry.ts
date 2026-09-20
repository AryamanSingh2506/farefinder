import { FlightProvider, ProviderMetadata } from '@/types/providers';
import { FlightSearchRequest, FlightSearchResult, ProviderStatus } from '@/types/flights';
import { AirIndiaProvider } from './airlines/air-india';
import { IndiGoProvider } from './airlines/indigo';
import { AkasaAirProvider } from './airlines/akasa-air';
import { AirIndiaExpressProvider } from './airlines/air-india-express';
import { MakeMyTripProvider } from './otas/makemytrip';
import { GoibiboProvider } from './otas/goibibo';
import { CleartripProvider } from './otas/cleartrip';
import { EaseMyTripProvider } from './otas/easemytrip';
import { YatraProvider } from './otas/yatra';
import { IxigoProvider } from './otas/ixigo';

// Global provider state cache to allow runtime enabling/disabling via Admin dashboard
const providerStateOverrides: Record<string, boolean> = {};

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: FlightProvider[] = [];

  private constructor() {
    this.registerDefaultProviders();
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  private registerDefaultProviders() {
    // 4 Indian Airlines
    this.providers.push(new AirIndiaProvider());
    this.providers.push(new IndiGoProvider());
    this.providers.push(new AkasaAirProvider());
    this.providers.push(new AirIndiaExpressProvider());

    // 6 Indian OTAs
    this.providers.push(new MakeMyTripProvider());
    this.providers.push(new GoibiboProvider());
    this.providers.push(new CleartripProvider());
    this.providers.push(new EaseMyTripProvider());
    this.providers.push(new YatraProvider());
    this.providers.push(new IxigoProvider());
  }

  public getProviders(): FlightProvider[] {
    return this.providers.map((p) => {
      // Apply state override if present
      if (typeof providerStateOverrides[p.id] === 'boolean') {
        p.enabled = providerStateOverrides[p.id];
      }
      return p;
    });
  }

  public getProviderById(id: string): FlightProvider | undefined {
    const provider = this.providers.find((p) => p.id === id);
    if (provider && typeof providerStateOverrides[provider.id] === 'boolean') {
      provider.enabled = providerStateOverrides[provider.id];
    }
    return provider;
  }

  public setProviderEnabled(id: string, enabled: boolean): boolean {
    const provider = this.providers.find((p) => p.id === id);
    if (!provider) return false;
    provider.enabled = enabled;
    providerStateOverrides[id] = enabled;
    return true;
  }

  public getProvidersMetadata(): ProviderMetadata[] {
    return this.getProviders().map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      airlineCode: p.airlineCode,
      websiteUrl: `https://www.${p.id.replace('-', '')}.com`,
      enabled: p.enabled,
      isDemo: p.isDemo,
      hasVerificationApi: typeof p.verifyPrice === 'function',
      supportsStudentFare: true,
      avgLatencyMs: Math.floor(Math.random() * 180 + 120),
    }));
  }

  /**
   * Concurrently query all enabled providers with strict per-provider timeout.
   * Uses Promise.allSettled so one failure does not break the meta-search.
   */
  public async searchAllProviders(
    request: FlightSearchRequest,
    timeoutMs: number = 4000
  ): Promise<{
    flights: FlightSearchResult[];
    statuses: ProviderStatus[];
  }> {
    const enabledProviders = this.getProviders().filter((p) => p.enabled);

    const searchPromises = enabledProviders.map(async (provider) => {
      const startTime = Date.now();

      // Wrap search in a timeout promise
      const searchWithTimeout = Promise.race([
        provider.searchFlights(request),
        new Promise<FlightSearchResult[]>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout: Provider ${provider.name} exceeded ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);

      try {
        const flights = await searchWithTimeout;
        const latencyMs = Date.now() - startTime;

        const status: ProviderStatus = {
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          status: 'success',
          flightsCount: flights.length,
          latencyMs,
          isDemo: provider.isDemo,
        };

        return { status, flights };
      } catch (err: unknown) {
        const latencyMs = Date.now() - startTime;
        const isTimeout = err instanceof Error && err.message.includes('Timeout');

        const status: ProviderStatus = {
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          status: isTimeout ? 'timeout' : 'error',
          flightsCount: 0,
          latencyMs,
          errorMessage: err instanceof Error ? err.message : 'Unknown provider error',
          isDemo: provider.isDemo,
        };

        return { status, flights: [] };
      }
    });

    const settledResults = await Promise.allSettled(searchPromises);

    const allFlights: FlightSearchResult[] = [];
    const statuses: ProviderStatus[] = [];

    for (const res of settledResults) {
      if (res.status === 'fulfilled') {
        statuses.push(res.value.status);
        allFlights.push(...res.value.flights);
      }
    }

    return { flights: allFlights, statuses };
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
