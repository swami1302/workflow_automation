"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Save, Workflow, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/workflows">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Button>
        </Link>
        <div className="h-6 w-[1px] bg-slate-200 mx-1" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
            <Workflow className="text-white w-5 h-5" />
          </div>
          <div className="flex gap-4 items-center">
            <h1 className="text-sm font-bold text-slate-900 leading-none">New Workflow</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Live Editing</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-600 font-semibold px-4">
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button size="sm" className="h-9 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 shadow-md shadow-orange-100">
          <Play className="w-4 h-4 mr-2 fill-white" />
          Run Workflow
        </Button>
      </div>
    </header>
  );
};
