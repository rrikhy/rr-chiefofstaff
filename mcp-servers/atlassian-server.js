#!/usr/bin/env node

/**
 * Atlassian MCP Server Wrapper
 * Wrapper for @modelcontextprotocol/server-atlassian
 * Provides access to Jira and Confluence via Okta SSO
 * 
 * Requires environment variables:
 * - ATLASSIAN_HOST: Your Atlassian domain (e.g., your-company.atlassian.net)
 * - ATLASSIAN_EMAIL: Your email for API authentication
 * - ATLASSIAN_API_TOKEN: API token from https://id.atlassian.com/manage-profile/security/api-tokens
 */

import { spawn } from 'child_process';

const requiredEnvVars = ['ATLASSIAN_HOST', 'ATLASSIAN_EMAIL', 'ATLASSIAN_API_TOKEN'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please set these in your .vscode/mcp.json or .env file');
  process.exit(1);
}

// Spawn the official MCP server
const child = spawn('npx', ['-y', '@modelcontextprotocol/server-atlassian'], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('Failed to start Atlassian MCP server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
