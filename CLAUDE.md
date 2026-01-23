# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## System Overview

This is a master agent system that orchestrates specialized AI agents to analyze product management work. Each agent is defined by markdown instructions and uses the Model Context Protocol (MCP) to access data from Slack, Jira, Confluence, Calendar, Gong, and other services.

**Key Architecture Pattern**: Agents are markdown files containing instructions, not code. The system reads these instructions and executes them via Claude API with MCP tool access. This means changing agent behavior requires editing markdown, not JavaScript.

**Agent Registry**: See `agents.md` for a comprehensive catalog of all 20 registered agents (15 implemented, 5 placeholders), including their purposes, data sources, and capabilities.

## Common Commands

```bash
# Development and testing
npm install                           # Install dependencies
npm run test-mcp                      # Test MCP server connections
npm run setup-mcp                     # Generate .cursor/mcp.json from .env credentials

# Running agents
npm start                             # Run all default agents (COS agents)
npm start weekly-recap                # Run single agent
npm start -- --agents=prd-writer,todo-tasks  # Run specific agents
npm start -- --list                   # List all available agents
npm start -- --help                   # Show help

# Quick scripts
npm run list                          # List available agents
npm run help                          # Show help
```

## Code Architecture

### Three-Layer Architecture

1. **Master Orchestrator** (`src/index.js`)
   - CLI interface and argument parsing
   - Loads configuration from config.json and .env
   - Initializes MCP client connections
   - Executes agents sequentially
   - Generates final reports

2. **Agent Runner** (`src/agent-runner.js`)
   - Loads agent markdown instructions from `agents/` directory
   - Injects configuration context (team info, channel IDs, etc.)
   - Manages Claude API conversation loop
   - Handles MCP tool calls during execution
   - Extracts and returns agent outputs

3. **MCP Client Manager** (`src/mcp-client.js`)
   - Discovers MCP configuration from multiple sources (Cursor settings, workspace .cursor/mcp.json, Claude Desktop)
   - Connects to all configured MCP servers in parallel with retry logic
   - Maintains unified tool registry
   - Routes tool execution requests to appropriate servers

### Agent Execution Flow

```
1. Load agent .md file (e.g., agents/COS/weekly-recap.md)
2. Build context message with config.json data
3. Send to Claude API with MCP tools available
4. Claude analyzes and calls MCP tools (Slack, Jira, etc.)
5. Execute tools via MCP Client Manager
6. Claude processes results and calls more tools if needed
7. Loop until analysis complete
8. Extract final formatted output
9. Combine all agent outputs into markdown report
```

### Agent Registry System

Agents are organized in subdirectories and registered in `src/index.js`:
- `agents/COS/` - Chief of Staff operational agents (weekly-recap, business-health, product-engineering, okr-progress, etc.)
- `agents/leadership/` - Leadership analysis (product-strategy, portfolio-review, team-health, stakeholder-briefing)
- `agents/ic/` - IC Product Management (prd-writer, customer-discovery, competitive-analysis, etc.)

The `agentRegistry` maps short names to file paths. Agents can be referenced by short name (`weekly-recap`) or full path (`COS/weekly-recap`).

## Configuration System

### Two Configuration Files

1. **.env** - API keys and credentials
   - `ANTHROPIC_API_KEY` or AWS Bedrock credentials
   - MCP server credentials (ATLASSIAN_*, SLACK_*, GONG_*, etc.)
   - MCP connection settings (timeouts, retries)
   - Run `npm run setup-mcp` after updating to regenerate .cursor/mcp.json

2. **config.json** - Application settings
   - Team member info (names, Slack IDs, emails)
   - Slack channel IDs (teamChannels, csmChannels, etc.)
   - Jira configuration (board IDs, team names, project keys)
   - Confluence page IDs
   - Calendar names
   - Other integration-specific settings

### MCP Configuration Auto-Detection

The system automatically finds MCP config in this order:
1. `MCP_CONFIG_PATH` environment variable
2. Cursor User settings (`settings.json` with `mcp.servers`)
3. Workspace `.cursor/mcp.json`
4. Claude Desktop config (legacy)

**Important**: When .env credentials change, run `npm run setup-mcp` to update .cursor/mcp.json.

## Adding or Modifying Agents

### To Modify Existing Agent Behavior

Edit the markdown file directly (e.g., `agents/COS/weekly-recap.md`). Changes take effect immediately on next run. No code changes needed.

### To Add a New Agent

1. Create markdown file in appropriate subdirectory:
   ```bash
   agents/COS/new-agent.md      # For operational agents
   agents/leadership/new-agent.md  # For leadership agents
   agents/ic/new-agent.md       # For IC PM agents
   ```

