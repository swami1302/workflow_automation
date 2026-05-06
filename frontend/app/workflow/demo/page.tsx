"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/builder/Sidebar";
import { WorkflowBuilder } from "@/components/builder/WorkflowBuilder";
import { BuilderNodePanel } from "@/components/builder/BuilderNodePanel";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function DemoPage() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);

  return (
    <main className="flex flex-col h-screen w-screen bg-white font-sans antialiased overflow-hidden">
      <Header isGuest />
      <section className="flex flex-1 relative overflow-hidden">
        <BuilderNodePanel />
        <WorkflowBuilder />
        {selectedNodeId && <Sidebar />}
      </section>
    </main>
  );
}
