"use client";

import React from "react";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { TriggerConfig } from "@/components/nodes/trigger/TriggerConfig";
import { HttpConfig } from "@/components/nodes/http/HttpConfig";
import { BinaryConfig } from "@/components/nodes/Binary/BinaryConfig";
import { LogConfig } from "@/components/nodes/log/LogConfig";
import { DelayConfig } from "@/components/nodes/delay/DelayConfig";
import { Button } from "@/components/ui/button";

interface NodeConfigProps {
  nodeId: string;
}

export const NodeConfig: React.FC<NodeConfigProps> = ({ nodeId }) => {
  const node = useWorkflowStore((state) => state.nodes.find((n) => n.id === nodeId));
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  if (!node || node.type === 'exit') return null;

  const configProps = {
    nodeId,
    data: node.data,
    updateNodeData,
  };

  const renderConfig = () => {
    switch (node.type) {
      case "trigger":
        return <TriggerConfig {...configProps} />;
      case "http":
        return <HttpConfig {...configProps} />;
      case "binary":
        return <BinaryConfig {...configProps} />;
      case "log":
        return <LogConfig {...configProps} />;
      case "delay":
        return <DelayConfig {...configProps} />;
      default:
        return <div className="p-4">Unknown node type: {node.type}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 pb-20">
        {renderConfig()}
      </div>
      
      {/* Universal Save Button Wrapper */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <Button 
          type="submit" 
          form="node-config-form" 
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 uppercase tracking-wider"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
