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

type WorkflowStore = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: string, data: any) => void;
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
    data: { label: 'Finish flow' } 
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'trigger-1', target: 'exit-1', animated: true, type: 'custom' }
];

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

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
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (type, data) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 100, y: Math.random() * 100 }, // Default position, could be improved
      data,
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
}));
