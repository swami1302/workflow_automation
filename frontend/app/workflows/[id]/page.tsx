"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Node, Edge } from "@xyflow/react";
import { useParams } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/builder/Sidebar";
import { WorkflowBuilder } from "@/components/builder/WorkflowBuilder";
import { BuilderNodePanel } from "@/components/builder/BuilderNodePanel";
import { MobileViewGuard } from "@/components/builder/MobileViewGuard";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { useWorkflowHttp } from "@/app/workflows/action/http";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { useMutationEvents } from "@/hooks/useMutationEvents";
import { WORKFLOW_GET_KEY, WORKFLOW_UPDATE_KEY } from "@/lib/constants/queryKeys";
import type { Workflow } from "@/lib/types/workflow";

export default function BuilderPage() {
  // Path param from /workflows/[id] — always present, no "create on mount" needed
  const { id: workflowId } = useParams<{ id: string }>();

  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const workflowName = useWorkflowStore((state) => state.workflowName);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const setWorkflowId = useWorkflowStore((state) => state.setWorkflowId);
  const setWorkflowName = useWorkflowStore((state) => state.setWorkflowName);
  const setWorkflowLoading = useWorkflowStore((state) => state.setWorkflowLoading);

  const { getWorkflow, updateWorkflow } = useWorkflowHttp();

  // ── Load workflow ───────────────────────────────────────────────────────────
  const onWorkflowLoaded = (data: Workflow) => {
    setWorkflowId(data.id);
    setWorkflowName(data.title);
    setNodes(data.definition.nodes as Node[]);
    setEdges(data.definition.edges as Edge[]);
  };

  const query = useQuery({
    queryKey: [WORKFLOW_GET_KEY, workflowId],
    queryFn: () => getWorkflow(workflowId),
    staleTime: 0, // always refetch on open so we never edit a stale cached copy
  });

  useQueryEvents(query, {
    onSuccess: onWorkflowLoaded,
    onError: () => toast.error("Failed to load workflow"),
  });

  // ── Sync loading state to the store (drives the layout skeleton) ────────────
  useEffect(() => {
    setWorkflowLoading(query.isPending);
    return () => setWorkflowLoading(false);
  }, [query.isPending, setWorkflowLoading]);

  // ── Save ────────────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationKey: [WORKFLOW_UPDATE_KEY],
    mutationFn: (payload: { title: string; definition: Workflow["definition"] }) =>
      updateWorkflow(workflowId, payload),
  });

  useMutationEvents(saveMutation, {
    onSuccess: () => toast.success("Workflow saved"),
    onError: () => toast.error("Failed to save workflow"),
  });

  const handleSave = () => {
    saveMutation.mutate({
      title: workflowName,
      definition: {
        nodes: nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
        edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, type: e.type })),
      },
    });
  };

  return (
    <>
      <MobileViewGuard />
      <main className="flex flex-col h-screen w-screen bg-white font-sans antialiased overflow-hidden">
        <Header onSave={handleSave} />
        <section className="flex flex-1 relative overflow-hidden">
          <BuilderNodePanel />
          <WorkflowBuilder />
          {selectedNodeId && <Sidebar />}
        </section>
      </main>
    </>
  );
}
