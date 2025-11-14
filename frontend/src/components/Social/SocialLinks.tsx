import { motion } from 'framer-motion'
import { Twitter, Send, MessageCircle, FileText } from 'lucide-react'

const socialLinks = [
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://x.com/SolameterSOL',
    color: 'hover:bg-blue-500/20 hover:border-blue-500',
  },
  {
    name: 'Telegram',
    icon: Send,
    url: 'https://t.me/solameter',
    color: 'hover:bg-sky-500/20 hover:border-sky-500',
  },
  {
    name: 'Discord',
    icon: MessageCircle,
    url: 'https://discord.gg/solameter',
    color: 'hover:bg-indigo-500/20 hover:border-indigo-500',
  },
  {
    name: 'Whitepaper',
    icon: FileText,
    url: '/whitepaper',
    color: 'hover:bg-solameter-red/20 hover:border-solameter-red',
  },
]

export default function SocialLinks() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">Join the Community</h3>

      <div className="grid grid-cols-2 gap-3">
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col items-center gap-2 p-4 bg-black/30 border border-gray-800 rounded-lg transition-all ${link.color}`}
          >
            <link.icon className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-300">{link.name}</span>
          </motion.a>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-200/80 text-center">
          🎁 Early supporters get exclusive perks!
        </p>
      </div>
    </div>
  )
}
