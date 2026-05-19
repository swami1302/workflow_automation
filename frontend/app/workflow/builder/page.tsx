"use client";

import { useEffect, Suspense } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Node, Edge } from "@xyflow/react";
import { useSearchParams, useRouter } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/builder/Sidebar";
import { WorkflowBuilder } from "@/components/builder/WorkflowBuilder";
import { BuilderNodePanel } from "@/components/builder/BuilderNodePanel";
import { MobileViewGuard } from "@/components/builder/MobileViewGuard";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { useWorkflowHttp } from "@/app/workflow/action/http";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { useMutationEvents } from "@/hooks/useMutationEvents";
import {
  WORKFLOW_CREATE_KEY,
  WORKFLOW_GET_KEY,
  WORKFLOW_UPDATE_KEY,
} from "@/lib/constants/queryKeys";
import type { Workflow } from "@/lib/types/workflow";
import { Skeleton } from "@/components/ui/skeleton";

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id");

  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const workflowName = useWorkflowStore((state) => state.workflowName);
  const workflowId = useWorkflowStore((state) => state.workflowId);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const setWorkflowId = useWorkflowStore((state) => state.setWorkflowId);
  const setWorkflowLoading = useWorkflowStore((state) => state.setWorkflowLoading);

  const { getWorkflow, createWorkflow, updateWorkflow } = useWorkflowHttp();

  // ── Sync ID from URL ──────────────────────────────────────────────────────
  useEffect(() => {
    if (idFromUrl && idFromUrl !== workflowId) {
      setWorkflowId(idFromUrl);
    }
  }, [idFromUrl, workflowId, setWorkflowId]);

  // ── Load existing workflow ─────────────────────────────────────────────────
  const onWorkflowLoaded = (data: Workflow) => {
    setNodes(data.definition.nodes as Node[]);
    setEdges(data.definition.edges as Edge[]);
  };

  const query = useQuery({
    queryKey: [WORKFLOW_GET_KEY, workflowId],
    queryFn: () => getWorkflow(workflowId!),
    enabled: !!workflowId,
    staleTime: Infinity,
  });

  useQueryEvents(query, {
    onSuccess: onWorkflowLoaded,
    onError: () => toast.error("Failed to load workflow"),
  });

  // ── Create on first load ───────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationKey: [WORKFLOW_CREATE_KEY],
    mutationFn: createWorkflow,
  });

  useMutationEvents(createMutation, {
    onSuccess: (res) => {
      setWorkflowId(res.workflow_uuid);
      router.replace(`/workflow/builder?id=${res.workflow_uuid}`);
    },
    onError: () => toast.error("Failed to initialise workflow"),
  });

  useEffect(() => {
    if (!workflowId && !idFromUrl) {
      createMutation.mutate({
        title: `${workflowName} (${new Date().toLocaleString()})`,
        status: "DRAFT",
        definition: {
          nodes: nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, type: e.type })),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync Loading State ─────────────────────────────────────────────────────
  useEffect(() => {
    const isActuallyLoading = (query.isPending && !!workflowId) || createMutation.isPending;
    setWorkflowLoading(isActuallyLoading);
  }, [query.isPending, workflowId, createMutation.isPending, setWorkflowLoading]);

  // ── Reset Loading on Unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      setWorkflowLoading(false);
    };
  }, [setWorkflowLoading]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationKey: [WORKFLOW_UPDATE_KEY],
    mutationFn: ({ id, ...payload }: { id: string; title: string; definition: Workflow["definition"] }) =>
      updateWorkflow(id, payload),
  });

  useMutationEvents(saveMutation, {
    onSuccess: () => toast.success("Workflow saved"),
    onError: () => toast.error("Failed to save workflow"),
  });

  const handleSave = () => {
    if (!workflowId) {
      toast.error("Workflow is still being initialised");
      return;
    }
    saveMutation.mutate({
      id: workflowId,
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

export default function BuilderPage() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-screen rounded-none" />}>
      <BuilderContent />
    </Suspense>
  );
}
