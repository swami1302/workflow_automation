export type WorkflowStatus = 'DRAFT' | 'ACTIVE';

export interface WorkflowDefinition {
  nodes: Record<string, unknown>[];
  edges: Record<string, unknown>[];
}

export interface WorkflowListItem {
  id: string;
  title: string;
  status: WorkflowStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow extends WorkflowListItem {
  userId: string;
  definition: WorkflowDefinition;
}

export interface CreateWorkflowPayload {
  title: string;
  status?: WorkflowStatus;
  definition?: WorkflowDefinition;
}

export interface UpdateWorkflowPayload {
  title?: string;
  status?: WorkflowStatus;
  definition?: WorkflowDefinition;
}

export interface CreateWorkflowResponse {
  message: string;
  workflow_uuid: string;
}

export interface UpdateWorkflowResponse {
  message: string;
  workflow_uuid: string;
  version: number;
}

export interface DeleteWorkflowResponse {
  message: string;
}

// ─── Node data types ──────────────────────────────────────────────────────────

export interface BaseNodeData {
  label: string;
}

export interface TriggerNodeData extends BaseNodeData {
  every: number;
  unit: 'Seconds' | 'Minutes' | 'Hours' | 'Days' | 'Months';
}

export interface HttpNodeData extends BaseNodeData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  timeout?: number;
  authType: 'None' | 'Bearer token' | 'Basic auth' | 'API key';
  authValue?: string;
  headers?: { key: string; value: string }[];
  body?: string;
  followRedirects?: boolean;
}

export interface BinaryCondition {
  leftOperand: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not contains' | 'is empty' | 'is not empty';
  rightOperand?: string;
  logicConnector?: 'AND' | 'OR';
}

export interface BinaryNodeData extends BaseNodeData {
  conditions: BinaryCondition[];
}

export interface LogNodeData extends BaseNodeData {
  logLevel: 'Info' | 'Warn' | 'Error' | 'Debug';
  messageTemplate: string;
  includeFullPayload?: boolean;
  destination: 'Console' | 'External logger' | 'File';
}

export interface DelayNodeData extends BaseNodeData {
  duration: number;
  unit: 'Seconds' | 'Minutes' | 'Hours' | 'Days' | 'Months';
}

export type AppNodeData =
  | TriggerNodeData
  | HttpNodeData
  | BinaryNodeData
  | LogNodeData
  | DelayNodeData
  | BaseNodeData;
