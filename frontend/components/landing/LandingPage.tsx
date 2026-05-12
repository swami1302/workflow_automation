"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, Shield, Globe, Cpu, ArrowRight, LayoutDashboard, LogOut, Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email?.[0] ?? "U").toUpperCase();
}

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function LandingPage() {
  const { user, isAuthenticated, isInitialized, logout } = useAuth();

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      {/* Announcement Banner */}
      <div className="bg-[#FF4500] text-white py-2.5 px-4 text-center text-sm font-medium relative z-50">
        🎉 Limited Time: Get 50% off your first month with code <span className="font-bold border-b border-white/50">FLOW50</span>. Cancel anytime.
      </div>

      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-[84px] font-[900] text-[#1A1A1A] tracking-tighter leading-[0.9] mb-8">
              Automate your workflow <br />
              <span className="text-[#FF4500]">without writing code</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              The most intuitive visual builder to connect your apps, process data, and automate repetitive tasks in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={isAuthenticated ? "/workflows" : "/login"}>
                <Button size="lg" className="bg-[#FF4500] hover:bg-[#E63E00] text-white h-16 px-10 text-xl font-black rounded-full shadow-2xl shadow-orange-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2">
                  Start for free
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link href="/workflow/demo">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-black rounded-full border-2 border-slate-200 hover:border-[#FF4500] hover:text-[#FF4500] transition-all bg-white/50 backdrop-blur-sm">
                  Try Demo
                </Button>
              </Link>
            </div>
            
            {/* Social Proof Placeholder */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted by 2,000+ teams worldwide</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Powerful Features</h2>
              <p className="text-slate-500 font-medium">Everything you need to scale your automation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-10 rounded-[40px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-100 relative overflow-hidden">
                <div className="absolute top-8 right-10 text-6xl font-black text-slate-100 group-hover:text-orange-50 transition-colors">01</div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8">
                  <Globe className="w-7 h-7 text-blue-600" />
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 block">Integrations</span>
                <h3 className="text-2xl font-black text-slate-900 mb-4">HTTP Webhooks</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Connect to any API with our powerful HTTP node. Supports custom headers, multiple methods, and variable interpolation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-10 rounded-[40px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-100 relative overflow-hidden">
                <div className="absolute top-8 right-10 text-6xl font-black text-slate-100 group-hover:text-orange-50 transition-colors">02</div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8">
                  <Cpu className="w-7 h-7 text-purple-600" />
                </div>
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-3 block">Logic</span>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Binary Logic</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Build complex branching logic with ease. Split your workflows based on any condition using our visual logic builder.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-10 rounded-[40px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-100 relative overflow-hidden">
                <div className="absolute top-8 right-10 text-6xl font-black text-slate-100 group-hover:text-orange-50 transition-colors">03</div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                  <Shield className="w-7 h-7 text-emerald-600" />
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 block">Security</span>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Reliable Execution</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Scale your automations with confidence. Our engine ensures your tasks run on time, every time, with detailed logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto rounded-[50px] bg-[#1A1A1A] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4500] blur-[120px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 blur-[120px] opacity-10" />
            
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 relative z-10">
              Ready to automate <br />your next big idea?
            </h2>
            <Link href={isAuthenticated ? "/workflows" : "/login"} className="relative z-10">
              <Button size="lg" className="bg-[#FF4500] hover:bg-[#E63E00] text-white h-16 px-12 text-xl font-black rounded-full shadow-2xl shadow-orange-900/50 transition-all hover:scale-[1.05]">
                Get Started Now
              </Button>
            </Link>
            <p className="mt-8 text-slate-400 font-bold uppercase tracking-widest text-xs relative z-10">
              No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
