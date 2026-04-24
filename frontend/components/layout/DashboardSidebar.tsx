"use client";

import React from "react";
import { LayoutDashboard, Clock, User, Settings, Zap, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { name: "Workflows", href: "/workflows", icon: LayoutDashboard },
  { name: "History", href: "#", icon: Clock },
  { name: "Connections", href: "#", icon: User },
  { name: "Settings", href: "#", icon: Settings },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="font-bold text-white tracking-tight">FlowBuilder</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name}
              href={item.href} 
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
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center justify-between gap-3 px-2 py-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-8 w-8 border border-slate-700 shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-800 text-xs">JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-white truncate">John Doe</span>
              <span className="text-[10px] text-slate-500 truncate">Free Plan</span>
            </div>
          </div>
          
          <Link href="/login">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-full"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};
