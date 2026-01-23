#!/usr/bin/env node

/**
 * Google Calendar MCP Server Wrapper
 * Wrapper for @modelcontextprotocol/server-google-calendar
 * Provides access to Google Calendar events and scheduling
 * 
 * Requires environment variables:
 * - GOOGLE_CALENDAR_CREDENTIALS_PATH: Path to Google OAuth credentials JSON file
 * 
 * Setup:
 * 1. Go to Google Cloud Console
 * 2. Create OAuth 2.0 credentials
 * 3. Download JSON and save to a secure location
 * 4. Set the path in GOOGLE_CALENDAR_CREDENTIALS_PATH
 */

import { spawn } from 'child_process';

const requiredEnvVars = ['GOOGLE_CALENDAR_CREDENTIALS_PATH'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please set these in your .cursor/mcp.json or .env file');
  process.exit(1);
}

// Spawn the official MCP server
const child = spawn('npx', ['-y', '@modelcontextprotocol/server-google-calendar'], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('Failed to start Google Calendar MCP server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
