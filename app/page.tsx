"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Globe, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">FlowBuilder</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
            Sign In
          </Link>
          <Link href="/login">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-8">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">New Release v2.0</span>
            <div className="w-1 h-1 rounded-full bg-orange-300" />
            <span className="text-[10px] font-medium text-orange-600">Visual automation is here</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Automate your workflow <br />
            <span className="text-orange-600">without writing code</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            The most intuitive visual builder to connect your apps, process data, and automate repetitive tasks in minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white h-14 px-10 text-lg font-bold shadow-xl shadow-orange-200 gap-2 group">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-semibold border-slate-200">
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">HTTP Integrations</h3>
              <p className="text-slate-500 leading-relaxed">
                Connect to any API with our powerful HTTP node. Supports custom headers, multiple methods, and variable interpolation.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Binary Logic</h3>
              <p className="text-slate-500 leading-relaxed">
                Build complex branching logic with ease. Split your workflows based on any condition using our visual logic builder.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Reliable Execution</h3>
              <p className="text-slate-500 leading-relaxed">
                Scale your automations with confidence. Our engine ensures your tasks run on time, every time, with detailed logs.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-10 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400">
          © 2026 FlowBuilder Inc. Built for developers and creators.
        </p>
      </footer>
    </div>
  );
}
