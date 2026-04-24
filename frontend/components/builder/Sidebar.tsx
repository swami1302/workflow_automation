"use client";

import React from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { NodeConfig } from './NodeConfig';

export const Sidebar = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);

  if (!selectedNodeId) return null;

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shrink-0 shadow-sm z-10 animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b bg-gray-50/50">
          <h2 className="text-sm font-semibold text-gray-800 tracking-tight uppercase">Configuration</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-gray-200 rounded-full" 
            onClick={() => setSelectedNodeId(null)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <NodeConfig nodeId={selectedNodeId} />
        </ScrollArea>
      </div>
    </aside>
  );
};
