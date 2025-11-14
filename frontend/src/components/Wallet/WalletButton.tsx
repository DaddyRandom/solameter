import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Wallet } from 'lucide-react'

export default function WalletButton() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="relative">
      {connected && publicKey ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500 rounded-lg">
          <Wallet className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-400 font-mono">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      ) : null}

      <WalletMultiButton className="!bg-solameter-red hover:!bg-red-700 !text-white !font-bold !rounded-lg !px-6 !py-2 !transition-all" />
    </div>
  )
}
