"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/builder/Sidebar";
import { WorkflowBuilder } from "@/components/builder/WorkflowBuilder";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen bg-white font-sans antialiased overflow-hidden">
      {/* Top Header Section */}
      <Header />
      
      {/* Main Builder Area */}
      <section className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar for Integrations */}
        {/* <Sidebar /> */}
        
        {/* React Flow Canvas */}
        <WorkflowBuilder />
      </section>
    </main>
  );
}
