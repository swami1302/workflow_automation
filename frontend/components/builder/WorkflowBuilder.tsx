"use client";

import React, { useMemo, useCallback } from 'react';
import { ReactFlow, Background, Panel, MiniMap, Controls, useReactFlow, ReactFlowProvider } from '@xyflow/react';
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

const WorkflowBuilderContent = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);
  const setSelectedEdgeId = useWorkflowStore((state) => state.setSelectedEdgeId);
  const addNode = useWorkflowStore((state) => state.addNode);

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNodeData = {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      };

      // The store's addNode currently handles layouting, but it doesn't take position.
      // We'll use the existing addNode which adds it to the graph.
      addNode(type, newNodeData);
    },
    [screenToFlowPosition, addNode],
  );

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
        onNodeClick={(_, node) => {
          if (node.type !== 'exit') {
            setSelectedNodeId(node.id);
          } else {
            setSelectedNodeId(null);
          }
        }}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode="light"
        fitView
      >
        <Background />
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

export const WorkflowBuilder = () => (
  <ReactFlowProvider>
    <WorkflowBuilderContent />
  </ReactFlowProvider>
);
