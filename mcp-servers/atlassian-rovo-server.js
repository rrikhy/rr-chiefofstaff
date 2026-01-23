#!/usr/bin/env node

/**
 * Atlassian Rovo MCP Server (OAuth)
 *
 * Connects to the official Atlassian-hosted MCP endpoint via the `mcp-remote` proxy,
 * which handles OAuth in a browser and bridges the remote SSE server to stdio.
 *
 * Optional environment variables:
 * - ATLASSIAN_MCP_URL: Remote MCP SSE URL (default: https://mcp.atlassian.com/v1/sse)
 */

import { spawn } from 'child_process';
import { createRequire } from 'module';
import './load-env.js';

const atlassianMcpUrl = process.env.ATLASSIAN_MCP_URL || 'https://mcp.atlassian.com/v1/sse';

const require = createRequire(import.meta.url);
const proxyPath = require.resolve('mcp-remote/dist/proxy.js');

const child = spawn(process.execPath, [proxyPath, atlassianMcpUrl], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('Failed to start Atlassian Rovo MCP proxy (mcp-remote):', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

