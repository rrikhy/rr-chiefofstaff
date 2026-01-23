# Agent Registry

This document provides a comprehensive overview of all agents in the Chief of Staff system, including their purposes, data sources, and capabilities.

## Agent Organization

Agents are organized into three categories:
- **COS (Chief of Staff)**: Operational and weekly reporting agents
- **Leadership**: Strategic analysis and executive-level insights
- **IC (Individual Contributor)**: Core product management workflows

## Registry Status

✅ = Implementation exists (`agents/{category}/{name}.md`)
⚠️ = Registered but no implementation file (placeholder)

---

## COS Agents (Chief of Staff - Operational)

These agents provide weekly operational insights and catch-up reports.

### ✅ weekly-recap
**File**: `agents/COS/weekly-recap.md`
**Purpose**: Comprehensive catch-up of the last 7 days to help the Product Director stay informed about team activities, communications, and upcoming commitments.

**Data Sources**:
- Slack (team channels, saved messages)
- Google Calendar (customer interviews, meetings)
- Hubspot (customer context, recent requests)
- CSM channels (customer context)

**Key Capabilities**:
- Slack team communication analysis
- Team activities and pending responses review
- Sales learnings extraction (Officevibe-specific)
- Saved messages review
- Customer interview preparation with external attendee research

**Output**: Starts with single-line executive summary, then structured sections for communications, activities, sales learnings, and interview prep.

---

### ✅ business-health
**File**: `agents/COS/business-health.md`
**Purpose**: Monitor and report on business health including revenue metrics, deal activity, customer churn, and voice of customer insights.

**Data Sources**:
- Manual sources folder (ARR spreadsheets)
- Slack sales channels (deal announcements)
- Confluence Voice of Customer page
- Customer churn data

**Key Capabilities**:
- ARR analysis with trend identification and growth rates (supports Excel parsing)
- Deal activity review (closed won/lost with reasons)
- Customer churn tracking and pattern analysis
- Voice of Customer synthesis from Confluence

**Special Features**:
- Supports folder parameter for organizing weekly ARR data (e.g., "Week 1", "Week 2")
- Automatically parses Excel files and returns JSON data
- Filters for Officevibe-only data (not Performance product)

---

### ✅ product-engineering
**File**: `agents/COS/product-engineering.md`
**Purpose**: Track product development activities, engineering progress, feature launches, usage metrics, and customer conversations.

**Data Sources**:
- Jira (ticket completion for OV teams)
- Slack (product launches, feedback, team channels)
- Mixpanel (feature usage metrics)
- Gong (PM customer calls)

**Key Capabilities**:
- Jira ticket analysis (last 10 days, by team)
- Product launch review from Slack
- Feature usage analysis from Mixpanel
- PM customer call synthesis from Gong

**Important**: Requires ISO 8601 date format (YYYY-MM-DD) for MCP tool parameters. No relative dates like "-7d".

---

### ✅ okr-progress
**File**: `agents/COS/okr-progress.md`
**Purpose**: Monitor and report on OKR progress for Officevibe teams and Workleap AI initiatives.

**Data Sources**:
- Jira Ideas Boards (OV OKR Board, Workleap AI Board)
- Board IDs from config.json

**Key Capabilities**:
- OKR board analysis (status changes, priority shifts, new ideas)
- Progress tracking (on track, at risk, behind schedule)
- Blocker identification
- Velocity analysis
- Cross-board comparison (Officevibe vs AI initiatives)

---

### ✅ quarterly-review
**File**: `agents/COS/quarterly-review.md`
**Purpose**: Prepare comprehensive quarterly review materials.

**Data Sources**:
- All COS agent data sources (aggregated)
- Historical reports (if available)

**Key Capabilities**:
- Quarter-level aggregation of business metrics
- Goal achievement analysis
- Trend identification over 3 months

---

### ✅ thoughtleadership-updates
**File**: `agents/COS/thoughtleadership-updates.md`
**Purpose**: Track industry insights and thought leadership opportunities.

**Data Sources**:
- Confluence (thought leadership content)
- Slack (industry discussions)

**Key Capabilities**:
- Industry trend synthesis
- Content opportunity identification
- Competitive intelligence gathering

---

## Placeholder COS Agents (Registered, Not Implemented)

These agents are registered in `src/index.js` but don't have corresponding markdown files yet.

