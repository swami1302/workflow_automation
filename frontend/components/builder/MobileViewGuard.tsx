"use client";

import React from "react";
import { Monitor, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const MobileViewGuard = () => {
  return (
    <div className="md:hidden fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-8">
        <Monitor className="w-10 h-10 text-orange-600" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
        Desktop Only Experience
      </h2>
      
      <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-xs">
        FlowBuilder's visual editor requires a larger screen for the best experience. Please switch to a desktop or tablet to edit your workflows.
      </p>

      <Link href="/workflows" className="w-full max-w-xs">
        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 font-black text-lg gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </Link>
      
      <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        FlowBuilder Professional v1.0
      </p>
    </div>
  );
};
