#!/usr/bin/env node

/**
 * Salesforce MCP Server Wrapper
 * Uses @salesforce/mcp package for Salesforce CRM and platform access
 * 
 * This wraps the official Salesforce MCP server from:
 * https://github.com/salesforcecli/mcp
 * 
 * Prerequisites:
 * 1. Salesforce CLI (sf) must be installed: npm install -g @salesforce/cli
 * 2. You must authenticate to your Salesforce org: sf org login web -a myorg
 * 3. Set the target org alias in SALESFORCE_TARGET_ORG environment variable
 * 
 * Available toolsets (configurable via SALESFORCE_TOOLSETS):
 * - core: Basic org tools (query, search, deploy, retrieve, etc.)
 * - metadata: Metadata operations
 * - apex: Apex code execution and debugging
 * - lwc: Lightning Web Components tools
 * - mobile-core: Mobile development tools
 * - mobile-offline: Mobile offline support
 * - lwc-experts: LWC development guidance
 * - aura-experts: Aura to LWC migration
 * - code-analysis: Static code analysis
 * - scale-products: Performance analysis
 * 
 * Environment Variables:
 * - SALESFORCE_TARGET_ORG: (Required) Alias or username of authenticated Salesforce org
 * - SALESFORCE_TOOLSETS: (Optional) Comma-separated list of toolsets to enable
 *                        Defaults to: core,metadata,apex
 * - SALESFORCE_INSTANCE_URL: (Optional) Override the instance URL
 */

import { spawn } from 'child_process';
import { execSync } from 'child_process';

// Check if Salesforce CLI is installed
function checkSfCliInstalled() {
  try {
    execSync('sf --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Check if we have authenticated orgs
function checkAuthenticatedOrgs() {
  try {
    const result = execSync('sf org list --json', { stdio: 'pipe' });
    const orgs = JSON.parse(result.toString());
    return orgs.result && (
      (orgs.result.nonScratchOrgs && orgs.result.nonScratchOrgs.length > 0) ||
      (orgs.result.scratchOrgs && orgs.result.scratchOrgs.length > 0)
    );
  } catch {
    return false;
  }
}

// Get default org if SALESFORCE_TARGET_ORG not set
function getDefaultOrg() {
  try {
    const result = execSync('sf config get target-org --json', { stdio: 'pipe' });
    const config = JSON.parse(result.toString());
    if (config.result && config.result[0] && config.result[0].value) {
      return config.result[0].value;
    }
  } catch {
    // No default org set
  }
  return null;
}

// Main startup check
if (!checkSfCliInstalled()) {
  console.error('❌ Salesforce CLI (sf) is not installed.');
  console.error('');
  console.error('Install it with:');
  console.error('  npm install -g @salesforce/cli');
  console.error('');
  console.error('Then authenticate to your org:');
  console.error('  sf org login web -a myorg');
  process.exit(1);
}

if (!checkAuthenticatedOrgs()) {
  console.error('❌ No authenticated Salesforce orgs found.');
  console.error('');
  console.error('Authenticate to your org first:');
  console.error('  sf org login web -a myorg  (for production/dev orgs)');
  console.error('  sf org login web -a myorg -r https://test.salesforce.com  (for sandboxes)');
  process.exit(1);
}

// Determine target org
let targetOrg = process.env.SALESFORCE_TARGET_ORG || getDefaultOrg();

if (!targetOrg) {
  console.error('❌ No target org specified and no default org set.');
  console.error('');
  console.error('Either:');
  console.error('  1. Set SALESFORCE_TARGET_ORG environment variable');
  console.error('  2. Or set a default org: sf config set target-org myorg');
  process.exit(1);
}

// Parse toolsets
const defaultToolsets = ['core', 'metadata', 'apex'];
const toolsets = process.env.SALESFORCE_TOOLSETS
  ? process.env.SALESFORCE_TOOLSETS.split(',').map(t => t.trim())
  : defaultToolsets;

// Build arguments for the MCP server
const args = ['-y', '@salesforce/mcp@latest'];

// Add target org
args.push('--target-org', targetOrg);

// Add toolsets if specified
if (toolsets.length > 0) {
  args.push('--toolsets', toolsets.join(','));
}

// Add instance URL if specified
if (process.env.SALESFORCE_INSTANCE_URL) {
  args.push('--instance-url', process.env.SALESFORCE_INSTANCE_URL);
}

console.error(`🚀 Starting Salesforce MCP Server`);
console.error(`   Target Org: ${targetOrg}`);
console.error(`   Toolsets: ${toolsets.join(', ')}`);
console.error('');

// Spawn the Salesforce MCP server
const child = spawn('npx', args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Pass through any additional SF environment variables
    SF_TARGET_ORG: targetOrg,
  }
});

child.on('error', (err) => {
  console.error('Failed to start Salesforce MCP server:', err);
  console.error('');
  console.error('Make sure @salesforce/mcp is accessible:');
  console.error('  npx @salesforce/mcp --help');
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
