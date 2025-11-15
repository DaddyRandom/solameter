import { BaseFetcher } from './BaseFetcher';
import { DriftFetcher } from './DriftFetcher';
import { MockFetcher } from './MockFetcher';
import { FundingRate, MarketConfig } from '../types';

/**
 * Factory to create the appropriate fetcher based on exchange
 */
export class FetcherFactory {
  private static fetchers: Map<string, BaseFetcher> = new Map();

  static getFetcher(exchange: string): BaseFetcher {
    if (!this.fetchers.has(exchange)) {
      switch (exchange.toLowerCase()) {
        case 'drift':
          this.fetchers.set(exchange, new DriftFetcher());
          break;
        case 'mock':
          this.fetchers.set(exchange, new MockFetcher());
          break;
        default:
          console.warn(`Unknown exchange: ${exchange}, using mock fetcher`);
          this.fetchers.set(exchange, new MockFetcher());
      }
    }

    return this.fetchers.get(exchange)!;
  }

  /**
   * Fetch funding rates for all markets
   */
  static async fetchAll(markets: MarketConfig[]): Promise<FundingRate[]> {
    const exchangeGroups = new Map<string, MarketConfig[]>();

    // Group markets by exchange
    for (const market of markets) {
      const exchange = market.exchange;
      if (!exchangeGroups.has(exchange)) {
        exchangeGroups.set(exchange, []);
      }
      exchangeGroups.get(exchange)!.push(market);
    }

    // Fetch from each exchange
    const allPromises: Promise<FundingRate[]>[] = [];
    for (const [exchange, exchangeMarkets] of exchangeGroups) {
      const fetcher = this.getFetcher(exchange);
      allPromises.push(fetcher.fetchMultipleFundingRates(exchangeMarkets));
    }

    const results = await Promise.all(allPromises);
    return results.flat();
  }
}

export { BaseFetcher } from './BaseFetcher';
export { DriftFetcher } from './DriftFetcher';
export { MockFetcher } from './MockFetcher';
