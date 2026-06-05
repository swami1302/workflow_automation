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

type WorkflowStore = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  workflowName: string;
  workflowId: string | null;
  isWorkflowLoading: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setWorkflowName: (name: string) => void;
  setWorkflowId: (id: string) => void;
  setWorkflowLoading: (isLoading: boolean) => void;
  addNode: (type: string, data?: Record<string, unknown>) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  deleteNode: (nodeId: string) => void;
  deleteBinaryNode: (nodeId: string, option: 'yes-path' | 'no-path' | 'both') => void;
  getLayoutedElements: () => void;
};

const nodeWidth = 200;
const nodeHeight = 80;

const getInitialNodeData = (type: string, label?: string) => {
  const baseLabel = label || `${type.charAt(0).toUpperCase() + type.slice(1)} Node`;
  
  switch (type) {
    case 'trigger':
      return { label: baseLabel, every: 1, unit: 'Minutes' };
    case 'http':
      return { 
        label: baseLabel, 
        method: 'GET', 
        url: '', 
        timeout: 5000, 
        authType: 'None', 
        headers: [], 
        body: '',
        followRedirects: true 
      };
    case 'binary':
      return { 
        label: baseLabel, 
        conditions: [{ leftOperand: '', operator: '==', rightOperand: '', logicConnector: 'AND' }] 
      };
    case 'log':
      return { 
        label: baseLabel, 
        logLevel: 'Info', 
        messageTemplate: '', 
        includeFullPayload: false, 
        destination: 'Console' 
      };
    case 'delay':
      return { label: baseLabel, duration: 1, unit: 'Minutes' };
    default:
      return { label: baseLabel };
  }
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  // 1. Build adjacency lists and track incoming edges to find roots
  const childrenMap: Record<string, { id: string; handle?: string | null }[]> = {};
  const incomingCount: Record<string, number> = {};

  nodes.forEach((n) => {
    childrenMap[n.id] = [];
    incomingCount[n.id] = 0;
  });

  edges.forEach((e) => {
    if (childrenMap[e.source]) {
      childrenMap[e.source].push({ id: e.target, handle: e.sourceHandle });
    }
    if (incomingCount[e.target] !== undefined) {
      incomingCount[e.target]++;
    }
  });

  // Find root nodes (usually just the trigger)
  const roots = nodes.filter((n) => incomingCount[n.id] === 0);
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0]);
  }

  // 2. Pass 1: Recursive Bottom-Up width calculation
  const subtreeWidth: Record<string, number> = {};
  const nodePadding = 120; // Horizontal gap between sibling subtrees

  const calculateWidth = (nodeId: string): number => {
    if (subtreeWidth[nodeId]) return subtreeWidth[nodeId];

    const children = childrenMap[nodeId];
    const sourceNode = nodes.find((n) => n.id === nodeId);

    // Leaf nodes have a fixed base width
    if (!children || children.length === 0) {
      subtreeWidth[nodeId] = nodeWidth + nodePadding;
      return subtreeWidth[nodeId];
    }

    // Binary nodes MUST allocate space for both YES and NO paths to keep them symmetrical
    if (sourceNode?.type === 'binary') {
      const yesChild = children.find((c) => c.handle === 'yes');
      const noChild = children.find((c) => c.handle === 'no');

      // If a branch is missing, we still reserve half the "default" width to maintain the split structure
      const leftWidth = yesChild
        ? calculateWidth(yesChild.id)
        : (nodeWidth + nodePadding) / 2;
      const rightWidth = noChild
        ? calculateWidth(noChild.id)
        : (nodeWidth + nodePadding) / 2;

      subtreeWidth[nodeId] = leftWidth + rightWidth;
      return subtreeWidth[nodeId];
    }

    // Non-binary nodes sum up their children's widths
    let totalChildrenWidth = 0;
    children.forEach((child) => {
      totalChildrenWidth += calculateWidth(child.id);
    });

    subtreeWidth[nodeId] = Math.max(totalChildrenWidth, nodeWidth + nodePadding);
    return subtreeWidth[nodeId];
  };

  roots.forEach((root) => calculateWidth(root.id));

  // 3. Pass 2: Recursive Top-Down coordinate assignment
  const positions: Record<string, { x: number; y: number }> = {};
  const verticalSpacing = 180;

  const assignPositions = (nodeId: string, x: number, y: number) => {
    if (positions[nodeId]) return; // Handle converging paths if they exist
    positions[nodeId] = { x, y };

    const children = childrenMap[nodeId];
    const sourceNode = nodes.find((n) => n.id === nodeId);

    if (!children || children.length === 0) return;

    if (sourceNode?.type === 'binary') {
      const yesChild = children.find((c) => c.handle === 'yes');
      const noChild = children.find((c) => c.handle === 'no');

      const leftWidth = yesChild
        ? subtreeWidth[yesChild.id]
        : (nodeWidth + nodePadding) / 2;
      const rightWidth = noChild
        ? subtreeWidth[noChild.id]
        : (nodeWidth + nodePadding) / 2;

      const totalDist = leftWidth + rightWidth;

      // Perfectly center the children within their allocated partition
      if (yesChild) {
        const leftCenterX = x - totalDist / 2 + leftWidth / 2;
        assignPositions(yesChild.id, leftCenterX, y + verticalSpacing);
      }

      if (noChild) {
        const rightCenterX = x + totalDist / 2 - rightWidth / 2;
        assignPositions(noChild.id, rightCenterX, y + verticalSpacing);
      }
    } else {
      // For non-binary nodes, distribute children side-by-side
      let currentLeft = x - subtreeWidth[nodeId] / 2;
      children.forEach((child) => {
        const childWidth = subtreeWidth[child.id];
        const childCenterX = currentLeft + childWidth / 2;
        assignPositions(child.id, childCenterX, y + verticalSpacing);
        currentLeft += childWidth;
      });
    }
  };

  // Start positioning from each root, spreading them horizontally
  let currentRootX = 250;
  const startY = 100;
  roots.forEach((root) => {
    assignPositions(root.id, currentRootX, startY);
    currentRootX += subtreeWidth[root.id] + 400; // Space between disconnected graphs
  });

  // 4. Map the calculated positions back to the React Flow nodes
  const layoutedNodes = nodes.map((node) => {
    if (positions[node.id]) {
      return {
        ...node,
        position: {
          x: positions[node.id].x - nodeWidth / 2,
          y: positions[node.id].y - nodeHeight / 2,
        },
      };
    }
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const initialNodes: Node[] = [
  { 
    id: 'trigger-1', 
    type: 'trigger', 
    position: { x: 250, y: 100 }, 
    data: getInitialNodeData('trigger', 'When trigger fires')
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

// Definition payload for a brand-new workflow (used by the "Create workflow" flow on the list page)
export const createInitialDefinition = () => ({
  nodes: initialNodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
  edges: initialEdges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, type: e.type })),
});

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedEdgeId: null,
  workflowName: 'Untitled Workflow',
  workflowId: null,
  isWorkflowLoading: false,

  setWorkflowName: (name) => set({ workflowName: name }),
  setWorkflowId: (id) => set({ workflowId: id }),
  setWorkflowLoading: (isLoading) => set({ isWorkflowLoading: isLoading }),

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

    const newEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

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
    const { nodes, edges } = get();
    
    // Check if the source node is a binary node
    const sourceNode = nodes.find(n => n.id === connection.source);
    
    // We want to ensure only one edge per source handle
    // This applies to binary (yes/no) and other nodes (which typically have one output)
    const existingEdge = edges.find(
      (e) => e.source === connection.source && e.sourceHandle === connection.sourceHandle
    );

    let updatedEdges = edges;
    if (existingEdge && sourceNode?.type !== 'trigger') {
      updatedEdges = edges.filter((e) => e.id !== existingEdge.id);
    }

    const newEdges = addEdge(connection, updatedEdges);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, newEdges);
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
              queue.push({ id: edge.target, handle: undefined });
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

    const updatedNodes = nodes.filter(n => !nodesToRemove.has(n.id));
    const updatedEdges = edges.filter(e => !edgesToRemove.has(e.id));

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
    const initialData = getInitialNodeData(type, data?.label as string | undefined);

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
            data: initialData,
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
            sourceHandle: type === 'binary' 
              ? (edgeToSplit.sourceHandle === 'no' ? 'no' : 'yes') 
              : undefined,
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
            const binaryExitNode: Node = {
              id: exitId,
              type: 'exit',
              position: { x: 0, y: 0 },
              data: { label: 'End' },
            };
            const binaryExitEdge: Edge = {
              id: `e-${id}-${exitId}`,
              source: id,
              sourceHandle: edgeToSplit.sourceHandle === 'no' ? 'yes' : 'no',
              target: exitId,
              animated: true,
              type: 'custom',
            };
            updatedNodes = [...updatedNodes, binaryExitNode];
            updatedEdges = [...updatedEdges, binaryExitEdge];
          }
        }
      }
    } else {
      const newNode: Node = {
        id,
        type,
        position: { x: 0, y: 0 },
        data: initialData,
      };
      updatedNodes.push(newNode);

      // If it's a binary node added without splitting an edge, 
      // we still want it to have default 'yes' and 'no' paths for a better UX.
      if (type === 'binary') {
        const yesExitId = `exit-${uuidv4()}`;
        const noExitId = `exit-${uuidv4()}`;
        
        const yesExitNode: Node = {
          id: yesExitId,
          type: 'exit',
          position: { x: 0, y: 0 },
          data: { label: 'End' },
        };
        const noExitNode: Node = {
          id: noExitId,
          type: 'exit',
          position: { x: 0, y: 0 },
          data: { label: 'End' },
        };

        const yesEdge: Edge = {
          id: `e-${id}-${yesExitId}`,
          source: id,
          sourceHandle: 'yes',
          target: yesExitId,
          animated: true,
          type: 'custom',
        };
        const noEdge: Edge = {
          id: `e-${id}-${noExitId}`,
          source: id,
          sourceHandle: 'no',
          target: noExitId,
          animated: true,
          type: 'custom',
        };

        updatedNodes.push(yesExitNode, noExitNode);
        updatedEdges.push(yesEdge, noEdge);
      }
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges,
      selectedEdgeId: null
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => 
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    });
  },

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),
}));
