export interface GaugeData {
  gaugeReading: number;
  volumeSol: number;
  activityLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  dataQuality: number;
  timestamp: string;
  trending?: TrendingToken[];
}

export interface TrendingToken {
  symbol: string;
  name: string;
  address: string;
  volume24hSol: number;
  volume24hUsd: number;
  priceUsd: number;
  priceChange24h: number;
  liquidity: number;
  holders?: number;
  rank: number;
}

export interface WebSocketMessage {
  type: 'gauge_update' | 'trending_update' | 'error' | 'connection';
  data: any;
  timestamp?: string;
}
