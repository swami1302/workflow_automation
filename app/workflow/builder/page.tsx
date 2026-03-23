"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/builder/Sidebar";
import { WorkflowBuilder } from "@/components/builder/WorkflowBuilder";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function Home() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);

  return (
    <main className="flex flex-col h-screen w-screen bg-white font-sans antialiased overflow-hidden">
      {/* Top Header Section */}
      <Header />
      
      {/* Main Builder Area */}
      <section className="flex flex-1 relative overflow-hidden">
        {/* React Flow Canvas */}
        <WorkflowBuilder />

        {/* Right Sidebar for Configuration - Only shown when a node is selected */}
        {selectedNodeId && <Sidebar />}
      </section>
    </main>
  );
}
