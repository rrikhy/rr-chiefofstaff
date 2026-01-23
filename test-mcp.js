#!/usr/bin/env node

/**
 * MCP Connection Test Script
 * Tests connectivity to MCP servers and lists available tools
 */

import 'dotenv/config';
import { MCPClientManager } from './src/mcp-client.js';

async function testMCPConnection() {
  console.log('='.repeat(80));
  console.log('MCP CONNECTION TEST');
  console.log('='.repeat(80));
  console.log('');

  const client = new MCPClientManager();

  try {
    console.log('Initializing MCP client...\n');
    await client.initialize();

    console.log('\n' + '='.repeat(80));
    console.log('AVAILABLE TOOLS');
    console.log('='.repeat(80));
    console.log('');

    const tools = client.getAvailableTools();

    if (tools.length === 0) {
      console.log('⚠ No MCP tools found!');
      console.log('\nPossible reasons:');
      console.log('1. No MCP config found in Cursor settings or workspace');
      console.log('2. No MCP servers configured');
      console.log('3. MCP servers failed to connect');
      console.log('\nTo configure MCP servers:');
      console.log('  - Create .cursor/mcp.json from .cursor/mcp.json.example');
      console.log('  - Or add mcp.servers to Cursor settings.json');
      console.log('  - Or configure in Claude Desktop (legacy)');
    } else {
      // Group tools by server
      const toolsByServer = {};
      tools.forEach(tool => {
        if (!toolsByServer[tool.server]) {
          toolsByServer[tool.server] = [];
        }
        toolsByServer[tool.server].push(tool);
      });

      Object.entries(toolsByServer).forEach(([server, serverTools]) => {
        console.log(`\n📦 ${server}`);
        console.log('-'.repeat(40));
        serverTools.forEach(tool => {
          console.log(`  • ${tool.name}`);
          if (tool.schema.description) {
            console.log(`    ${tool.schema.description}`);
          }
        });
      });

      console.log('\n' + '='.repeat(80));
      console.log(`✓ Total: ${tools.length} tools from ${Object.keys(toolsByServer).length} servers`);
      console.log('='.repeat(80));
    }

    await client.close();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

testMCPConnection();
