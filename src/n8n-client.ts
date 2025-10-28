import axios, { AxiosInstance } from 'axios';
import type {
  N8nConfig,
  WorkflowData,
  ExecutionFilters,
  CredentialData,
  TagData,
  VariableData,
  UserData,
  ProjectData,
  ApiResponse
} from './types.js';

export class N8nClient {
  private client: AxiosInstance;

  constructor(config: N8nConfig) {
    this.client = axios.create({
      baseURL: `${config.baseUrl}/api/v1`,
      headers: {
        'X-N8N-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  // ========== WORKFLOWS ==========

  async createWorkflow(workflow: WorkflowData): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/workflows', workflow);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getWorkflows(filters?: {
    active?: boolean;
    tags?: string;
    name?: string;
    projectId?: string;
    limit?: number;
    cursor?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/workflows', { params: filters });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getWorkflow(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/workflows/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateWorkflow(id: string, workflow: Partial<WorkflowData>): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/workflows/${id}`, workflow);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteWorkflow(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/workflows/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async activateWorkflow(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post(`/workflows/${id}/activate`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deactivateWorkflow(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post(`/workflows/${id}/deactivate`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async transferWorkflow(id: string, destinationProjectId: string): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/workflows/${id}/transfer`, {
        destinationProjectId,
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getWorkflowTags(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/workflows/${id}/tags`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateWorkflowTags(id: string, tagIds: string[]): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/workflows/${id}/tags`, { tagIds });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== EXECUTIONS ==========

  async getExecutions(filters?: ExecutionFilters): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/executions', { params: filters });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getExecution(id: string, includeData = false): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/executions/${id}`, {
        params: { includeData },
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteExecution(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/executions/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async retryExecution(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post(`/executions/${id}/retry`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== CREDENTIALS ==========

  async createCredential(credential: CredentialData): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/credentials', credential);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteCredential(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/credentials/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getCredentialSchema(credentialTypeName: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/credentials/schema/${credentialTypeName}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async transferCredential(id: string, destinationProjectId: string): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/credentials/${id}/transfer`, {
        destinationProjectId,
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== TAGS ==========

  async createTag(tag: TagData): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/tags', tag);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getTags(): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/tags');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getTag(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/tags/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateTag(id: string, tag: TagData): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/tags/${id}`, tag);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteTag(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/tags/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== VARIABLES ==========

  async createVariable(variable: VariableData): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/variables', variable);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getVariables(filters?: { projectId?: string; state?: string }): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/variables', { params: filters });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateVariable(id: string, variable: Partial<VariableData>): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/variables/${id}`, variable);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteVariable(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/variables/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== USERS ==========

  async getUsers(includeRole = false): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/users', { params: { includeRole } });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async createUsers(users: UserData[]): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/users', users);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getUser(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/users/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/users/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async changeUserRole(id: string, role: string): Promise<ApiResponse> {
    try {
      const response = await this.client.patch(`/users/${id}/role`, { role });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== PROJECTS ==========

  async createProject(project: ProjectData): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/projects', project);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getProjects(): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/projects');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateProject(id: string, project: Partial<ProjectData>): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/projects/${id}`, project);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteProject(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/projects/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async addUserToProject(projectId: string, userId: string, role: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post(`/projects/${projectId}/users`, {
        userId,
        role,
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async removeUserFromProject(projectId: string, userId: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/projects/${projectId}/users/${userId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async changeUserProjectRole(projectId: string, userId: string, role: string): Promise<ApiResponse> {
    try {
      const response = await this.client.patch(`/projects/${projectId}/users/${userId}`, {
        role,
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== OTHER ==========

  async generateAudit(): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/audit');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async pullSourceControl(): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/source-control/pull');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }
}
