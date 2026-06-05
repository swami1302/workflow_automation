"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Trash2,
  Edit2,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWorkflowHttp } from "@/app/workflows/action/http";
import { WORKFLOWS_QUERY_KEY, WORKFLOW_CREATE_KEY } from "@/lib/constants/queryKeys";
import { createInitialDefinition, useWorkflowStore } from "@/store/useWorkflowStore";
import type { WorkflowListItem } from "@/lib/types/workflow";
import { toast } from "sonner";

function WorkflowsEmptyState({
  onCreate,
  isCreating,
}: {
  onCreate: () => void;
  isCreating: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
        <Zap className="w-8 h-8 text-orange-500" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">No workflows yet</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Create your first workflow to start automating your tasks visually.
        </p>
      </div>
      <Button
        onClick={onCreate}
        disabled={isCreating}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2 font-semibold"
      >
        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Create your first workflow
      </Button>
    </div>
  );
}

function WorkflowsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="min-w-[180px] text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Workflow Name
            </TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Status
            </TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Last Run
            </TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Version
            </TableHead>
            <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="py-4">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-14" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-10 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function WorkflowsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">Failed to load workflows</h3>
        <p className="text-sm text-slate-500">Check your connection and try again.</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function WorkflowRow({
  workflow,
  onToggleStatus,
  onDelete,
  onEditNavigate,
}: {
  workflow: WorkflowListItem;
  onToggleStatus: (id: string, current: WorkflowListItem["status"]) => void;
  onDelete: (id: string) => void;
  onEditNavigate: () => void;
}) {
  const isActive = workflow.status === "ACTIVE";

  return (
    <TableRow className="hover:bg-slate-50/50 transition-colors">
      <TableCell className="font-medium text-slate-900 py-4 text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="truncate max-w-[150px] sm:max-w-none">{workflow.title}</span>
          <span className="text-[10px] text-slate-400 font-normal font-mono">
            {workflow.id.slice(0, 8)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[10px]"
              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 text-[10px]"
          }
        >
          <div
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}
          />
          {isActive ? "Active" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-slate-600 italic text-xs whitespace-nowrap">
        {timeAgo(workflow.updatedAt)}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-white font-medium text-slate-500 text-[10px]">
          v{workflow.version}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-900"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild className="gap-2 cursor-pointer text-xs">
              <Link href={`/workflows/${workflow.id}`} onClick={onEditNavigate}>
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-xs"
              onClick={() => onToggleStatus(workflow.id, workflow.status)}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isActive ? "Pause" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 text-xs"
              onClick={() => onDelete(workflow.id)}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function WorkflowsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { getWorkflows, createWorkflow, updateWorkflowStatus, deleteWorkflow } = useWorkflowHttp();
  const queryClient = useQueryClient();
  const setWorkflowLoading = useWorkflowStore((state) => state.setWorkflowLoading);

  const {
    data: workflows,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [WORKFLOWS_QUERY_KEY],
    queryFn: getWorkflows,
  });

  // Created from the button click (an event handler) — not from a useEffect in the
  // builder — so the workflow always exists before the builder page mounts.
  const createMutation = useMutation({
    mutationKey: [WORKFLOW_CREATE_KEY],
    mutationFn: () =>
      createWorkflow({
        title: `Untitled Workflow (${new Date().toLocaleString()})`,
        status: "DRAFT",
        definition: createInitialDefinition(),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      // Show the builder skeleton (rendered by the shared workflows layout) now,
      // so it covers the route transition + the builder's initial GET. The builder
      // page takes over this flag once it mounts and clears it when loaded.
      setWorkflowLoading(true);
      router.push(`/workflows/${res.workflow_uuid}`);
    },
    onError: () => toast.error("Failed to create workflow"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: WorkflowListItem["status"] }) =>
      updateWorkflowStatus(id, status === "ACTIVE" ? "DRAFT" : "ACTIVE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
    },
    onError: () => toast.error("Failed to update workflow status"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      toast.success("Workflow deleted");
    },
    onError: () => toast.error("Failed to delete workflow"),
  });

  const filtered = (workflows ?? []).filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="min-h-16 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-0 shrink-0 gap-4 sm:gap-0">
          <h1 className="text-lg font-semibold text-slate-900">My Workflows</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search workflows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-slate-50 border-slate-200 h-9 text-sm focus-visible:ring-orange-500"
              />
            </div>
            <Button
              size="sm"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white gap-2 font-semibold shadow-sm text-xs h-9 w-full sm:w-auto"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              CREATE WORKFLOW
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <WorkflowsTableSkeleton />
            ) : isError ? (
              <WorkflowsErrorState onRetry={refetch} />
            ) : filtered.length === 0 ? (
              search ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                  <p className="text-sm font-medium text-slate-700">No results for &quot;{search}&quot;</p>
                  <p className="text-xs text-slate-400">Try a different search term</p>
                </div>
              ) : (
                <WorkflowsEmptyState
                  onCreate={() => createMutation.mutate()}
                  isCreating={createMutation.isPending}
                />
              )
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="min-w-[180px] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Workflow Name
                      </TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Last Run
                      </TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Version
                      </TableHead>
                      <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((workflow) => (
                      <WorkflowRow
                        key={workflow.id}
                        workflow={workflow}
                        onToggleStatus={(id, status) =>
                          toggleStatusMutation.mutate({ id, status })
                        }
                        onDelete={(id) => deleteMutation.mutate(id)}
                        onEditNavigate={() => setWorkflowLoading(true)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
