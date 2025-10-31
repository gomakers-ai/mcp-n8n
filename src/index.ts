#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { N8nClient } from './n8n-client.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const server = new Server(
  {
    name: 'mcp-n8n',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Get config from environment variables
const N8N_BASE_URL = process.env.N8N_BASE_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_BASE_URL || !N8N_API_KEY) {
  console.error('Error: N8N_BASE_URL and N8N_API_KEY environment variables are required');
  process.exit(1);
}

const n8nClient = new N8nClient({
  baseUrl: N8N_BASE_URL,
  apiKey: N8N_API_KEY,
});

// ========== TEMPLATE HELPERS ==========

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TemplateMetadata {
  id: string;
  file: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  keywords: string[];
  useCases: string[];
  complexity: string;
}

interface TemplatesData {
  templates: TemplateMetadata[];
}

function loadTemplatesMetadata(): TemplatesData {
  try {
    const metadataPath = join(__dirname, '../examples/templates-metadata.json');
    const data = readFileSync(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading templates metadata:', error);
    return { templates: [] };
  }
}

function loadTemplateFile(filename: string): any {
  try {
    const templatePath = join(__dirname, '../examples', filename);
    const data = readFileSync(templatePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading template file:', error);
    return null;
  }
}

function findBestTemplate(userRequest: string, templates: TemplateMetadata[]): TemplateMetadata | null {
  if (!userRequest || templates.length === 0) {
    return null;
  }

  const searchTerms = userRequest.toLowerCase().split(/\s+/);
  const scores = templates.map(template => {
    let score = 0;

    // Score based on keywords
    searchTerms.forEach(term => {
      if (template.keywords.some(kw => kw.includes(term) || term.includes(kw))) {
        score += 5;
      }
      if (template.tags.some(tag => tag.includes(term) || term.includes(tag))) {
        score += 3;
      }
      if (template.name.toLowerCase().includes(term)) {
        score += 4;
      }
      if (template.description.toLowerCase().includes(term)) {
        score += 2;
      }
      if (template.useCases.some(uc => uc.toLowerCase().includes(term))) {
        score += 6;
      }
    });

    return { template, score };
  });

  // Sort by score and return the best match
  scores.sort((a, b) => b.score - a.score);

  if (scores[0] && scores[0].score > 0) {
    return scores[0].template;
  }

  return null;
}

// ========== TOOL SCHEMAS ==========

const WorkflowSchema = z.object({
  name: z.string(),
  active: z.boolean().optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

// ========== LIST TOOLS ==========

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // ========== WORKFLOW TOOLS ==========
      {
        name: 'n8n_create_workflow',
        description: 'Create a new workflow in n8n. You can specify nodes, connections, and settings.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name of the workflow' },
            active: { type: 'boolean', description: 'Whether to activate the workflow immediately' },
            nodes: {
              type: 'array',
              description: 'Array of workflow nodes',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  position: { type: 'array', items: { type: 'number' } },
                  parameters: { type: 'object' },
                },
              },
            },
            connections: { type: 'object', description: 'Node connections' },
            settings: { type: 'object', description: 'Workflow settings' },
          },
          required: ['name'],
        },
      },
      {
        name: 'n8n_list_workflows',
        description: 'List all workflows with full details. Can filter by active status, tags, name, or project. WARNING: Returns complete workflow data including nodes and connections - use n8n_list_workflows_summary for better token efficiency.',
        inputSchema: {
          type: 'object',
          properties: {
            active: { type: 'boolean', description: 'Filter by active status' },
            tags: { type: 'string', description: 'Filter by tag ID' },
            name: { type: 'string', description: 'Filter by workflow name' },
            projectId: { type: 'string', description: 'Filter by project ID' },
            limit: { type: 'number', description: 'Number of results (max 250)', default: 10 },
            cursor: { type: 'string', description: 'Pagination cursor' },
            fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific fields to return (e.g., ["id", "name", "active"]). Reduces token usage significantly.'
            },
          },
        },
      },
      {
        name: 'n8n_list_workflows_summary',
        description: 'List workflows with minimal data (id, name, active, tags, updatedAt only). Recommended for browsing and listing - uses 90% fewer tokens than n8n_list_workflows. Use n8n_get_workflow to fetch full details of a specific workflow.',
        inputSchema: {
          type: 'object',
          properties: {
            active: { type: 'boolean', description: 'Filter by active status' },
            tags: { type: 'string', description: 'Filter by tag ID' },
            name: { type: 'string', description: 'Filter by workflow name' },
            projectId: { type: 'string', description: 'Filter by project ID' },
            limit: { type: 'number', description: 'Number of results (max 250)', default: 20 },
            cursor: { type: 'string', description: 'Pagination cursor' },
          },
        },
      },
      {
        name: 'n8n_get_workflow',
        description: 'Get detailed information about a specific workflow by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_update_workflow',
        description: 'Update an existing workflow. Can modify name, nodes, connections, settings, etc.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID to update' },
            name: { type: 'string', description: 'New workflow name' },
            active: { type: 'boolean', description: 'Active status' },
            nodes: { type: 'array', description: 'Updated workflow nodes' },
            connections: { type: 'object', description: 'Updated connections' },
            settings: { type: 'object', description: 'Updated settings' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_delete_workflow',
        description: 'Delete a workflow permanently.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID to delete' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_activate_workflow',
        description: 'Activate a workflow to start receiving triggers.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID to activate' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_deactivate_workflow',
        description: 'Deactivate a workflow to stop receiving triggers.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID to deactivate' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_transfer_workflow',
        description: 'Transfer a workflow to another project.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID' },
            destinationProjectId: { type: 'string', description: 'Destination project ID' },
          },
          required: ['id', 'destinationProjectId'],
        },
      },
      {
        name: 'n8n_get_workflow_tags',
        description: 'Get all tags associated with a workflow.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_update_workflow_tags',
        description: 'Update tags for a workflow.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Workflow ID' },
            tagIds: { type: 'array', items: { type: 'string' }, description: 'Array of tag IDs' },
          },
          required: ['id', 'tagIds'],
        },
      },

      // ========== EXECUTION TOOLS ==========
      {
        name: 'n8n_list_executions',
        description: 'List workflow executions. Can filter by status, workflow ID, or project. TIP: Set includeData=false and use fields parameter to reduce token usage.',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['error', 'success', 'waiting', 'running', 'canceled'],
              description: 'Filter by execution status',
            },
            workflowId: { type: 'string', description: 'Filter by workflow ID' },
            projectId: { type: 'string', description: 'Filter by project ID' },
            includeData: { type: 'boolean', description: 'Include execution data (WARNING: significantly increases token usage)', default: false },
            limit: { type: 'number', description: 'Number of results', default: 20 },
            cursor: { type: 'string', description: 'Pagination cursor' },
            fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific fields to return (e.g., ["id", "status", "workflowId"]). Reduces token usage.'
            },
          },
        },
      },
      {
        name: 'n8n_get_execution',
        description: 'Get detailed information about a specific execution.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Execution ID' },
            includeData: { type: 'boolean', description: 'Include execution data', default: false },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_delete_execution',
        description: 'Delete an execution record.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Execution ID to delete' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_retry_execution',
        description: 'Retry a failed execution.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Execution ID to retry' },
          },
          required: ['id'],
        },
      },

      // ========== CREDENTIAL TOOLS ==========
      {
        name: 'n8n_create_credential',
        description: 'Create a new credential for a specific node type.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Credential name' },
            type: { type: 'string', description: 'Credential type (e.g., "httpBasicAuth")' },
            data: { type: 'object', description: 'Credential data' },
            projectId: { type: 'string', description: 'Project ID' },
          },
          required: ['name', 'type', 'data'],
        },
      },
      {
        name: 'n8n_delete_credential',
        description: 'Delete a credential (owner only).',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Credential ID to delete' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_get_credential_schema',
        description: 'Get the schema for a credential type to understand required fields.',
        inputSchema: {
          type: 'object',
          properties: {
            credentialTypeName: { type: 'string', description: 'Credential type name' },
          },
          required: ['credentialTypeName'],
        },
      },
      {
        name: 'n8n_transfer_credential',
        description: 'Transfer a credential to another project.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Credential ID' },
            destinationProjectId: { type: 'string', description: 'Destination project ID' },
          },
          required: ['id', 'destinationProjectId'],
        },
      },

      // ========== TAG TOOLS ==========
      {
        name: 'n8n_create_tag',
        description: 'Create a new tag for organizing workflows.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Tag name' },
          },
          required: ['name'],
        },
      },
      {
        name: 'n8n_list_tags',
        description: 'List all tags available in n8n.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'n8n_get_tag',
        description: 'Get information about a specific tag.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Tag ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_update_tag',
        description: 'Update a tag name.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Tag ID' },
            name: { type: 'string', description: 'New tag name' },
          },
          required: ['id', 'name'],
        },
      },
      {
        name: 'n8n_delete_tag',
        description: 'Delete a tag.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Tag ID to delete' },
          },
          required: ['id'],
        },
      },

      // ========== VARIABLE TOOLS ==========
      {
        name: 'n8n_create_variable',
        description: 'Create a new environment variable in n8n.',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Variable key' },
            value: { type: 'string', description: 'Variable value' },
            type: {
              type: 'string',
              enum: ['string', 'boolean', 'number'],
              description: 'Variable type',
            },
            projectId: { type: 'string', description: 'Project ID' },
          },
          required: ['key', 'value'],
        },
      },
      {
        name: 'n8n_list_variables',
        description: 'List all environment variables.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Filter by project ID' },
            state: { type: 'string', description: 'Filter by state' },
          },
        },
      },
      {
        name: 'n8n_update_variable',
        description: 'Update an environment variable.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Variable ID' },
            key: { type: 'string', description: 'New key' },
            value: { type: 'string', description: 'New value' },
            type: { type: 'string', enum: ['string', 'boolean', 'number'] },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_delete_variable',
        description: 'Delete an environment variable.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Variable ID to delete' },
          },
          required: ['id'],
        },
      },

      // ========== USER TOOLS ==========
      {
        name: 'n8n_list_users',
        description: 'List all users (owner only).',
        inputSchema: {
          type: 'object',
          properties: {
            includeRole: { type: 'boolean', description: 'Include role information', default: false },
          },
        },
      },
      {
        name: 'n8n_create_users',
        description: 'Create multiple users at once.',
        inputSchema: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  role: {
                    type: 'string',
                    enum: ['global:owner', 'global:admin', 'global:member'],
                  },
                },
              },
              description: 'Array of user objects',
            },
          },
          required: ['users'],
        },
      },
      {
        name: 'n8n_get_user',
        description: 'Get user by ID or email (owner only).',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID or email' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_delete_user',
        description: 'Delete a user.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID to delete' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_change_user_role',
        description: "Change a user's global role.",
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            role: {
              type: 'string',
              enum: ['global:owner', 'global:admin', 'global:member'],
              description: 'New role',
            },
          },
          required: ['id', 'role'],
        },
      },

      // ========== PROJECT TOOLS ==========
      {
        name: 'n8n_create_project',
        description: 'Create a new project in n8n.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Project name' },
            type: { type: 'string', enum: ['team', 'personal'], description: 'Project type' },
          },
          required: ['name'],
        },
      },
      {
        name: 'n8n_list_projects',
        description: 'List all projects.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'n8n_update_project',
        description: 'Update a project.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Project ID' },
            name: { type: 'string', description: 'New project name' },
            type: { type: 'string', enum: ['team', 'personal'] },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_delete_project',
        description: 'Delete a project.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Project ID to delete' },
          },
          required: ['id'],
        },
      },
      {
        name: 'n8n_add_user_to_project',
        description: 'Add a user to a project with a specific role.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            userId: { type: 'string', description: 'User ID to add' },
            role: { type: 'string', description: 'User role in project' },
          },
          required: ['projectId', 'userId', 'role'],
        },
      },
      {
        name: 'n8n_remove_user_from_project',
        description: 'Remove a user from a project.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            userId: { type: 'string', description: 'User ID to remove' },
          },
          required: ['projectId', 'userId'],
        },
      },
      {
        name: 'n8n_change_user_project_role',
        description: "Change a user's role within a project.",
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            userId: { type: 'string', description: 'User ID' },
            role: { type: 'string', description: 'New role' },
          },
          required: ['projectId', 'userId', 'role'],
        },
      },

      // ========== OTHER TOOLS ==========
      {
        name: 'n8n_generate_audit',
        description: 'Generate a security audit report.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'n8n_pull_source_control',
        description: 'Pull changes from remote source control repository.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      // ========== WORKFLOW TEMPLATE TOOLS ==========
      {
        name: 'n8n_list_workflow_templates',
        description: 'List available workflow templates with their metadata. Use this to discover what pre-built workflows are available.',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Filter by category (e.g., "AI/Chat", "E-commerce/Support")' },
            search: { type: 'string', description: 'Search keywords in name, description, tags, and use cases' },
          },
        },
      },
      {
        name: 'n8n_get_workflow_template',
        description: 'Get a specific workflow template by ID or intelligently find the best matching template based on user requirements.',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: { type: 'string', description: 'Template ID (if known)' },
            userRequest: { type: 'string', description: 'User\'s description of what they want to build. Used to intelligently match the best template.' },
          },
        },
      },
      {
        name: 'n8n_create_workflow_from_template',
        description: 'Create a new workflow in n8n based on a template. Automatically selects the best template if not specified.',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: { type: 'string', description: 'Template ID to use (if known)' },
            userRequest: { type: 'string', description: 'Description of what the user wants. Used to find the best matching template if templateId not provided.' },
            workflowName: { type: 'string', description: 'Custom name for the new workflow (optional, will use template name if not provided)' },
            activate: { type: 'boolean', description: 'Whether to activate the workflow after creation', default: false },
          },
        },
      },
    ],
  };
});

