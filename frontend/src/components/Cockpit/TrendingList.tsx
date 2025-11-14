import { motion } from 'framer-motion'
import { TrendingToken } from '../../types'
import { formatNumber, formatCurrency, formatPercentage } from '../../lib/utils'
import { TrendingUp } from 'lucide-react'

interface TrendingListProps {
  tokens: TrendingToken[]
}

export default function TrendingList({ tokens }: TrendingListProps) {
  if (!tokens || tokens.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-solameter-red" />
          Trending Tokens
        </h3>
        <p className="text-gray-400 text-sm">Loading trending tokens...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-solameter-red" />
        Trending Tokens
      </h3>

      <div className="space-y-3">
        {tokens.map((token, index) => (
          <motion.div
            key={token.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors border border-gray-800 hover:border-solameter-red"
          >
            <div className="flex items-center gap-3">
              <span className="text-solameter-red font-bold text-sm w-6">
                #{token.rank}
              </span>
              <div>
                <div className="font-bold text-white">{token.symbol}</div>
                <div className="text-xs text-gray-400">{token.name}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-sm text-white">
                {formatCurrency(token.priceUsd, 6)}
              </div>
              <div className="text-xs text-gray-400">
                Vol: {formatNumber(token.volume24hSol)} SOL
              </div>
            </div>

            <div className="text-right min-w-[60px]">
              <div
                className={`font-bold text-sm ${
                  token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatPercentage(token.priceChange24h)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
