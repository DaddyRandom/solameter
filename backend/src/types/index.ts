export interface GaugeData {
  gaugeReading: number;
  volumeSol: number;
  activityLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  dataQuality: number;
  timestamp: string;
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

export interface BaselineInfo {
  baselineVolumeSol: number;
  gaugeMax: number;
  updateIntervalMs: number;
}

export interface VolumeData {
  totalVolumeSol: number;
  totalVolumeUsd: number;
  tokenCount: number;
  sources: {
    dexscreener: number;
    pumpfun: number;
    helius: number;
  };
}

export interface WebSocketMessage {
  type: 'gauge_update' | 'trending_update' | 'error' | 'connection';
  data: any;
  timestamp?: string;
}

export interface MCPRequest {
  method: string;
  params?: Record<string, any>;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}
