import { BaseFetcher } from './BaseFetcher';
import { FundingRate, MarketConfig } from '../types';

/**
 * Mock fetcher for testing and demonstration
 * Generates random funding rates
 */
export class MockFetcher extends BaseFetcher {
  constructor() {
    super('mock');
  }

  async fetchFundingRate(market: MarketConfig): Promise<FundingRate | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate random funding rate between -50 and 50 bps (-0.5% to 0.5%)
    // With occasional extreme values for testing
    let fundingRateBps: number;

    if (Math.random() < 0.1) {
      // 10% chance of extreme funding rate
      fundingRateBps = (Math.random() - 0.5) * 200; // -100 to 100 bps
    } else {
      fundingRateBps = (Math.random() - 0.5) * 100; // -50 to 50 bps
    }

    const fundingRatePercentage = this.bpsToPercentage(fundingRateBps);

    return {
      market: market.market,
      symbol: market.symbol,
      fundingRate: fundingRateBps,
      fundingRatePercentage,
      timestamp: Date.now(),
      exchange: this.exchange,
      annualizedRate: this.calculateAnnualizedRate(fundingRatePercentage),
    };
  }
}
