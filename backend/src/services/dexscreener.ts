import axios from 'axios';
import config from '../config';
import { TrendingToken } from '../types';

const DEXSCREENER_API_BASE = 'https://api.dexscreener.com/latest/dex';

/**
 * Fetch trending Solana tokens from DexScreener
 */
export async function fetchDexScreenerData(): Promise<TrendingToken[]> {
  try {
    const response = await axios.get(`${DEXSCREENER_API_BASE}/tokens/solana`, {
      timeout: 5000,
    });

    if (!response.data || !response.data.pairs) {
      return [];
    }

    // Transform and filter data
    const tokens: TrendingToken[] = response.data.pairs
      .filter((pair: any) => pair.chainId === 'solana')
      .slice(0, 50) // Top 50
      .map((pair: any, index: number) => ({
        symbol: pair.baseToken?.symbol || 'UNKNOWN',
        name: pair.baseToken?.name || 'Unknown Token',
        address: pair.baseToken?.address || '',
        volume24hSol: parseFloat(pair.volume?.h24 || '0') / 100, // Estimate SOL volume
        volume24hUsd: parseFloat(pair.volume?.h24 || '0'),
        priceUsd: parseFloat(pair.priceUsd || '0'),
        priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
        liquidity: parseFloat(pair.liquidity?.usd || '0'),
        rank: index + 1,
      }));

    return tokens;
  } catch (error: any) {
    console.error('DexScreener API error:', error.message);
    return [];
  }
}

/**
 * Calculate total volume from DexScreener data
 */
export async function getDexScreenerVolume(): Promise<number> {
  try {
    const tokens = await fetchDexScreenerData();
    const totalVolumeSol = tokens.reduce((sum, token) => sum + token.volume24hSol, 0);
    return totalVolumeSol;
  } catch (error) {
    console.error('Error calculating DexScreener volume:', error);
    return 0;
  }
}
