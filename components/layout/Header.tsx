"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Save, Workflow } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
          <Workflow className="text-white w-5 h-5" />
        </div>
        <h1 className="text-sm font-semibold text-gray-800">Workflow Automation Builder</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-gray-600 font-medium">
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm">
          <Play className="w-4 h-4 mr-2" />
          Run Workflow
        </Button>
      </div>
    </header>
  );
};
