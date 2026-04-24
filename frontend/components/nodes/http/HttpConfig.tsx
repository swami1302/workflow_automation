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
import { Plus, X } from "lucide-react";
import { HttpNodeSchema } from "@/lib/validations";

interface HttpConfigProps {
  nodeId: string;
  data: any;
  updateNodeData: (nodeId: string, data: any) => void;
}

export const HttpConfig = ({ nodeId, data, updateNodeData }: HttpConfigProps) => {
  const form = useForm({
    resolver: zodResolver(HttpNodeSchema),
    defaultValues: {
      label: data.label || "HTTP Request",
      method: data.method || "GET",
      url: data.url || "",
      timeout: data.timeout || 5000,
      authType: data.authType || "None",
      authValue: data.authValue || "",
      headers: data.headers || [],
      body: data.body || "",
      followRedirects: data.followRedirects ?? true,
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
      label: data.label || "HTTP Request",
      method: data.method || "GET",
      url: data.url || "",
      timeout: data.timeout || 5000,
      authType: data.authType || "None",
      authValue: data.authValue || "",
      headers: data.headers || [],
      body: data.body || "",
      followRedirects: data.followRedirects ?? true,
    });
  }, [nodeId, data.method, data.url, data.timeout, data.authType, data.authValue, data.headers, data.body, data.followRedirects, form]);

  const onSubmit = (values: any) => {
    console.log(`[HttpNode] Saving Configuration for ${nodeId}:`, values);
    updateNodeData(nodeId, values);
  };

  const method = form.watch("method");
  const authType = form.watch("authType");
  const headers = form.watch("headers") || [];

  return (
    <div className="p-4 flex flex-col gap-4 bg-white">
      <h2 className="text-sm font-semibold text-blue-600">HTTP Request Configuration</h2>
      <Separator />
      <Form {...form}>
        <form id="node-config-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-8">
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
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout (ms)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://api.example.com/{{variable}}" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auth type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select auth type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Bearer token">Bearer token</SelectItem>
                    <SelectItem value="Basic auth">Basic auth</SelectItem>
                    <SelectItem value="API key">API key</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {authType !== "None" && (
            <FormField
              control={form.control}
              name="authValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auth value</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="space-y-2">
            <FormLabel>Headers</FormLabel>
            {headers.map((header: any, index: number) => (
              <div key={index} className="flex gap-2">
                <Input 
                  placeholder="Key" 
                  value={header.key} 
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].key = e.target.value;
                    form.setValue("headers", newHeaders);
                  }}
                />
                <Input 
                  placeholder="Value" 
                  value={header.value} 
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].value = e.target.value;
                    form.setValue("headers", newHeaders);
                  }}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const newHeaders = headers.filter((_: any, i: number) => i !== index);
                    form.setValue("headers", newHeaders);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                form.setValue("headers", [...headers, { key: "", value: "" }]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add header
            </Button>
          </div>

          {["POST", "PUT", "PATCH"].includes(method) && (
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body (JSON)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder='{ "key": "{{variable}}" }' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="followRedirects"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Follow redirects</FormLabel>
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
        </form>
      </Form>
    </div>
  );
};
