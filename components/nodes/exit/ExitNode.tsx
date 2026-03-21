"use client";

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Square } from 'lucide-react';
import { cn } from '@/lib/utils';

const ExitNode = ({ data, selected }: { data: any, selected?: boolean }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-white border rounded-xl shadow-sm transition-all duration-200 min-w-[200px]",
        selected ? "border-orange-500 ring-2 ring-orange-100 shadow-md" : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 shrink-0">
        <Square className="w-4 h-4 text-red-600 fill-red-600" />
      </div>
      
      <div className="flex flex-col text-left overflow-hidden">
        <span className="text-sm font-semibold text-gray-700 truncate">
          {data.label || 'End'}
        </span>
        <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase mt-0.5">
          Exit Flow
        </span>
      </div>

      <Handle 
        type="target" 
        position={Position.Top} 
        className="bg-white! w-3! h-3! border-2! border-red-500! hover:scale-125! transition-transform"
      />
    </div>
  );
};

export default memo(ExitNode);
