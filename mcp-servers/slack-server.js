#!/usr/bin/env node

/**
 * Slack MCP Server Wrapper
 * Wrapper for @modelcontextprotocol/server-slack
 * Provides access to Slack channels, messages, and threads
 * 
 * Requires environment variables:
 * - SLACK_BOT_TOKEN: Bot token starting with xoxb-
 * - SLACK_TEAM_ID: Your Slack workspace team ID
 * 
 * Bot needs these OAuth scopes:
 * - channels:history, channels:read
 * - groups:history, groups:read
 * - im:history, im:read
 * - mpim:history, mpim:read
 * - users:read
 * - chat:write (for posting messages)
 */

import { spawn } from 'child_process';

const requiredEnvVars = ['SLACK_BOT_TOKEN', 'SLACK_TEAM_ID'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please set these in your .vscode/mcp.json or .env file');
  process.exit(1);
}

// Spawn the official MCP server
const child = spawn('npx', ['-y', '@modelcontextprotocol/server-slack'], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('Failed to start Slack MCP server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
