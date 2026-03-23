"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

export const ExitConfig = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-sm font-semibold">Exit Node</h2>
      <Separator />
      <div className="bg-gray-50 border rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500 italic">End of workflow branch.</p>
        <p className="text-xs text-gray-400 mt-2">No configuration required.</p>
      </div>
    </div>
  );
};
