import { FetcherFactory } from '../fetchers';
import { SqueezeDetector } from '../detector/SqueezeDetector';
import { AlertManager } from '../alerts/AlertManager';
import { MarketConfig, MonitorConfig } from '../types';

/**
 * Main monitor that orchestrates funding rate monitoring
 */
export class FundingMonitor {
  private config: MonitorConfig;
  private markets: MarketConfig[];
  private detector: SqueezeDetector;
  private alertManager: AlertManager;
  private intervalId?: NodeJS.Timeout;
  private isRunning: boolean = false;

  constructor(config: MonitorConfig, markets: MarketConfig[]) {
    this.config = config;
    this.markets = markets;
    this.detector = new SqueezeDetector(
      config.negativeFundingThreshold,
      config.positiveFundingThreshold
    );
    this.alertManager = new AlertManager(config.alertMode, config.webhookUrl);
  }

  /**
   * Start monitoring
   */
  start(): void {
    if (this.isRunning) {
      console.log('Monitor is already running');
      return;
    }

    this.isRunning = true;
    console.log('\n🔍 Starting Funding Rate Monitor...');
    console.log(`📊 Monitoring ${this.markets.length} markets`);
    console.log(`⏱️  Interval: ${this.config.monitorInterval / 1000}s`);
    console.log(`📉 Negative threshold: ${this.config.negativeFundingThreshold} bps (short squeeze)`);
    console.log(`📈 Positive threshold: ${this.config.positiveFundingThreshold} bps (long squeeze)`);
    console.log(`🔔 Alert mode: ${this.config.alertMode}\n`);

    // Run immediately
    this.scan();

    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.scan();
    }, this.config.monitorInterval);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
    console.log('\n🛑 Monitor stopped');
  }

  /**
   * Perform a single scan
   */
  private async scan(): Promise<void> {
    try {
      // Fetch funding rates
      const fundingRates = await FetcherFactory.fetchAll(this.markets);

      if (fundingRates.length === 0) {
        console.log('⚠️ No funding rates fetched');
        return;
      }

      // Display rates table
      this.alertManager.displayRatesTable(fundingRates);

      // Detect squeeze opportunities
      const signals = this.detector.analyze(fundingRates);

      // Display statistics
      const stats = this.detector.getStatistics(fundingRates);
      console.log('📊 Statistics:');
      console.log(`  Total markets: ${stats.total}`);
      console.log(`  Negative funding: ${stats.negative}`);
      console.log(`  Positive funding: ${stats.positive}`);
      console.log(`  Average rate: ${stats.avgRate.toFixed(2)} bps (${(stats.avgRate / 100).toFixed(4)}%)`);
      console.log(`  Range: ${stats.minRate.toFixed(2)} to ${stats.maxRate.toFixed(2)} bps\n`);

      // Send alerts
      await this.alertManager.sendAlerts(signals, fundingRates);
    } catch (error) {
      console.error('Error during scan:', error);
    }
  }

  /**
   * Run a single scan and exit
   */
  async scanOnce(): Promise<void> {
    console.log('🔍 Running single scan...\n');
    await this.scan();
  }
}
