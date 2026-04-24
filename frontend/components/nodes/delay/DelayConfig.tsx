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
import { Separator } from "@/components/ui/separator";
import { DelayNodeSchema } from "@/lib/validations";

interface DelayConfigProps {
  nodeId: string;
  data: any;
  updateNodeData: (nodeId: string, data: any) => void;
}

export const DelayConfig = ({ nodeId, data, updateNodeData }: DelayConfigProps) => {
  const form = useForm({
    resolver: zodResolver(DelayNodeSchema),
    defaultValues: {
      label: data.label || "Delay Node",
      duration: data.duration || 1,
      unit: data.unit || "Minutes",
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
      label: data.label || "Delay Node",
      duration: data.duration || 1,
      unit: data.unit || "Minutes",
    });
  }, [nodeId, data.duration, data.unit, form]);

  const onSubmit = (values: any) => {
    console.log(`[DelayNode] Saving Configuration for ${nodeId}:`, values);
    updateNodeData(nodeId, values);
  };

  return (
    <div className="p-4 flex flex-col gap-4 bg-white">
      <h2 className="text-sm font-semibold text-amber-600">Delay Configuration</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wait for</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Minutes">Minutes</SelectItem>
                      <SelectItem value="Hours">Hours</SelectItem>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