### ⚠️ telemetry-deepdive
**Status**: Placeholder
**Expected Purpose**: Deep analysis of telemetry and usage data
**Expected Data Sources**: Mixpanel, analytics tools
**Note**: Referenced as root-level agent but file doesn't exist

### ⚠️ team-pulse
**Status**: Placeholder
**Expected Purpose**: Team morale and engagement tracking
**Expected Data Sources**: Slack sentiment, calendar load, velocity
**Note**: Referenced as root-level agent but file doesn't exist

### ⚠️ pingboard-migration
**Status**: Placeholder
**Expected Purpose**: Track migration from Pingboard to new system
**Expected Data Sources**: Migration status, user adoption
**Note**: Referenced as root-level agent but file doesn't exist

### ⚠️ jira-tracker
**Status**: Placeholder
**Expected Purpose**: Detailed Jira ticket tracking and analysis
**Expected Data Sources**: Jira boards and tickets
**Note**: Referenced as root-level agent but file doesn't exist

### ⚠️ productivity-weekly-tracker
**Status**: Placeholder
**Expected Purpose**: Weekly productivity metrics across teams
**Expected Data Sources**: Jira, calendar, Slack
**Note**: Referenced as root-level agent but file doesn't exist

### ⚠️ officevibe-strategy-roadmap
**Status**: Placeholder
**Expected Purpose**: Strategic roadmap planning for Officevibe
**Expected Data Sources**: Jira roadmap, strategy docs
**Note**: Referenced as root-level agent but file doesn't exist

### ⚠️ slack-user-analysis
**Status**: Placeholder
**Expected Purpose**: Analyze specific Slack user activity and engagement
**Expected Data Sources**: Slack messages, threads, reactions
**Note**: Referenced as root-level agent but file doesn't exist. Supports agentParams with slackUserId.

---

## Leadership Agents

These agents provide strategic analysis and executive-level insights.

### ✅ product-strategy (leadership)
**Registry Name**: `leadership-strategy`
**File**: `agents/leadership/product-strategy.md`
**Purpose**: Act as strategic product advisor to help product leaders develop and refine product strategy, market positioning, competitive analysis, and long-term roadmap planning.

**Data Sources**:
- Confluence (product vision, strategy docs, competitive intel)
- Jira (roadmap items, OKRs, initiatives)
- Slack (leadership discussions, market feedback)
- Gong (customer discovery, sales calls for market insights)
- OneDrive/SharePoint (strategy decks, board presentations)

**Key Capabilities**:
- Market analysis (TAM/SAM/SOM, trends, competitive landscape)
- Product-market fit assessment
- Growth vector identification (expansion, adjacencies, build/buy/partner)
- Strategic framework application
- Competitive positioning analysis

**Strategic Analysis Framework**:
- Market Analysis
- Product-Market Fit
- Growth Vectors
- Platform vs. Point Solution Dynamics

---

### ✅ portfolio-review
**File**: `agents/leadership/portfolio-review.md`
**Purpose**: Multi-product portfolio health and investment allocation analysis.

**Data Sources**:
- Jira (all product roadmaps)
- Business metrics across products
- Resource allocation data

**Key Capabilities**:
- Cross-product performance comparison
- Investment allocation optimization
- Portfolio balance analysis
- Resource prioritization recommendations

---

### ✅ team-health
**File**: `agents/leadership/team-health.md`
**Purpose**: Monitor team health, capacity, and organizational dynamics for product leaders.

**Data Sources**:
- Jira (velocity, sprint metrics, workload distribution)
- Slack (communication patterns, sentiment)
- Confluence (retrospectives, 1:1 notes)
- Gong (team participation in customer calls)
- Calendar (meeting load, focus time)

**Key Capabilities**:
- Delivery health metrics (velocity trends, completion rates, technical debt)
- Engagement signals (Slack activity, meeting participation, collaboration)
- Capacity analysis (workload distribution, burnout risk)
- Team dynamics assessment
- Leadership action recommendations

**Health Indicators**:
- Delivery Health
- Engagement Signals
- Capacity Analysis
- Team Dynamics

---

### ✅ stakeholder-briefing
**File**: `agents/leadership/stakeholder-briefing.md`
**Purpose**: Executive communications and stakeholder updates.

**Data Sources**:
- Aggregated data from all COS agents
- Strategic updates from leadership agents

**Key Capabilities**:
- Executive summary generation
- Key metric highlighting
- Risk and opportunity flagging
- Stakeholder-appropriate formatting

---

## IC Agents (Individual Contributor - Product Management)

