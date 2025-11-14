import axios from 'axios';
import { TrendingToken } from '../types';

// Pump.fun API endpoint (unofficial/community)
const PUMPFUN_API_BASE = 'https://frontend-api.pump.fun';

/**
 * Fetch trending tokens from Pump.fun
 */
export async function fetchPumpFunData(): Promise<TrendingToken[]> {
  try {
    // Note: This is a placeholder. Pump.fun doesn't have an official public API
    // In production, you'd need to implement web scraping or use their SDK
    const response = await axios.get(`${PUMPFUN_API_BASE}/coins`, {
      timeout: 5000,
      params: {
        limit: 50,
        sort: 'volume',
        order: 'desc',
      },
    });

    if (!response.data) {
      return [];
    }

    const tokens: TrendingToken[] = response.data
      .slice(0, 50)
      .map((coin: any, index: number) => ({
        symbol: coin.symbol || 'UNKNOWN',
        name: coin.name || 'Unknown Token',
        address: coin.mint || '',
        volume24hSol: parseFloat(coin.volume_24h || '0'),
        volume24hUsd: parseFloat(coin.volume_24h_usd || '0'),
        priceUsd: parseFloat(coin.price || '0'),
        priceChange24h: parseFloat(coin.price_change_24h || '0'),
        liquidity: parseFloat(coin.liquidity || '0'),
        holders: parseInt(coin.holders || '0', 10),
        rank: index + 1,
      }));

    return tokens;
  } catch (error: any) {
    console.error('Pump.fun API error:', error.message);
    // Return empty array on error (API might not be accessible)
    return [];
  }
}

/**
 * Calculate total volume from Pump.fun data
 */
export async function getPumpFunVolume(): Promise<number> {
  try {
    const tokens = await fetchPumpFunData();
    const totalVolumeSol = tokens.reduce((sum, token) => sum + token.volume24hSol, 0);
    return totalVolumeSol;
  } catch (error) {
    console.error('Error calculating Pump.fun volume:', error);
    return 0;
  }
}
