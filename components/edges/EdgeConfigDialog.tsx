import React, { useState } from 'react'
import { PlusCircle, Play, Globe, GitBranch, Terminal, Clock, Square } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useWorkflowStore } from '@/store/useWorkflowStore'

interface EdgeConfigDialogProps {
  edgeId?: string
}

const AVAILABLE_NODES = [
  { type: 'http', label: 'HTTP Request', description: 'API Call', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
  { type: 'binary', label: 'Binary Split', description: 'Conditional', icon: GitBranch, color: 'text-purple-600', bg: 'bg-purple-50' },
  { type: 'log', label: 'Log', description: 'Data Logger', icon: Terminal, color: 'text-slate-600', bg: 'bg-slate-50' },
  { type: 'delay', label: 'Wait', description: 'Execution Delay', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
]

export const EdgeConfigDialog = ({ edgeId }: EdgeConfigDialogProps) => {
  const [open, setOpen] = useState(false);
  const addNode = useWorkflowStore((state) => state.addNode);
  const setSelectedEdgeId = useWorkflowStore((state) => state.setSelectedEdgeId);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && edgeId) {
      setSelectedEdgeId(edgeId);
    } else if (!isOpen) {
      setSelectedEdgeId(null);
    }
  };

  const handleSelect = (type: string, node: any) => {
    addNode(type, node);
    setOpen(false);
    setSelectedEdgeId(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors cursor-pointer group">
          <PlusCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Node</DialogTitle>
          <p className="text-xs text-gray-400 mt-1">Configuring edge: {edgeId}</p>
        </DialogHeader>
        <Separator className="my-2" />
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid gap-2">
            {AVAILABLE_NODES.map((node) => (
              <button
                key={node.type}
                onClick={() => handleSelect(node.type, node)}
                className="flex items-center gap-3 p-3 text-left bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${node.bg} shrink-0`}>
                  <node.icon className={`w-5 h-5 ${node.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700">{node.label}</span>
                  <span className="text-[11px] text-gray-400 uppercase tracking-tight">{node.description}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
