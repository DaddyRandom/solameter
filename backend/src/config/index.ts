import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://admin:solameter_dev_2024@localhost:5432/solameter',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // API Keys
  heliusRpcUrl: process.env.HELIUS_RPC_URL || '',
  birdeyeApiKey: process.env.BIRDEYE_API_KEY || '',
  dexscreenerApiKey: process.env.DEXSCREENER_API_KEY || '',

  // App Config
  baselineVolumeSol: parseInt(process.env.BASELINE_VOLUME_SOL || '1000000000', 10),
  gaugeMax: parseInt(process.env.GAUGE_MAX || '10000', 10),
  updateIntervalMs: parseInt(process.env.UPDATE_INTERVAL_MS || '10000', 10),

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // MCP
  mcpPort: parseInt(process.env.MCP_PORT || '3002', 10),
};

export default config;
