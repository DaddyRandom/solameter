import { motion } from 'framer-motion'

interface DataGaugeProps {
  label: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export default function DataGauge({ label, value, unit, icon, trend }: DataGaugeProps) {
  const getTrendColor = () => {
    if (!trend) return 'text-gray-400'
    switch (trend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getTrendIcon = () => {
    if (!trend || trend === 'neutral') return null
    return trend === 'up' ? '↑' : '↓'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 rounded-lg p-4 hover:border-solameter-red transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-white font-mono"
        >
          {value}
        </motion.span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
        {getTrendIcon() && (
          <span className={`text-lg ml-auto ${getTrendColor()}`}>
            {getTrendIcon()}
          </span>
        )}
      </div>
    </motion.div>
  )
}
