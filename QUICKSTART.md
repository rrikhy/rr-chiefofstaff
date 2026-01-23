# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Anthropic API key
- [ ] Cursor IDE (for MCP servers)

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Create and configure .env with ALL credentials
cp .env.example .env
# Edit .env and add:
#   - ANTHROPIC_API_KEY
#   - ATLASSIAN_* credentials (for Jira/Confluence)
#   - SLACK_* credentials
#   - GONG_* credentials
#   - etc.

# 3. Generate MCP config from your .env
npm run setup-mcp
# This creates .cursor/mcp.json with your credentials

# 4. Create and configure config.json
cp config.example.json config.json
# Edit config.json with your team details

# 5. Restart Cursor (or Cmd+Shift+P → "Reload Window")

# 6. Test MCP connections
npm run test-mcp

# 7. Test with one agent
npm start -- --agents=weekly-recap

# 8. Run all agents
npm start
```

## Minimum Configuration Required

### .env (Credentials)
```env
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here

# MCP Services (add what you need)
ATLASSIAN_HOST=your-company.atlassian.net
ATLASSIAN_EMAIL=your-email@company.com
ATLASSIAN_API_TOKEN=your-api-token

SLACK_BOT_TOKEN=xoxb-your-token
SLACK_TEAM_ID=T0YOUR0TEAM

GONG_API_KEY=your-gong-key
GONG_API_SECRET=your-gong-secret
```

Then run: `npm run setup-mcp`

### config.json - Update These Sections

```json
{
  "team": {
    "ovTeamMembers": [/* Your team members */],
    "jiraTeams": [/* Your Jira team names */]
  },
  "slack": {
    "channels": {
      "teamChannels": [/* Your channel IDs */]
    },
    "myslackuserId": "/* Your Slack user ID */"
  }
}
```

## Find Your IDs Quickly

**Slack Channel ID**: Open channel in browser → Copy from URL
**Slack User ID**: Your profile → More → Copy member ID
**Jira Board ID**: From Ideas board URL

## First Run

```bash
npm start -- --agents=weekly-recap
```

Should see:
- ✓ MCP servers connecting
- ✓ Agent executing
- ✓ Report generated in `reports/`

## Run Different Agent Types

```bash
# List all available agents
npm start -- --list

# Run IC agents
npm start -- --agents=prd-writer,todo-tasks

# Run leadership agents
npm start -- --agents=product-strategy,team-health

# Run Chief of Staff (default) agents
npm start
```

## Customize

Edit files in `agents/` directory to change what each agent does:
- `agents/COS/` - Chief of Staff weekly/operational agents
- `agents/leadership/` - Leadership analysis agents
- `agents/ic/` - IC product management agents

## Need Help?

See SETUP.md for detailed instructions.

## Common Commands

```bash
npm start                      # Run all agents
npm start weekly-recap         # Run one agent
npm start -- --list            # List available agents
npm start -- --help            # Show help
```
