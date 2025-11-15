import axios from 'axios';
import { BaseFetcher } from './BaseFetcher';
import { FundingRate, MarketConfig } from '../types';

/**
 * Fetcher for Drift Protocol funding rates
 * Uses Drift's public API
 */
export class DriftFetcher extends BaseFetcher {
  private apiUrl = 'https://mainnet-beta.api.drift.trade';

  constructor() {
    super('drift');
  }

  async fetchFundingRate(market: MarketConfig): Promise<FundingRate | null> {
    try {
      // Drift API endpoint for market data
      const response = await axios.get(`${this.apiUrl}/markets`, {
        timeout: 10000,
      });

      const markets = response.data;
      const marketData = markets.find((m: any) =>
        m.marketName === market.symbol ||
        m.symbol === market.symbol.replace('-PERP', '')
      );

      if (!marketData) {
        console.warn(`Market ${market.symbol} not found on Drift`);
        return null;
      }

      // Drift returns funding rate as a percentage (e.g., 0.01 = 1%)
      // We need to convert this to basis points
      const fundingRatePercentage = parseFloat(marketData.fundingRate || '0');
      const fundingRateBps = this.percentageToBps(fundingRatePercentage);

      return {
        market: market.market,
        symbol: market.symbol,
        fundingRate: fundingRateBps,
        fundingRatePercentage,
        timestamp: Date.now(),
        exchange: this.exchange,
        annualizedRate: this.calculateAnnualizedRate(fundingRatePercentage),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching from Drift for ${market.symbol}:`, error.message);
      } else {
        console.error(`Unknown error fetching from Drift for ${market.symbol}:`, error);
      }
      return null;
    }
  }
}
