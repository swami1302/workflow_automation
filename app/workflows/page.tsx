"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, Play, Pause, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

const WORKFLOWS = [
  { id: "1", name: "Sync CRM Contacts", status: "Active", steps: 5, lastRun: "2 mins ago", type: "Automation" },
  { id: "2", name: "Weekly Report Dispatch", status: "Inactive", steps: 3, lastRun: "1 day ago", type: "Reporting" },
  { id: "3", name: "Slack Notification on Error", status: "Active", steps: 2, lastRun: "1 hour ago", type: "Monitoring" },
  { id: "4", name: "Database Backup", status: "Active", steps: 4, lastRun: "12 hours ago", type: "Maintenance" },
];

export default function WorkflowsPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-900">My Workflows</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search workflows..." 
                className="pl-9 w-64 bg-slate-50 border-slate-200 h-9 text-sm focus-visible:ring-orange-500" 
              />
            </div>
            <Link href="/workflow/builder">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2 font-semibold shadow-sm text-xs h-9">
                <Plus className="w-4 h-4" />
                CREATE WORKFLOW
              </Button>
            </Link>
          </div>
        </header>

        {/* Workflow Table */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[300px] text-[11px] font-bold uppercase tracking-wider text-slate-500">Workflow Name</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Steps</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Last Run</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Type</TableHead>
                  <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WORKFLOWS.map((workflow) => (
                  <TableRow key={workflow.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 py-4 text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span>{workflow.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">ID: {workflow.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={workflow.status === "Active" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[10px]" 
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 text-[10px]"
                        }
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${workflow.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {workflow.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{workflow.steps} steps</TableCell>
                    <TableCell className="text-slate-600 italic text-xs">{workflow.lastRun}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white font-medium text-slate-500 text-[10px]">{workflow.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                            {workflow.status === "Active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            {workflow.status === "Active" ? "Pause" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 text-xs">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
