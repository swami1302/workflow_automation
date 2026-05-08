export type WorkflowStatus = 'active' | 'inactive';

export type WorkflowType =
  | 'Automation'
  | 'Reporting'
  | 'Monitoring'
  | 'Maintenance'
  | 'Integration'
  | 'Custom';

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  nodeCount: number;
  lastRunAt: string | null;
  type: WorkflowType;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateWorkflowPayload {
  name: string;
  type?: WorkflowType;
}

export interface UpdateWorkflowPayload {
  name?: string;
  type?: WorkflowType;
}

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
