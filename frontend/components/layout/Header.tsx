"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Play, Save, Workflow, ChevronLeft, Lock, Pencil } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { toast } from "sonner";

interface HeaderProps {
  isGuest?: boolean;
  onSave?: () => void;
}

export const Header = ({ isGuest = false, onSave }: HeaderProps) => {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [inlineNameValue, setInlineNameValue] = useState(workflowName);

  const openSaveDialog = () => {
    if (isGuest) {
      toast("Create a free account to save your workflows", {
        description: "Your work is safe in this session — sign up to keep it.",
        action: { label: "Sign Up", onClick: () => (window.location.href = "/login") },
      });
      return;
    }
    setDraftName(workflowName);
    setSaveDialogOpen(true);
  };

  const handleSave = () => {
    const name = draftName.trim() || "Untitled Workflow";
    setWorkflowName(name);
    setSaveDialogOpen(false);
    onSave?.();
    toast.success(`"${name}" saved as draft`);
  };

  const commitInlineName = () => {
    const name = inlineNameValue.trim() || "Untitled Workflow";
    setWorkflowName(name);
    setEditingName(false);
  };

  const backHref = isGuest ? "/" : "/workflows";

  return (
    <>
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </Button>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
              <Workflow className="text-white w-5 h-5" />
            </div>
            <div className="flex gap-3 items-center">
              {editingName ? (
                <Input
                  autoFocus
                  value={inlineNameValue}
                  onChange={(e) => setInlineNameValue(e.target.value)}
                  onBlur={commitInlineName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitInlineName();
                    if (e.key === "Escape") {
                      setInlineNameValue(workflowName);
                      setEditingName(false);
                    }
                  }}
                  className="h-7 text-sm font-bold w-52 px-2 border-orange-300 focus-visible:ring-orange-400"
                />
              ) : (
                <button
                  onClick={() => {
                    if (!isGuest) {
                      setInlineNameValue(workflowName);
                      setEditingName(true);
                    }
                  }}
                  className="flex items-center gap-1.5 group"
                  title={isGuest ? undefined : "Click to rename"}
                >
                  <h1 className="text-sm font-bold text-slate-900 leading-none">{workflowName}</h1>
                  {!isGuest && (
                    <Pencil className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  )}
                </button>
              )}
              {isGuest ? (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] font-bold px-2">
                  Guest Mode
                </Badge>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Live Editing
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isGuest ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-slate-200 text-slate-400 font-semibold px-4 cursor-not-allowed opacity-60"
                disabled
                title="Sign up to save your workflow"
              >
                <Lock className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="h-9 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4"
                >
                  Sign Up to Save
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-slate-200 text-slate-600 font-semibold px-4"
                onClick={openSaveDialog}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="sm"
                className="h-9 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 shadow-md shadow-orange-100"
              >
                <Play className="w-4 h-4 mr-2 fill-white" />
                Run Workflow
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Save / Name Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Save workflow</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Workflow name
            </label>
            <Input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Sync CRM Contacts"
              className="focus-visible:ring-orange-400"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleSave}
            >
              Save Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
