"use client";

import React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Globe, Cpu, Shield, Zap, CheckCircle2, Layout, Database, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Globe,
    title: "HTTP Integrations",
    description: "Connect to any API with our powerful HTTP node. Supports custom headers, multiple methods, and variable interpolation.",
    color: "blue"
  },
  {
    icon: Cpu,
    title: "Binary Logic",
    description: "Build complex branching logic with ease. Split your workflows based on any condition using our visual logic builder.",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Reliable Execution",
    description: "Scale your automations with confidence. Our engine ensures your tasks run on time, every time, with detailed logs.",
    color: "emerald"
  },
  {
    icon: Layout,
    title: "Visual Builder",
    description: "An intuitive drag-and-drop interface that makes building complex workflows as easy as drawing a flowchart.",
    color: "orange"
  },
  {
    icon: Database,
    title: "Data Transformation",
    description: "Transform and map data between different services with built-in functions and powerful transformation nodes.",
    color: "pink"
  },
  {
    icon: Workflow,
    title: "Workflow Templates",
    description: "Get started quickly with pre-built templates for common use cases like lead generation and notifications.",
    color: "cyan"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-[#1A1A1A] tracking-tighter mb-6">
              Features that power <br />
              <span className="text-[#FF4500]">your automation</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              Everything you need to build, scale, and manage your automated workflows in one intuitive platform.
            </p>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-10 rounded-[40px] bg-white border border-slate-100 hover:border-[#FF4500]/20 transition-all hover:shadow-2xl hover:shadow-orange-100/50 relative overflow-hidden">
                <div className="absolute top-8 right-10 text-6xl font-black text-slate-50 group-hover:text-orange-50 transition-colors">0{i+1}</div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-slate-50`}>
                  <feature.icon className="w-7 h-7 text-[#FF4500]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 px-6 bg-[#1A1A1B] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                Built for <span className="text-[#FF4500]">Performance</span> and Reliability
              </h2>
              <div className="space-y-6">
                {[
                  "99.9% Uptime Guarantee",
                  "End-to-end Encryption",
                  "Real-time Monitoring",
                  "Auto-scaling Infrastructure"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#FF4500]" />
                    <span className="text-xl font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[50px] bg-[#FF4500]/10 border border-[#FF4500]/20 flex items-center justify-center">
                <Zap className="w-32 h-32 text-[#FF4500] animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
