#!/usr/bin/env node

/**
 * Gong MCP Server
 * Custom MCP server for Gong call recordings and insights
 * 
 * Requires:
 * - GONG_ACCESS_KEY or GONG_API_KEY: Your Gong API access key
 * - GONG_ACCESS_KEY_SECRET or GONG_API_SECRET: Your Gong API secret
 * - GONG_BASE_URL: Your Gong API base URL (e.g., https://us-24642.api.gong.io)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import './load-env.js';

// Use the correct base URL without /v2 suffix - we add it per endpoint
const GONG_BASE_URL = process.env.GONG_BASE_URL || 'https://us-24642.api.gong.io';

class GongServer {
  constructor() {
    this.server = new Server(
      { name: 'gong-server', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    
    this.setupTools();
  }

  async makeGongRequest(endpoint, method = 'GET', body = null) {
    const apiKey = process.env.GONG_ACCESS_KEY || process.env.GONG_API_KEY;
    const apiSecret = process.env.GONG_ACCESS_KEY_SECRET || process.env.GONG_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      throw new Error('GONG_ACCESS_KEY/GONG_API_KEY and GONG_ACCESS_KEY_SECRET/GONG_API_SECRET must be set');
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

    const url = `${GONG_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gong API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
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

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
    // Gong API uses /v2/calls/extensive for listing calls with filters
    const body = {
      filter: {
        fromDateTime,
        toDateTime
      },
      contentSelector: {
        exposedFields: {
          parties: true,
          content: {
            topics: true
          }
        }
      }
    };
    
    if (workspaceId) {
      body.filter.workspaceId = workspaceId;
    }

    return this.makeGongRequest('/v2/calls/extensive', 'POST', body);
  }

  async getCall(callId) {
    // Get single call metadata
    const body = {
      filter: {
        callIds: [callId]
      }
    };
    return this.makeGongRequest('/v2/calls/extensive', 'POST', body);
  }

  async getCallTranscript(callId) {
    // Gong API requires POST with filter.callIds array for transcripts
    const body = {
      filter: {
        callIds: [callId]
      }
    };
    return this.makeGongRequest('/v2/calls/transcript', 'POST', body);
  }

  async searchCalls({ query, participantEmails, fromDateTime, toDateTime }) {
    // Use /v2/calls/extensive with filters - there's no dedicated search endpoint
    const body = {
      filter: {},
      contentSelector: {
        exposedFields: {
          parties: true,
          content: {
            topics: true,
            trackers: true
          }
        }
      }
    };

    if (participantEmails && participantEmails.length > 0) {
      body.filter.primaryUserIds = participantEmails;
    }
    if (fromDateTime) {
      body.filter.fromDateTime = fromDateTime;
    }
    if (toDateTime) {
      body.filter.toDateTime = toDateTime;
    }

    // Note: Gong API doesn't support text search in list calls
    // You need to get transcripts separately and search client-side
    return this.makeGongRequest('/v2/calls/extensive', 'POST', body);
  }

  async getUsers() {
    return this.makeGongRequest('/v2/users', 'GET');
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Gong MCP Server running on stdio');
  }
}

const server = new GongServer();
server.run().catch(console.error);
