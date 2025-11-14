import { motion } from 'framer-motion'
import { Rocket, ExternalLink } from 'lucide-react'

export default function PumpFunWidget() {
  const PUMP_FUN_URL = 'https://pump.fun' // Update with actual token address when launched
  const TOKEN_ADDRESS = 'COMING_SOON' // Update after launch

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-solameter-red/20 to-transparent border-2 border-solameter-red rounded-lg p-6 box-glow"
    >
      <div className="flex items-center gap-3 mb-4">
        <Rocket className="w-8 h-8 text-solameter-red" />
        <div>
          <h3 className="text-xl font-bold text-white">$SOLA Token</h3>
          <p className="text-xs text-gray-400">Launching on Pump.fun</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Total Supply</div>
          <div className="text-lg font-bold text-white font-mono">
            1,000,000,000 $SOLA
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Contract Address</div>
          <div className="text-xs font-mono text-white break-all">
            {TOKEN_ADDRESS}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Team Allocation</span>
            <span className="text-white font-bold">0%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Fair Launch</span>
            <span className="text-green-500 font-bold">✓ Yes</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Liquidity</span>
            <span className="text-green-500 font-bold">🔒 Locked</span>
          </div>
        </div>

        <a
          href={PUMP_FUN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-solameter-red hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all mt-4"
        >
          <span>Buy on Pump.fun</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <p className="text-xs text-gray-400 text-center">
          Not financial advice. DYOR.
        </p>
      </div>
    </motion.div>
  )
}
