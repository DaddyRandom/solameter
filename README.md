# 🏎️ Solameter - Track the Speed. Ape the Gains. Reach the Moon.

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
  [![Solana](https://img.shields.io/badge/Solana-Mainnet-green)](https://solana.com/)
</div>

---

## 🚀 What is Solameter?

Solameter is a **real-time trading activity monitor** for Solana meme coins with a stunning Formula One-inspired cockpit design set in a Simpsons-style environment.

**Features:**
- 🎯 Live trading volume tracking across DexScreener, Pump.fun
- 🏎️ F1 cockpit speedometer with realistic gauges
- 🎨 Simpsons cartoon aesthetic environment
- 👛 Solana wallet integration (Phantom, Solflare, Backpack)
- 💎 $SOLA token integration (launching on Pump.fun)
- 📊 Real-time WebSocket updates every 10 seconds
- 🎭 Crypto meme culture integration with ghostly brand logos

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## ⚡ Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/solameter.git
cd solameter
```

### 2. Environment Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your API keys

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env if needed
```

### 3. Start with Docker

```bash
# From root directory
docker-compose up -d
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **WebSocket:** ws://localhost:3001/ws/live

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **@solana/wallet-adapter** - Wallet integration
- **Three.js** - 3D graphics (optional)

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Redis** - Caching
- **WebSocket (ws)** - Real-time updates
- **Axios** - HTTP client

### APIs & Services
- **DexScreener API** - DEX trading data
- **Pump.fun API** - New token launches
- **Helius RPC** - Solana blockchain data

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Cockpit    │  │   Wallet     │  │   Token      │    │
│  │  Components  │  │  Integration │  │   Widget     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                         │                                   │
│                    WebSocket                               │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                      BACKEND API                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  WebSocket   │  │     REST     │  │     MCP      │    │
│  │   Server     │  │     API      │  │   Server     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
│         │                  │                                │
│  ┌──────┴──────────────────┴────────┐                     │
│  │      Aggregator Service          │                     │
│  └──────┬──────────┬─────────┬──────┘                     │
│         │          │         │                             │
│  ┌──────┴──┐  ┌───┴────┐  ┌─┴────────┐                   │
│  │ DexScr  │  │ Pump   │  │  Helius  │                   │
│  │ Service │  │ Service│  │  Service │                   │
│  └─────────┘  └────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  PostgreSQL  │              │    Redis     │            │
│  │  (Historical)│              │  (Cache)     │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Local Development (without Docker)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Database Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run migrations (if any)
cd backend
npm run migrate
```

---

## ⚙️ Configuration

### Backend Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/solameter

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
BIRDEYE_API_KEY=your_key_here

# App Config
BASELINE_VOLUME_SOL=1000000000  # 1 billion SOL
GAUGE_MAX=10000
UPDATE_INTERVAL_MS=10000  # 10 seconds

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001/ws/live
```

---

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## 🚀 Deployment

### Production Environment Variables

Update the following for production:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@production-db:5432/solameter
REDIS_URL=redis://production-redis:6379
CORS_ORIGIN=https://solameter.xyz
```

### Deploy to Cloud

#### Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

#### Railway/Render (Backend)

```bash
# Push to GitHub, connect to Railway/Render
# Set environment variables in dashboard
```

#### Docker Production Build

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 API Documentation

### REST Endpoints

#### GET /api/v1/current
Returns current gauge reading and volume data.

**Response:**
```json
{
  "gaugeReading": 7200,
  "volumeSol": 720000000,
  "activityLevel": "High",
  "dataQuality": 100,
  "timestamp": "2024-11-13T12:00:00Z"
}
```

#### GET /api/v1/trending
Returns top trending meme coins.

**Response:**
```json
{
  "tokens": [
    {
      "symbol": "BONK",
      "volume24hSol": 1500000,
      "priceUsd": 0.0001234,
      "priceChange24h": 25.5,
      "rank": 1
    }
  ]
}
```

#### GET /api/v1/baseline
Returns baseline calculation info.

### WebSocket Events

#### gauge_update
Sent every 10 seconds with latest data.

**Payload:**
```json
{
  "type": "gauge_update",
  "data": {
    "gaugeReading": 7200,
    "volumeSol": 720000000,
    "activityLevel": "High",
    "timestamp": "2024-11-13T12:00:00Z",
    "dataQuality": 100
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript
- Follow ESLint rules
- Write tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website:** [solameter.xyz](https://solameter.xyz)
- **Twitter:** [@SolameterSOL](https://x.com/SolameterSOL)
- **Telegram:** [t.me/solameter](https://t.me/solameter)
- **Discord:** [discord.gg/solameter](https://discord.gg/solameter)
- **Whitepaper:** [solameter.xyz/whitepaper](https://solameter.xyz/whitepaper)

---

## ⚠️ Disclaimer

This software is provided "as is" for educational and entertainment purposes. Cryptocurrency trading is risky. Only invest what you can afford to lose. This is not financial advice. DYOR (Do Your Own Research).

---

## 🙏 Acknowledgments

- Solana Foundation
- DexScreener team
- Pump.fun platform
- The entire crypto meme community

---

<div align="center">
  <strong>Built with ❤️ by degens, for degens</strong>

  <p>🏎️ Track the Speed • 🦍 Ape the Gains • 🌙 Reach the Moon</p>

  ⭐ Star us on GitHub if you like this project!
</div>
