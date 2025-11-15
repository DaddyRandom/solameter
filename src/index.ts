import { FundingMonitor } from './monitor/FundingMonitor';
import { config, MARKETS_TO_MONITOR, validateConfig } from './config';

/**
 * Main entry point for the Solana Funding Rate Monitor
 */
async function main() {
  console.log('═'.repeat(80));
  console.log('🔥 SOLAMETER - Solana Funding Rate Squeeze Detector 🔥');
  console.log('═'.repeat(80));

  try {
    // Validate configuration
    validateConfig();

    // Create monitor instance
    const monitor = new FundingMonitor(config, MARKETS_TO_MONITOR);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n📴 Received SIGINT, shutting down gracefully...');
      monitor.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n\n📴 Received SIGTERM, shutting down gracefully...');
      monitor.stop();
      process.exit(0);
    });

    // Check if running in single-scan mode
    const singleScan = process.argv.includes('--once') || process.argv.includes('-o');

    if (singleScan) {
      await monitor.scanOnce();
      console.log('\n✅ Single scan completed');
      process.exit(0);
    } else {
      // Start continuous monitoring
      monitor.start();
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the application
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
