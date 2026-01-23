#!/usr/bin/env node

/**
 * Search JIRA for Q3 roadmap items
 */

import 'dotenv/config';
import { MCPClientManager } from './src/mcp-client.js';
import fs from 'fs';

const CLOUD_ID = 'b9080184-778a-4723-97cd-2379e5760def';

const Q3_ITEMS = [
  { name: 'AI Assistant/Agents as a Service (A2A)', keywords: ['A2A', 'agent to agent', 'agents as a service', 'consume AI agents'] },
  { name: 'Extend Views Explanation - Cloud Insights', keywords: ['cloud insights', 'views explanation', 'cloud explanation'] },
  { name: 'Extend Views Explanation - BGP Logic', keywords: ['BGP logic', 'BGP explanation', 'BGP revamp'] },
  { name: 'Troubleshooting V2 Phase 2/3', keywords: ['troubleshooting', 'MCP migration', 'troubleshooting phase'] },
  { name: 'Fusion - Evals', keywords: ['fusion evals', 'LLM evals', 'evaluation', 'model eval'] },
  { name: 'Fusion - Credo Integration', keywords: ['credo', 'credo integration'] },
  { name: 'Fusion - Cost Attribution', keywords: ['cost attribution', 'LLM cost', 'token cost'] },
  { name: 'Fusion - Operational', keywords: ['fusion operational', 'GenAI operational', 'AI ops'] },
  { name: 'Discovery - Meraki Integration', keywords: ['meraki', 'meraki agent', 'meraki actionability'] },
  { name: 'Discovery - Generative Landing Page', keywords: ['generative landing', 'landing page', 'generative UI'] },
  { name: 'AI Assistant Actionability', keywords: ['actionability', 'actionable agent', 'agent actions'] },
  { name: 'TAM/Best Practices Agent', keywords: ['TAM agent', 'best practices agent', 'account health', 'health check'] },
  { name: 'Customer Outcome Metrics', keywords: ['customer outcome', 'support cases', 'solved cases', 'actions recommended'] },
  { name: 'AI Integration for Teams', keywords: ['AI integration', 'team enablement', 'workflow AI'] },
];

async function searchQ3Roadmap() {
  console.log('='.repeat(80));
  console.log('JIRA SEARCH - Q3 ROADMAP CROSS-REFERENCE');
  console.log('='.repeat(80));
  console.log('');

  const client = new MCPClientManager();
  const allResults = [];

  try {
    console.log('Initializing MCP client...\n');
    await client.initialize();

    for (const item of Q3_ITEMS) {
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`Searching for: ${item.name}`);
      console.log('═'.repeat(60));

      const itemResults = { name: item.name, matches: [] };

      for (const keyword of item.keywords) {
        try {
          const jql = `project = PR AND text ~ "${keyword}" ORDER BY updated DESC`;
          console.log(`  JQL: text ~ "${keyword}"`);
          
          const result = await client.callTool('searchJiraIssuesUsingJql', {
            cloudId: CLOUD_ID,
            jql: jql,
            maxResults: 5
          });

          if (result?.content?.[0]?.text && !result?.isError) {
            const issues = JSON.parse(result.content[0].text);
            if (Array.isArray(issues) && issues.length > 0) {
              console.log(`    Found ${issues.length} issues`);
              for (const issue of issues) {
                if (!itemResults.matches.find(m => m.key === issue.key)) {
                  itemResults.matches.push({
                    key: issue.key,
                    summary: issue.fields?.summary,
                    status: issue.fields?.status?.name,
                    keyword: keyword
                  });
                }
              }
            }
          }
        } catch (error) {
          console.log(`    Error: ${error.message}`);
        }
      }

      allResults.push(itemResults);
      console.log(`  Total unique matches: ${itemResults.matches.length}`);
    }

    await client.close();

    // Write results
    fs.writeFileSync('./reports/q3-roadmap-jira.json', JSON.stringify(allResults, null, 2));

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('Q3 ROADMAP - JIRA CROSS-REFERENCE SUMMARY');
    console.log('='.repeat(80));

    for (const item of allResults) {
      console.log(`\n## ${item.name}`);
      if (item.matches.length === 0) {
        console.log('  ❌ No matches found');
      } else {
        const top3 = item.matches.slice(0, 3);
        for (const match of top3) {
          console.log(`  ✓ ${match.key}: ${match.summary} [${match.status}]`);
        }
        if (item.matches.length > 3) {
          console.log(`  ... and ${item.matches.length - 3} more`);
        }
      }
    }

    console.log('\n\nResults saved to: ./reports/q3-roadmap-jira.json');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

searchQ3Roadmap();