// ========== CALL TOOL HANDLER ==========

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    // ========== WORKFLOW HANDLERS ==========
    if (name === 'n8n_create_workflow') {
      const result = await n8nClient.createWorkflow(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_list_workflows') {
      const result = await n8nClient.getWorkflows(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_list_workflows_summary') {
      // Force minimal fields for summary view
      const summaryArgs = {
        ...(args as any),
        fields: ['id', 'name', 'active', 'tags', 'updatedAt', 'createdAt']
      };
      const result = await n8nClient.getWorkflows(summaryArgs);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_get_workflow') {
      const result = await n8nClient.getWorkflow((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_update_workflow') {
      const { id, ...updates } = args as any;
      const result = await n8nClient.updateWorkflow(id, updates);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_delete_workflow') {
      const result = await n8nClient.deleteWorkflow((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_activate_workflow') {
      const result = await n8nClient.activateWorkflow((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_deactivate_workflow') {
      const result = await n8nClient.deactivateWorkflow((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_transfer_workflow') {
      const result = await n8nClient.transferWorkflow(
        (args as any).id,
        (args as any).destinationProjectId
      );
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_get_workflow_tags') {
      const result = await n8nClient.getWorkflowTags((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_update_workflow_tags') {
      const result = await n8nClient.updateWorkflowTags((args as any).id, (args as any).tagIds);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== EXECUTION HANDLERS ==========
    if (name === 'n8n_list_executions') {
      const result = await n8nClient.getExecutions(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_get_execution') {
      const result = await n8nClient.getExecution((args as any).id, (args as any).includeData);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_delete_execution') {
      const result = await n8nClient.deleteExecution((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_retry_execution') {
      const result = await n8nClient.retryExecution((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== CREDENTIAL HANDLERS ==========
    if (name === 'n8n_create_credential') {
      const result = await n8nClient.createCredential(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_delete_credential') {
      const result = await n8nClient.deleteCredential((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_get_credential_schema') {
      const result = await n8nClient.getCredentialSchema((args as any).credentialTypeName);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_transfer_credential') {
      const result = await n8nClient.transferCredential(
        (args as any).id,
        (args as any).destinationProjectId
      );
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== TAG HANDLERS ==========
    if (name === 'n8n_create_tag') {
      const result = await n8nClient.createTag(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_list_tags') {
      const result = await n8nClient.getTags();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_get_tag') {
      const result = await n8nClient.getTag((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_update_tag') {
      const result = await n8nClient.updateTag((args as any).id, { name: (args as any).name });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_delete_tag') {
      const result = await n8nClient.deleteTag((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== VARIABLE HANDLERS ==========
    if (name === 'n8n_create_variable') {
      const result = await n8nClient.createVariable(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_list_variables') {
      const result = await n8nClient.getVariables(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_update_variable') {
      const { id, ...updates } = args as any;
      const result = await n8nClient.updateVariable(id, updates);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_delete_variable') {
      const result = await n8nClient.deleteVariable((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== USER HANDLERS ==========
    if (name === 'n8n_list_users') {
      const result = await n8nClient.getUsers((args as any).includeRole);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_create_users') {
      const result = await n8nClient.createUsers((args as any).users);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_get_user') {
      const result = await n8nClient.getUser((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_delete_user') {
      const result = await n8nClient.deleteUser((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_change_user_role') {
      const result = await n8nClient.changeUserRole((args as any).id, (args as any).role);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== PROJECT HANDLERS ==========
    if (name === 'n8n_create_project') {
      const result = await n8nClient.createProject(args as any);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_list_projects') {
      const result = await n8nClient.getProjects();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_update_project') {
      const { id, ...updates } = args as any;
      const result = await n8nClient.updateProject(id, updates);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_delete_project') {
      const result = await n8nClient.deleteProject((args as any).id);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_add_user_to_project') {
      const result = await n8nClient.addUserToProject(
        (args as any).projectId,
        (args as any).userId,
        (args as any).role
      );
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_remove_user_from_project') {
      const result = await n8nClient.removeUserFromProject(
        (args as any).projectId,
        (args as any).userId
      );
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_change_user_project_role') {
      const result = await n8nClient.changeUserProjectRole(
        (args as any).projectId,
        (args as any).userId,
        (args as any).role
      );
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== OTHER HANDLERS ==========
    if (name === 'n8n_generate_audit') {
      const result = await n8nClient.generateAudit();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_pull_source_control') {
      const result = await n8nClient.pullSourceControl();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // ========== TEMPLATE HANDLERS ==========
    if (name === 'n8n_list_workflow_templates') {
      const templatesData = loadTemplatesMetadata();
      let filteredTemplates = templatesData.templates;

      // Filter by category if provided
      if ((args as any).category) {
        const category = (args as any).category.toLowerCase();
        filteredTemplates = filteredTemplates.filter(t =>
          t.category.toLowerCase().includes(category)
        );
      }

      // Search if provided
      if ((args as any).search) {
        const searchTerms = (args as any).search.toLowerCase().split(/\s+/);
        filteredTemplates = filteredTemplates.filter(t => {
          const searchableText = [
            t.name,
            t.description,
            ...t.tags,
            ...t.keywords,
            ...t.useCases
          ].join(' ').toLowerCase();

          return searchTerms.some((term: string) => searchableText.includes(term));
        });
      }

      const result = {
        templates: filteredTemplates.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category,
          description: t.description,
          tags: t.tags,
          complexity: t.complexity,
          useCases: t.useCases.slice(0, 3) // Show first 3 use cases
        })),
        total: filteredTemplates.length
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_get_workflow_template') {
      const templatesData = loadTemplatesMetadata();
      let selectedTemplate: TemplateMetadata | null = null;

      // If templateId provided, use it
      if ((args as any).templateId) {
        selectedTemplate = templatesData.templates.find(t => t.id === (args as any).templateId) || null;
      }
      // Otherwise, find best match based on user request
      else if ((args as any).userRequest) {
        selectedTemplate = findBestTemplate((args as any).userRequest, templatesData.templates);
      }

      if (!selectedTemplate) {
        return {
          content: [{ type: 'text', text: JSON.stringify({
            error: 'No matching template found',
            suggestion: 'Use n8n_list_workflow_templates to see available templates'
          }, null, 2) }],
          isError: true,
        };
      }

      // Load the actual workflow from file
      const workflowData = loadTemplateFile(selectedTemplate.file);

      if (!workflowData) {
        return {
          content: [{ type: 'text', text: JSON.stringify({
            error: 'Failed to load template file',
            template: selectedTemplate
          }, null, 2) }],
          isError: true,
        };
      }

      const result = {
        metadata: selectedTemplate,
        workflow: workflowData,
        message: `Found template: ${selectedTemplate.name}`
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'n8n_create_workflow_from_template') {
      const templatesData = loadTemplatesMetadata();
      let selectedTemplate: TemplateMetadata | null = null;

      // If templateId provided, use it
      if ((args as any).templateId) {
        selectedTemplate = templatesData.templates.find(t => t.id === (args as any).templateId) || null;
      }
      // Otherwise, find best match based on user request
      else if ((args as any).userRequest) {
        selectedTemplate = findBestTemplate((args as any).userRequest, templatesData.templates);
      }

      if (!selectedTemplate) {
        return {
          content: [{ type: 'text', text: JSON.stringify({
            error: 'No matching template found',
            suggestion: 'Use n8n_list_workflow_templates to see available templates'
          }, null, 2) }],
          isError: true,
        };
      }

      // Load the actual workflow from file
      const workflowData = loadTemplateFile(selectedTemplate.file);

      if (!workflowData) {
        return {
          content: [{ type: 'text', text: JSON.stringify({
            error: 'Failed to load template file',
            template: selectedTemplate
          }, null, 2) }],
          isError: true,
        };
      }

      // Prepare workflow data for creation
      const newWorkflow: any = {
        name: (args as any).workflowName || workflowData.name || selectedTemplate.name,
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        settings: workflowData.settings || { executionOrder: 'v1' }
      };

      // Remove fields that shouldn't be sent to the API
      delete newWorkflow.id;
      delete newWorkflow.versionId;
      delete newWorkflow.meta;
      delete newWorkflow.tags; // Tags will be handled separately if needed
      delete newWorkflow.pinData;

      // Create the workflow
      const createResult = await n8nClient.createWorkflow(newWorkflow);

      if (createResult.error) {
        return {
          content: [{ type: 'text', text: JSON.stringify({
            error: createResult.error,
            template: selectedTemplate
          }, null, 2) }],
          isError: true,
        };
      }

      // Activate if requested
      if ((args as any).activate && createResult.data && createResult.data.id) {
        const activateResult = await n8nClient.activateWorkflow(createResult.data.id);
        if (activateResult.error) {
          return {
            content: [{ type: 'text', text: JSON.stringify({
              workflow: createResult.data,
              activationError: activateResult.error,
              message: 'Workflow created but activation failed',
              template: selectedTemplate
            }, null, 2) }],
          };
        }
      }

      const result = {
        success: true,
        workflow: createResult.data,
        template: selectedTemplate,
        message: `Successfully created workflow from template: ${selectedTemplate.name}`,
        url: createResult.data?.id ? `${N8N_BASE_URL}/workflow/${createResult.data.id}` : undefined
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// ========== START SERVER ==========

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('n8n MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
