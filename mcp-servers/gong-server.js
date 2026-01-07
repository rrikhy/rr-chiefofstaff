#!/usr/bin/env node

/**
 * Gong MCP Server
 * Custom MCP server for Gong call recordings and insights
 * 
 * Requires:
 * - GONG_API_KEY: Your Gong API access key
 * - GONG_API_SECRET: Your Gong API secret (for Salesforce SSO, use OAuth token)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const GONG_API_BASE = 'https://api.gong.io/v2';

class GongServer {
  constructor() {
    this.server = new Server(
      { name: 'gong-server', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    
    this.setupTools();
  }

  async makeGongRequest(endpoint, method = 'GET', body = null) {
    const apiKey = process.env.GONG_API_KEY;
    const apiSecret = process.env.GONG_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      throw new Error('GONG_API_KEY and GONG_API_SECRET must be set');
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    const options = {
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${GONG_API_BASE}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`Gong API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  setupTools() {
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'gong_list_calls',
          description: 'List Gong call recordings within a date range',
          inputSchema: {
            type: 'object',
            properties: {
              fromDateTime: {
                type: 'string',
                description: 'Start date in ISO format (e.g., 2024-01-01T00:00:00Z)'
              },
              toDateTime: {
                type: 'string',
                description: 'End date in ISO format (e.g., 2024-01-07T23:59:59Z)'
              },
              workspaceId: {
                type: 'string',
                description: 'Optional workspace ID to filter calls'
              }
            },
            required: ['fromDateTime', 'toDateTime']
          }
        },
        {
          name: 'gong_get_call',
          description: 'Get details of a specific Gong call including transcript',
          inputSchema: {
            type: 'object',
            properties: {
              callId: {
                type: 'string',
                description: 'The Gong call ID'
              }
            },
            required: ['callId']
          }
        },
        {
          name: 'gong_get_call_transcript',
          description: 'Get the transcript of a Gong call',
          inputSchema: {
            type: 'object',
            properties: {
              callId: {
                type: 'string',
                description: 'The Gong call ID'
              }
            },
            required: ['callId']
          }
        },
        {
          name: 'gong_search_calls',
          description: 'Search Gong calls by keywords or participants',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query for call content'
              },
              participantEmails: {
                type: 'array',
                items: { type: 'string' },
                description: 'Filter by participant email addresses'
              },
              fromDateTime: {
                type: 'string',
                description: 'Start date in ISO format'
              },
              toDateTime: {
                type: 'string',
                description: 'End date in ISO format'
              }
            }
          }
        },
        {
          name: 'gong_get_users',
          description: 'List Gong users in the organization',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;
        
        switch (name) {
          case 'gong_list_calls':
            result = await this.listCalls(args);
            break;
          case 'gong_get_call':
            result = await this.getCall(args.callId);
            break;
          case 'gong_get_call_transcript':
            result = await this.getCallTranscript(args.callId);
            break;
          case 'gong_search_calls':
            result = await this.searchCalls(args);
            break;
          case 'gong_get_users':
            result = await this.getUsers();
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error.message}` }],
          isError: true
        };
      }
    });
  }

  async listCalls({ fromDateTime, toDateTime, workspaceId }) {
    const body = {
      filter: {
        fromDateTime,
        toDateTime
      }
    };
    
    if (workspaceId) {
      body.filter.workspaceId = workspaceId;
    }

    return this.makeGongRequest('/calls', 'POST', body);
  }

  async getCall(callId) {
    return this.makeGongRequest(`/calls/${callId}`);
  }

  async getCallTranscript(callId) {
    return this.makeGongRequest(`/calls/${callId}/transcript`);
  }

  async searchCalls({ query, participantEmails, fromDateTime, toDateTime }) {
    const body = {
      filter: {}
    };

    if (query) {
      body.filter.textSearch = query;
    }
    if (participantEmails) {
      body.filter.participantsEmails = participantEmails;
    }
    if (fromDateTime) {
      body.filter.fromDateTime = fromDateTime;
    }
    if (toDateTime) {
      body.filter.toDateTime = toDateTime;
    }

    return this.makeGongRequest('/calls/search', 'POST', body);
  }

  async getUsers() {
    return this.makeGongRequest('/users');
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Gong MCP Server running on stdio');
  }
}

const server = new GongServer();
server.run().catch(console.error);
