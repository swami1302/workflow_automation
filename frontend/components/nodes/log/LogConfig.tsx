"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LogNodeSchema } from "@/lib/validations";

interface LogConfigProps {
  nodeId: string;
  data: any;
  updateNodeData: (nodeId: string, data: any) => void;
}

export const LogConfig = ({ nodeId, data, updateNodeData }: LogConfigProps) => {
  const form = useForm({
    resolver: zodResolver(LogNodeSchema),
    defaultValues: {
      label: data.label || "Log Node",
      logLevel: data.logLevel || "Info",
      messageTemplate: data.messageTemplate || "",
      includeFullPayload: data.includeFullPayload ?? false,
      destination: data.destination || "Console",
    },
  });

  // Real-time label syncing
  const watchedLabel = form.watch("label");
  useEffect(() => {
    if (watchedLabel !== data.label) {
      updateNodeData(nodeId, { label: watchedLabel });
    }
  }, [watchedLabel, nodeId, data.label, updateNodeData]);

  useEffect(() => {
    form.reset({
      label: data.label || "Log Node",
      logLevel: data.logLevel || "Info",
      messageTemplate: data.messageTemplate || "",
      includeFullPayload: data.includeFullPayload ?? false,
      destination: data.destination || "Console",
    });
  }, [nodeId, data.logLevel, data.messageTemplate, data.includeFullPayload, data.destination, form]);

  const onSubmit = (values: any) => {
    console.log(`[LogNode] Saving Configuration for ${nodeId}:`, values);
    updateNodeData(nodeId, values);
  };

  return (
    <div className="p-4 flex flex-col gap-4 bg-white">
      <h2 className="text-sm font-semibold text-green-600">Log Configuration</h2>
      <Separator />
      <Form {...form}>
        <form id="node-config-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Node label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Log level</FormLabel>
                <div className="flex gap-2">
                  {["Info", "Warn", "Error", "Debug"].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={field.value === level ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8 text-xs px-2"
                      onClick={() => field.onChange(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="messageTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message template</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="User {{input.id}} responded..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeFullPayload"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Include full payload</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Console">Console</SelectItem>
                    <SelectItem value="External logger">External logger</SelectItem>
                    <SelectItem value="File">File</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
