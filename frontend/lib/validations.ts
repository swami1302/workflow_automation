import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const SignupSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must not exceed 72 characters'),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type SignupFormValues = z.infer<typeof SignupSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must not exceed 72 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export const TriggerNodeSchema = z.object({
  label: z.string().min(1, "Node label is required"),
  every: z.number().min(1, "Minimum value is 1"),
  unit: z.enum(["Seconds", "Minutes", "Hours", "Days", "Months"]),
});

export const HttpNodeSchema = z.object({
  label: z.string().min(1, "Node label is required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().min(1, "URL is required"),
  timeout: z.number().min(0, "Timeout must be non-negative").default(5000),
  authType: z.enum(["None", "Bearer token", "Basic auth", "API key"]),
  authValue: z.string().optional(),
  headers: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).default([]),
  body: z.string().optional(),
  followRedirects: z.boolean().default(true),
});

export const BinaryNodeSchema = z.object({
  label: z.string().min(1, "Node label is required"),
  conditions: z.array(z.object({
    leftOperand: z.string().min(1, "Left operand is required"),
    operator: z.enum(["==", "!=", ">", "<", ">=", "<=", "contains", "is empty", "is not empty"]),
    rightOperand: z.string().optional(),
    logicConnector: z.enum(["AND", "OR"]).optional(),
  })).min(1, "At least one condition is required"),
});

export const LogNodeSchema = z.object({
  label: z.string().min(1, "Node label is required"),
  logLevel: z.enum(["Info", "Warn", "Error", "Debug"]),
  messageTemplate: z.string().min(1, "Message template is required"),
  includeFullPayload: z.boolean().default(false),
  destination: z.enum(["Console", "External logger", "File"]),
});

export const DelayNodeSchema = z.object({
  label: z.string().min(1, "Node label is required"),
  duration: z.number().min(1, "Minimum value is 1"),
  unit: z.enum(["Minutes", "Hours", "Days", "Months"]),
});

export type TriggerNodeData = z.infer<typeof TriggerNodeSchema>;
export type HttpNodeData = z.infer<typeof HttpNodeSchema>;
export type BinaryNodeData = z.infer<typeof BinaryNodeSchema>;
export type LogNodeData = z.infer<typeof LogNodeSchema>;
export type DelayNodeData = z.infer<typeof DelayNodeSchema>;
