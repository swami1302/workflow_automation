"use client";

import React, { useMemo } from 'react';
import { ReactFlow, Background, Panel, MiniMap, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '@/store/useWorkflowStore';

// Import Custom Node Types
import TriggerNode from '@/components/nodes/trigger/TriggerNode';
import ExitNode from '@/components/nodes/exit/ExitNode';
import CustomEdge from '../edges/CustomEdge';
import HttpNode from '../nodes/http/HttpNode';
import BinaryNode from '../nodes/Binary/BinaryNode';
import LogNode from '../nodes/log/LogNode';
import DelayNode from '../nodes/delay/DelayNode';

export const WorkflowBuilder = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useWorkflowStore();

  // Register custom node types with useMemo to prevent re-renders
  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    http: HttpNode,
    binary: BinaryNode,
    log: LogNode,
    delay: DelayNode,
    exit: ExitNode,
  }), []);

  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);


  return (
    <div className="flex-1 w-full h-full bg-slate-50 relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode="light"
        fitView
      >
        <Background />
        <Panel position="bottom-left" className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm m-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Canvas Status: </span>
            <span className="text-xs font-bold text-gray-700">Live Editing</span>
          </div>
        </Panel>
        <MiniMap 
          nodeStrokeWidth={2} 
          className="rounded-lg border border-gray-200 shadow-sm"
        />
        <Controls 
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden " 
          showInteractive={false} 
        />
      </ReactFlow>
    </div>
  );
};
