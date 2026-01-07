#!/usr/bin/env node

/**
 * Microsoft Graph MCP Server Wrapper
 * Wrapper for @modelcontextprotocol/server-microsoft-graph
 * Provides access to Office 365, OneDrive, Calendar, and Teams
 * 
 * Requires environment variables:
 * - MICROSOFT_CLIENT_ID: Azure AD application client ID
 * - MICROSOFT_CLIENT_SECRET: Azure AD application client secret
 * - MICROSOFT_TENANT_ID: Azure AD tenant ID
 * - MICROSOFT_REDIRECT_URI: OAuth redirect URI (e.g., http://localhost:3000/auth/callback)
 * 
 * Azure AD App needs these API permissions (delegated):
 * - Calendars.Read, Calendars.ReadWrite
 * - Files.Read, Files.ReadWrite
 * - Mail.Read
 * - User.Read
 */

import { spawn } from 'child_process';

const requiredEnvVars = ['MICROSOFT_CLIENT_ID', 'MICROSOFT_CLIENT_SECRET', 'MICROSOFT_TENANT_ID'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please set these in your .vscode/mcp.json or .env file');
  process.exit(1);
}

// Spawn the official MCP server
const child = spawn('npx', ['-y', '@modelcontextprotocol/server-microsoft-graph'], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('Failed to start Microsoft Graph MCP server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