2. Add to agent registry in `src/index.js`:
   ```javascript
   this.agentRegistry = {
     // ... existing agents
     'new-agent': 'COS/new-agent',  // or 'leadership/new-agent', etc.
   };
   ```

3. Optionally add to default execution list:
   ```javascript
   this.agents = [
     'weekly-recap',
     // ... existing agents
     'new-agent',  // Add here if it should run by default
   ];
   ```

### Agent Markdown Structure

```markdown
# Agent Name

## Purpose
[What this agent analyzes and why]

## Data Sources
[List of MCP tools/sources used: Slack, Jira, Calendar, etc.]

## Instructions
[Detailed instructions for Claude AI - what to analyze, how to process, what to look for]

## Output Format
[Expected output structure - use markdown formatting]

## Success Criteria
[What defines successful execution]
```

## MCP Server System

### Custom MCP Servers

Located in `mcp-servers/` directory:
- `gong-server.js` - Gong API integration
- `atlassian-server.js` - Atlassian via mcp-atlassian package
- `atlassian-rovo-server.js` - Atlassian via OAuth mcp-remote
- `salesforce-server.js` - Salesforce MCP
- `slack-server.js` - Slack wrapper
- `microsoft-graph-server.js` - Microsoft Graph
- `google-calendar-server.js` - Google Calendar
- `filesystem-server.js` - File system access

All custom servers follow the pattern:
1. Import `load-env.js` to load .env variables
2. Spawn underlying MCP package with transformed environment variables
3. Handle stdio communication

### MCP Connection Behavior

- Connections are attempted in parallel for speed
- Automatic retry with exponential backoff (default: 3 retries)
- Configurable timeouts via .env (MCP_CONNECTION_TIMEOUT, MCP_MAX_RETRIES, MCP_RETRY_DELAY)
- Failed connections are logged but don't stop execution
- Agents fail only if they require unavailable tools

## API Client Support

Supports two Claude API options:
1. **Direct Anthropic API**: Set `ANTHROPIC_API_KEY` in .env
2. **AWS Bedrock**: Set `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (or use AWS_PROFILE)

The system auto-detects which to use based on environment variables. Bedrock model IDs differ from Anthropic API models (e.g., `us.anthropic.claude-opus-4-5-20251101-v1:0` vs `claude-sonnet-4-5-20250929`).

## Rate Limiting and Token Management

- Built-in rate limiting via `src/agent/rate-limiter.js`
- Message truncation via `src/agent/message-truncator.js` when context exceeds limits
- Token usage tracking per agent
- Constants defined in `src/utils/constants.js`

## Report Generation

Reports are generated in `reports/` directory with timestamp:
- Format: `weekly-report-YYYY-MM-DD-HH-MM-SS.md`
- Contains output from all executed agents
- Includes execution metadata (time, token usage)
- Generated by `src/report-generator.js`

## Date Range Support

Agents support optional date range parameters:
```bash
npm start -- --start-date=2024-01-01 --end-date=2024-01-07
```

Date ranges are automatically calculated if not provided (default: last 7 days).

## Testing and Debugging

```bash
# Test MCP connections
npm run test-mcp

# Test single agent (faster than full run)
npm start weekly-recap

# Test with date range
npm start -- --agents=weekly-recap --start-date=2024-01-01

# Check agent registry
npm start -- --list
```

## Important Implementation Notes

- **Agent instructions are markdown, not code**: To change behavior, edit .md files in `agents/` directory
- **Configuration is injected at runtime**: Agents receive config.json data as context
- **MCP tools are discovered dynamically**: No code changes needed to add new MCP servers
- **Agents run sequentially, not parallel**: Full execution takes 5-15 minutes typically
- **Reports are append-only**: Each run creates a new report file
- **Environment determines API client**: Anthropic direct vs AWS Bedrock based on .env

## When Modifying Core System

- **src/index.js**: Only modify to add agents to registry or change default execution order
- **src/agent-runner.js**: Only modify for new capabilities like streaming, caching, or custom tool handling
- **src/mcp-client.js**: Rarely needs changes unless MCP protocol updates
- **src/report-generator.js**: Modify only for different output formats (PDF, email, etc.)

## Credentials and Security

- Never commit .env or config.json (both in .gitignore)
- API keys stored only in .env
- MCP server credentials stored in .env, then propagated to .cursor/mcp.json via `npm run setup-mcp`
- Configuration IDs (channel IDs, board IDs) stored in config.json
