import axios from 'axios';
import { SqueezeSignal, FundingRate } from '../types';

/**
 * Manages alerts for squeeze signals
 */
export class AlertManager {
  private alertMode: 'console' | 'webhook' | 'both';
  private webhookUrl?: string;

  constructor(alertMode: 'console' | 'webhook' | 'both', webhookUrl?: string) {
    this.alertMode = alertMode;
    this.webhookUrl = webhookUrl;
  }

  /**
   * Send alerts for detected squeeze signals
   */
  async sendAlerts(signals: SqueezeSignal[], allRates: FundingRate[]): Promise<void> {
    if (signals.length === 0) {
      this.logNoSignals(allRates);
      return;
    }

    for (const signal of signals) {
      await this.sendAlert(signal);
    }
  }

  /**
   * Send a single alert
   */
  private async sendAlert(signal: SqueezeSignal): Promise<void> {
    const message = this.formatAlert(signal);

    if (this.alertMode === 'console' || this.alertMode === 'both') {
      this.sendConsoleAlert(signal, message);
    }

    if (this.alertMode === 'webhook' || this.alertMode === 'both') {
      await this.sendWebhookAlert(signal, message);
    }
  }

  /**
   * Format alert message
   */
  private formatAlert(signal: SqueezeSignal): string {
    const emoji = signal.type === 'SHORT_SQUEEZE' ? '🚀' : '⚠️';
    const severityEmoji = this.getSeverityEmoji(signal.severity);

    return (
      `${emoji} ${severityEmoji} ${signal.type} DETECTED\n` +
      `Market: ${signal.symbol} (${signal.exchange})\n` +
      `Funding Rate: ${signal.fundingRatePercentage.toFixed(4)}% (${signal.fundingRate.toFixed(2)} bps)\n` +
      `Severity: ${signal.severity}\n` +
      `${signal.description}\n` +
      `Time: ${new Date(signal.timestamp).toISOString()}`
    );
  }

  /**
   * Send console alert
   */
  private sendConsoleAlert(signal: SqueezeSignal, message: string): void {
    console.log('\n' + '='.repeat(80));
    console.log(message);
    console.log('='.repeat(80) + '\n');
  }

  /**
   * Send webhook alert (Discord, Slack, etc.)
   */
  private async sendWebhookAlert(signal: SqueezeSignal, message: string): Promise<void> {
    if (!this.webhookUrl) {
      console.error('Webhook URL not configured');
      return;
    }

    try {
      const color = signal.type === 'SHORT_SQUEEZE' ? 0x00ff00 : 0xff0000;

      // Discord webhook format
      const payload = {
        embeds: [
          {
            title: `${signal.type} - ${signal.symbol}`,
            description: signal.description,
            color,
            fields: [
              {
                name: 'Exchange',
                value: signal.exchange.toUpperCase(),
                inline: true,
              },
              {
                name: 'Funding Rate',
                value: `${signal.fundingRatePercentage.toFixed(4)}%`,
                inline: true,
              },
              {
                name: 'Severity',
                value: signal.severity,
                inline: true,
              },
            ],
            timestamp: new Date(signal.timestamp).toISOString(),
          },
        ],
      };

      await axios.post(this.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });

      console.log(`✓ Webhook alert sent for ${signal.symbol}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error sending webhook alert: ${error.message}`);
      } else {
        console.error(`Unknown error sending webhook alert:`, error);
      }
    }
  }

  /**
   * Log when no signals are detected
   */
  private logNoSignals(rates: FundingRate[]): void {
    if (this.alertMode === 'console' || this.alertMode === 'both') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ✓ Scanned ${rates.length} markets - No squeeze signals detected`);

      // Show a summary of rates
      if (rates.length > 0) {
        const maxRate = Math.max(...rates.map(r => r.fundingRate));
        const minRate = Math.min(...rates.map(r => r.fundingRate));
        console.log(
          `  Range: ${minRate.toFixed(2)} bps to ${maxRate.toFixed(2)} bps ` +
          `(${(minRate / 100).toFixed(4)}% to ${(maxRate / 100).toFixed(4)}%)`
        );
      }
    }
  }

  /**
   * Get emoji for severity
   */
  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'EXTREME':
        return '🔥🔥🔥';
      case 'HIGH':
        return '🔥🔥';
      case 'MEDIUM':
        return '🔥';
      case 'LOW':
        return '⚡';
      default:
        return '';
    }
  }

  /**
   * Display current funding rates table
   */
  displayRatesTable(rates: FundingRate[]): void {
    if (rates.length === 0) return;

    console.log('\n📊 Current Funding Rates:');
    console.log('─'.repeat(100));
    console.log(
      `${'Symbol'.padEnd(15)} | ` +
      `${'Exchange'.padEnd(10)} | ` +
      `${'Rate (%)'.padStart(12)} | ` +
      `${'Rate (bps)'.padStart(12)} | ` +
      `${'Annualized (%)'.padStart(16)} | ` +
      `Status`
    );
    console.log('─'.repeat(100));

    for (const rate of rates.sort((a, b) => a.fundingRate - b.fundingRate)) {
      const status = this.getRateStatus(rate.fundingRate);
      console.log(
        `${rate.symbol.padEnd(15)} | ` +
        `${rate.exchange.padEnd(10)} | ` +
        `${rate.fundingRatePercentage.toFixed(6).padStart(12)} | ` +
        `${rate.fundingRate.toFixed(2).padStart(12)} | ` +
        `${(rate.annualizedRate || 0).toFixed(2).padStart(16)} | ` +
        `${status}`
      );
    }
    console.log('─'.repeat(100) + '\n');
  }

  /**
   * Get status indicator for funding rate
   */
  private getRateStatus(fundingRate: number): string {
    if (fundingRate < -50) return '🚀🚀🚀 EXTREME SHORT SQUEEZE SETUP';
    if (fundingRate < -25) return '🚀🚀 HIGH SHORT SQUEEZE SETUP';
    if (fundingRate < -10) return '🚀 SHORT SQUEEZE SETUP';
    if (fundingRate < 0) return '⬇️ Shorts paying';
    if (fundingRate === 0) return '➖ Neutral';
    if (fundingRate < 10) return '⬆️ Longs paying';
    if (fundingRate < 25) return '⚠️ LONG SQUEEZE RISK';
    if (fundingRate < 50) return '⚠️⚠️ HIGH LONG SQUEEZE RISK';
    return '⚠️⚠️⚠️ EXTREME LONG SQUEEZE RISK';
  }
}
