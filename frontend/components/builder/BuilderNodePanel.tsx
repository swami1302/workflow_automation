"use client";

import React from "react";
import { Globe, GitBranch, Clock, FileText, Square, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const DRAGGABLE_NODES = [
  {
    type: "http",
    name: "HTTP",
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    description: "Call external APIs",
  },
  {
    type: "binary",
    name: "Binary",
    icon: GitBranch,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    description: "Branch on conditions",
  },
  {
    type: "delay",
    name: "Delay",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    description: "Pause execution",
  },
  {
    type: "log",
    name: "Log",
    icon: FileText,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    description: "Record & debug data",
  },
];

function DraggableNodeCard({
  type,
  name,
  icon: Icon,
  color,
  bg,
  border,
  description,
}: (typeof DRAGGABLE_NODES)[number]) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing",
        "hover:shadow-sm transition-all select-none group",
        "bg-white border-slate-200 hover:border-slate-300"
      )}
    >
      <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", bg, border, "border")}>
        <Icon className={cn("w-4 h-4", color)} />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 leading-tight">
          {name}
        </span>
        <span className="text-[10px] text-slate-400 leading-tight truncate">{description}</span>
      </div>
    </div>
  );
}

export const BuilderNodePanel = () => {
  return (
    <aside className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Node Library</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Drag onto canvas to add</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {DRAGGABLE_NODES.map((node) => (
          <DraggableNodeCard key={node.type} {...node} />
        ))}
      </div>
    </aside>
  );
};
