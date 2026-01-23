#!/usr/bin/env node

import 'dotenv/config';
import { MCPClientManager } from './mcp-client.js';
import { AgentRunner } from './agent-runner.js';
import { ReportGenerator } from './report-generator.js';
import { ConfigManager, validateEnvironment } from './config/config-manager.js';
import { parseCliArguments, displayHelp, logParsedArguments, validateAgentRequirements } from './utils/cli-parser.js';
import { AGENT_EXECUTION } from './utils/constants.js';

/**
 * Master Chief of Staff Agent
 * Orchestrates multiple specialized agents to provide weekly product director insights
 */
class ChiefOfStaffAgent {
  constructor(dateRange = null, agentParams = {}) {
    this.mcpClient = null;
    this.configManager = new ConfigManager();
    this.config = null;
    this.agentRunner = null;
    this.reportGenerator = new ReportGenerator();
    this.dateRange = dateRange; // { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
    this.agentParams = agentParams; // { slackUserId: 'U...' } for slack-user-analysis

    // Define agent registry with folder paths
    // Format: 'agent-name' (root agents/) or 'folder/agent-name' (subfolders)
    this.agentRegistry = {
      // COS (Chief of Staff) agents - original operational agents
      'weekly-recap': 'COS/weekly-recap',
      'business-health': 'COS/business-health',
      'product-engineering': 'COS/product-engineering',
      'okr-progress': 'COS/okr-progress',
      'quarterly-review': 'COS/quarterly-review',
      'thoughtleadership-updates': 'COS/thoughtleadership-updates',

      // Root agents (if any exist at root level)
      'telemetry-deepdive': 'telemetry-deepdive',
      'team-pulse': 'team-pulse',
      'pingboard-migration': 'pingboard-migration',
      'jira-tracker': 'jira-tracker',
      'productivity-weekly-tracker': 'productivity-weekly-tracker',
      'officevibe-strategy-roadmap': 'officevibe-strategy-roadmap',
      'slack-user-analysis': 'slack-user-analysis',

      // Leadership agents
      'leadership-strategy': 'leadership/product-strategy',
      'portfolio-review': 'leadership/portfolio-review',
      'team-health': 'leadership/team-health',
      'stakeholder-briefing': 'leadership/stakeholder-briefing',

      // IC agents (core PM work)
      'prd-writer': 'ic/prd-writer',
      'roadmap-planning': 'ic/roadmap-planning',
      'customer-discovery': 'ic/customer-discovery',
      'product-strategy': 'ic/product-strategy',
      'competitive-analysis': 'ic/competitive-analysis'
    };

    // Define default agent execution order (for --all or no specific agents)
    // Only includes implemented agents (have .md files)
    this.agents = [
      'weekly-recap',
      'business-health',
      'product-engineering',
      'okr-progress',
      'quarterly-review',
      'thoughtleadership-updates'
    ];

    // Placeholder agents (registered but not yet implemented - .md files don't exist)
    // Uncomment when implemented:
    // 'telemetry-deepdive',
    // 'team-pulse',
    // 'pingboard-migration',
    // 'jira-tracker',
    // 'productivity-weekly-tracker',
    // 'officevibe-strategy-roadmap',
    // 'slack-user-analysis'
  }

  /**
   * Resolve agent name to file path
   * Allows both short names ('prd-writer') and full paths ('ic/prd-writer')
   */
  resolveAgentPath(agentName) {
    // If it's already a path with /, use it directly
    if (agentName.includes('/')) {
      return agentName;
    }
    // Otherwise, look up in registry
    return this.agentRegistry[agentName] || agentName;
  }

  /**
   * Check if agent exists in registry
   */
  isValidAgent(agentName) {
    // Check both registry and if it's a direct path
    return this.agentRegistry[agentName] || agentName.includes('/');
  }

