/**
 * Example: Basic usage of the funding rate detector
 */
import { FetcherFactory } from '../fetchers';
import { SqueezeDetector } from '../detector/SqueezeDetector';
import { MarketConfig } from '../types';

async function basicExample() {
  console.log('🔍 Basic Funding Rate Detection Example\n');

  // Define markets to check
  const markets: MarketConfig[] = [
    { symbol: 'SOL-PERP', market: 'SOL-PERP', exchange: 'mock' },
    { symbol: 'BTC-PERP', market: 'BTC-PERP', exchange: 'mock' },
    { symbol: 'ETH-PERP', market: 'ETH-PERP', exchange: 'mock' },
  ];

  // Fetch funding rates
  console.log('Fetching funding rates...');
  const fundingRates = await FetcherFactory.fetchAll(markets);

  console.log(`\nFound ${fundingRates.length} funding rates:\n`);
  for (const rate of fundingRates) {
    console.log(
      `${rate.symbol}: ${rate.fundingRatePercentage.toFixed(4)}% ` +
      `(${rate.fundingRate.toFixed(2)} bps) on ${rate.exchange}`
    );
  }

  // Create detector with thresholds
  const detector = new SqueezeDetector(
    -10, // Negative threshold (short squeeze)
    10   // Positive threshold (long squeeze)
  );

  // Detect squeezes
  const signals = detector.analyze(fundingRates);

  console.log(`\n\n🚨 Detected ${signals.length} squeeze opportunities:\n`);
  for (const signal of signals) {
    console.log(`${signal.type}: ${signal.symbol}`);
    console.log(`  Severity: ${signal.severity}`);
    console.log(`  Rate: ${signal.fundingRatePercentage.toFixed(4)}%`);
    console.log(`  ${signal.description}\n`);
  }

  // Get statistics
  const stats = detector.getStatistics(fundingRates);
  console.log('\n📊 Statistics:');
  console.log(`  Total markets: ${stats.total}`);
  console.log(`  Negative funding: ${stats.negative}`);
  console.log(`  Positive funding: ${stats.positive}`);
  console.log(`  Average rate: ${stats.avgRate.toFixed(2)} bps`);
}

basicExample().catch(console.error);
