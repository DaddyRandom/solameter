import express from 'express';
import { MCPRequest, MCPResponse } from '../types';
import { getCurrentGaugeData, getTrendingTokens, getBaselineInfo } from '../services/aggregator';
import config from '../config';

const mcpApp = express();
mcpApp.use(express.json());

/**
 * MCP Server - Model Context Protocol
 * Provides data access for AI agents and LLMs
 */

/**
 * GET /mcp/tools
 * List available tools
 */
mcpApp.get('/mcp/tools', (_req, res) => {
  res.json({
    tools: [
      {
        name: 'get_gauge_data',
        description: 'Get current gauge reading and trading volume',
        parameters: {},
      },
      {
        name: 'get_trending_tokens',
        description: 'Get list of trending meme coins',
        parameters: {
          limit: 'number (optional, default: 10)',
        },
      },
      {
        name: 'get_baseline_info',
        description: 'Get baseline configuration',
        parameters: {},
      },
    ],
  });
});

/**
 * POST /mcp/execute
 * Execute a tool
 */
mcpApp.post('/mcp/execute', async (req, res) => {
  const request: MCPRequest = req.body;

  try {
    let response: MCPResponse;

    switch (request.method) {
      case 'get_gauge_data': {
        const data = await getCurrentGaugeData();
        response = {
          success: true,
          data,
        };
        break;
      }

      case 'get_trending_tokens': {
        const limit = request.params?.limit || 10;
        const tokens = await getTrendingTokens(limit);
        response = {
          success: true,
          data: { tokens },
        };
        break;
      }

      case 'get_baseline_info': {
        const info = getBaselineInfo();
        response = {
          success: true,
          data: info,
        };
        break;
      }

      default:
        response = {
          success: false,
          error: `Unknown method: ${request.method}`,
        };
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /mcp/health
 * Health check for MCP server
 */
mcpApp.get('/mcp/health', (_req, res) => {
  res.json({
    status: 'ok',
    server: 'Solameter MCP Server',
    version: '1.0.0',
  });
});

/**
 * Start MCP server
 */
export function startMCPServer() {
  mcpApp.listen(config.mcpPort, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║               SOLAMETER MCP SERVER                    ║
╚═══════════════════════════════════════════════════════╝

🤖 MCP Server running on port ${config.mcpPort}
📋 Tools: http://localhost:${config.mcpPort}/mcp/tools
⚡ Execute: http://localhost:${config.mcpPort}/mcp/execute
❤️  Health: http://localhost:${config.mcpPort}/mcp/health
    `);
  });
}

export default mcpApp;
