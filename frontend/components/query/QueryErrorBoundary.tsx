"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

interface QueryErrorBoundaryProps {
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  children: React.ReactNode;
}

// Wrap any useQuery result with this to block rendering its consumers
// (forms, save buttons, etc.) entirely on fetch failure, instead of
// letting the page render with stale/default local state that a user
// could then act on (e.g. save) as if it were the real data.
export function QueryErrorBoundary({
  isError,
  error,
  onRetry,
  children,
}: QueryErrorBoundaryProps) {
  if (isError) {
    const apiError = error as ApiError | undefined;
    const message =
      apiError?.response?.data?.message ?? apiError?.message ?? "Failed to load data";

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Data unavailable</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={onRetry}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
