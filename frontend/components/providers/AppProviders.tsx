'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from '@/context/AuthContext';
import { AxiosProvider } from '@/context/AxiosContext';
import { RouteGuard } from './RouteGuard';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 30 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AxiosProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </AxiosProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
