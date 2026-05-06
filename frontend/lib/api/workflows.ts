'use client';

import { useMemo } from 'react';
import { useAxios } from '@/context/AxiosContext';
import type {
  Workflow,
  CreateWorkflowPayload,
  UpdateWorkflowPayload,
  WorkflowStatus,
} from '@/lib/types/workflow';

export function useWorkflowsApi() {
  const axios = useAxios();

  return useMemo(
    () => ({
      list: async (): Promise<Workflow[]> => {
        const { data } = await axios.get<Workflow[]>('/workflows');
        return data;
      },

      create: async (payload: CreateWorkflowPayload): Promise<Workflow> => {
        const { data } = await axios.post<Workflow>('/workflows', payload);
        return data;
      },

      update: async (id: string, payload: UpdateWorkflowPayload): Promise<Workflow> => {
        const { data } = await axios.patch<Workflow>(`/workflows/${id}`, payload);
        return data;
      },

      updateStatus: async (id: string, status: WorkflowStatus): Promise<Workflow> => {
        const { data } = await axios.patch<Workflow>(`/workflows/${id}/status`, { status });
        return data;
      },

      remove: async (id: string): Promise<void> => {
        await axios.delete(`/workflows/${id}`);
      },
    }),
    [axios],
  );
}
