"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. You can try again, or head back to
            the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error.message && (
            <p className="text-muted-foreground break-words text-sm">
              {error.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/">Go home</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
