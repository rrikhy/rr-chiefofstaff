#!/usr/bin/env node

/**
 * MCP Configuration Setup Script
 * 
 * Generates .vscode/mcp.json from .env file credentials
 * Run: npm run setup-mcp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Load .env file
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please create one from .env.example');
    console.error('   cp .env.example .env');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.startsWith('#') || !line.trim()) return;
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  });

  return env;
}

// Generate MCP config
function generateMcpConfig(env) {
  const config = {
    servers: {}
  };

  // Atlassian (Jira + Confluence)
  if (env.ATLASSIAN_HOST && env.ATLASSIAN_EMAIL && env.ATLASSIAN_API_TOKEN) {
    config.servers.atlassian = {
      command: 'node',
      args: ['mcp-servers/atlassian-server.js'],
      env: {
        ATLASSIAN_HOST: env.ATLASSIAN_HOST,
        ATLASSIAN_EMAIL: env.ATLASSIAN_EMAIL,
        ATLASSIAN_API_TOKEN: env.ATLASSIAN_API_TOKEN
      }
    };
    console.log('✅ Atlassian (Jira/Confluence) configured');
  } else {
    console.log('⏭️  Atlassian skipped (missing ATLASSIAN_HOST, ATLASSIAN_EMAIL, or ATLASSIAN_API_TOKEN)');
  }

  // Slack
  if (env.SLACK_BOT_TOKEN && env.SLACK_TEAM_ID) {
    config.servers.slack = {
      command: 'node',
      args: ['mcp-servers/slack-server.js'],
      env: {
        SLACK_BOT_TOKEN: env.SLACK_BOT_TOKEN,
        SLACK_TEAM_ID: env.SLACK_TEAM_ID
      }
    };
    console.log('✅ Slack configured');
  } else {
    console.log('⏭️  Slack skipped (missing SLACK_BOT_TOKEN or SLACK_TEAM_ID)');
  }

  // Google Calendar
  if (env.GOOGLE_CALENDAR_CREDENTIALS_PATH) {
    config.servers['google-calendar'] = {
      command: 'node',
      args: ['mcp-servers/google-calendar-server.js'],
      env: {
        GOOGLE_CALENDAR_CREDENTIALS_PATH: env.GOOGLE_CALENDAR_CREDENTIALS_PATH
      }
    };
    console.log('✅ Google Calendar configured');
  } else {
    console.log('⏭️  Google Calendar skipped (missing GOOGLE_CALENDAR_CREDENTIALS_PATH)');
  }

  // Microsoft Graph (Office 365, OneDrive)
  if (env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET && env.MICROSOFT_TENANT_ID) {
    config.servers['microsoft-graph'] = {
      command: 'node',
      args: ['mcp-servers/microsoft-graph-server.js'],
      env: {
        MICROSOFT_CLIENT_ID: env.MICROSOFT_CLIENT_ID,
        MICROSOFT_CLIENT_SECRET: env.MICROSOFT_CLIENT_SECRET,
        MICROSOFT_TENANT_ID: env.MICROSOFT_TENANT_ID,
        MICROSOFT_REDIRECT_URI: env.MICROSOFT_REDIRECT_URI || 'http://localhost:3000/auth/callback'
      }
    };
    console.log('✅ Microsoft Graph (Office 365/OneDrive) configured');
  } else {
    console.log('⏭️  Microsoft Graph skipped (missing MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, or MICROSOFT_TENANT_ID)');
  }

  // Gong
  if (env.GONG_API_KEY && env.GONG_API_SECRET) {
    config.servers.gong = {
      command: 'node',
      args: ['mcp-servers/gong-server.js'],
      env: {
        GONG_API_KEY: env.GONG_API_KEY,
        GONG_API_SECRET: env.GONG_API_SECRET
      }
    };
    console.log('✅ Gong configured');
  } else {
    console.log('⏭️  Gong skipped (missing GONG_API_KEY or GONG_API_SECRET)');
  }

  // Filesystem (always enabled)
  config.servers.filesystem = {
    command: 'node',
    args: ['mcp-servers/filesystem-server.js'],
    env: {
      FILESYSTEM_ROOT_PATH: env.FILESYSTEM_ROOT_PATH || ROOT_DIR
    }
  };
  console.log('✅ Filesystem configured');

  return config;
}

// Main
function main() {
  console.log('\n🔧 MCP Configuration Setup\n');
  console.log('Reading credentials from .env...\n');

  const env = loadEnv();
  const config = generateMcpConfig(env);

  // Ensure .vscode directory exists
  const vscodeDir = path.join(ROOT_DIR, '.vscode');
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  // Write config
  const configPath = path.join(vscodeDir, 'mcp.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const serverCount = Object.keys(config.servers).length;
  console.log(`\n✨ Generated .vscode/mcp.json with ${serverCount} server(s)`);
  console.log('\nNext steps:');
  console.log('1. Restart VS Code or reload the window');
  console.log('2. GitHub Copilot will automatically detect the MCP servers');
  console.log('3. Run "npm run test-mcp" to verify connections\n');
}

main();
