/**
 * Funding rate data for a market
 */
export interface FundingRate {
  market: string;
  symbol: string;
  fundingRate: number; // in basis points (100 = 1%)
  fundingRatePercentage: number; // actual percentage
  timestamp: number;
  exchange: string;
  annualizedRate?: number;
}

/**
 * Squeeze detection result
 */
export interface SqueezeSignal {
  type: 'SHORT_SQUEEZE' | 'LONG_SQUEEZE';
  market: string;
  symbol: string;
  fundingRate: number;
  fundingRatePercentage: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  exchange: string;
  timestamp: number;
  description: string;
}

/**
 * Market configuration
 */
export interface MarketConfig {
  symbol: string;
  market: string;
  exchange: string;
}

/**
 * Monitor configuration
 */
export interface MonitorConfig {
  rpcUrl: string;
  monitorInterval: number;
  negativeFundingThreshold: number;
  positiveFundingThreshold: number;
  alertMode: 'console' | 'webhook' | 'both';
  webhookUrl?: string;
}
