import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import config from './config';
import apiRouter from './routes';
import { initWebSocketServer } from './websocket';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(compression());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Solameter API',
    version: '1.0.0',
    description: 'Real-time trading activity monitor for Solana meme coins',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      websocket: 'ws://localhost:' + config.port + '/ws/live',
    },
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Initialize WebSocket server
initWebSocketServer(httpServer);

// Start server
httpServer.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                   SOLAMETER API                       ║
╚═══════════════════════════════════════════════════════╝

🏎️  Server running on port ${config.port}
🌐 Environment: ${config.nodeEnv}
🔌 WebSocket: ws://localhost:${config.port}/ws/live
📊 API: http://localhost:${config.port}/api/v1
❤️  Health: http://localhost:${config.port}/health

Track the Speed. Ape the Gains. Reach the Moon. 🚀
  `);
});

export default app;
