"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Zap,
  LogOut,
  Globe,
  GitBranch,
  Clock,
  FileText,
  Square,
  ChevronDown,
  ChevronRight,
  Timer,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { name: "Workflows", href: "/workflows", icon: LayoutDashboard },
  { name: "Settings", href: "/settings", icon: Settings },
];

const NODE_TYPES = [
  {
    name: "Trigger",
    icon: Timer,
    color: "text-orange-400",
    bg: "bg-orange-900/20",
    description: "Schedule your workflow on a time interval",
  },
  {
    name: "HTTP",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-900/20",
    description: "Make HTTP requests to external APIs",
  },
  {
    name: "Binary",
    icon: GitBranch,
    color: "text-purple-400",
    bg: "bg-purple-900/20",
    description: "Branch flow based on conditions",
  },
  {
    name: "Delay",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-900/20",
    description: "Pause execution for a set duration",
  },
  {
    name: "Log",
    icon: FileText,
    color: "text-emerald-400",
    bg: "bg-emerald-900/20",
    description: "Record data for debugging & monitoring",
  },
  {
    name: "Exit",
    icon: Square,
    color: "text-slate-400",
    bg: "bg-slate-800",
    description: "End the workflow execution path",
  },
];

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email?.[0] ?? "U").toUpperCase();
}

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [nodesExpanded, setNodesExpanded] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-orange-700 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-white tracking-tight">FlowBuilder</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto pb-4 space-y-6">
          {/* Main nav */}
          <div className="space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Main
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Node Library */}
          <div>
            <button
              onClick={() => setNodesExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
            >
              <span>Node Library</span>
              {nodesExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>

            {nodesExpanded && (
              <div className="space-y-1">
                {NODE_TYPES.map((node) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.name}
                      className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors group cursor-default"
                    >
                      <div className={cn("w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5", node.bg)}>
                        <Icon className={cn("w-3.5 h-3.5", node.color)} />
                      </div>
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                          {node.name}
                        </span>
                        <span className="text-[10px] text-slate-600 group-hover:text-slate-400 leading-tight transition-colors">
                          {node.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="h-8 w-8 border border-slate-700 shrink-0">
                <AvatarFallback className="bg-orange-900/40 text-orange-400 text-xs font-bold">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.name ?? user?.email ?? "User"}
                </span>
                <span className="text-[10px] text-slate-500 truncate">Free Plan</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-full shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
