import { FundingRate, MarketConfig } from '../types';

/**
 * Base class for funding rate fetchers
 */
export abstract class BaseFetcher {
  protected exchange: string;

  constructor(exchange: string) {
    this.exchange = exchange;
  }

  /**
   * Fetch funding rate for a specific market
   */
  abstract fetchFundingRate(market: MarketConfig): Promise<FundingRate | null>;

  /**
   * Fetch funding rates for multiple markets
   */
  async fetchMultipleFundingRates(markets: MarketConfig[]): Promise<FundingRate[]> {
    const promises = markets
      .filter(m => m.exchange === this.exchange)
      .map(market => this.fetchFundingRate(market));

    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<FundingRate> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  /**
   * Convert basis points to percentage
   */
  protected bpsToPercentage(bps: number): number {
    return bps / 100;
  }

  /**
   * Convert percentage to basis points
   */
  protected percentageToBps(percentage: number): number {
    return percentage * 100;
  }

  /**
   * Calculate annualized funding rate
   * Assumes 8-hour funding periods (3 per day)
   */
  protected calculateAnnualizedRate(hourlyRate: number): number {
    return hourlyRate * 24 * 365;
  }
}
