"use client";

import React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Users, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-[#1A1A1A] tracking-tighter mb-6">
              Our mission is to <br />
              <span className="text-[#FF4500]">simplify complexity</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              We believe that everyone should be able to build powerful automations without needing to write a single line of code. FlowBuilder was born out of the frustration of complex, fragmented tools.
            </p>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-12 rounded-[50px] bg-white border border-slate-100 shadow-xl shadow-slate-100/50">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-8">
                  <Globe className="w-7 h-7 text-[#FF4500]" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Open Source</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  FlowBuilder is built on the belief that the best tools are built in the open. Our core engine is fully open source, and we welcome developers from all over the world to contribute.
                </p>
              </div>

              <div className="p-12 rounded-[50px] bg-[#1A1A1B] text-white shadow-2xl shadow-orange-900/10">
                <div className="w-14 h-14 rounded-2xl bg-[#FF4500]/10 flex items-center justify-center mb-8">
                  <Users className="w-7 h-7 text-[#FF4500]" />
                </div>
                <h2 className="text-3xl font-black mb-4 text-white">Join the Community</h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Whether you're fixing a bug, suggesting a feature, or helping with documentation, every contribution helps us make automation accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-16">The numbers behind our journey</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Users", value: "10,000+" },
                { label: "Workflows Run", value: "5M+" },
                { label: "Hours Saved", value: "500k+" },
                { label: "App Integrations", value: "100+" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-5xl font-black text-[#FF4500]">{stat.value}</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-12 h-12 text-[#FF4500] mx-auto mb-8" />
            <h2 className="text-3xl font-black text-slate-900 mb-6">Build with us</h2>
            <p className="text-lg text-slate-500 font-medium mb-10">
              FlowBuilder is an open-source project. We're always looking for developers, designers, and writers to help us build the future of automation.
            </p>
            <a 
              href="https://github.com/swami1302/workflow_automation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#FF4500] hover:bg-[#E63E00] text-white px-10 h-14 rounded-full font-black shadow-lg shadow-orange-200 transition-all flex items-center justify-center w-fit mx-auto"
            >
              Contribute Now
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
