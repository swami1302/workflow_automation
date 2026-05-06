"use client";

import React, { useMemo, useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  useReactFlow,
  useStore as useRFStore,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '@/store/useWorkflowStore';

import TriggerNode from '@/components/nodes/trigger/TriggerNode';
import ExitNode from '@/components/nodes/exit/ExitNode';
import CustomEdge from '../edges/CustomEdge';
import HttpNode from '../nodes/http/HttpNode';
import BinaryNode from '../nodes/Binary/BinaryNode';
import LogNode from '../nodes/log/LogNode';
import DelayNode from '../nodes/delay/DelayNode';

// ─── Geometry helper ──────────────────────────────────────────────────────────

function distanceToSegment(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DROP_THRESHOLD = 40; // flow units

// ─── Inner builder ────────────────────────────────────────────────────────────

const WorkflowBuilderContent = () => {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const setSelectedEdgeId = useWorkflowStore((s) => s.setSelectedEdgeId);
  const addNode = useWorkflowStore((s) => s.addNode);

  const { screenToFlowPosition } = useReactFlow();

  // React Flow's internal node lookup — gives us actual measured dimensions
  const nodeLookup = useRFStore((s) => s.nodeLookup);

  // Track which edge the drag is hovering over
  const [dragOverEdgeId, setDragOverEdgeId] = useState<string | null>(null);
  const dragOverEdgeIdRef = useRef<string | null>(null);

  const updateDragOverEdge = useCallback((id: string | null) => {
    if (id !== dragOverEdgeIdRef.current) {
      dragOverEdgeIdRef.current = id;
      setDragOverEdgeId(id);
    }
  }, []);

  // Returns actual bottom-center of source node and top-center of target node
  const getEdgeEndpoints = useCallback(
    (sourceId: string, targetId: string) => {
      const src = nodeLookup.get(sourceId);
      const tgt = nodeLookup.get(targetId);
      if (!src || !tgt) return null;

      const srcPos = src.internals.positionAbsolute;
      const tgtPos = tgt.internals.positionAbsolute;
      const srcW = src.measured?.width ?? 200;
      const srcH = src.measured?.height ?? 80;
      const tgtW = tgt.measured?.width ?? 200;

      return {
        sx: srcPos.x + srcW / 2,
        sy: srcPos.y + srcH,
        tx: tgtPos.x + tgtW / 2,
        ty: tgtPos.y,
      };
    },
    [nodeLookup],
  );

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      // Only run proximity check when actually dragging a node from the panel
      if (!event.dataTransfer.types.includes('application/reactflow')) return;

      const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      let closestEdgeId: string | null = null;
      let minDist = DROP_THRESHOLD;

      for (const edge of edges) {
        const ep = getEdgeEndpoints(edge.source, edge.target);
        if (!ep) continue;
        const dist = distanceToSegment(flowPos.x, flowPos.y, ep.sx, ep.sy, ep.tx, ep.ty);
        if (dist < minDist) {
          minDist = dist;
          closestEdgeId = edge.id;
        }
      }

      updateDragOverEdge(closestEdgeId);
    },
    [edges, screenToFlowPosition, getEdgeEndpoints, updateDragOverEdge],
  );

  // Guard against dragLeave firing when cursor moves into a child element
  const onDragLeave = useCallback((event: React.DragEvent) => {
    if ((event.currentTarget as HTMLElement).contains(event.relatedTarget as HTMLElement)) return;
    updateDragOverEdge(null);
  }, [updateDragOverEdge]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      if (dragOverEdgeIdRef.current) {
        setSelectedEdgeId(dragOverEdgeIdRef.current);
      }

      addNode(type, { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` });
      updateDragOverEdge(null);
    },
    [addNode, setSelectedEdgeId, updateDragOverEdge],
  );

  // Inject highlight style on the hovered edge — no store mutation needed
  const displayEdges = useMemo(
    () =>
      edges.map((edge) =>
        edge.id === dragOverEdgeId
          ? {
              ...edge,
              style: { stroke: '#f97316', strokeWidth: 3 },
              data: { ...edge.data, isDropTarget: true },
            }
          : edge,
      ),
    [edges, dragOverEdgeId],
  );

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      http: HttpNode,
      binary: BinaryNode,
      log: LogNode,
      delay: DelayNode,
      exit: ExitNode,
    }),
    [],
  );

  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  return (
    <div className="flex-1 w-full h-full bg-slate-50 relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.type !== 'exit' ? node.id : null);
        }}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
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
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
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