  /**
   * Load configuration using ConfigManager
   */
  loadConfig() {
    try {
      this.config = this.configManager.loadConfig();
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  /**
   * Initialize all components
   */
  async initialize() {
    console.log('\n' + '='.repeat(80));
    console.log('CHIEF OF STAFF AGENT - INITIALIZING');
    console.log('='.repeat(80) + '\n');

    validateEnvironment();
    this.loadConfig();

    // Initialize MCP client
    console.log('Initializing MCP client...');
    this.mcpClient = new MCPClientManager();
    await this.mcpClient.initialize();

    // Initialize agent runner
    this.agentRunner = new AgentRunner(this.mcpClient, this.config, this.dateRange, this.agentParams);
    await this.agentRunner.initialize();

    console.log('\nInitialization complete!\n');
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Run all agents
   */
  async runAllAgents() {
    console.log('\n' + '='.repeat(80));
    console.log('STARTING AGENT EXECUTION');
    console.log('='.repeat(80) + '\n');

    const results = [];

    for (let i = 0; i < this.agents.length; i++) {
      const agentName = this.agents[i];
      const agentPath = this.resolveAgentPath(agentName);
      try {
        const result = await this.agentRunner.runAgent(agentPath);
        results.push({ ...result, agentName }); // Include display name

        if (result.success) {
          console.log(`✓ ${agentName} completed successfully`);
        } else {
          console.log(`✗ ${agentName} failed: ${result.error}`);
        }
        
        // Add delay between agents (except after the last one) to help with rate limits
        if (i < this.agents.length - 1) {
          const delay = AGENT_EXECUTION.DELAY_BETWEEN_AGENTS;
          console.log(`Waiting ${delay / 1000} seconds before next agent...\n`);
          await this.sleep(delay);
        }
      } catch (error) {
        console.error(`Error executing ${agentName}:`, error.message);
        results.push({
          agentName,
          success: false,
          error: error.message
        });
        
        // Still add delay even on error
        if (i < this.agents.length - 1) {
          const delay = AGENT_EXECUTION.DELAY_BETWEEN_AGENTS_ON_ERROR;
          console.log(`Waiting ${delay / 1000} seconds before next agent...\n`);
          await this.sleep(delay);
        }
      }
    }

    return results;
  }

  /**
   * Run specific agents
   */
  async runSpecificAgents(agentNames) {
    console.log('\n' + '='.repeat(80));
    console.log(`RUNNING SPECIFIC AGENTS: ${agentNames.join(', ')}`);
    console.log('='.repeat(80) + '\n');

    const results = [];
    const validAgents = agentNames.filter(name => this.isValidAgent(name));
    const invalidAgents = agentNames.filter(name => !this.isValidAgent(name));

    // Warn about invalid agents
    invalidAgents.forEach(name => {
      console.warn(`Warning: Unknown agent "${name}", skipping...`);
    });

    for (let i = 0; i < validAgents.length; i++) {
      const agentName = validAgents[i];
      const agentPath = this.resolveAgentPath(agentName);

      try {
        const result = await this.agentRunner.runAgent(agentPath);
        results.push({ ...result, agentName }); // Include display name

        if (result.success) {
          console.log(`✓ ${agentName} completed successfully`);
        } else {
          console.log(`✗ ${agentName} failed: ${result.error}`);
        }
        
        // Add delay between agents (except after the last one) to help with rate limits
        if (i < validAgents.length - 1) {
          const delay = AGENT_EXECUTION.DELAY_FOR_SPECIFIC_AGENTS;
          console.log(`Waiting ${delay / 1000} seconds before next agent...\n`);
          await this.sleep(delay);
        }
      } catch (error) {
        console.error(`Error executing ${agentName}:`, error.message);
        results.push({
          agentName,
          success: false,
          error: error.message
        });

        // Still add delay even on error
        if (i < validAgents.length - 1) {
          const delay = AGENT_EXECUTION.DELAY_FOR_SPECIFIC_AGENTS;
          console.log(`Waiting ${delay / 1000} seconds before next agent...\n`);
          await this.sleep(delay);
        }
      }
    }

    return results;
  }

  /**
   * Generate and save report
   */
  async generateReport(results) {
    console.log('\n' + '='.repeat(80));
    console.log('GENERATING REPORT');
    console.log('='.repeat(80) + '\n');

    const reportPath = await this.reportGenerator.generateReport(results);
    const summary = this.reportGenerator.generateSummary(results);

    console.log(summary);
    console.log(`\nFull report saved to: ${reportPath}`);

    return reportPath;
  }

  /**
   * Main execution
   */
  async run(specificAgents = null) {
    try {
      await this.initialize();

      let results;
      if (specificAgents && specificAgents.length > 0) {
        results = await this.runSpecificAgents(specificAgents);
      } else {
        results = await this.runAllAgents();
      }

      await this.generateReport(results);

      console.log('\n' + '='.repeat(80));
      console.log('EXECUTION COMPLETE');
      console.log('='.repeat(80) + '\n');

    } catch (error) {
      console.error('Fatal error:', error);
      throw error;
    } finally {
      if (this.mcpClient) {
        await this.mcpClient.close();
      }
    }
  }

  /**
   * List available agents
   */
  listAgents() {
    console.log('\nAvailable Agents:');
    
    // Group agents by category
    const cosAgents = [];
    const rootAgents = [];
    const leadershipAgents = [];
    const icAgents = [];
    
    Object.entries(this.agentRegistry).forEach(([name, path]) => {
      if (path.startsWith('COS/')) {
        cosAgents.push(name);
      } else if (path.startsWith('leadership/')) {
        leadershipAgents.push(name);
      } else if (path.startsWith('ic/')) {
        icAgents.push(name);
      } else {
        rootAgents.push(name);
      }
    });
    
    console.log('\n  📊 Chief of Staff (Weekly/Operational) Reports:');
    cosAgents.forEach(agent => {
      const isDefault = this.agents.includes(agent);
      console.log(`    - ${agent}${isDefault ? ' (default)' : ''}`);
    });
    
    if (rootAgents.length > 0) {
      console.log('\n  📋 Other Operational Agents:');
      rootAgents.forEach(agent => {
        const isDefault = this.agents.includes(agent);
        console.log(`    - ${agent}${isDefault ? ' (default)' : ''}`);
      });
    }
    
    console.log('\n  👔 Leadership Agents:');
    leadershipAgents.forEach(agent => {
      console.log(`    - ${agent}`);
    });
    
    console.log('\n  💻 IC Product Management Agents:');
    icAgents.forEach(agent => {
      console.log(`    - ${agent}`);
    });
    
    console.log('\n  Usage: npm start -- --agents=<agent1>,<agent2>');
    console.log('  Example: npm start -- --agents=prd-writer,competitive-analysis\n');
  }
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  displayHelp();
  process.exit(0);
}

// Parse CLI arguments using the new parser
let parsed;
try {
  parsed = parseCliArguments(args);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const { dateRange, agentParams, specificAgents } = parsed;

// Log parsed arguments for debugging
logParsedArguments(parsed, args);

// Validate agent-specific requirements
validateAgentRequirements(specificAgents, agentParams);

const agent = new ChiefOfStaffAgent(dateRange, agentParams);

if (args.includes('--list') || args.includes('-l')) {
  agent.listAgents();
  process.exit(0);
}

// Run with specific agents if provided
agent.run(specificAgents).catch(error => {
  console.error('Execution failed:', error);
  process.exit(1);
});
