# MCP Servers

This directory contains all MCP (Model Context Protocol) server configurations for the Chief of Staff Agent system. Each server provides access to different data sources.

## Available Servers

| Server | File | Purpose | Auth Type |
|--------|------|---------|-----------|
| **Atlassian** | `atlassian-server.js` | Jira & Confluence access | API Token |
| **Slack** | `slack-server.js` | Slack channels & messages | Bot Token |
| **Microsoft Graph** | `microsoft-graph-server.js` | Office 365, OneDrive, Calendar | OAuth 2.0 |
| **Google Calendar** | `google-calendar-server.js` | Google Calendar access | OAuth 2.0 |
| **Gong** | `gong-server.js` | Call recordings & transcripts | API Key |
| **Filesystem** | `filesystem-server.js` | Local file access | None |

## Configuration

All servers are configured via `.vscode/mcp.json` in the workspace root. Each server requires specific environment variables.

### Atlassian (Jira + Confluence)

```bash
ATLASSIAN_HOST=your-company.atlassian.net
ATLASSIAN_EMAIL=your-email@company.com
ATLASSIAN_API_TOKEN=your-api-token
```

Get your API token from: https://id.atlassian.com/manage-profile/security/api-tokens

### Slack

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_TEAM_ID=T0YOUR0TEAM
```

Required bot scopes:
- `channels:history`, `channels:read`
- `groups:history`, `groups:read`
- `im:history`, `im:read`
- `users:read`
- `chat:write` (for posting)

### Microsoft Graph (Office 365, OneDrive)

```bash
MICROSOFT_CLIENT_ID=your-azure-app-client-id
MICROSOFT_CLIENT_SECRET=your-azure-app-client-secret
MICROSOFT_TENANT_ID=your-azure-tenant-id
MICROSOFT_REDIRECT_URI=http://localhost:3000/auth/callback
```

Setup in Azure AD:
1. Register an application in Azure Portal
2. Add API permissions: Calendars.Read, Files.Read, Mail.Read, User.Read
3. Create a client secret

### Google Calendar

```bash
GOOGLE_CALENDAR_CREDENTIALS_PATH=/path/to/google-credentials.json
```

Setup:
1. Create OAuth credentials in Google Cloud Console
2. Download the JSON credentials file
3. Set the path in the environment variable

### Gong

```bash
GONG_API_KEY=your-api-key
GONG_API_SECRET=your-api-secret
```

Get credentials from Gong Settings > API > Create API Key

### Filesystem

```bash
FILESYSTEM_ROOT_PATH=/path/to/workspace
```

Defaults to the current working directory if not set.

## Adding New Servers

To add a new MCP server:

1. Create a new wrapper script in this directory (e.g., `myservice-server.js`)
2. Add the server configuration to `.vscode/mcp.json`
3. Document the required environment variables in this README

### Wrapper Script Template

```javascript
#!/usr/bin/env node

/**
 * MyService MCP Server Wrapper
 * Description of what this server does
 */

import { spawn } from 'child_process';

const requiredEnvVars = ['MY_SERVICE_API_KEY'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// For npm-based MCP servers:
const child = spawn('npx', ['-y', '@modelcontextprotocol/server-myservice'], {
  stdio: 'inherit',
  env: process.env
});

// For custom servers, implement the MCP protocol directly
// See gong-server.js for an example

child.on('exit', (code) => process.exit(code || 0));
```

## Testing

Test individual MCP servers:

```bash
# Test all configured servers
npm run test-mcp

# Test a specific server manually
node mcp-servers/gong-server.js
```

## Troubleshooting

### Server won't start
- Check that all required environment variables are set
- Verify API credentials are valid
- Check network connectivity to the service

### Authentication errors
- Regenerate API tokens/credentials
- Verify OAuth scopes are correct
- Check that tokens haven't expired

### Rate limiting
- Most services have rate limits
- The system includes built-in rate limiting (see `src/agent/rate-limiter.js`)
- Consider caching responses for frequently accessed data
