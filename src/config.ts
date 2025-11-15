import dotenv from 'dotenv';
import { MonitorConfig, MarketConfig } from './types';

dotenv.config();

export const config: MonitorConfig = {
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  monitorInterval: parseInt(process.env.MONITOR_INTERVAL || '60000'),
  negativeFundingThreshold: parseFloat(process.env.NEGATIVE_FUNDING_THRESHOLD || '-10'),
  positiveFundingThreshold: parseFloat(process.env.POSITIVE_FUNDING_THRESHOLD || '10'),
  alertMode: (process.env.ALERT_MODE || 'console') as 'console' | 'webhook' | 'both',
  webhookUrl: process.env.WEBHOOK_URL,
};

/**
 * Markets to monitor
 * These are popular Solana meme coins and major tokens
 */
export const MARKETS_TO_MONITOR: MarketConfig[] = [
  // Major tokens
  { symbol: 'SOL-PERP', market: 'SOL-PERP', exchange: 'drift' },
  { symbol: 'BTC-PERP', market: 'BTC-PERP', exchange: 'drift' },
  { symbol: 'ETH-PERP', market: 'ETH-PERP', exchange: 'drift' },

  // Popular Solana meme coins
  { symbol: 'BONK-PERP', market: 'BONK-PERP', exchange: 'drift' },
  { symbol: 'WIF-PERP', market: 'WIF-PERP', exchange: 'drift' },
  { symbol: 'PYTH-PERP', market: 'PYTH-PERP', exchange: 'drift' },
  { symbol: 'JTO-PERP', market: 'JTO-PERP', exchange: 'drift' },
];

export function validateConfig(): void {
  if (!config.rpcUrl) {
    throw new Error('SOLANA_RPC_URL is required');
  }

  if (config.alertMode === 'webhook' || config.alertMode === 'both') {
    if (!config.webhookUrl) {
      throw new Error('WEBHOOK_URL is required when using webhook alert mode');
    }
  }

  console.log('✓ Configuration validated');
}
