#!/usr/bin/env node

/**
 * Atlassian MCP Server Wrapper
 * Uses mcp-atlassian package for Jira and Confluence access
 * 
 * Requires environment variables:
 * - ATLASSIAN_HOST: Your Atlassian domain (e.g., your-company.atlassian.net)
 * - ATLASSIAN_EMAIL: Your email for API authentication
 * - ATLASSIAN_API_TOKEN: API token from https://id.atlassian.com/manage-profile/security/api-tokens
 */

import { spawn } from 'child_process';
import './load-env.js';

const requiredEnvVars = ['ATLASSIAN_HOST', 'ATLASSIAN_EMAIL', 'ATLASSIAN_API_TOKEN'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please set these in your .cursor/mcp.json or .env file');
  process.exit(1);
}

// Map env vars to what mcp-atlassian expects
const atlassianEnv = {
  ...process.env,
  CONFLUENCE_URL: `https://${process.env.ATLASSIAN_HOST.replace(/\/$/, '')}/wiki`,
  CONFLUENCE_USERNAME: process.env.ATLASSIAN_EMAIL,
  CONFLUENCE_API_TOKEN: process.env.ATLASSIAN_API_TOKEN,
  JIRA_URL: `https://${process.env.ATLASSIAN_HOST.replace(/\/$/, '')}`,
  JIRA_USERNAME: process.env.ATLASSIAN_EMAIL,
  JIRA_API_TOKEN: process.env.ATLASSIAN_API_TOKEN
};

// Spawn the mcp-atlassian server
const child = spawn('npx', ['-y', 'mcp-atlassian'], {
  stdio: 'inherit',
  env: atlassianEnv
});

child.on('error', (err) => {
  console.error('Failed to start Atlassian MCP server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