These agents support core PM workflows and day-to-day product work.

### ✅ prd-writer
**File**: `agents/ic/prd-writer.md`
**Purpose**: Act as a Principal Product Manager to help write comprehensive, well-structured Product Requirements Documents (PRDs).

**Data Sources**:
- Confluence (existing PRDs, design docs, research)
- Jira (related tickets, customer requests, bugs)
- Slack (feature discussions, customer feedback)
- Gong (customer interviews, discovery calls)
- OneDrive (research decks, competitive analysis)

**Key Capabilities**:
- PRD creation guidance through 4 phases
- Context gathering from multiple sources
- Template and structure recommendations
- Best practice enforcement

**PRD Creation Process**:
1. **Phase 1: Problem Discovery** - Clarify problem, identify personas, quantify impact
2. **Phase 2: Solution Definition** - Define success metrics, outline solution, user flows
3. **Phase 3: Detailed Requirements** - Functional/non-functional reqs, edge cases, integrations
4. **Phase 4: Planning** - Scope, dependencies, risks, launch criteria

---

### ✅ customer-discovery
**File**: `agents/ic/customer-discovery.md`
**Purpose**: Help PMs prepare for and synthesize insights from customer discovery calls.

**Data Sources**:
- Gong (past calls, similar customers)
- Jira (customer's feature requests, bugs, feedback)
- Slack (customer mentions, CSM feedback)
- Confluence (customer profiles, account plans)
- Calendar (upcoming meetings)
- CRM/Salesforce (account details via Gong)

**Key Capabilities**:
- Pre-call preparation (customer context, call objectives, interview guide)
- Call execution guidance (question frameworks, active listening techniques)
- Post-call synthesis (theme identification, insight extraction, recommendation generation)

**Discovery Lifecycle Support**:
1. **Pre-Call Preparation** - Customer context, call objectives, interview guide
2. **Call Execution** - Question frameworks, listening techniques
3. **Post-Call Synthesis** - Themes, insights, recommendations

---

### ✅ competitive-analysis
**File**: `agents/ic/competitive-analysis.md`
**Purpose**: Competitive intelligence tracking and win/loss analysis.

**Data Sources**:
- Confluence (competitive docs)
- Slack (competitive mentions)
- Gong (win/loss calls)
- Sales feedback

**Key Capabilities**:
- Competitor tracking
- Feature comparison
- Win/loss pattern analysis
- Market positioning insights

---

### ✅ roadmap-planning
**File**: `agents/ic/roadmap-planning.md`
**Purpose**: Support roadmap planning and prioritization.

**Data Sources**:
- Jira (backlog, initiatives)
- Customer feedback sources
- Business metrics

**Key Capabilities**:
- Prioritization frameworks
- Roadmap sequencing
- Dependency mapping
- Capacity planning

---

### ✅ product-strategy (IC)
**File**: `agents/ic/product-strategy.md`
**Purpose**: IC-level strategic thinking and market analysis support.

**Data Sources**:
- Market research
- Customer data
- Competitive intelligence

**Key Capabilities**:
- Feature strategy development
- Market opportunity assessment
- User segmentation analysis

**Note**: Different from leadership/product-strategy which focuses on portfolio and company-level strategy.

---

## Default Execution Order

When running all agents (no specific agents specified), the system executes only implemented agents in this order:

1. `weekly-recap` (COS)
2. `business-health` (COS)
3. `product-engineering` (COS)
4. `okr-progress` (COS)
5. `quarterly-review` (COS)
6. `thoughtleadership-updates` (COS)

**Note**: Placeholder agents are registered in the agent registry but excluded from default execution until implementation files are created.

---

## Agent Registry Reference

### How to Reference Agents

Agents can be referenced by:
- **Short name**: `weekly-recap`, `prd-writer`, `team-health`
- **Full path**: `COS/weekly-recap`, `ic/prd-writer`, `leadership/team-health`

### Registry Mapping

```javascript
// From src/index.js
{
  // COS agents
  'weekly-recap': 'COS/weekly-recap',
  'business-health': 'COS/business-health',
  'product-engineering': 'COS/product-engineering',
  'okr-progress': 'COS/okr-progress',
  'quarterly-review': 'COS/quarterly-review',
  'thoughtleadership-updates': 'COS/thoughtleadership-updates',

  // Root-level placeholders
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

  // IC agents
  'prd-writer': 'ic/prd-writer',
  'roadmap-planning': 'ic/roadmap-planning',
  'customer-discovery': 'ic/customer-discovery',
  'product-strategy': 'ic/product-strategy',
  'competitive-analysis': 'ic/competitive-analysis'
}
```

---

## Usage Examples

```bash
# Run all default agents (includes placeholders that will fail)
npm start

# Run specific COS agents
npm start weekly-recap business-health

# Run IC agents
npm start -- --agents=prd-writer,customer-discovery

# Run leadership agents
npm start -- --agents=leadership-strategy,team-health

# Run with date range
npm start weekly-recap -- --start-date=2024-01-01 --end-date=2024-01-07

# List all available agents
npm start -- --list
```

---

## Adding New Agents

### Step 1: Create Markdown File
Create agent definition in appropriate subfolder:
```bash
agents/COS/new-agent.md       # For operational agents
agents/leadership/new-agent.md # For strategic agents
agents/ic/new-agent.md         # For IC workflow agents
```

### Step 2: Register in src/index.js
Add to `agentRegistry`:
```javascript
this.agentRegistry = {
  // ... existing agents
  'new-agent': 'COS/new-agent',  // or appropriate path
};
```

### Step 3: (Optional) Add to Default Execution
If it should run by default:
```javascript
this.agents = [
  'weekly-recap',
  // ... existing agents
  'new-agent',  // Add here
];
```

### Step 4: Test
```bash
npm start new-agent
```

---

## Agent Parameters

Some agents support additional parameters via `agentParams`:

### slack-user-analysis
```javascript
agentParams: { slackUserId: 'U12345' }
```

### business-health
Supports folder parameter for weekly ARR data organization:
```javascript
agentParams: { folder: 'Week 1' }
```

Pass via command line (if supported by CLI):
```bash
npm start slack-user-analysis -- --slack-user-id=U12345
```

---

## Date Range Support

All agents support optional date ranges:

```bash
# Use specific dates
npm start weekly-recap -- --start-date=2024-01-01 --end-date=2024-01-07

# Default: last 7 days (calculated automatically)
npm start weekly-recap
```

Date ranges are automatically calculated if not provided. Agents receive the date range in their context and can use it for filtering data sources.

---

## Data Source Integration

All agents use MCP (Model Context Protocol) to access data sources. Common MCP tools include:

- **Slack**: `slack_search_messages`, `slack_get_channel_history`, `slack_list_channels`
- **Jira**: `jira_search_issues`, `jira_get_board_issues`, `jira_get_issue`
- **Confluence**: `confluence_search`, `confluence_get_page`, `confluence_list_pages`
- **Gong**: `gong_search_calls`, `gong_get_call_transcript`
- **Calendar**: `calendar_list_events`, `calendar_get_event`
- **Filesystem**: `list_manual_sources_files`, `read_file_from_manual_sources`

Agents automatically discover available MCP tools at runtime. No code changes needed to add new data sources—just configure the MCP server.

---

## Best Practices

1. **Agent Scope**: Keep agents focused on a single purpose or workflow
2. **Data Sources**: Clearly document required MCP tools in agent markdown
3. **Output Format**: Use consistent markdown formatting with sections
4. **Executive Summary**: COS agents should start with single-line summary
5. **Date Handling**: Use ISO 8601 format (YYYY-MM-DD) for all date parameters
6. **Error Handling**: Agents should gracefully handle missing data sources
7. **Testing**: Test new agents individually before adding to default execution

---

## Troubleshooting

### Agent Not Found
- Check agent name matches registry in `src/index.js`
- Verify markdown file exists at expected path
- Use `npm start -- --list` to see available agents

### Agent Fails to Execute
- Check if agent requires MCP tools that aren't configured
- Verify config.json has required settings (channel IDs, board IDs, etc.)
- Test MCP connections with `npm run test-mcp`

### Placeholder Agents Failing
- These agents don't have implementation files yet
- Remove from default execution list in `src/index.js` or create implementation files
- Alternatively, run specific agents to avoid placeholders

---

## Summary Statistics

**Total Registered Agents**: 22
- **COS Agents**: 13 (6 implemented, 7 placeholders)
- **Leadership Agents**: 4 (4 implemented, 0 placeholders)
- **IC Agents**: 5 (5 implemented, 0 placeholders)

**Implementation Status**:
- ✅ Implemented: 15 agents (68%)
- ⚠️ Placeholders: 7 agents (32%)

**Default Execution**: 6 agents (only implemented COS agents)
