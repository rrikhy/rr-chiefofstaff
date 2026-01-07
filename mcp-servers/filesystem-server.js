#!/usr/bin/env node

/**
 * Filesystem MCP Server Wrapper
 * Wrapper for @modelcontextprotocol/server-filesystem
 * Provides access to local filesystem for reading/writing files
 * 
 * Requires environment variables:
 * - FILESYSTEM_ROOT_PATH: Root directory the server can access (default: current directory)
 * 
 * Security Note: The server only has access to the specified root directory and subdirectories.
 */

import { spawn } from 'child_process';
import { resolve } from 'path';

const rootPath = process.env.FILESYSTEM_ROOT_PATH || process.cwd();
const resolvedPath = resolve(rootPath);

console.error(`Filesystem MCP server starting with root: ${resolvedPath}`);

// Spawn the official MCP server
const child = spawn('npx', ['-y', '@modelcontextprotocol/server-filesystem', resolvedPath], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('Failed to start Filesystem MCP server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
