# Solameter - Solana Funding Rate Squeeze Detector

A real-time monitoring tool that tracks funding rates across Solana perpetual markets to identify potential squeeze opportunities.

## What is Funding Rate?

In perpetual futures markets, funding rates are periodic payments between traders:

- **Negative Funding** (Shorts pay Longs): Indicates heavy short positioning → Potential **SHORT SQUEEZE** setup
- **Positive Funding** (Longs pay Shorts): Indicates heavy long positioning → Potential **LONG SQUEEZE** risk

## Features

- Real-time funding rate monitoring across multiple Solana perpetual DEXs
- Automated squeeze detection with configurable thresholds
- Multi-severity classification (LOW, MEDIUM, HIGH, EXTREME)
- Support for Discord/Slack webhooks for alerts
- Beautiful console output with statistics and analysis
- Extensible architecture for adding new exchanges

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `MONITOR_INTERVAL` | Scan interval in milliseconds | `60000` (1 minute) |
| `NEGATIVE_FUNDING_THRESHOLD` | Short squeeze threshold (bps) | `-10` (-0.1%) |
| `POSITIVE_FUNDING_THRESHOLD` | Long squeeze threshold (bps) | `10` (0.1%) |
| `ALERT_MODE` | Alert output mode | `console` |
| `WEBHOOK_URL` | Discord/Slack webhook URL | - |

### Alert Modes

- `console`: Display alerts in terminal
- `webhook`: Send to webhook URL
- `both`: Both console and webhook

## Usage

### Build the project

```bash
npm run build
```

### Start monitoring (continuous)

```bash
npm start
```

Or in development mode:

```bash
npm run monitor
```

### Single scan

```bash
npm start -- --once
```

Or:

```bash
node dist/index.js --once
```

## How It Works

### Funding Rate Detection

The detector monitors funding rates and triggers alerts when:

1. **Short Squeeze Setup**: Funding rate < -10 bps (shorts paying longs)
   - Indicates shorts are willing to pay high premiums
   - Suggests potential for upward price movement if shorts cover

2. **Long Squeeze Risk**: Funding rate > +10 bps (longs paying shorts)
   - Indicates longs are willing to pay high premiums
   - Suggests potential for downward price movement if longs liquidate

### Severity Levels

| Severity | Funding Rate (absolute) |
|----------|------------------------|
| LOW | < 0.25% (25 bps) |
| MEDIUM | 0.25% - 0.5% (25-50 bps) |
| HIGH | 0.5% - 1% (50-100 bps) |
| EXTREME | > 1% (100+ bps) |

## Example Output

```
════════════════════════════════════════════════════════════════════════════════
🔥 SOLAMETER - Solana Funding Rate Squeeze Detector 🔥
════════════════════════════════════════════════════════════════════════════════

🔍 Starting Funding Rate Monitor...
📊 Monitoring 7 markets
⏱️  Interval: 60s
📉 Negative threshold: -10 bps (short squeeze)
📈 Positive threshold: 10 bps (long squeeze)
🔔 Alert mode: console

📊 Current Funding Rates:
────────────────────────────────────────────────────────────────────────────────────────────────────────
Symbol          | Exchange   |    Rate (%) |   Rate (bps) | Annualized (%) | Status
────────────────────────────────────────────────────────────────────────────────────────────────────────
BONK-PERP       | drift      |   -0.0450   |      -45.00  |        -394.20 | 🚀🚀 HIGH SHORT SQUEEZE SETUP
SOL-PERP        | drift      |   -0.0120   |      -12.00  |        -105.12 | 🚀 SHORT SQUEEZE SETUP
BTC-PERP        | drift      |    0.0050   |        5.00  |          43.80 | ⬆️ Longs paying
ETH-PERP        | drift      |    0.0150   |       15.00  |         131.40 | ⚠️ LONG SQUEEZE RISK
────────────────────────────────────────────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════════════════════
🚀 🔥🔥 SHORT_SQUEEZE DETECTED
Market: BONK-PERP (drift)
Funding Rate: -0.0450% (-45.00 bps)
Severity: HIGH
Negative funding detected: Shorts are paying 0.0450% (-394.20% annualized).
This indicates heavy short positioning and potential for a short squeeze.
Consider going long or closing shorts.
Time: 2025-11-15T10:30:00.000Z
════════════════════════════════════════════════════════════════════════════════
```

## Supported Exchanges

- **Drift Protocol** (mainnet)
- **Mock Exchange** (for testing)

### Adding New Exchanges

Create a new fetcher in `src/fetchers/`:

```typescript
import { BaseFetcher } from './BaseFetcher';
import { FundingRate, MarketConfig } from '../types';

export class YourExchangeFetcher extends BaseFetcher {
  constructor() {
    super('your-exchange');
  }

  async fetchFundingRate(market: MarketConfig): Promise<FundingRate | null> {
    // Implement your API call here
    return {
      market: market.market,
      symbol: market.symbol,
      fundingRate: /* in basis points */,
      fundingRatePercentage: /* as decimal */,
      timestamp: Date.now(),
      exchange: this.exchange,
    };
  }
}
```

Then register it in `src/fetchers/index.ts`.

## Project Structure

```
src/
├── alerts/           # Alert management
│   └── AlertManager.ts
├── detector/         # Squeeze detection logic
│   └── SqueezeDetector.ts
├── fetchers/         # Exchange data fetchers
│   ├── BaseFetcher.ts
│   ├── DriftFetcher.ts
│   ├── MockFetcher.ts
│   └── index.ts
├── monitor/          # Main monitoring orchestration
│   └── FundingMonitor.ts
├── examples/         # Usage examples
│   └── basic-usage.ts
├── config.ts         # Configuration
├── types.ts          # TypeScript types
└── index.ts          # Entry point
```

## Trading Strategies

### Short Squeeze (Negative Funding)

When funding is negative (shorts pay longs):
- Heavy short accumulation
- Shorts are "paying rent" to maintain positions
- If price moves up, shorts may be forced to cover
- **Strategy**: Consider long positions or monitor for entry

### Long Squeeze (Positive Funding)

When funding is positive (longs pay shorts):
- Heavy long accumulation
- Longs are "paying rent" to maintain positions
- If price moves down, longs may be forced to close
- **Strategy**: Consider short positions or take profits on longs

## Risk Warning

This tool is for informational purposes only. Funding rates are one of many indicators and should not be used as the sole basis for trading decisions. Always:

- Do your own research (DYOR)
- Use proper risk management
- Never trade with money you can't afford to lose
- Consider multiple indicators and market conditions

## Development

Run in development mode:

```bash
npm run dev
```

Run example:

```bash
npx ts-node src/examples/basic-usage.ts
```

Build:

```bash
npm run build
```

## License

MIT
