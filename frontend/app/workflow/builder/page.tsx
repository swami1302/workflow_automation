"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/builder/Sidebar";
import { WorkflowBuilder } from "@/components/builder/WorkflowBuilder";
import { BuilderNodePanel } from "@/components/builder/BuilderNodePanel";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { Node, Edge } from "@xyflow/react";

export default function BuilderPage() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);

  const handleSave = () => {
    // This represents the data that would typically be saved in the database
    const workflowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
      })),
    };

    console.log("Saving workflow data to database:", JSON.stringify(workflowData, null, 2));
  };

  // Function to construct the flow when receiving data from the backend
  // This can be called when workflow data is fetched from an API
  const constructFlowFromBackend = (backendData: { nodes: Node[]; edges: Edge[] }) => {
    if (backendData.nodes && backendData.edges) {
      setNodes(backendData.nodes);
      setEdges(backendData.edges);
      console.log("Flow constructed from backend data");
    }
  };

  // Example usage (commented out):
  // useEffect(() => {
  //   fetchWorkflow().then(data => constructFlowFromBackend(data));
  // }, []);

  return (
    <main className="flex flex-col h-screen w-screen bg-white font-sans antialiased overflow-hidden">
      <Header onSave={handleSave} />
      <section className="flex flex-1 relative overflow-hidden" data-construct-flow={!!constructFlowFromBackend}>
        <BuilderNodePanel />
        <WorkflowBuilder />
        {selectedNodeId && <Sidebar />}
      </section>
    </main>
  );
}
