"use client";

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DelayNode = ({ data, selected }: { data: any, selected?: boolean }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-white border rounded-xl shadow-sm transition-all duration-200 min-w-[200px]",
        selected ? "border-orange-500 ring-2 ring-orange-100 shadow-md" : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 shrink-0">
        <Clock className="w-4 h-4 text-amber-600" />
      </div>
      
      <div className="flex flex-col text-left overflow-hidden">
        <span className="text-sm font-semibold text-gray-700 truncate">
          {data.label || 'Wait'}
        </span>
        <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase mt-0.5">
          Execution Delay
        </span>
      </div>

      <Handle 
        type="target" 
        position={Position.Top} 
        className="bg-white! w-3! h-3! border-2! border-amber-500! hover:scale-125! transition-transform"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="bg-white! w-3! h-3! border-2! border-amber-500! hover:scale-125! transition-transform"
      />
    </div>
  );
};

export default DelayNode;
