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
