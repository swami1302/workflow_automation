"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative w-full bg-[#1A1A1B] text-white py-20 px-6 rounded-t-[40px] mt-12 overflow-hidden">
      {/* Large Background Text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <h2 className="text-[20vw] font-black whitespace-nowrap leading-none uppercase -ml-4 -mt-8 text-[#FF4500]">
          FlowBuilder
        </h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF4500] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">FlowBuilder</span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              Connect your tools, automate your processes, and save hours of manual work every week.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><Link href="/features" className="hover:text-[#FF4500] transition-colors">Features</Link></li>
              <li><a href="#" className="hover:text-[#FF4500] transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-[#FF4500] transition-colors">Templates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><Link href="/about" className="hover:text-[#FF4500] transition-colors">About</Link></li>
              <li><Link href="/blogs" className="hover:text-[#FF4500] transition-colors">Blog</Link></li>
              <li><a href="#" className="hover:text-[#FF4500] transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><a href="#" className="hover:text-[#FF4500] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#FF4500] transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-[#FF4500] transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-bold text-sm">© 2026 FlowBuilder Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-bold">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-bold">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
