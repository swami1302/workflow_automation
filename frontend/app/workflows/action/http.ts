'use client';

import { useMemo } from 'react';
import { useAxios } from '@/context/AxiosContext';
import type {
  Workflow,
  WorkflowListItem,
  CreateWorkflowPayload,
  CreateWorkflowResponse,
  UpdateWorkflowPayload,
  UpdateWorkflowResponse,
  DeleteWorkflowResponse,
  WorkflowStatus,
} from '@/lib/types/workflow';

export function useWorkflowHttp() {
  const axios = useAxios();

  return useMemo(
    () => ({
      getWorkflows: async (): Promise<WorkflowListItem[]> => {
        const { data } = await axios.get<WorkflowListItem[]>('/workflows');
        return data;
      },

      getWorkflow: async (id: string): Promise<Workflow> => {
        const { data } = await axios.get<Workflow>(`/workflows/${id}`);
        return data;
      },

      createWorkflow: async (payload: CreateWorkflowPayload): Promise<CreateWorkflowResponse> => {
        const { data } = await axios.post<CreateWorkflowResponse>('/workflows', payload);
        return data;
      },

      updateWorkflow: async (id: string, payload: UpdateWorkflowPayload): Promise<UpdateWorkflowResponse> => {
        const { data } = await axios.put<UpdateWorkflowResponse>(`/workflows/${id}`, payload);
        return data;
      },

      updateWorkflowStatus: async (id: string, status: WorkflowStatus): Promise<UpdateWorkflowResponse> => {
        const { data } = await axios.put<UpdateWorkflowResponse>(`/workflows/${id}`, { status });
        return data;
      },

      deleteWorkflow: async (id: string): Promise<DeleteWorkflowResponse> => {
        const { data } = await axios.delete<DeleteWorkflowResponse>(`/workflows/${id}`);
        return data;
      },
    }),
    [axios],
  );
}
