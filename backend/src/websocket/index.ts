import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketMessage } from '../types';
import { getCurrentGaugeData, getTrendingTokens } from '../services/aggregator';
import config from '../config';

let wss: WebSocketServer;
let updateInterval: NodeJS.Timeout;

/**
 * Initialize WebSocket server
 */
export function initWebSocketServer(httpServer: HTTPServer) {
  wss = new WebSocketServer({
    server: httpServer,
    path: '/ws/live',
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('✅ New WebSocket client connected');

    // Send welcome message
    const welcomeMessage: WebSocketMessage = {
      type: 'connection',
      data: {
        message: 'Connected to Solameter live feed',
        updateInterval: config.updateIntervalMs,
      },
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(welcomeMessage));

    // Send initial data immediately
    sendGaugeUpdate(ws);

    // Handle client messages
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message from client:', data);

        // Handle different message types
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Start periodic updates
  startPeriodicUpdates();

  console.log('🔌 WebSocket server initialized on /ws/live');
}

/**
 * Send gauge update to a specific client or all clients
 */
async function sendGaugeUpdate(client?: WebSocket) {
  try {
    const [gaugeData, trendingTokens] = await Promise.all([
      getCurrentGaugeData(),
      getTrendingTokens(5),
    ]);

    const message: WebSocketMessage = {
      type: 'gauge_update',
      data: {
        ...gaugeData,
        trending: trendingTokens,
      },
      timestamp: new Date().toISOString(),
    };

    const messageString = JSON.stringify(message);

    if (client && client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    } else {
      // Broadcast to all connected clients
      broadcastMessage(messageString);
    }
  } catch (error) {
    console.error('Error sending gauge update:', error);
  }
}

/**
 * Broadcast message to all connected clients
 */
function broadcastMessage(message: string) {
  if (!wss) return;

  let sentCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      sentCount++;
    }
  });

  if (sentCount > 0) {
    console.log(`📡 Broadcast to ${sentCount} client(s)`);
  }
}

/**
 * Start periodic updates to all clients
 */
function startPeriodicUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(async () => {
    await sendGaugeUpdate();
  }, config.updateIntervalMs);

  console.log(`⏱️  Periodic updates started (every ${config.updateIntervalMs}ms)`);
}

/**
 * Stop periodic updates
 */
export function stopPeriodicUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    console.log('⏱️  Periodic updates stopped');
  }
}

/**
 * Get WebSocket server instance
 */
export function getWebSocketServer(): WebSocketServer | null {
  return wss || null;
}
