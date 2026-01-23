#!/usr/bin/env node

/**
 * MCP Configuration Setup Script
 * 
 * Generates .cursor/mcp.json from .env file credentials
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

  // Atlassian Rovo - uses mcp-remote bridge to handle OAuth
  // The mcp-remote tool opens a browser for authentication and proxies the connection
  config.servers['atlassian'] = {
    command: 'npx',
    args: ['-y', 'mcp-remote', 'https://mcp.atlassian.com/v1/sse']
  };
  console.log('✅ Atlassian Rovo (via mcp-remote bridge) configured');

  // Slack - temporarily disabled
  // if (env.SLACK_BOT_TOKEN && env.SLACK_TEAM_ID) {
  //   config.servers.slack = {
  //     command: 'node',
  //     args: ['mcp-servers/slack-server.js'],
  //     env: {
  //       SLACK_BOT_TOKEN: env.SLACK_BOT_TOKEN,
  //       SLACK_TEAM_ID: env.SLACK_TEAM_ID
  //     }
  //   };
  //   console.log('✅ Slack configured');
  // } else {
  //   console.log('⏭️  Slack skipped (missing SLACK_BOT_TOKEN or SLACK_TEAM_ID)');
  // }
  console.log('⏭️  Slack disabled (temporarily)');

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
  const gongKey = env.GONG_ACCESS_KEY || env.GONG_API_KEY;
  const gongSecret = env.GONG_ACCESS_KEY_SECRET || env.GONG_API_SECRET;
  if (gongKey && gongSecret) {
    config.servers.gong = {
      command: 'node',
      args: ['mcp-servers/gong-server.js'],
      env: {
        // Prefer the newer ACCESS_KEY naming, but support API_KEY aliases.
        GONG_ACCESS_KEY: gongKey,
        GONG_ACCESS_KEY_SECRET: gongSecret,
        ...(env.GONG_BASE_URL ? { GONG_BASE_URL: env.GONG_BASE_URL } : {})
      }
    };
    console.log('✅ Gong configured');
  } else {
    console.log('⏭️  Gong skipped (missing GONG_ACCESS_KEY/GONG_API_KEY or GONG_ACCESS_KEY_SECRET/GONG_API_SECRET)');
  }

  // Filesystem - project directory (always enabled)
  config.servers.filesystem = {
    command: 'node',
    args: ['mcp-servers/filesystem-server.js'],
    env: {
      FILESYSTEM_ROOT_PATH: env.FILESYSTEM_ROOT_PATH || ROOT_DIR
    }
  };
  console.log('✅ Filesystem (project) configured');

  // OneDrive / SharePoint - auto-detect CloudStorage folders
  const cloudStoragePath = path.join(process.env.HOME, 'Library/CloudStorage');
  if (fs.existsSync(cloudStoragePath)) {
    const cloudFolders = fs.readdirSync(cloudStoragePath)
      .filter(f => !f.startsWith('.') && fs.statSync(path.join(cloudStoragePath, f)).isDirectory());
    
    if (cloudFolders.length > 0) {
      // Add each cloud folder as a separate server for clarity
      cloudFolders.forEach((folder, index) => {
        const serverName = index === 0 ? 'onedrive' : `cloud-storage-${index + 1}`;
        config.servers[serverName] = {
          command: 'node',
          args: ['mcp-servers/filesystem-server.js'],
          env: {
            FILESYSTEM_ROOT_PATH: path.join(cloudStoragePath, folder)
          }
        };
        console.log(`✅ ${folder} (OneDrive/SharePoint) configured`);
      });
    }
  }

  return config;
}

// Main
function main() {
  console.log('\n🔧 MCP Configuration Setup\n');
  console.log('Reading credentials from .env...\n');

  const env = loadEnv();
  const config = generateMcpConfig(env);

  // Ensure .cursor directory exists
  const cursorDir = path.join(ROOT_DIR, '.cursor');
  if (!fs.existsSync(cursorDir)) {
    fs.mkdirSync(cursorDir, { recursive: true });
  }

  // Write config
  const configPath = path.join(cursorDir, 'mcp.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const serverCount = Object.keys(config.servers).length;
  console.log(`\n✨ Generated .cursor/mcp.json with ${serverCount} server(s)`);
  console.log('\nNext steps:');
  console.log('1. Restart Cursor or reload the window');
  console.log('2. Cursor will automatically detect the MCP servers');
  console.log('3. Run "npm run test-mcp" to verify connections\n');
}

main();
