"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { X, Plus, GripVertical } from "lucide-react";
import { BinaryNodeSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

const OPERATORS = [
  { value: "==", label: "Equal" },
  { value: "!=", label: "Not Equal" },
  { value: ">", label: "Greater Than" },
  { value: "<", label: "Less Than" },
  { value: ">=", label: "Greater or Equal" },
  { value: "<=", label: "Less or Equal" },
  { value: "contains", label: "Contains" },
  { value: "is empty", label: "Is Empty" },
  { value: "is not empty", label: "Is Not Empty" },
];

interface BinaryConfigProps {
  nodeId: string;
  data: any;
  updateNodeData: (nodeId: string, data: any) => void;
}

export const BinaryConfig = ({ nodeId, data, updateNodeData }: BinaryConfigProps) => {
  const form = useForm({
    resolver: zodResolver(BinaryNodeSchema),
    defaultValues: {
      label: data.label || "Binary Split",
      conditions: data.conditions || [{ leftOperand: "", operator: "==", rightOperand: "", logicConnector: "AND" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "conditions",
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
      label: data.label || "Binary Split",
      conditions: data.conditions || [{ leftOperand: "", operator: "==", rightOperand: "", logicConnector: "AND" }],
    });
  }, [nodeId, data.conditions, form]);

  const onSubmit = (values: any) => {
    console.log(`[BinaryNode] Saving Configuration for ${nodeId}:`, values);
    updateNodeData(nodeId, values);
  };

  return (
    <div className="p-4 flex flex-col gap-6 bg-white">
      <div>
        <h2 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4">Binary Split Configuration</h2>
        <Form {...form}>
          <form id="node-config-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold text-gray-500 uppercase">Node Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-[11px] font-semibold text-gray-500 uppercase">Conditions</FormLabel>
                <span className="text-[10px] text-gray-400 font-medium italic text-right">Matches when all (AND) or any (OR) are true</span>
              </div>
              
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="group relative">
                    <div className="flex flex-col gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-purple-200 hover:bg-white transition-all">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-gray-300 shrink-0" />
                        <div className="flex-1 text-[10px] font-bold text-gray-400 uppercase">Condition {index + 1}</div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-red-50 hover:text-red-500"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.leftOperand`}
                          render={({ field }) => (
                            <Input {...field} placeholder="Left operand (e.g. {{variable}})" className="h-8 text-xs bg-white" />
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name={`conditions.${index}.operator`}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="h-8 text-xs bg-white">
                                  <SelectValue placeholder="Operator" />
                                </SelectTrigger>
                                <SelectContent>
                                  {OPERATORS.map((op) => (
                                    <SelectItem key={op.value} value={op.value} className="text-xs">
                                      {op.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />

                          {form.watch(`conditions.${index}.operator`) !== "is empty" && 
                           form.watch(`conditions.${index}.operator`) !== "is not empty" && (
                            <FormField
                              control={form.control}
                              name={`conditions.${index}.rightOperand`}
                              render={({ field }) => (
                                <Input {...field} placeholder="Value" className="h-8 text-xs bg-white" />
                              )}
                            />
                          )}
                        </div>
                      </div>

                      {index < fields.length - 1 && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-[1px] flex-1 bg-gray-100" />
                          <FormField
                            control={form.control}
                            name={`conditions.${index}.logicConnector`}
                            render={({ field }) => (
                              <div className="flex bg-gray-100 p-0.5 rounded-md">
                                <button
                                  type="button"
                                  onClick={() => field.onChange("AND")}
                                  className={cn(
                                    "px-2 py-0.5 text-[9px] font-bold rounded shadow-sm transition-all",
                                    field.value === "AND" ? "bg-white text-purple-600" : "text-gray-400 hover:text-gray-600"
                                  )}
                                >
                                  AND
                                </button>
                                <button
                                  type="button"
                                  onClick={() => field.onChange("OR")}
                                  className={cn(
                                    "px-2 py-0.5 text-[9px] font-bold rounded shadow-sm transition-all",
                                    field.value === "OR" ? "bg-white text-purple-600" : "text-gray-400 hover:text-gray-600"
                                  )}
                                >
                                  OR
                                </button>
                              </div>
                            )}
                          />
                          <div className="h-[1px] flex-1 bg-gray-100" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 text-[10px] font-bold border-dashed border-gray-300 hover:border-purple-300 hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-all"
                  onClick={() => append({ leftOperand: "", operator: "==", rightOperand: "", logicConnector: "AND" })}
                >
                  <Plus className="w-3 h-3 mr-1" /> ADD CONDITION
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
