import axios from 'axios';
import config from '../config';

/**
 * Fetch Solana network statistics from Helius RPC
 */
export async function fetchHeliusData(): Promise<number> {
  try {
    if (!config.heliusRpcUrl) {
      console.warn('Helius RPC URL not configured');
      return 0;
    }

    // Get recent performance samples
    const response = await axios.post(
      config.heliusRpcUrl,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getRecentPerformanceSamples',
        params: [10],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      }
    );

    if (!response.data || !response.data.result) {
      return 0;
    }

    // Calculate average transaction count
    const samples = response.data.result;
    const avgTxCount = samples.reduce((sum: number, sample: any) => {
      return sum + (sample.numTransactions || 0);
    }, 0) / samples.length;

    // Estimate volume based on transaction count
    // This is a rough estimate: assuming each tx involves ~0.1 SOL on average
    const estimatedVolumeSol = (avgTxCount * 0.1) / 10; // Divided by 10 for 24h normalization

    return estimatedVolumeSol;
  } catch (error: any) {
    console.error('Helius API error:', error.message);
    return 0;
  }
}

/**
 * Get Solana network health status
 */
export async function getNetworkHealth(): Promise<{ healthy: boolean; tps: number }> {
  try {
    if (!config.heliusRpcUrl) {
      return { healthy: false, tps: 0 };
    }

    const response = await axios.post(
      config.heliusRpcUrl,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getRecentPerformanceSamples',
        params: [1],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      }
    );

    if (!response.data || !response.data.result || response.data.result.length === 0) {
      return { healthy: false, tps: 0 };
    }

    const sample = response.data.result[0];
    const tps = Math.floor(sample.numTransactions / sample.samplePeriodSecs);

    return {
      healthy: tps > 0,
      tps,
    };
  } catch (error) {
    console.error('Error checking network health:', error);
    return { healthy: false, tps: 0 };
  }
}
