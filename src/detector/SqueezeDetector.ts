import { FundingRate, SqueezeSignal } from '../types';

/**
 * Detects potential squeeze opportunities based on funding rates
 */
export class SqueezeDetector {
  private negativeFundingThreshold: number;
  private positiveFundingThreshold: number;

  constructor(negativeFundingThreshold: number, positiveFundingThreshold: number) {
    this.negativeFundingThreshold = negativeFundingThreshold;
    this.positiveFundingThreshold = positiveFundingThreshold;
  }

  /**
   * Analyze funding rates and detect squeeze opportunities
   */
  analyze(fundingRates: FundingRate[]): SqueezeSignal[] {
    const signals: SqueezeSignal[] = [];

    for (const rate of fundingRates) {
      const signal = this.detectSqueeze(rate);
      if (signal) {
        signals.push(signal);
      }
    }

    return signals;
  }

  /**
   * Detect squeeze for a single funding rate
   */
  private detectSqueeze(rate: FundingRate): SqueezeSignal | null {
    const { fundingRate } = rate;

    // Negative funding: Shorts pay longs (potential short squeeze)
    if (fundingRate < this.negativeFundingThreshold) {
      return {
        type: 'SHORT_SQUEEZE',
        market: rate.market,
        symbol: rate.symbol,
        fundingRate: rate.fundingRate,
        fundingRatePercentage: rate.fundingRatePercentage,
        severity: this.calculateSeverity(fundingRate, true),
        exchange: rate.exchange,
        timestamp: rate.timestamp,
        description: this.generateDescription(rate, 'SHORT_SQUEEZE'),
      };
    }

    // Positive funding: Longs pay shorts (potential long squeeze)
    if (fundingRate > this.positiveFundingThreshold) {
      return {
        type: 'LONG_SQUEEZE',
        market: rate.market,
        symbol: rate.symbol,
        fundingRate: rate.fundingRate,
        fundingRatePercentage: rate.fundingRatePercentage,
        severity: this.calculateSeverity(fundingRate, false),
        exchange: rate.exchange,
        timestamp: rate.timestamp,
        description: this.generateDescription(rate, 'LONG_SQUEEZE'),
      };
    }

    return null;
  }

  /**
   * Calculate severity of the squeeze signal
   */
  private calculateSeverity(
    fundingRate: number,
    isNegative: boolean
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' {
    const absRate = Math.abs(fundingRate);

    if (absRate >= 100) return 'EXTREME'; // >= 1%
    if (absRate >= 50) return 'HIGH'; // >= 0.5%
    if (absRate >= 25) return 'MEDIUM'; // >= 0.25%
    return 'LOW'; // >= threshold but < 0.25%
  }

  /**
   * Generate human-readable description
   */
  private generateDescription(rate: FundingRate, type: 'SHORT_SQUEEZE' | 'LONG_SQUEEZE'): string {
    const absRate = Math.abs(rate.fundingRatePercentage);
    const annualized = rate.annualizedRate
      ? ` (${rate.annualizedRate.toFixed(2)}% annualized)`
      : '';

    if (type === 'SHORT_SQUEEZE') {
      return (
        `Negative funding detected: Shorts are paying ${absRate.toFixed(4)}%${annualized}. ` +
        `This indicates heavy short positioning and potential for a short squeeze. ` +
        `Consider going long or closing shorts.`
      );
    } else {
      return (
        `Positive funding detected: Longs are paying ${absRate.toFixed(4)}%${annualized}. ` +
        `This indicates heavy long positioning and potential for a long squeeze. ` +
        `Consider going short or closing longs.`
      );
    }
  }

  /**
   * Get statistics from funding rates
   */
  getStatistics(fundingRates: FundingRate[]): {
    total: number;
    negative: number;
    positive: number;
    avgRate: number;
    maxRate: number;
    minRate: number;
  } {
    if (fundingRates.length === 0) {
      return {
        total: 0,
        negative: 0,
        positive: 0,
        avgRate: 0,
        maxRate: 0,
        minRate: 0,
      };
    }

    const negative = fundingRates.filter(r => r.fundingRate < 0).length;
    const positive = fundingRates.filter(r => r.fundingRate > 0).length;
    const sum = fundingRates.reduce((acc, r) => acc + r.fundingRate, 0);
    const max = Math.max(...fundingRates.map(r => r.fundingRate));
    const min = Math.min(...fundingRates.map(r => r.fundingRate));

    return {
      total: fundingRates.length,
      negative,
      positive,
      avgRate: sum / fundingRates.length,
      maxRate: max,
      minRate: min,
    };
  }
}
