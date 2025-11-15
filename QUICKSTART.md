# Quick Start Guide

Get up and running with Solameter in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure (Optional)

For basic testing, you can skip this step. For production use:

```bash
cp .env.example .env
nano .env  # Edit configuration
```

## Step 3: Try It Out

### Test with Mock Data

The quickest way to see it in action:

```bash
npm run dev
```

This will use mock data to simulate funding rates.

### Single Scan

Run once and exit:

```bash
npm run dev -- --once
```

### Production Build

```bash
npm run build
npm start
```

## What You'll See

The monitor will display:

1. **Current Funding Rates Table** - All monitored markets with their rates
2. **Statistics** - Overview of market conditions
3. **Squeeze Alerts** - When extreme funding is detected

## Understanding the Output

### Funding Rate Status Indicators

- 🚀🚀🚀 **EXTREME SHORT SQUEEZE SETUP** - Very negative funding (< -50 bps)
- 🚀🚀 **HIGH SHORT SQUEEZE SETUP** - High negative funding (-50 to -25 bps)
- 🚀 **SHORT SQUEEZE SETUP** - Moderate negative funding (-25 to -10 bps)
- ⬇️ **Shorts paying** - Slight negative funding (0 to -10 bps)
- ➖ **Neutral** - Zero funding
- ⬆️ **Longs paying** - Slight positive funding (0 to +10 bps)
- ⚠️ **LONG SQUEEZE RISK** - Moderate positive funding (+10 to +25 bps)
- ⚠️⚠️ **HIGH LONG SQUEEZE RISK** - High positive funding (+25 to +50 bps)
- ⚠️⚠️⚠️ **EXTREME LONG SQUEEZE RISK** - Very positive funding (> +50 bps)

## Next Steps

### Connect to Real Data

Edit `src/config.ts` to use real exchanges instead of mock:

```typescript
export const MARKETS_TO_MONITOR: MarketConfig[] = [
  { symbol: 'SOL-PERP', market: 'SOL-PERP', exchange: 'drift' },
  { symbol: 'BTC-PERP', market: 'BTC-PERP', exchange: 'drift' },
  // Add more markets...
];
```

### Set Up Discord Alerts

1. Create a Discord webhook in your server
2. Add to `.env`:
   ```
   ALERT_MODE=both
   WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
   ```

### Customize Thresholds

Adjust sensitivity in `.env`:

```
# More sensitive (trigger on smaller rates)
NEGATIVE_FUNDING_THRESHOLD=-5
POSITIVE_FUNDING_THRESHOLD=5

# Less sensitive (only extreme rates)
NEGATIVE_FUNDING_THRESHOLD=-25
POSITIVE_FUNDING_THRESHOLD=25
```

## Troubleshooting

### No data showing?

- Check your internet connection
- Verify RPC URL in `.env`
- Try using mock exchange first

### Want to add more markets?

Edit `src/config.ts` and add to `MARKETS_TO_MONITOR` array.

### Need help?

Check the main README.md for detailed documentation.

## Example Run

```
═══════════════════════════════════════════════════════════════════════════════
🔥 SOLAMETER - Solana Funding Rate Squeeze Detector 🔥
═══════════════════════════════════════════════════════════════════════════════

🔍 Starting Funding Rate Monitor...
📊 Monitoring 7 markets
⏱️  Interval: 60s
📉 Negative threshold: -10 bps (short squeeze)
📈 Positive threshold: 10 bps (long squeeze)
🔔 Alert mode: console

📊 Current Funding Rates:
────────────────────────────────────────────────────────────────────────────────
BONK-PERP       | mock       |   -0.0450   |   -45.00 | 🚀🚀 HIGH SHORT SQUEEZE
SOL-PERP        | mock       |   -0.0120   |   -12.00 | 🚀 SHORT SQUEEZE SETUP
BTC-PERP        | mock       |    0.0080   |     8.00 | ⬆️ Longs paying
────────────────────────────────────────────────────────────────────────────────

📊 Statistics:
  Total markets: 3
  Negative funding: 2
  Positive funding: 1
  Average rate: -16.33 bps (-0.1633%)

════════════════════════════════════════════════════════════════════════════════
🚀 🔥🔥 SHORT_SQUEEZE DETECTED
Market: BONK-PERP (mock)
Funding Rate: -0.0450% (-45.00 bps)
Severity: HIGH
════════════════════════════════════════════════════════════════════════════════
```

Happy trading! Remember: Always DYOR and manage your risk! 🚀
