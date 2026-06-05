"use client";

import { useWorkflowStore } from "@/store/useWorkflowStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowsLayout({ children }: { children: React.ReactNode }) {
  const isWorkflowLoading = useWorkflowStore((state) => state.isWorkflowLoading);

  return (
    <>
      {children}

      {isWorkflowLoading && (
        <div className="absolute inset-0 z-50 flex flex-col h-screen w-screen bg-white font-sans antialiased overflow-hidden">
          {/* Header Skeleton */}
          <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="h-6 w-[1px] bg-slate-200 mx-1" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>

          <div className="flex flex-1 relative overflow-hidden">
            {/* Node Panel Skeleton */}
            <div className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden p-3 gap-3">
              <div className="space-y-1 mb-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>

            {/* Main Canvas Skeleton */}
            <div className="flex-1 bg-slate-50 relative overflow-hidden p-8 flex items-center justify-center">
              <div className="flex flex-col items-center gap-20">
                <Skeleton className="h-16 w-52 rounded-xl" />
                <div className="relative">
                  <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[2px] h-10 bg-slate-200 animate-pulse" />
                  <Skeleton className="h-16 w-52 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
