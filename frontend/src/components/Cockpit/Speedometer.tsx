import { motion } from 'framer-motion'
import { GaugeData } from '../../types'

interface SpeedometerProps {
  data: GaugeData
}

export default function Speedometer({ data }: SpeedometerProps) {
  const { gaugeReading, activityLevel } = data
  const maxGauge = 10000
  const percentage = (gaugeReading / maxGauge) * 100
  const rotation = (percentage / 100) * 180 - 90 // -90 to 90 degrees

  const getColorByActivity = () => {
    switch (activityLevel) {
      case 'Extreme': return 'text-red-500'
      case 'High': return 'text-orange-500'
      case 'Medium': return 'text-yellow-500'
      default: return 'text-green-500'
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Speedometer Circle */}
      <div className="relative aspect-square w-full">
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-800 bg-black shadow-2xl">
          {/* Inner gradient */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-black"></div>
        </div>

        {/* Gauge Arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background arc */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#1F2937"
            strokeWidth="8"
            strokeDasharray="110 220"
          />
          {/* Active arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#FF0000"
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 110} 220`}
            strokeLinecap="round"
            className="transition-all duration-1000 filter drop-shadow-[0_0_10px_#FF0000]"
            initial={{ strokeDasharray: '0 220' }}
            animate={{ strokeDasharray: `${(percentage / 100) * 110} 220` }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className={`text-5xl font-bold ${getColorByActivity()} text-glow`}>
              {gaugeReading.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">RPM</div>
            <div className={`text-sm font-semibold mt-2 ${getColorByActivity()}`}>
              {activityLevel}
            </div>
          </motion.div>
        </div>

        {/* Needle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        >
          <div className="h-1/2 w-1 bg-gradient-to-t from-solameter-red to-white origin-bottom transform -translate-y-1/2 rounded-full shadow-lg"></div>
          <div className="absolute w-4 h-4 bg-solameter-red rounded-full border-2 border-white shadow-lg"></div>
        </motion.div>

        {/* Tick Marks */}
        {[...Array(9)].map((_, i) => {
          const angle = -90 + (i * 180) / 8
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="h-1/2 w-0.5 bg-gray-600 origin-bottom transform -translate-y-1/2"></div>
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        <span className="text-xs text-gray-500">0</span>
        <span className="text-xs text-gray-500">{maxGauge.toLocaleString()}</span>
      </div>
    </div>
  )
}
