export interface N8nConfig {
  baseUrl: string;
  apiKey: string;
}

export interface WorkflowData {
  name: string;
  active?: boolean;
  nodes?: WorkflowNode[];
  connections?: Record<string, any>;
  settings?: Record<string, any>;
  tags?: string[];
}

export interface WorkflowNode {
  id?: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, string>;
}

export interface ExecutionFilters {
  status?: 'error' | 'success' | 'waiting' | 'running' | 'canceled';
  workflowId?: string;
  projectId?: string;
  includeData?: boolean;
  limit?: number;
  cursor?: string;
}

export interface CredentialData {
  name: string;
  type: string;
  data: Record<string, any>;
  projectId?: string;
}

export interface TagData {
  name: string;
}

export interface VariableData {
  key: string;
  value: string;
  type?: 'string' | 'boolean' | 'number';
  projectId?: string;
}

export interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'global:owner' | 'global:admin' | 'global:member';
}

export interface ProjectData {
  name: string;
  type?: 'team' | 'personal';
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export interface FieldFilterOptions {
  fields?: string[];
}
