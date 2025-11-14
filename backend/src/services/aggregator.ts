import { GaugeData, TrendingToken, BaselineInfo, VolumeData } from '../types';
import { getDexScreenerVolume, fetchDexScreenerData } from './dexscreener';
import { getPumpFunVolume, fetchPumpFunData } from './pumpfun';
import { fetchHeliusData, getNetworkHealth } from './helius';
import config from '../config';

// Cache for performance
let cachedGaugeData: GaugeData | null = null;
let cachedTrendingTokens: TrendingToken[] = [];
let lastUpdateTime = 0;

/**
 * Calculate gauge reading from total volume
 */
function calculateGaugeReading(totalVolumeSol: number): number {
  const percentage = (totalVolumeSol / config.baselineVolumeSol) * 100;
  const gaugeReading = Math.min(Math.floor(percentage * (config.gaugeMax / 100)), config.gaugeMax);
  return gaugeReading;
}

/**
 * Determine activity level based on gauge reading
 */
function getActivityLevel(gaugeReading: number): GaugeData['activityLevel'] {
  const percentage = (gaugeReading / config.gaugeMax) * 100;

  if (percentage >= 75) return 'Extreme';
  if (percentage >= 50) return 'High';
  if (percentage >= 25) return 'Medium';
  return 'Low';
}

/**
 * Aggregate volume data from all sources
 */
async function aggregateVolumeData(): Promise<VolumeData> {
  const [dexVolume, pumpVolume, heliusVolume] = await Promise.all([
    getDexScreenerVolume(),
    getPumpFunVolume(),
    fetchHeliusData(),
  ]);

  const totalVolumeSol = dexVolume + pumpVolume + heliusVolume;

  // Estimate USD value (assuming SOL = $100, adjust as needed)
  const solPriceUsd = 100; // TODO: Fetch real SOL price
  const totalVolumeUsd = totalVolumeSol * solPriceUsd;

  return {
    totalVolumeSol,
    totalVolumeUsd,
    tokenCount: 0, // Will be set by trending tokens count
    sources: {
      dexscreener: dexVolume,
      pumpfun: pumpVolume,
      helius: heliusVolume,
    },
  };
}

/**
 * Get current gauge data (cached)
 */
export async function getCurrentGaugeData(): Promise<GaugeData> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedGaugeData && now - lastUpdateTime < config.updateIntervalMs) {
    return cachedGaugeData;
  }

  try {
    const volumeData = await aggregateVolumeData();
    const gaugeReading = calculateGaugeReading(volumeData.totalVolumeSol);
    const activityLevel = getActivityLevel(gaugeReading);

    // Check network health for data quality
    const { healthy, tps } = await getNetworkHealth();
    const dataQuality = healthy && tps > 1000 ? 100 : 75;

    cachedGaugeData = {
      gaugeReading,
      volumeSol: volumeData.totalVolumeSol,
      activityLevel,
      dataQuality,
      timestamp: new Date().toISOString(),
    };

    lastUpdateTime = now;
    return cachedGaugeData;
  } catch (error) {
    console.error('Error aggregating gauge data:', error);

    // Return fallback data
    return {
      gaugeReading: 0,
      volumeSol: 0,
      activityLevel: 'Low',
      dataQuality: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get trending tokens from all sources
 */
export async function getTrendingTokens(limit: number = 10): Promise<TrendingToken[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedTrendingTokens.length > 0 && now - lastUpdateTime < config.updateIntervalMs) {
    return cachedTrendingTokens.slice(0, limit);
  }

  try {
    const [dexTokens, pumpTokens] = await Promise.all([
      fetchDexScreenerData(),
      fetchPumpFunData(),
    ]);

    // Merge and deduplicate tokens
    const tokenMap = new Map<string, TrendingToken>();

    [...dexTokens, ...pumpTokens].forEach((token) => {
      const existing = tokenMap.get(token.address);
      if (!existing || existing.volume24hSol < token.volume24hSol) {
        tokenMap.set(token.address, token);
      }
    });

    // Sort by volume and assign ranks
    const sortedTokens = Array.from(tokenMap.values())
      .sort((a, b) => b.volume24hSol - a.volume24hSol)
      .map((token, index) => ({ ...token, rank: index + 1 }));

    cachedTrendingTokens = sortedTokens;
    return sortedTokens.slice(0, limit);
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}

/**
 * Get baseline configuration info
 */
export function getBaselineInfo(): BaselineInfo {
  return {
    baselineVolumeSol: config.baselineVolumeSol,
    gaugeMax: config.gaugeMax,
    updateIntervalMs: config.updateIntervalMs,
  };
}

/**
 * Force refresh cached data
 */
export function refreshCache() {
  cachedGaugeData = null;
  cachedTrendingTokens = [];
  lastUpdateTime = 0;
}
