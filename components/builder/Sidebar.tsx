"use client";

import React from 'react';
import { Search, Webhook, MessageSquare, Mail, Globe, Database, Calendar, GitBranch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Mock list of integrations
const INTEGRATIONS = [
  { id: 'webhook', name: 'Webhook', description: 'Trigger workflow on HTTP request', icon: Webhook, color: 'text-purple-500', bg: 'bg-purple-100', type: 'trigger' },
  { id: 'binary', name: 'If Node', description: 'Split workflow based on conditions', icon: GitBranch, color: 'text-purple-600', bg: 'bg-purple-50', type: 'logic' },
  { id: 'http', name: 'HTTP Request', description: 'Make a custom API call', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-100', type: 'action' },
  { id: 'slack', name: 'Slack', description: 'Send or receive Slack messages', icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-100', type: 'action' },
  { id: 'gmail', name: 'Gmail', description: 'Manage emails via Google Workspace', icon: Mail, color: 'text-red-500', bg: 'bg-red-100', type: 'action' },
  { id: 'postgres', name: 'PostgreSQL', description: 'Execute a database query', icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-100', type: 'action' },
  { id: 'calendar', name: 'Google Calendar', description: 'Schedule or read events', icon: Calendar, color: 'text-yellow-600', bg: 'bg-yellow-100', type: 'action' }
];

export const Sidebar = () => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 shadow-sm z-10">
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-800 tracking-tight">Node Catalog</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search integrations..." 
            className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-orange-500"
          />
        </div>
      </div>
      
      <Separator />

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-3 pb-8">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Available Apps</h3>
          {INTEGRATIONS.map((app) => {
            const Icon = app.icon;
            return (
              <Card 
                key={app.id} 
                className="cursor-grab hover:shadow-md hover:border-orange-200 transition-all group"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', app.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
              >
                <CardContent className="p-3 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${app.bg}`}>
                    <Icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-800 truncate">{app.name}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-gray-100 text-gray-500">
                        {app.type === 'trigger' ? 'Trigger' : 'Action'}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 line-clamp-2 leading-snug">{app.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};
