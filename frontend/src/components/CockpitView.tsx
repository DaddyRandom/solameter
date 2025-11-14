import { useWebSocket } from '../hooks/useWebSocket'
import Speedometer from './Cockpit/Speedometer'
import DataGauge from './Cockpit/DataGauge'
import TrendingList from './Cockpit/TrendingList'
import WalletButton from './Wallet/WalletButton'
import PumpFunWidget from './Token/PumpFunWidget'
import SocialLinks from './Social/SocialLinks'
import { formatNumber } from '../lib/utils'
import { Activity, Zap, Database } from 'lucide-react'

export default function CockpitView() {
  const { gaugeData, isConnected, error } = useWebSocket()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏎️</span>
            <div>
              <h1 className="text-2xl font-bold font-racing text-solameter-red text-glow">
                SOLAMETER
              </h1>
              <p className="text-xs text-gray-400">Track. Ape. Moon.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-xs text-gray-400">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Speedometer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 rounded-lg p-8">
              {gaugeData ? (
                <Speedometer data={gaugeData} />
              ) : (
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-gray-400">Loading gauge data...</div>
                </div>
              )}
            </div>

            {/* Data Gauges Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <DataGauge
                label="Volume"
                value={gaugeData ? formatNumber(gaugeData.volumeSol) : '---'}
                unit="SOL"
                icon={<Activity className="w-4 h-4" />}
              />
              <DataGauge
                label="Activity"
                value={gaugeData?.activityLevel || '---'}
                icon={<Zap className="w-4 h-4" />}
              />
              <DataGauge
                label="Data Quality"
                value={gaugeData?.dataQuality || '---'}
                unit="%"
                icon={<Database className="w-4 h-4" />}
              />
            </div>

            {/* Trending Tokens */}
            <TrendingList tokens={gaugeData?.trending || []} />
          </div>

          {/* Right Column - Widgets */}
          <div className="space-y-6">
            <PumpFunWidget />
            <SocialLinks />

            {/* Info Box */}
            <div className="bg-gradient-to-br from-solameter-red/10 to-transparent border-2 border-solameter-red/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                What is Solameter?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                A real-time trading activity monitor for Solana meme coins with
                an F1-inspired cockpit design. Track market speed, ape into
                gains, reach the moon! 🚀
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>
            Built with ❤️ by degens, for degens | Not financial advice | DYOR
          </p>
        </div>
      </footer>
    </div>
  )
}
