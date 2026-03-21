"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Trash2, X, ArrowUpRight, GitBranch } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function DeleteBinaryDialog({ nodeId }: { nodeId: string }) {
  const deleteBinaryNode = useWorkflowStore((state) => state.deleteBinaryNode);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="absolute top-1 right-1 p-1 text-gray-300 hover:text-red-500 transition-colors duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">Delete Conditional Branch</DialogTitle>
          </div>
          <p className="text-purple-100 text-sm">
            This node has active branches. Choose how you want to handle the downstream paths.
          </p>
        </div>

        <div className="p-6 grid gap-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Option 1: Delete Yes Path */}
            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto p-4 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
              onClick={() => deleteBinaryNode(nodeId, 'yes-path')}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-emerald-600" />
                  Delete "Yes" Path
                </span>
                <span className="text-xs text-gray-500 font-normal">
                  Removes Yes branch. <span className="text-emerald-700 font-medium">Promotes No branch</span> to parent.
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </Button>

            {/* Option 2: Delete No Path */}
            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto p-4 border-gray-200 hover:border-rose-500 hover:bg-rose-50/50 transition-all group"
              onClick={() => deleteBinaryNode(nodeId, 'no-path')}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  Delete "No" Path
                </span>
                <span className="text-xs text-gray-500 font-normal">
                  Removes No branch. <span className="text-rose-700 font-medium">Promotes Yes branch</span> to parent.
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-rose-500 transition-colors" />
            </Button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <Separator className="flex-1" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dangerous Area</span>
            <Separator className="flex-1" />
          </div>

          {/* Option 3: Delete Everything */}
          <Button 
            variant="destructive" 
            className="flex items-center justify-between h-auto p-4 bg-red-50 hover:bg-red-100 border-red-200 text-red-900 hover:text-red-900 transition-all group shadow-none"
            onClick={() => deleteBinaryNode(nodeId, 'both')}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-sm font-bold flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                Remove Entire Split
              </span>
              <span className="text-xs text-red-700/70 font-normal">
                Deletes this node and <b>all downstream paths</b> completely.
              </span>
            </div>
          </Button>
        </div>

        <DialogFooter className="bg-gray-50 p-4 border-t border-gray-100">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="text-gray-500 hover:text-gray-900">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
