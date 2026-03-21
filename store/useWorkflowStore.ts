import { create } from 'zustand';
import { 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect 
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { graphStratify, sugiyama } from 'd3-dag';

type WorkflowStore = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  addNode: (type: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  deleteBinaryNode: (nodeId: string, option: 'yes-path' | 'no-path' | 'both') => void;
  getLayoutedElements: () => void;
};

const nodeWidth = 200;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  try {
    const stratify = graphStratify();
    const dag = stratify(
      nodes.map((node) => ({
        id: node.id,
        parentIds: edges
          .filter((edge) => edge.target === node.id)
          .map((edge) => edge.source),
      }))
    );

    const layout = sugiyama()
      .nodeSize([nodeWidth + 100, nodeHeight + 120]); // Spacing between nodes

    layout(dag);

    const layoutedNodes = nodes.map((node) => {
      const dagNode = [...dag.nodes()].find((d) => d.data.id === node.id);
      return {
        ...node,
        position: {
          x: (dagNode?.x || 0),
          y: (dagNode?.y || 0),
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  } catch (e) {
    console.error("Layout error:", e);
    return { nodes, edges };
  }
};

const initialNodes: Node[] = [
  { 
    id: 'trigger-1', 
    type: 'trigger', 
    position: { x: 250, y: 100 }, 
    data: { label: 'When trigger fires' } 
  },
  { 
    id: 'exit-1', 
    type: 'exit', 
    position: { x: 250, y: 300 }, 
    data: { label: 'End' } 
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'trigger-1', target: 'exit-1', animated: true, type: 'custom' }
];

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedEdgeId: null,

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),

  getLayoutedElements: () => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },

  deleteNode: (nodeId) => {
    const { nodes, edges } = get();
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    
    if (!nodeToDelete || nodeToDelete.type === 'trigger' || nodeToDelete.type === 'exit') {
      return; 
    }

    const incomingEdges = edges.filter((e) => e.target === nodeId);
    const outgoingEdges = edges.filter((e) => e.source === nodeId);

    let newEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

    if (incomingEdges.length === 1 && outgoingEdges.length === 1) {
      const source = incomingEdges[0].source;
      const sourceHandle = incomingEdges[0].sourceHandle;
      const target = outgoingEdges[0].target;
      
      const connectorEdge: Edge = {
        id: `e-${source}-${target}`,
        source,
        sourceHandle, 
        target,
        animated: true,
        type: 'custom',
      };
      newEdges.push(connectorEdge);
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes.filter((n) => n.id !== nodeId),
      newEdges
    );

    set({
      nodes: layoutedNodes,
      edges: layoutedEdges,
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const newEdges = addEdge(connection, get().edges);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(get().nodes, newEdges);
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges,
    });
  },

  deleteBinaryNode: (nodeId, option) => {
    const { nodes, edges } = get();
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    if (!nodeToDelete) return;

    const nodesToRemove = new Set<string>([nodeId]);
    const edgesToRemove = new Set<string>(
      edges.filter((e) => e.source === nodeId || e.target === nodeId).map((e) => e.id)
    );

    const getDownstreamElements = (startNodeId: string, startHandleId?: string) => {
      const visitedNodes = new Set<string>();
      const visitedEdges = new Set<string>();
      const queue = [{ id: startNodeId, handle: startHandleId }];

      while (queue.length > 0) {
        const { id, handle } = queue.shift()!;
        const outgoing = edges.filter(
          (e) => e.source === id && (!handle || e.sourceHandle === handle)
        );

        outgoing.forEach((edge) => {
          visitedEdges.add(edge.id);
          if (!visitedNodes.has(edge.target)) {
            const targetNode = nodes.find(n => n.id === edge.target);
            if (targetNode && targetNode.type !== 'trigger') {
              visitedNodes.add(edge.target);
              queue.push({ id: edge.target });
            }
          }
        });
      }
      return { nodes: visitedNodes, edges: visitedEdges };
    };

    let targetForRelink: string | null = null;

    if (option === 'yes-path') {
      const yesDownstream = getDownstreamElements(nodeId, 'yes');
      yesDownstream.nodes.forEach(id => nodesToRemove.add(id));
      yesDownstream.edges.forEach(id => edgesToRemove.add(id));
      
      const noEdge = edges.find(e => e.source === nodeId && e.sourceHandle === 'no');
      if (noEdge) targetForRelink = noEdge.target;
    } else if (option === 'no-path') {
      const noDownstream = getDownstreamElements(nodeId, 'no');
      noDownstream.nodes.forEach(id => nodesToRemove.add(id));
      noDownstream.edges.forEach(id => edgesToRemove.add(id));
      
      const yesEdge = edges.find(e => e.source === nodeId && e.sourceHandle === 'yes');
      if (yesEdge) targetForRelink = yesEdge.target;
    } else if (option === 'both') {
      const yesDownstream = getDownstreamElements(nodeId, 'yes');
      const noDownstream = getDownstreamElements(nodeId, 'no');
      [...yesDownstream.nodes, ...noDownstream.nodes].forEach(id => nodesToRemove.add(id));
      [...yesDownstream.edges, ...noDownstream.edges].forEach(id => edgesToRemove.add(id));
    }

    let updatedNodes = nodes.filter(n => !nodesToRemove.has(n.id));
    let updatedEdges = edges.filter(e => !edgesToRemove.has(e.id));

    const incomingEdges = edges.filter((e) => e.target === nodeId);
    const parentId = incomingEdges.length > 0 ? incomingEdges[0].source : null;
    const parentHandle = incomingEdges.length > 0 ? incomingEdges[0].sourceHandle : undefined;

    if (parentId) {
      if (option === 'both') {
        const exitId = `exit-${uuidv4()}`;
        updatedNodes.push({
          id: exitId,
          type: 'exit',
          position: { x: nodeToDelete.position.x, y: nodeToDelete.position.y + 100 },
          data: { label: 'End' },
        });
        updatedEdges.push({
          id: `e-${parentId}-${exitId}`,
          source: parentId,
          sourceHandle: parentHandle,
          target: exitId,
          animated: true,
          type: 'custom',
        });
      } else if (targetForRelink) {
        updatedEdges.push({
          id: `e-${parentId}-${targetForRelink}`,
          source: parentId,
          sourceHandle: parentHandle,
          target: targetForRelink,
          animated: true,
          type: 'custom',
        });
      }
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);
    set({ nodes: layoutedNodes, edges: layoutedEdges, selectedNodeId: null });
  },

  addNode: (type, data) => {
    const { nodes, edges, selectedEdgeId } = get();
    const id = `${type}-${uuidv4()}`;

    let updatedNodes = [...nodes];
    let updatedEdges = [...edges];

    if (selectedEdgeId) {
      const edgeToSplit = edges.find((e) => e.id === selectedEdgeId);
      if (edgeToSplit) {
        const sourceNode = nodes.find((n) => n.id === edgeToSplit.source);
        const targetNode = nodes.find((n) => n.id === edgeToSplit.target);

        if (sourceNode && targetNode) {
          const newNode: Node = {
            id,
            type,
            position: { x: 0, y: 0 }, 
            data,
          };

          const edgeBefore: Edge = {
            id: `e-${sourceNode.id}-${id}`,
            source: sourceNode.id,
            sourceHandle: edgeToSplit.sourceHandle,
            target: id,
            animated: true,
            type: 'custom',
          };

          const edgeAfter: Edge = {
            id: `e-${id}-${targetNode.id}`,
            source: id,
            sourceHandle: type === 'binary' ? 'yes' : undefined,
            target: targetNode.id,
            animated: true,
            type: 'custom',
          };

          updatedNodes = [...nodes, newNode];
          updatedEdges = [
            ...edges.filter((e) => e.id !== selectedEdgeId),
            edgeBefore,
            edgeAfter,
          ];

          if (type === 'binary') {
            const exitId = `exit-${uuidv4()}`;
            updatedNodes.push({
              id: exitId,
              type: 'exit',
              position: { x: 0, y: 0 },
              data: { label: 'End' },
            });
            updatedEdges.push({
              id: `e-${id}-${exitId}`,
              source: id,
              sourceHandle: 'no',
              target: exitId,
              animated: true,
              type: 'custom',
            });
          }
        }
      }
    } else {
      const newNode: Node = {
        id,
        type,
        position: { x: 0, y: 0 },
        data,
      };
      updatedNodes.push(newNode);
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges,
      selectedEdgeId: null
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
}));
